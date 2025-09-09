import { RootStackNavigationProp } from '../navigation/NavTypes';
import React from 'react';
import { DarkModeToggle } from '../components/DarkModeToggle';

type Props = { navigation: RootStackNavigationProp<'ThemeToggle'> };

export default function ThemeToggle({ navigation }: Props) {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    return <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
}