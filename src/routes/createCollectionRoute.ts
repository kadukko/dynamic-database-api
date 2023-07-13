import handleRequestError from "../helpers/handleRequestError"
import Joi from 'joi'
import mongodb from "../services/mongodb"
import { ICollection } from "../classes/ICollection"
import { Collection } from 'mongodb'

export default handleRequestError(async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required()
  })

  const payload = await schema.validateAsync(req.body)

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections')
    
    if (await dbCollections.findOne({ name: payload.name })) throw new Error('ALREADY_EXISTS')

    const collection: ICollection = {
      name: payload.name,
      fields: []
    }

    await dbCollections.insertOne(collection)
  })

  res.send()
})