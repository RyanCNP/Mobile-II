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
// ---- show data
async function selectUser(db: SQLite.SQLiteDatabase) {
    try{
        const result = await db.getAllAsync("SELECT * FROM USER;");
        console.log("Users found: ", result);
        return result;
    } catch (error) {
        console.log("Error selecting users: ", error);
    }
}

// ---- filter
async function selectUserId(db: SQLite.SQLiteDatabase, id: number) {
    try{
        const result = await db.getAllAsync("SELECT * FROM USER WHERE ID_US = ?;", [id]);
        console.log("User found: ", result);
        return result;
    } catch (error) {
        console.log("Error selecting users: ", error);
    }
}

// ---- delete data
async function deleteUser(db: SQLite.SQLiteDatabase, id: number) {
    try{
        await db.runAsync("DELETE FROM USER WHERE ID_US = ?;", [id]);
        console.log("User deleted");
    } catch (error) {
        console.log("Error deleting user: ", error);
    }
}

// ---- update data
async function updateUser(db: SQLite.SQLiteDatabase, id: number, name: string, email: string) {
    try{
        await db.runAsync("UPDATE USER SET NOME_US = ?, EMAIL_US = ? WHERE ID_US = ?;", [name, email, id]);
        console.log("User updated");
    } catch (error) {
        console.log("Error updating user: ", error);
    }
}

export { Database, createTable, insertData, selectUser, selectUserId, deleteUser, updateUser };