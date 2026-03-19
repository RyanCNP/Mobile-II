import * as SQLite from 'expo-sqlite';

//--- function create and open database
async function Database() {
    const db = await SQLite.openDatabaseAsync('FatecV');
    console.log("Database created");
    return db;
}

// create table
async function createTable(db: SQLite.SQLiteDatabase) {
    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS USER(
                ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME_US VARCHAR(100),
                EMAIL_US VARCHAR(100)
            );
            `)
        console.log("Table created");
    } catch (error) {
        console.log("Error creating table: ", error);
    }
}

// insert data
async function insertData(db: SQLite.SQLiteDatabase, name: string, email: string) {
    try { 
        await db.runAsync("INSERT INTO USER (NOME_US, EMAIL_US) VALUES (?, ?);", [name, email]);
        console.log("New user inserted");
    } catch (error) {
        console.log("Error inserting new user: ", error);
    }
}
// ----
export { Database, createTable, insertData };