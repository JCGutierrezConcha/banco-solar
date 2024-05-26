import { modelTransfer } from "../models/transferencia.model.js"

const getAllTransfers = async (req, res) => {
    try {
        const transfers = await modelTransfer.findAll()
        return res.status(200).json(transfers)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: "Error de servidor" })
    }
}

const createTransfer = async (req, res) => {
    try {
        const { emisor, receptor, monto } = req.body

        if (!emisor || !receptor || !monto) {
            return res.status(400).json({ ok: false, msg: "Todos los campos obligatorios" })
        }

        const newTransfer = await modelTransfer.createTransfer({ emisor, receptor, monto })
        return res.status(201).json(newTransfer)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: "Error de servidor" })
    }
}

export const controllerTransfer = {
    getAllTransfers,
    createTransfer
}