import handleRequestError from "../helpers/handleRequestError"
import { ICollection, ICollectionObject } from "../interfaces"
import mongodb from "../services/mongodb"
import {Collection, ObjectId} from 'mongodb'

export default handleRequestError(async (req, res) => {
  let data = null

  const collectionId = req.params.cid;
  const objectId = req.params.id;

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections')
    const dbCollectionObjects: Collection<ICollectionObject> = client.db().collection('collection_objects') 
    
    const collection = await dbCollections.findOne({ _id: new ObjectId(collectionId) })
    
    if (!collection) throw new Error('COLLECTION_NOT_EXISTS')

    data = await dbCollectionObjects.findOne({
      collectionId: collection._id,
      _id: new ObjectId(objectId)
    })
  })

  res.send(data)
})