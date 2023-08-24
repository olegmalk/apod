import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import useAPOD from '../hooks/useAPOD';
import { Apod } from '../types/apod';
import { getRandomDate } from '../utils/getRandomDate';
import { useFavorites } from '../context/favorites';

const SWIPE_OFFSET = 25;

const generateRandomDateString = () => getRandomDate().toISOString().slice(0, 10);

export default function Explore() {
    const [date, setDate] = useState(generateRandomDateString());
    const { data: currentAPOD, loading, error, triggerRetry } = useAPOD(date);
    const panX = useRef(new Animated.Value(0)).current;
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'none'>('none');
    const {favorites, addFavorite} = useFavorites()

    const reload = () => {
        if (!loading) {
            setDate(generateRandomDateString())
        }
    }

    useEffect(() => {
        Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    }, [currentAPOD]);

    const rotateInterpolate = panX.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: ['-30deg', '0deg', '30deg'],
        extrapolate: 'clamp',
    });

    const renderLoading = () => (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );

    const renderSuccess = (apod: Apod) => (
        <>
            <Image source={{ uri: apod.url }} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay}>
                <Text style={styles.title} numberOfLines={2}>{apod.title}</Text>
                <Text style={styles.description} numberOfLines={10}>{apod.explanation}</Text>
                {swipeDirection === 'left' ? (
                    <Text style={[styles.label, styles.nextLabel]}>NEXT</Text>
                ) : swipeDirection === 'right' ? (
                    <Text style={[styles.label, styles.favoritesLabel]}>TO FAVORITES</Text>
                ) : null}
            </View>
        </>
    )

    const renderError = () => (<View style={styles.container}>
            <Text>Error loading data</Text>
            <TouchableOpacity onPress={() => {
                triggerRetry();
            }}>
                <Text style={styles.retryButton}>Retry</Text>
            </TouchableOpacity>
        </View>)

    return (
        <GestureHandlerRootView style={styles.container}>
            <PanGestureHandler
                onGestureEvent={({ nativeEvent }) => {
                    panX.setValue(nativeEvent.translationX);
                    if (nativeEvent.translationX > SWIPE_OFFSET) {
                        setSwipeDirection('right');
                    } else if (nativeEvent.translationX < -SWIPE_OFFSET) {
                        setSwipeDirection('left');
                    } else {
                        setSwipeDirection('none');
                    }
                }}
                onHandlerStateChange={({ nativeEvent }) => {
                    if (swipeDirection === 'right') {
                        reload();
                        addFavorite(date);
                    } else if (swipeDirection === 'left') {
                        reload();
                    }

                    Animated.spring(panX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                    setSwipeDirection('none');
                }}
            >
                <Animated.View style={[styles.card, { transform: [{ translateX: panX }, { rotate: rotateInterpolate }] }]}>
                    {loading ? renderLoading() :currentAPOD ? renderSuccess(currentAPOD) : renderError()}
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '90%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
    retryButton: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
    favoritesButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
    label: {
        position: 'absolute',
        top: '15%',
        left: '50%',
        width: 200,
        height: 40,
        transform: [{ translateX: -100 }, { translateY: -20 }],
        textAlign: 'center',
    },
    nextLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    favoritesLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
});