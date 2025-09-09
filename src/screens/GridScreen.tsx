import { RootStackNavigationProp } from '../navigation/NavTypes';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Props = { navigation: RootStackNavigationProp<'Grid'> };

// Data for cards
const cardData = [
    { id: '1', title: 'Card 1', description: 'This is the first card.' },
    { id: '2', title: 'Card 2', description: 'Second card description.' },
    { id: '3', title: 'Card 3', description: 'Third card in the grid.' },
    { id: '4', title: 'Card 4', description: 'Fourth item here.' },
    { id: '5', title: 'Card 5', description: 'Another card detail.' },
    { id: '6', title: 'Card 6', description: 'Last card in the grid.' },
];

// Dimensions for responsive layout
const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export default function GridScreen({ navigation }: Props) {
    const renderItem = ({ item }: { item: typeof cardData[0] }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
        </View>
    );


    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <FlatList
                        data={cardData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        contentContainerStyle={{ padding: CARD_MARGIN }}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#4a4a4a',
    },
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: CARD_MARGIN,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 1, height: 1 },
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});