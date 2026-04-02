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
            CREATE TABLE IF NOT EXISTS USER(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME VARCHAR(100) NOT NULL,
                EMAIL VARCHAR(100) UNIQUE NOT NULL
            );
            CREATE TABLE IF NOT EXISTS LOGIN(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USER_EMAIL VARCHAR(100) NOT NULL,
                PASSWORD VARCHAR(100) NOT NULL,
                FOREIGN KEY (USER_EMAIL) REFERENCES USER(EMAIL)
            );
            CREATE TABLE IF NOT EXISTS CEP(
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USER_ID INTEGER NOT NULL,
                CEP INTEGER(8) NOT NULL,
                LOGRADOURO VARCHAR(100) NOT NULL,
                BAIRRO VARCHAR(100) NOT NULL,
                CIDADE VARCHAR(100) NOT NULL,
                ESTADO VARCHAR(2) NOT NULL,
                COMPLEMENTO VARCHAR(100),
                NUMERO INTEGER,
                DDD INTEGER(2) NOT NULL,
                FOREIGN KEY (USER_ID) REFERENCES USER(ID)
                );
            `)
        console.log("Tabelas criadas com sucesso");
    } catch (error) {
        console.log("Erro ao criar tabelas: ", error);
    }
}

export { Database, createTables};