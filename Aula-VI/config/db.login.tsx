import * as SQLite from 'expo-sqlite';

async function createLogin(db: SQLite.SQLiteDatabase, userEmail: string, password: string) {
    try {
        await db.runAsync("INSERT INTO LOGIN (USER_EMAIL, PASSWORD) VALUES (?, ?);", [userEmail, password]);
        console.log("Usuário Logado com sucesso");
    } catch (error) {
        console.log("Erro ao entrar: ", error);
    }
}

async function AuthenticateUser(db: SQLite.SQLiteDatabase, userEmail: string, password: string) {
    try {
        const result = await db.getFirstAsync("SELECT * FROM LOGIN WHERE USER_EMAIL = ? AND PASSWORD = ?;", [userEmail, password]);
        console.log("Usuário encontrado: ", result);
        return result;
    } catch (error) {
        console.log("Erro ao buscar usuário: ", error);
    }
}

export { createLogin, AuthenticateUser };