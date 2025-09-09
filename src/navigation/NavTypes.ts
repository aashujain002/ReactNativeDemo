import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Central Root stack route definitions used across the app
export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  NewsReader: undefined;
  ToDoList: undefined;
  Grid: undefined;
  FetchUserList: undefined;
  ThemeToggle: undefined;
  Weather: undefined;
};

// Generic helper for typed navigation prop per screen
export type RootStackNavigationProp<Screen extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, Screen>;
