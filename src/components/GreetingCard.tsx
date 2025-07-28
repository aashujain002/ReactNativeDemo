import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

type GreetingCardProps = {
    title: string;
    message: string;
    imageUri?: string;
};

const GreetingCard: React.FC<GreetingCardProps> = ({ title, message, imageUri }) => {
    return (
        <View style={styles.card}>
            <ImageBackground source={{ uri: imageUri }} style={styles.image} imageStyle={styles.imageBorder}>
                <View style={styles.overlay}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        overflow: 'hidden',
        margin: 10,
        elevation: 4,
        backgroundColor: '#000',
    },
    image: {
        width: '100%',
        height: 200,
        justifyContent: 'flex-end', // positions text at the bottom
    },
    imageBorder: {
        borderRadius: 15,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // translucent black
        padding: 15,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    message: {
        color: '#fff',
        fontSize: 16,
        marginTop: 5,
    },
});

export default GreetingCard;