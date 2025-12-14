import express from 'express'
import { getToys, getToyById, addToy, updateToy, removeToy } from './toy.controller.js'

const router = express.Router()

router.get('/', getToys)
router.get('/:id', getToyById)
router.post('/', addToy)
router.put('/', updateToy)
router.delete('/:id', removeToy)

export const toyRoutes = router