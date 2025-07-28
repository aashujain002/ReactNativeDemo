import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { DarkModeToggle } from '../components/DarkModeToggle';

type RootStackParamList = {
    Home: undefined;
    ThemeToggle: undefined;
};

type ThemeToggleNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ThemeToggle'>;

type Props = {
    navigation: ThemeToggleNavigationProp;
};

export default function ThemeToggle({ navigation }: Props) {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    return <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
}