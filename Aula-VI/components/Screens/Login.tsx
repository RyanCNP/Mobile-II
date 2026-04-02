import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function Login({ navigation }: any) {
    return (
        <View style={styles.center}>
            <Text>Tela de Login</Text>
            <Button title="Ir para Cadastro" onPress={() => navigation.navigate('Cadastro')} />
            <Button title="Voltar" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });