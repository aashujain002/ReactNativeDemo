import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AddSubNumberCard from '../components/AddSubNumberCard';
import GreetingCard from '../components/GreetingCard';
import GreetingCardTextOnly from '../components/GreetingCardTextOnly';
import GreetingCardWithToggle from '../components/GreetingCardWithToggle';
import NavCard from '../components/NavCard';
import TimerComponent from '../components/TimerComponent';

type RootStackParamList = {
    Home: undefined;
    Details: undefined;
    ToDoList: undefined;
    Grid: undefined;
    FetchUserList: undefined;
    ThemeToggle: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
    const [count, setCount] = useState(0);

    const onPress = () => setCount(prev => prev + 1);
    const onNegPress = () => setCount(prev => prev - 1);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView>

                    <NavCard
                        title="Input & Memo Screen"
                        onPress={() => navigation.navigate('Details')} />

                    <NavCard
                        title="ToDoList Screen"
                        onPress={() => navigation.navigate('ToDoList')} />

                    <NavCard
                        title="Grid Screen"
                        onPress={() => navigation.navigate('Grid')} />

                    <NavCard
                        title="Fetch User Screen"
                        onPress={() => navigation.navigate('FetchUserList')} />

                    <NavCard
                        title="Theme Toggle Screen"
                        onPress={() => navigation.navigate('ThemeToggle')} />

                    <AddSubNumberCard
                        number={count}
                        firstButtonLabel="Add +"
                        secondButtonLabel="Subtract -"
                        onFirstButtonPress={onPress}
                        onSecondButtonPress={onNegPress} />

                    <GreetingCard
                        title="Happy Birthday!"
                        message="Wishing you all the best on your special day 🎉"
                        imageUri="https://patisserie-valerie.co.uk/cdn/shop/articles/why-we-celebrate-birthdays-with-cake-885206.jpg" />

                    <GreetingCardWithToggle
                        title="Hello there!"
                        description="This is a sample description text that gets toggled on button press." />

                    <TimerComponent />

                    <GreetingCardTextOnly
                        title="Warm Wishes"
                        message="May your day be filled with sunshine, smiles, and sweet surprises!" />

                    <GreetingCardTextOnly
                        title="Congratulations!"
                        message="You did an amazing job. Keep it up!" />
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
        marginBottom: 20,
    },
});