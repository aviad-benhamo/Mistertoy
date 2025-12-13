import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'


const app = express()


// Express Config
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}
app.use(cors(corsOptions))


// Routes (Example)
app.get('/api/toy', (req, res) => {
    res.send('Toy API is ready')
})



const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log(`Server listening on port http://127.0.0.1:${port}/`)
})