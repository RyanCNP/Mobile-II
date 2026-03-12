import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [buscarCep, setBuscarCep] = useState('');
  const [dadosCep, setDadosCep] = useState(null);
  const [loading, setLoading] = useState(false);

  const ufs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleBuscaCep = async () => {
    if (buscarCep.length < 8) {
      Alert.alert("Erro", "Digite um CEP válido com 8 dígitos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${buscarCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        Alert.alert("Aviso", "CEP não encontrado!");
        setDadosCep(null);
      } else {
        setDadosCep({
          ...data,
          numero: '',
          complemento: ''
        });
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar à API");
    } finally {
      setLoading(false);
    }
  };

  const atualizarCampo = (chave, valor) => {
    setDadosCep({ ...dadosCep, [chave]: valor });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Consulta de CEP</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            placeholder='Digite o CEP'
            style={styles.inputCep}
            onChangeText={setBuscarCep}
            value={buscarCep}
            keyboardType="numeric"
            maxLength={8}
          />
          <TouchableOpacity style={styles.btnBusca} onPress={handleBuscaCep}>
            <Text style={styles.btnText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 20 }} />}

        {dadosCep && !loading && (
          <View style={styles.form}>
            
            <Text style={styles.label}>Logradouro:</Text>
            <TextInput
              style={styles.inputEdit}
              value={dadosCep.logradouro}
              onChangeText={(txt) => atualizarCampo('logradouro', txt)}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Número:</Text>
                <TextInput
                  style={styles.inputEdit}
                  placeholder="Ex: 123"
                  value={dadosCep.numero}
                  onChangeText={(txt) => atualizarCampo('numero', txt)}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.label}>Complemento:</Text>
                <TextInput
                  style={styles.inputEdit}
                  placeholder="Apto / Bloco"
                  value={dadosCep.complemento}
                  onChangeText={(txt) => atualizarCampo('complemento', txt)}
                />
              </View>
            </View>

            <Text style={styles.label}>Bairro:</Text>
            <TextInput
              style={styles.inputEdit}
              value={dadosCep.bairro}
              onChangeText={(txt) => atualizarCampo('bairro', txt)}
            />

            <Text style={styles.label}>Cidade:</Text>
            <TextInput
              style={styles.inputEdit}
              value={dadosCep.localidade}
              onChangeText={(txt) => atualizarCampo('localidade', txt)}
            />

            <Text style={styles.label}>Estado (UF):</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={dadosCep.uf}
                onValueChange={(itemValue) => atualizarCampo('uf', itemValue)}
                style={styles.picker}
              >
                {ufs.map((uf) => (
                  <Picker.Item key={uf} label={uf} value={uf} />
                ))}
              </Picker>
            </View>
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 20, alignItems: 'center', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a73e8', marginBottom: 25 },
  searchContainer: { flexDirection: 'row', width: '100%', gap: 10 },
  inputCep: {
    flex: 1, height: 50, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, fontSize: 16
  },
  btnBusca: {
    backgroundColor: '#1a73e8', paddingHorizontal: 20,
    borderRadius: 8, justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  form: { 
    width: '100%', backgroundColor: '#fff', padding: 20, 
    borderRadius: 12, marginTop: 20, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4
  },
  row: { flexDirection: 'row', width: '100%' },
  label: { fontSize: 14, color: '#444', fontWeight: '600', marginBottom: 5, marginTop: 12 },
  inputEdit: {
    height: 45, backgroundColor: '#fafafa', borderWidth: 1,
    borderColor: '#eee', borderRadius: 6, paddingHorizontal: 12, fontSize: 16, color: '#333'
  },
  pickerContainer: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 6,
    backgroundColor: '#fafafa', marginTop: 5, overflow: 'hidden',
  },
  picker: { height: 50, width: '100%' }
});