import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import TableCEP from '../components/TableCEP';
import { getCEPsByFilter } from '../config/db';

export default function ListScreen() {
  const db = useSQLiteContext();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [ceps, setCeps] = useState<any[]>([]);
  const [buscaUser, setBuscaUser] = useState('');
  const [buscaCEP, setBuscaCEP] = useState('');

  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 5;

  const loadData = useCallback(async () => {
    const offset = (pagina - 1) * itensPorPagina;
    const data = await getCEPsByFilter(db, buscaUser, buscaCEP, itensPorPagina, offset);
    setCeps(data || []);
  }, [db, buscaUser, buscaCEP, pagina]);

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused, loadData]);

  const handleSearch = (t: string) => {
    setBuscaUser(t);
    setPagina(1);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Filtrar por usuário..."
        value={buscaUser}
        onChangeText={handleSearch}
      />
      
      <TableCEP data={ceps} onDelete={loadData} onEdit={(item) => {}} />

      {/* Controles de Paginação (Opcional) */}
      <View style={styles.pagination}>
         <TouchableOpacity onPress={() => setPagina(p => Math.max(1, p - 1))}>
            <Text>Anterior</Text>
         </TouchableOpacity>
         <Text>Página {pagina}</Text>
         <TouchableOpacity onPress={() => setPagina(p => p + 1)}>
            <Text>Próxima</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  searchBar: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15
  }
});