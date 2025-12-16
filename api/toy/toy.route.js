import express from 'express'
import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.js'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'


const router = express.Router()

router.get('/', log, getToys)
router.get('/:id', log, getToyById)

// Protected routes
router.post('/', requireAdmin, addToy)
router.put('/', requireAdmin, updateToy)
router.delete('/:id', requireAdmin, removeToy)

// --- Added for MSGS support ---
router.post('/:id/msg', requireAuth, addToyMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)

export const toyRoutes = router