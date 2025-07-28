import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type NavCardProps = {
    title: string;
    onPress: () => void;
};

const NavCard: React.FC<NavCardProps> = ({
    title,
    onPress,
}) => {
    return (
        <View>
            <TouchableOpacity style={styles.card} onPress={onPress}>
                <Text style={styles.title}>{title}</Text>
                <Icon name="chevron-forward-sharp" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 3,
        margin: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default NavCard;