import handleRequestError from "../helpers/handleRequestError"
import { ICollection } from "../interfaces"
import mongodb from "../services/mongodb"
import { Collection } from 'mongodb'

export default handleRequestError(async (req, res) => {
  let data = null

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections')

    data = await dbCollections.find().toArray()    
  })

  res.send(data)
})