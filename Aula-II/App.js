import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, TextInput } from 'react-native';

export default function App() {
  const [cep, setCep] = useState([])
  const [loading, setLoading] = useState(false)

  //API ViaCEP
  const BuscaCep = async (cep) => {
    setLoading(true)
    let url = `https://viacep.com.br/ws/${cep}/json/`
    await fetch(url)
      .then(resp => resp.json())
      .then(data => {
        //console.log(data)
        setCep(data)
      })
      .catch(error => {
        console.log("tipo " + error)
      })
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Button title="Search Postal Code" onPress={() => BuscaCep('18112525')} />
      <TextInput
        value={cep.logradouro}
        onChange={(text) => setCep({ ...cep, logradouro: text })}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      />
      {loading && <ActivityIndicator size="large" color="blue" />}
      {cep != "" && (
        <View>
          <Text>CEP: {cep.cep}</Text>
          <Text>Logradouro: {cep.logradouro}</Text>
          <Text>Bairro: {cep.bairro}</Text>
          <Text>Cidade: {cep.localidade}</Text>
          <Text>Estado: {cep.uf}</Text>
        </View>
      )}
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
