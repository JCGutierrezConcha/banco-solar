import { Router } from "express"
import { controllerTransfer } from "../controllers/transferencia.controller.js"

const router = Router()

router.get('/transferencias', controllerTransfer.getAllTransfers)
router.post('/transferencia', controllerTransfer.createTransfer)

export default router