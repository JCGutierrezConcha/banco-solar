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

    try {
        const { id: emisorId } = await getIdByName(emisor)
        const { id: receptorId } = await getIdByName(receptor)

        await pool.query("BEGIN")

        const queryEmisor = {
            text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2",
            values: [monto, emisor]
        }

        await pool.query(queryEmisor)

        const queryReceptor = {
            text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2",
            values: [monto, receptor]
        }

        await pool.query(queryReceptor)

        const queryTransfer = {
            text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *",
            values: [emisorId, receptorId, monto]
        };

        const { rows } = await pool.query(queryTransfer)

        await pool.query("COMMIT")

        return rows[0]

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