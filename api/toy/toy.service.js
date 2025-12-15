import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { ObjectId } from 'mongodb'

export const toyService = {
    query,
    getById,
    remove,
    save
}

async function query(filterBy = {}, sortParam = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const sortCriteria = _buildSortCriteria(sortParam)

        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).sort(sortCriteria).toArray()

        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: new ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: new ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function save(toy) {
    try {
        const collection = await dbService.getCollection('toy')

        if (toy._id) {
            // Update
            const toyToSave = { ...toy }
            const id = toy._id
            delete toyToSave._id

            await collection.updateOne({ _id: new ObjectId(id) }, { $set: toyToSave })
            return toy
        } else {
            // Create
            toy.createdAt = Date.now()
            if (toy.inStock === undefined) toy.inStock = true
            if (!toy.labels) toy.labels = []

            await collection.insertOne(toy)
            return toy
        }
    } catch (err) {
        logger.error('cannot save toy', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    // Filter by name (regex)
    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }

    // Filter by max price (added for completeness)
    if (filterBy.maxPrice) {
        criteria.price = { $lte: filterBy.maxPrice }
    }

    // Filter by inStock
    if (filterBy.inStock !== undefined && filterBy.inStock !== '') {
        criteria.inStock = (filterBy.inStock === 'true' || filterBy.inStock === true)
    }

    // Filter by labels
    // Assuming filterBy.labels is strictly an array (handled by Controller)
    if (filterBy.labels && filterBy.labels.length > 0) {
        criteria.labels = { $in: filterBy.labels }
    }

    return criteria
}

function _buildSortCriteria(sortParam) {
    const criteria = {}

    if (sortParam && sortParam.type) {
        criteria[sortParam.type] = (sortParam.desc === -1 || sortParam.desc === '-1') ? -1 : 1
    }

    return criteria
}