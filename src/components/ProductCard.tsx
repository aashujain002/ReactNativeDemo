import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export interface ProductCardProps {
    title: string;
    price: number;
    thumbnail: string;
    onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, price, thumbnail, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <Image source={{ uri: thumbnail }} style={styles.image} resizeMode="contain" />
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.price}>${price}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1f2530',
        padding: 8,
        borderRadius: 10,
        width: '48%',
        margin: 4,
        minHeight: 180,
    },
    image: {
        width: '100%',
        height: 110,
        borderRadius: 8,
        marginBottom: 6,
        backgroundColor: '#2d3440',
        alignSelf: 'center'
    },
    title: {
        color: 'white',
        fontSize: 13,
        fontWeight: '500',
        flexGrow: 1,
    },
    price: {
        color: '#8bd7ff',
        fontWeight: '600',
        marginTop: 4,
    }
});

export default ProductCard;