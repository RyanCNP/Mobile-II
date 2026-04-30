import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import FormCEP from '../components/FormCEP';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function FormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Se viermos da tela de lista para editar, pegamos o item
  const editItem = route.params?.itemParaEditar || null;

  const handleSuccess = () => {
    navigation.navigate('Lista'); // Vai para a lista após salvar
  };

  return (
    <View style={styles.container}>
      <FormCEP 
        onSuccess={handleSuccess} 
        editItem={editItem}
        setEditItem={() => {}} // Ajustado para a lógica de navegação
      />
      
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('Lista')}
      >
        <Text style={styles.navButtonText}>VER ENDEREÇOS SALVOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  navButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#34C759',
    borderRadius: 8,
    alignItems: 'center'
  },
  navButtonText: { color: '#fff', fontWeight: 'bold' }
});