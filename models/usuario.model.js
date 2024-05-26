import { pool } from "../database/connection.js";

const findAll = async () => {
    const query = {
        text: "SELECT * FROM USUARIOS ORDER BY id",
    }
    const { rows } = await pool.query(query)
    return rows
}

const create = async ({ nombre, balance }) => {
    const query = {
        text: "INSERT INTO USUARIOS (nombre, balance) VALUES ($1, $2) RETURNING * ",
        values: [nombre, balance]
    }
    const { rows } = await pool.query(query)
    return rows[0]
}

const remove = async (id) => {
    const query = {
        text: "DELETE FROM USUARIOS WHERE id = $1 RETURNING *",
        values: [id]
    }
    const { rows } = await pool.query(query)
    return rows[0]
}

const update = async (user) => {
    const query = {
        text: "UPDATE USUARIOS SET nombre= $1, balance= $2 WHERE id= $3 RETURNING *",
        values: [user.nombre, user.balance, user.id]
    }
    const { rows } = await pool.query(query)
    return rows[0]
}

export const modelUser = {
    findAll,
    create,
    remove,
    update
}
