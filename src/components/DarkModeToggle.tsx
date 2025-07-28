import React, { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Switch,
    Text
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
};


export const DarkModeToggle: React.FC<Props> = ({ isDarkMode, setIsDarkMode }) => {
    const toggleSwitch = () => setIsDarkMode(!isDarkMode);
    // const [isDarkMode, setIsDarkMode] = useState(false);

    // const toggleSwitch = () => setIsDarkMode((prev) => !prev);

    const themeStyles = isDarkMode ? darkStyles : lightStyles;

    return (
        <SafeAreaProvider style={[styles.container, themeStyles.container]}>
            <SafeAreaView style={[styles.container, themeStyles.container]}>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={themeStyles.container.backgroundColor}
                    translucent={false}
                />

                <Text style={[styles.title, themeStyles.text]}>
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </Text>

                <Switch
                    value={isDarkMode}
                    onValueChange={toggleSwitch}
                    thumbColor={isDarkMode ? '#f5dd4b' : '#fff'}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

// Shared base styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: '600',
    },
});

// Light Theme Styles
const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    text: {
        color: '#000',
    },
});

// Dark Theme Styles
const darkStyles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
    },
    text: {
        color: '#fff',
    },
});