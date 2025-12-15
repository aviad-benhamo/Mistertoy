import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'

export async function getToys(req, res) {
    try {
        const { txt, maxPrice, inStock, sortBy } = req.query
        const labels = req.query.labels || req.query['labels[]']
        // Construction of the filterBy object
        const filterBy = {
            txt: txt || '',
            maxPrice: +maxPrice || 0,
            inStock: inStock === 'true' ? true : (inStock === 'false' ? false : undefined),
            labels: labels ? (Array.isArray(labels) ? labels : [labels]) : [],
        }

        const sortParam = req.query.sortBy

        logger.debug('Getting Toys', { filterBy })

        const toys = await toyService.query(filterBy, sortParam)
        res.json(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    try {
        const { name, price, inStock, labels, imgUrl } = req.body
        const toyToSave = { name, price, inStock, labels, imgUrl }

        const addedToy = await toyService.save(toyToSave)
        res.json(addedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    try {
        const { _id, name, price, inStock, labels, createdAt } = req.body
        const toyToSave = { _id, name, price, inStock, labels, createdAt }

        const savedToy = await toyService.save(toyToSave)
        res.json(savedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    try {
        const toyId = req.params.id
        await toyService.remove(toyId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}