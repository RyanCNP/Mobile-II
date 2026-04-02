import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function Home({ navigation }: any) {
    return (
        <View style={styles.center}>
            <Text>Tela Home - Lista de CEPs</Text>
            <Button title="Ir para Login" onPress={() => navigation.navigate('Login')} />
        </View>
    );
}

const styles = StyleSheet.create({ center: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
