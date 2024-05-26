import { modelUser } from "../models/usuario.model.js"

const getAllUsers = async (req, res) => {
    try {
        const users = await modelUser.findAll()
        return res.status(200).json(users)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: "Error de servidor" })
    }
}

const createUser = async (req, res) => {
    try {
        const { nombre, balance } = req.body

        if (!nombre || !balance) {
            return res.status(400).json({ ok: false, msg: "Todos los campos obligatorios" })
        }
        const newUser = await modelUser.create({ nombre, balance })
        return res.status(201).json(newUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: "Error de servidor" })
    }
}

const removeUser = async (req, res) => {
    try {
        const { id } = req.query
        const user = await modelUser.remove(id)
        return res.status(200).json(user)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: "Error de servidor" })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.query
        const { nombre, balance } = req.body

        if (!nombre || !balance)
            return res.status(400).json({ ok: false, msg: "Todos los campos obligatorios" })

        const userUpdate = {
            id,
            nombre,
            balance
        }
        const user = await modelUser.update(userUpdate)
        return res.status(200).json(user)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ ok: false, msg: "Error de servidor" })
    }
}

export const controllerUser = {
    getAllUsers,
    createUser,
    removeUser,
    updateUser
}