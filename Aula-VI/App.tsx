import React, { useState, useEffect, useCallback } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet, SafeAreaView, StatusBar, Text, TouchableOpacity } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

import { createTables } from './config/db'; 
import FormCEP from './components/FormCEP';
import TableCEP from './components/TableCEP';

export default function App() {
  return (
    // 2. ENVOLVA TUDO COM GESTUREHANDLERROOTVIEW
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="FatecV.db" onInit={createTables}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" />
          <MainContent />
        </SafeAreaView>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}

function MainContent() {
  const db = useSQLiteContext();
  const [ceps, setCeps] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [itemParaEditar, setItemParaEditar] = useState<any>(null);
  const itensPorPagina = 5;
  const [buscaUser, setBuscaUser] = useState('');
  const [buscaCEP, setBuscaCEP] = useState('');

  const loadData = useCallback(async () => {
    try {
      const offset = (pagina - 1) * itensPorPagina;
      
      // Construção da query dinâmica
      let query = "SELECT * FROM CEP WHERE 1=1";
      const params: any[] = [];

      if (buscaUser) {
        query += " AND USER LIKE ?";
        params.push(`%${buscaUser}%`);
      }

      if (buscaCEP) {
        query += " AND CEP = ?";
        params.push(parseInt(buscaCEP.replace(/\D/g, '')) || 0);
      }

      query += " ORDER BY ID DESC LIMIT ? OFFSET ?";
      params.push(itensPorPagina, offset);

      const data = await db.getAllAsync(query, params);
      setCeps(data);
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  }, [db, pagina, buscaUser, buscaCEP]); // Recarrega quando os filtros mudam

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      <FormCEP 
        onSuccess={loadData} 
        editItem={itemParaEditar} 
        setEditItem={setItemParaEditar} 
      />

      <View style={styles.divider} />

      {/* Inputs de Filtro */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={[styles.inputSearch, { flex: 2 }]} 
          placeholder="Filtrar por Usuário" 
          value={buscaUser}
          onChangeText={(txt) => { setBuscaUser(txt); setPagina(1); }}
        />
        <TextInput 
          style={[styles.inputSearch, { flex: 1, marginLeft: 10 }]} 
          placeholder="CEP" 
          keyboardType="numeric"
          value={buscaCEP}
          onChangeText={(txt) => { setBuscaCEP(txt); setPagina(1); }}
        />
      </View>

      <TableCEP 
        data={ceps} 
        onDelete={loadData} 
        onEdit={(item) => setItemParaEditar(item)} 
      />

      {/* Paginação */}
      <View style={styles.pagination}>
        <TouchableOpacity disabled={pagina === 1} onPress={() => setPagina(p => p - 1)}>
          <Text style={pagina === 1 ? { color: '#ccc' } : { color: '#007AFF' }}>Anterior</Text>
        </TouchableOpacity>
        <Text>Página {pagina}</Text>
        <TouchableOpacity disabled={ceps.length < itensPorPagina} onPress={() => setPagina(p => p + 1)}>
          <Text style={ceps.length < itensPorPagina ? { color: '#ccc' } : { color: '#007AFF' }}>Próxima</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { 
    flex: 1, 
    paddingTop: 20, 
    paddingHorizontal: 20 
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  pageText: {
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputSearch: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 5,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  }
});