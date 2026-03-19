import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Database, createTable, insertData } from './config/db'; // All DataBase rules
import { useEffect } from 'react';

export default function App() {

  useEffect(() => {
    async function Main() {
      const dbr = await Database();
      await createTable(dbr);
      insertData(dbr, 'João', 'j@j.com');
    };
    Main();
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
