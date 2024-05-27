import { pool } from "../database/connection.js"

const findAll = async () => {
    const query = {
        text: `SELECT
        e.nombre AS emisor,
        r.nombre AS receptor,
        t.monto,
        t.fecha
    FROM 
    transferencias t
    JOIN 
    usuarios e ON t.emisor = e.id
    JOIN 
    usuarios r ON t.receptor = r.id;`
    }
    const { rows } = await pool.query(query)
    return rows
}

const getIdByName = async (name) => {
    const query = {
        text: "SELECT id FROM usuarios WHERE nombre = $1",
        values: [name]
    }
    const { rows } = await pool.query(query)
    return rows[0]

}
const createTransfer = async ({ emisor, receptor, monto }) => {
    const { id: emisorId } = await getIdByName(emisor)
    const { id: receptorId } = await getIdByName(receptor)

    const registerTransfer = {
        text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *",
        values: [emisorId, receptorId, monto]
    };

    const updateBalanceEmisor = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *",
        values: [monto, emisor]
    };
    const updateBalanceReceptor = {
        text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *",
        values: [monto, receptor]
    };

    try {
        await pool.query("BEGIN")
        await pool.query(registerTransfer)
        await pool.query(updateBalanceEmisor)
        await pool.query(updateBalanceReceptor)
        await pool.query("COMMIT")
        return true
    } catch (error) {
        console.error(error)
        await pool.query("ROLLBACK")
        return {
            ok: false,
            data: "Error en la transferencia"
        }
    }
}

export const modelTransfer = {
    findAll,
    createTransfer
}