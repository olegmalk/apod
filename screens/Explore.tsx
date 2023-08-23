import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import useAPOD from '../hooks/useAPOD';
import { Apod } from '../types/apod';
import { getRandomDate } from '../utils/getRandomDate';

const generateRandomDateString = () => getRandomDate().toISOString().slice(0, 10);

export default function Explore() {
    const [date, setDate] = useState(generateRandomDateString());
    const { data: currentAPOD, loading, error, triggerRetry } = useAPOD(date);
    const panX = useRef(new Animated.Value(0)).current;
    function handleSwipeLeft() {
        setDate(generateRandomDateString())
    }

    function handleSwipeRight() {
        console.log('to favorites');
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

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const renderSuccess = (apod: Apod) => (<>
        <Image source={{ uri: apod.url }} style={styles.image} />
                <Text style={styles.title}>{apod.title}</Text>
                <Text style={styles.description}>{apod.explanation}</Text>
                <TouchableOpacity onPress={handleSwipeRight}>
                    <Text style={styles.favoritesButton}>Add to favorites</Text>
                </TouchableOpacity>
        </>)

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
                }}
                onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.translationX > 100) {
                        handleSwipeRight();
                    } else if (nativeEvent.translationX < -100) {
                        handleSwipeLeft();
                    } else {
                        Animated.spring(panX, {
                            toValue: 0,
                            useNativeDriver: true,
                        }).start();
                    }
                }}
            >
                <Animated.View style={[styles.card, { transform: [{ translateX: panX }, { rotate: rotateInterpolate }] }]}>
                    {currentAPOD ? renderSuccess(currentAPOD) : renderError()}
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
        justifyContent: 'space-between',
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
        height: '60%',
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    description: {
        fontSize: 16,
        marginTop: 10,
    },
    retryButton: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
    favoritesButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
});