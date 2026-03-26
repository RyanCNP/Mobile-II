import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Database, createTable, insertData, selectUser, selectUserId, deleteUser, updateUser } from './config/db'; // All DataBase rules
import { useEffect } from 'react';

export default function App() {

  useEffect(() => {
    async function Main() {
      const dbr = await Database();
      await createTable(dbr);

      insertData(dbr, 'João', 'j@j.com');
      const campos = await selectUser(dbr);
      for (const reg of campos as { ID_US: number, NOME_US: string, EMAIL_US: string }[]) {
        console.log(reg.ID_US, reg.NOME_US, reg.EMAIL_US);
      }

      console.log("--------------------------");

      const campoId = await selectUserId(dbr, 1) as { ID_US: number, NOME_US: string, EMAIL_US: string }[];
      console.log(campoId[0].ID_US, campoId[0].NOME_US, campoId[0].EMAIL_US);

      console.log("--------------------------");

      //await deleteUser(dbr, 1);
      const campos2 = await selectUser(dbr);
      for (const reg of campos2 as { ID_US: number, NOME_US: string, EMAIL_US: string }[]) {
        console.log(reg.ID_US, reg.NOME_US, reg.EMAIL_US);
      }

      console.log("--------------------------")

      await updateUser(dbr, 28, 'Maria', 'm@m.com');
      const campos3 = await selectUser(dbr);
      for (const reg of campos3 as { ID_US: number, NOME_US: string, EMAIL_US: string }[]) {
        console.log(reg.ID_US, reg.NOME_US, reg.EMAIL_US);
      }
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
