import React from 'react';
import {
  createNavigationContainer,
  NavigationContainer,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';

import Main from './src/screens/Main';
import SearchScreen from './src/screens/Search';
import CreateScreen from './src/screens/Create';
import UpdateScreen from './src/screens/Update';

const Stack = createStackNavigator();

/* console.ignoredYellowBox = ['Setting a timer']; */

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          inittialRoute="Main"
          /* screenOptions={{ headerShown: false }} */
        >
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Create" component={CreateScreen} />
          <Stack.Screen name="Update" component={UpdateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
