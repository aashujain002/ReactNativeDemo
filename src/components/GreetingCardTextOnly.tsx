import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type GreetingCardTextOnlyProps = {
    title: string;
    message: string;
};

const GreetingCardTextOnly: React.FC<GreetingCardTextOnlyProps> = ({ title, message }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 25,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 3,
        margin: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#555',
        lineHeight: 22,
    },
});

export default GreetingCardTextOnly;