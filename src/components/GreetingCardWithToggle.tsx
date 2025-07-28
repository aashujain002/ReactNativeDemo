import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type GreetingCardWithToggleProps = {
    title: string;
    description: string;
};

const GreetingCardWithToggle: React.FC<GreetingCardWithToggleProps> = ({
    title,
    description,
}) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(prev => !prev);
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>

            {showDetails && <Text style={styles.description}>{description}</Text>}

            <TouchableOpacity style={styles.button} onPress={toggleDetails}>
                <Text style={styles.buttonText}>
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 16,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#444',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default GreetingCardWithToggle;