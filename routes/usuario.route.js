import { Router } from "express"
import { controllerUser } from "../controllers/usuario.controller.js"

const router = Router()

router.get('/usuarios', controllerUser.getAllUsers)

router.post('/usuario', controllerUser.createUser)

router.delete('/usuario/', controllerUser.removeUser)

router.put('/usuario/', controllerUser.updateUser)

export default router