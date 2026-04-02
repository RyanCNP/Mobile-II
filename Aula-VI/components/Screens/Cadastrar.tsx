import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function Cadastrar({ navigation }: any) {
    return (
        <View style={styles.center}>
            <Text>Tela de Cadastro de Usuário</Text>
            <Button title="Voltar" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
