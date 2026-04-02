import * as SQLite from 'expo-sqlite';

async function createCEP(db: SQLite.SQLiteDatabase, userId: number, cep: number, logradouro: string,
    bairro: string, cidade: string, estado: string, complemento: string, numero: number, ddd: number) {
    try {
        await db.runAsync(`INSERT INTO CEP (USER_ID, CEP, LOGRADOURO,
            BAIRRO, CIDADE, ESTADO, COMPLEMENTO, NUMERO, DDD) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [userId, cep, logradouro, bairro, cidade, estado, complemento, numero, ddd]);
        console.log("CEP cadastrado com sucesso");
    } catch (error) {
        console.log("Erro ao cadastrar CEP: ", error);
    }
}

async function getCEP(db: SQLite.SQLiteDatabase, cep: number) {
    try {
        const result = await db.getFirstAsync("SELECT * FROM CEP WHERE CEP = ?;", [cep]);
        console.log("CEP encontrado: ", result);
        return result;
    } catch (error) {
        console.log("Erro ao buscar CEP: ", error);
    }
}

async function getAllCEPsByUserId(db: SQLite.SQLiteDatabase, userId: number) {
    try {
        const result = await db.getAllAsync("SELECT * FROM CEP WHERE USER_ID = ?;", [userId]);
        console.log("CEPs encontrados: ", result);
        return result;
    } catch (error) {
        console.log("Erro ao buscar CEPs: ", error);
    }
}

async function deleteCEP(db: SQLite.SQLiteDatabase, id: number) {
    try {
        await db.runAsync("DELETE FROM CEP WHERE ID = ?;", [id]);
        console.log("CEP excluído com sucesso");
    } catch (error) {
        console.log("Erro ao excluir CEP: ", error);
    }
}

async function updateCEP(db: SQLite.SQLiteDatabase, id: number, userId: number, cep: number, logradouro: string,
    bairro: string, cidade: string, estado: string, complemento: string, numero: number, ddd: number) {
    try {
        await db.runAsync(`UPDATE CEP SET USER_ID = ?, CEP = ?, LOGRADOURO = ?,
            BAIRRO = ?, CIDADE = ?, ESTADO = ?, COMPLEMENTO = ?, NUMERO = ?, DDD = ? WHERE ID = ?;`,
            [userId, cep, logradouro, bairro, cidade, estado, complemento, numero, ddd, id]);
        console.log("CEP atualizado com sucesso");
    } catch (error) {
        console.log("Erro ao atualizar CEP: ", error);
    }
}

export { createCEP, getCEP, getAllCEPsByUserId, deleteCEP, updateCEP };