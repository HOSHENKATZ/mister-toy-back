import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

const PAGE_SIZE = 6


export const toyService = {
  query,
  get,
  remove,
  add,
  update,
  addMsg,
  removeMsg
}

async function query(filterBy = {}) {
try{
  // const criteria = _buildCriteria(filterBy)
  const collection = await dbService.getCollection('toy')
		var toys = await collection.find().toArray()
		return toys
	} catch (err) {
		loggerService.error('cannot find toys', err)
		throw err
	}
}

async function get(toyId) {
  try {
      const collection = await dbService.getCollection('toy')
      const toy = collection.findOne({ _id: ObjectId.createFromHexString(toyId) })
      return toy
  } catch (error) {
      loggerService.error(`while finding toy ${toyId}`, error)
      throw error
  }
}

async function remove(toyId) {
  try {
      const collection = await dbService.getCollection('toy')
       await collection.deleteOne({ _id: ObjectId.createFromHexString(toyId) })

    } catch (error) {
      loggerService.error(`cannot remove toy ${toyId}`, error)
      throw error
  }
}

async function add(toy) {
  try {
      toy.createdAt = Date.now()
      toy.inStock = true
      const collection = await dbService.getCollection('toy')
      await collection.insertOne(toy)
      return toy
  } catch (error) {
      loggerService.error('cannot insert toy', error)
      throw error
  }
}

async function update(toy) {
  const { name, price, labels, inStock } = toy
  const toyToUpdate = {
      name,
      price,
      labels,
      inStock
  }

  try {
      const collection = await dbService.getCollection('toy')
      await collection.updateOne(
          { _id: ObjectId.createFromHexString(toy._id) },
          { $set: toyToUpdate }
      )
      return toy
  } catch (error) {
      loggerService.error(`cannot update toy ${toy._id}`, error)
      throw error
  }
}

async function addMsg(toyId, msg) {
  try {
      msg.id = utilService.makeId()
      const collection = await dbService.getCollection('toy')
      await collection.updateOne(
          { _id: ObjectId.createFromHexString(toyId) },
          { $push: { msgs: msg } }
      )
      return msg
  } catch (error) {
      loggerService.error(`cannot add message to toy ${toyId}`, error)
      throw error
  }
}

async function removeMsg(toyId, msgId) {
  try {
      const collection = await dbService.getCollection('toy')
      await collection.updateOne(
          { _id: ObjectId.createFromHexString(toyId) },
          { $pull: { msgs: { id: msgId } } }
      )
      return msgId
  } catch (error) {
      loggerService.error(`cannot remove message from toy ${toyId}`, error)
      throw error
  }
}


function _buildCriteria(filterBy) {
  const filterCriteria = {
  }
  // name: { $regex: filterBy.txt, $options: 'i' },
  // maxPrice: {$lte: filterBy.maxPrice },
  // minAge:  {$gte: filterBy.minAge }
  const skip = filterBy.pageIdx !== undefined ? filterBy.pageIdx * PAGE_SIZE : 0
  return { filterCriteria, skip }
}

// function _saveToysToFile() {
  //   return new Promise((resolve, reject) => {
    //     const toysStr = JSON.stringify(toys, null, 4)
    //     fs.writeFile('data/toy.json', toysStr, err => {
      //       if (err) {
        //         return console.log(err)
        //       }
        //       resolve()
        //     })
        //   })

        // function getMaxPage(filteredToysLength) {
        //   if (filteredToysLength) {
        //     return Promise.resolve(Math.ceil(filteredToysLength / PAGE_SIZE))
        //   }
        //   return Promise.resolve(Math.ceil(toys.length / PAGE_SIZE))
        // }
        
        // function _makeId(length = 5) {
        //   let text = ''
        //   const possible =
        //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        //   for (let i = 0; i < length; i++) {
        //     text += possible.charAt(Math.floor(Math.random() * possible.length))
        //   }
        //   return text
        // }
// }