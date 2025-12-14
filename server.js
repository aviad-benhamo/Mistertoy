import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { toyService } from './services/toy.service.js'

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


// Routes

// READ (List)
app.get('/api/toy', async (req, res) => {
    try {
        const filterBy = req.query
        const toys = await toyService.query(filterBy)
        res.send(toys)
    } catch (err) {
        console.log('Cannot load toys', err)
        res.status(400).send('Cannot load toys')
    }
})

// READ (Get By Id)
app.get('/api/toy/:toyId', async (req, res) => {
    try {
        const { toyId } = req.params
        const toy = await toyService.getById(toyId)
        res.send(toy)
    } catch (err) {
        console.log('Cannot load toy', err)
        res.status(400).send('Cannot load toy')
    }
})

// CREATE
app.post('/api/toy', async (req, res) => {
    try {
        const { name, price, inStock, labels } = req.body
        const toyToSave = { name, price, inStock, labels }

        const savedToy = await toyService.save(toyToSave)
        res.send(savedToy)
    } catch (err) {
        console.log('Cannot add toy', err)
        res.status(400).send('Cannot add toy')
    }
})

// UPDATE
app.put('/api/toy', async (req, res) => {
    try {
        const { _id, name, price, inStock, labels } = req.body
        const toyToSave = { _id, name, price, inStock, labels }

        const savedToy = await toyService.save(toyToSave)
        res.send(savedToy)
    } catch (err) {
        console.log('Cannot update toy', err)
        res.status(400).send('Cannot update toy')
    }
})

// DELETE
app.delete('/api/toy/:toyId', async (req, res) => {
    try {
        const { toyId } = req.params
        await toyService.remove(toyId)
        res.send({ msg: 'Removed successfully' })
    } catch (err) {
        console.log('Cannot remove toy', err)
        res.status(400).send('Cannot remove toy')
    }
})



const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log(`Server listening on port http://127.0.0.1:${port}/`)
})