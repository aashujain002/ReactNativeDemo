import { NativeStackNavigationProp } from '@react-navigation/native-stack';
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Details: undefined;
  NewsReader: undefined;
  ToDoList: undefined;
  Grid: undefined;
  FetchUserList: undefined;
  ThemeToggle: undefined;
  Weather: undefined;
  ProductCategorySelect: { onSelect?: (selected: string) => void } | undefined;
  ProductList: { selected?: string } | undefined;
  ExpenseTracker: undefined;
};

 
export type RootStackNavigationProp<Screen extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, Screen>;
