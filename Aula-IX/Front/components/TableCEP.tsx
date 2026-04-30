import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { deleteCEP } from '../config/db';

interface CEPItem {
  ID: number;
  USER: string;
  CEP: number;
  LOGRADOURO: string;
  BAIRRO: string;
  CIDADE: string;
  ESTADO: string;
  COMPLEMENTO?: string;
  NUMERO?: number;
}

interface TableCEPProps {
  data: CEPItem[];
  onDelete: () => void;
  onEdit: (item: CEPItem) => void;
}

export default function TableCEP({ data, onDelete, onEdit }: TableCEPProps) {
  const db = useSQLiteContext();

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Excluir",
      "Deseja realmente remover este endereço?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteCEP(db, id);
              onDelete();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o registro.");
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Endereços Salvos</Text>
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.ID.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum CEP cadastrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.userText}>Cadastrado por: {item.USER}</Text>
              
              <Text style={styles.cepText}>{item.CEP}</Text>
              <Text style={styles.addressText}>{item.LOGRADOURO}, {item.NUMERO}</Text>
              <Text style={styles.cityText}>{item.CIDADE} - {item.ESTADO}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.ID)}>
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  row: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  info: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cepText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  cityText: {
    fontSize: 12,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  userText: {
    fontSize: 10,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 2,
    textTransform: 'uppercase',
  }
});