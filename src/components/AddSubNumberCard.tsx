import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type AddSubNumberCardProps = {
    number: number;
    onFirstButtonPress: () => void;
    onSecondButtonPress: () => void;
    firstButtonLabel: string;
    secondButtonLabel: string;
};

const AddSubNumberCard: React.FC<AddSubNumberCardProps> = ({
    number,
    onFirstButtonPress,
    onSecondButtonPress,
    firstButtonLabel,
    secondButtonLabel,
}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.number}>{number}</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={onFirstButtonPress}>
                    <Text style={styles.buttonText}>{firstButtonLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onSecondButtonPress}>
                    <Text style={styles.buttonText}>{secondButtonLabel}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 30,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        elevation: 4,
        alignItems: 'center',
        margin: 10,
    },
    number: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AddSubNumberCard;