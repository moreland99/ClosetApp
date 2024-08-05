import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  Closet: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

export type CreateAccountScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateAccount'
>;
