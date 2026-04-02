import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Database, createTables } from './config/db';
import { useEffect } from 'react';
import { Home } from './components/Screens/Home';
import { Login } from './components/Screens/Login';
import { Cadastrar } from './components/Screens/Cadastrar';

const Stack = createStackNavigator();

export default function App() {
  /*
  useEffect(() => {
    async function Main() {
      const db = await Database();
      await createTables(db);
    }
    Main();
  }, [])
  */
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastrar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
