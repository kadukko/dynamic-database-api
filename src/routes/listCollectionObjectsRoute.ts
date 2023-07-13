import { ICollection, ICollectionObject } from "../classes/ICollection"
import handleRequestError from "../helpers/handleRequestError"
import mongodb from "../services/mongodb"
import { Collection, ObjectId } from 'mongodb'

export default handleRequestError(async (req, res) => {
  let data = null

  const collectionId = req.params.id

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections')
    const dbCollectionObjects: Collection<ICollectionObject> = client.db().collection('collection_objects') 
    
    const collection = await dbCollections.findOne({ _id: new ObjectId(collectionId) })
    
    if (!collection) throw new Error('COLLECTION_NOT_EXISTS')

    data = await dbCollectionObjects.find({ collectionId: collection._id }).toArray()
  })

  res.send(data)
})