import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimerComponent = () => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        // Start the timer
        const intervalId = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000); // every 1 second

        // Cleanup function: stop the timer when component unmounts
        return () => {
            clearInterval(intervalId);
            console.log('Timer stopped.');
        };
    }, []); // empty dependency array → run once on mount

    return (
        <View style={styles.container}>
            <Text style={styles.timerText}>Elapsed Time: {elapsedTime} seconds</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#CDCDCD',
    },
});

export default TimerComponent;