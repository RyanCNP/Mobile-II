import * as SQLite from 'expo-sqlite';

async function createUser(db: SQLite.SQLiteDatabase, name: string, email: string) {
    try {
        await db.runAsync("INSERT INTO USER (NOME, EMAIL) VALUES (?, ?);", [name, email]);
        console.log("Usuário cadastrado com sucesso");
    } catch (error) {
        console.log("Erro ao criar novo usuário: ", error);
    }
}

async function getUserByEmail(db: SQLite.SQLiteDatabase, email: string) {
    try {
        const result = await db.getFirstAsync("SELECT * FROM USER WHERE EMAIL = ?;", [email]);
        console.log("Usuário encontrado: ", result);
        return result;
    } catch (error) {
        console.log("Erro ao buscar usuário: ", error);
    }
}

async function deleteUser(db: SQLite.SQLiteDatabase, userEmail: string) {
    try {
        await db.runAsync("DELETE FROM CEP WHERE USER_ID = (SELECT ID FROM USER WHERE EMAIL = ?);", [userEmail]);
        await db.runAsync("DELETE FROM LOGIN WHERE USER_EMAIL = ?;", [userEmail]);
        await db.runAsync("DELETE FROM USER WHERE EMAIL = ?;", [userEmail]);

        console.log("Usuário excluído com sucesso");
    } catch (error) {
        console.log("Erro ao excluir usuário: ", error);
    }
}

async function updateUser(db: SQLite.SQLiteDatabase, id: number, name: string, email: string) {
    try {
        await db.runAsync("UPDATE USER SET NOME = ?, EMAIL = ? WHERE ID = ?;", [name, email, id]);
        await db.runAsync("UPDATE LOGIN SET USER_EMAIL = ? WHERE USER_ID = ?;", [email, id]);
        console.log("Usuário atualizado com sucesso");
    } catch (error) {
        console.log("Erro ao atualizar dados do usuário: ", error);
    }
}

export { createUser, getUserByEmail, deleteUser, updateUser };