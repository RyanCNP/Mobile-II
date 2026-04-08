import * as SQLite from 'expo-sqlite';

async function Database() {
    const db = await SQLite.openDatabaseAsync('FatecV');
    console.log("Database created");
    return db;
}

async function createTables(db: SQLite.SQLiteDatabase) {
    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS CEP(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USER VARCHAR(100) NOT NULL,
                CEP INTEGER(8) NOT NULL,
                LOGRADOURO VARCHAR(100) NOT NULL,
                BAIRRO VARCHAR(100) NOT NULL,
                CIDADE VARCHAR(100) NOT NULL,
                ESTADO VARCHAR(2) NOT NULL,
                COMPLEMENTO VARCHAR(100),
                NUMERO INTEGER,
                );
            `)
        console.log("Tabelas criadas com sucesso");
    } catch (error) {
        console.log("Erro ao criar tabelas: ", error);
    }
}

async function createCEP(db: SQLite.SQLiteDatabase, user: string, cep: number, logradouro: string,
    bairro: string, cidade: string, estado: string, complemento: string, numero: number) {
    try {
        await db.runAsync(`INSERT INTO CEP (USER, CEP, LOGRADOURO,
            BAIRRO, CIDADE, ESTADO, COMPLEMENTO, NUMERO) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [user, cep, logradouro, bairro, cidade, estado, complemento, numero, ]);
        console.log("CEP cadastrado com sucesso");
    } catch (error) {
        console.log("Erro ao cadastrar CEP: ", error);
    }
}

async function getCEPs(db: SQLite.SQLiteDatabase, cep: number) {
    try {
        const result = await db.getAllAsync("SELECT * FROM CEP WHERE CEP = ?;", [cep]);
        console.log("CEPs encontrados: ", result);
        return result;
    } catch (error) {
        console.log("Erro ao buscar CEP: ", error);
    }
}

async function getAllCEPsByUserId(db: SQLite.SQLiteDatabase, userId: number) {
    try {
        const result = await db.getAllAsync("SELECT * FROM CEP WHERE USER = ?;", [userId]);
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

async function updateCEP(db: SQLite.SQLiteDatabase, id: number, user: string, cep: number, logradouro: string,
    bairro: string, cidade: string, estado: string, complemento: string, numero: number) {
    try {
        await db.runAsync(`UPDATE CEP SET USER = ?, CEP = ?, LOGRADOURO = ?,
            BAIRRO = ?, CIDADE = ?, ESTADO = ?, COMPLEMENTO = ?, NUMERO = ? WHERE ID = ?;`,
            [user, cep, logradouro, bairro, cidade, estado, complemento, numero, id]);
        console.log("CEP atualizado com sucesso");
    } catch (error) {
        console.log("Erro ao atualizar CEP: ", error);
    }
}

export { Database, createTables, createCEP, getCEPs, getAllCEPsByUserId, deleteCEP, updateCEP };