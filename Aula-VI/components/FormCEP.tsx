import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { createCEP, updateCEP } from '../config/db';

interface FormCEPProps {
  onSuccess: () => void;
  editItem: any;
  setEditItem: (item: any) => void;
}

const listaUF = [
  { label: '--Selecione o Estado--', value: '' },
  { label: 'AC', value: 'AC' }, { label: 'AL', value: 'AL' }, { label: 'AP', value: 'AP' },
  { label: 'AM', value: 'AM' }, { label: 'BA', value: 'BA' }, { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' }, { label: 'ES', value: 'ES' }, { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' }, { label: 'MT', value: 'MT' }, { label: 'MS', value: 'MS' },
  { label: 'MG', value: 'MG' }, { label: 'PA', value: 'PA' }, { label: 'PB', value: 'PB' },
  { label: 'PR', value: 'PR' }, { label: 'PE', value: 'PE' }, { label: 'PI', value: 'PI' },
  { label: 'RJ', value: 'RJ' }, { label: 'RN', value: 'RN' }, { label: 'RS', value: 'RS' },
  { label: 'RO', value: 'RO' }, { label: 'RR', value: 'RR' }, { label: 'SC', value: 'SC' },
  { label: 'SP', value: 'SP' }, { label: 'SE', value: 'SE' }, { label: 'TO', value: 'TO' },
];

export default function FormCEP({ onSuccess, editItem, setEditItem }: FormCEPProps) {
  const db = useSQLiteContext();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [complemento, setComplemento] = useState('');
  const [numero, setNumero] = useState('');

  useEffect(() => {
    if (editItem) {
      setUser(editItem.USER);
      setCep(editItem.CEP.toString());
      setLogradouro(editItem.LOGRADOURO);
      setBairro(editItem.BAIRRO);
      setCidade(editItem.CIDADE);
      setEstado(editItem.ESTADO);
      setComplemento(editItem.COMPLEMENTO || '');
      setNumero(editItem.NUMERO?.toString() || '');
    }
  }, [editItem]);

  const buscarCEP = async (valorCEP: string) => {
    const limpo = valorCEP.replace(/\D/g, '');
    setCep(limpo);

    if (limpo.length === 8) {
      setLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
        const data = await response.json();

        if (data.erro) {
          Alert.alert("Aviso", "CEP não encontrado.");
        } else {
          setLogradouro(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
        }
      } catch (error) {
        Alert.alert("Ocorreu um erro de conexão, tente novamente.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!cep || !logradouro) {
      return Alert.alert("Campos Obrigatórios", "Por favor, preencha ao menos o CEP e o Logradouro.");
    }

    const cepNum = parseInt(cep);
    const numValue = parseInt(numero) || 0;

    try {
      if (editItem) {
        await updateCEP(db, editItem.ID, user, cepNum, logradouro, bairro, cidade, estado, complemento, numValue);
        Alert.alert("Sucesso", "CEP atualizado com sucesso!");
      } else {
        await createCEP(db, user, cepNum, logradouro, bairro, cidade, estado, complemento, numValue);
        Alert.alert("Sucesso", "CEP salvo com sucesso!");
      }

      clearFields();
      onSuccess();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar os dados no banco local.");
    }
  };

  const clearFields = () => {
    setUser('');
    setCep('');
    setLogradouro('');
    setBairro('');
    setCidade('');
    setEstado('');
    setComplemento('');
    setNumero('');
    if (setEditItem) setEditItem(null);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{editItem ? "📝 Editando Endereço" : "📍 Novo Endereço"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={user}
        onChangeText={setUser}
      />

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="CEP (somente números)"
          keyboardType="numeric"
          maxLength={8}
          value={cep}
          onChangeText={buscarCEP}
        />
        {loading && <ActivityIndicator style={styles.loader} color="#007AFF" />}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Logradouro"
        value={logradouro}
        onChangeText={setLogradouro}
      />

      <View style={styles.row}>
        <View style={{ flex: 2 }}>
          <TextInput
            style={styles.input}
            placeholder="Bairro"
            value={bairro}
            onChangeText={setBairro}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <TextInput
            style={styles.input}
            placeholder="Nº"
            keyboardType="numeric"
            value={numero}
            onChangeText={setNumero}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 2.5 }}>
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
          />
        </View>

        <View style={{ flex: 1.5, marginLeft: 10 }}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={estado}
              onValueChange={(itemValue) => setEstado(itemValue)}
              style={styles.picker}
              dropdownIconColor="#007AFF"
            >
              {listaUF.map((uf) => (
                <Picker.Item
                  key={uf.value}
                  label={uf.label === '--Selecione o Estado--' ? 'UF' : uf.label}
                  value={uf.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Complemento (opcional)"
        value={complemento}
        onChangeText={setComplemento}
      />

      {/* Botões de Ação */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, { flex: 1, backgroundColor: editItem ? '#FF9500' : '#007AFF' }]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>{editItem ? "ATUALIZAR" : "SALVAR"}</Text>
        </TouchableOpacity>

        {editItem && (
          <TouchableOpacity
            style={[styles.button, { flex: 1, marginLeft: 10, backgroundColor: '#8E8E93' }]}
            onPress={clearFields}
          >
            <Text style={styles.buttonText}>CANCELAR</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    maxHeight: Dimensions.get('window').height * 0.7,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 12,
    color: '#000',
    fontSize: 16,
    height: 50,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginLeft: 4,
    fontWeight: '600'
  },
  inputWrapper: {
    position: 'relative',
    width: '100%'
  },
  loader: {
    position: 'absolute',
    right: 12,
    top: 15
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    justifyContent: 'center',
    height: 50
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 12,
    justifyContent: 'center',
    height: 50,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    ...Platform.select({
      android: {
        marginLeft: -10,
        color: '#333',
      },
    }),
  },
});