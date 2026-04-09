import React, { useState, useEffect, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput, // Importado do react-native
  KeyboardAvoidingView
} from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

import { createTables } from './config/db';
import FormCEP from './components/FormCEP';
import TableCEP from './components/TableCEP';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="FatecV.db" onInit={createTables}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <MainContent />
          </KeyboardAvoidingView>
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
  const [buscaUser, setBuscaUser] = useState('');
  const [buscaCEP, setBuscaCEP] = useState('');

  const itensPorPagina = 5;

  const loadData = useCallback(async () => {
    try {
      const offset = (pagina - 1) * itensPorPagina;
      let query = "SELECT * FROM CEP WHERE 1=1";
      const params: any[] = [];

      if (buscaUser) {
        query += " AND USER LIKE ?";
        params.push(`%${buscaUser}%`);
      }

      if (buscaCEP) {
        const cepLimpo = buscaCEP.replace(/\D/g, '');
        if (cepLimpo) {
          query += " AND CEP = ?";
          params.push(parseInt(cepLimpo));
        }
      }

      query += " ORDER BY ID DESC LIMIT ? OFFSET ?";
      params.push(itensPorPagina, offset);

      const data = await db.getAllAsync(query, params);
      setCeps(data);
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  }, [db, pagina, buscaUser, buscaCEP]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      <View style={{ flexShrink: 0 }}>
        <FormCEP
          onSuccess={loadData}
          editItem={itemParaEditar}
          setEditItem={setItemParaEditar}
        />

        <View style={styles.divider} />

        <Text style={styles.searchTitle}>🔎 Filtros de busca</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.inputSearch, { flex: 2 }]}
            placeholder="Nome do Usuário"
            value={buscaUser}
            onChangeText={(t) => { setBuscaUser(t); setPagina(1); }}
          />
          <TextInput
            style={[styles.inputSearch, { flex: 1, marginLeft: 10 }]}
            placeholder="CEP"
            keyboardType="numeric"
            value={buscaCEP}
            onChangeText={(t) => { setBuscaCEP(t); setPagina(1); }}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <TableCEP data={ceps} onDelete={loadData} onEdit={setItemParaEditar} />
      </View>

      {(ceps.length >= itensPorPagina || pagina > 1) && (
        <View style={styles.pagination}>
          <TouchableOpacity
            disabled={pagina === 1}
            onPress={() => setPagina(p => p - 1)}
            style={[styles.pageButton, pagina === 1 && { opacity: 0.4 }]}
          >
            <Text style={styles.pageText}>Anterior</Text>
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>Página {pagina}</Text>

          <TouchableOpacity
            disabled={ceps.length < itensPorPagina}
            onPress={() => setPagina(p => p + 1)}
            style={[styles.pageButton, ceps.length < itensPorPagina && { opacity: 0.4 }]}
          >
            <Text style={styles.pageText}>Próxima</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  searchTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputSearch: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    marginBottom: Platform.OS === 'android' ? 30 : 10,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  pageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageIndicator: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeText: { color: '#007AFF' },
  disabledText: { color: '#ccc' }
});