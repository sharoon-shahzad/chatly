
import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express();
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }))

app.use(express.json({ limit: '16kb' }))

app.use(express.urlencoded({ extended: true, limit: '16kb' }))

app.use(cookieParser())

//testing server

app.get('/', (req, res) => {
    res.status(200).json({ message: "Server is running" })
})

//routes i
import userRoutes from './routes/user_route.js'

app.use('/api/v1/users', userRoutes)

export { app }
