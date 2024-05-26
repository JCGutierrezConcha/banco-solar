import express from 'express'
import 'dotenv/config'
import userRoutes from './routes/usuario.route.js'
import transferRoutes from './routes/transferencia.route.js'

const app = express()

const __dirname = import.meta.dirname

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.use('/', userRoutes)
app.use('/', transferRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`)
})