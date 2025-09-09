import { RootStackNavigationProp } from '../navigation/NavTypes';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import InputCard from '../components/InputCard';
import { MemoizedComponent } from '../components/MemoizedComponent';

type Props = { navigation: RootStackNavigationProp<'Details'> };

export default function InputScreen({ navigation }: Props) {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView>
                    <InputCard />
                    <MemoizedComponent />
                </ScrollView>
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
});