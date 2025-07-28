import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';

export const MyLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    text: '#000000',
    card: '#ffffff', // header background
    primary: '#007aff',
  },
};

export const MyDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    text: '#ffffff',
    card: '#121212', // header background
    primary: '#81b0ff',
  },
};