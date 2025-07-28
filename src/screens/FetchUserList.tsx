import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFetch } from '../hooks/useFetch';

type RootStackParamList = {
    Home: undefined;
    FetchUserList: undefined;
};

type FetchUserListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FetchUserList'>;

type Props = {
    navigation: FetchUserListNavigationProp;
};

type User = {
    id: number;
    name: string;
    email: string;
};

export default function FetchUserList({ navigation }: Props) {

    const { data, loading, error } = useFetch<User[]>('https://jsonplaceholder.typicode.com/users', 170);

    if (loading) return <ActivityIndicator size="large" color="#000" style={styles.center} />;
    if (error) return <Text style={[styles.center, styles.error]}>Error: {error}</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                        </View>
                    )}
                />
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
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textNav: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    center: {
        marginTop: 100,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
    list: {
        padding: 16,
    },
    item: {
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
});