import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import useAPOD from '../hooks/useAPOD';


export default function Explore() {
    const { data, loading, error, triggerRetry } = useAPOD();

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error loading data</Text>
                <TouchableOpacity onPress={() => {
                    triggerRetry();
                }}>
                    <Text style={styles.retryButton}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <PanGestureHandler
                onGestureEvent={({ nativeEvent }) => {
                    if (nativeEvent.translationX > 100) {
                        console.log('Swiped right');
                    } else if (nativeEvent.translationX < -100) {
                        console.log('Swiped left');
                    }
                }}
            >
                <View>
                    <Image source={{ uri: data.url }} style={styles.image} />
                    <Text style={styles.title}>{data.title}</Text>
                    <Text style={styles.description}>{data.explanation}</Text>
                </View>
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
    image: {
        width: '100%',
        height: 200,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
    },
    retryButton: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
});