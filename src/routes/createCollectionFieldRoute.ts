import { ICollection } from "../classes/ICollection"
import handleRequestError from "../helpers/handleRequestError"
import Joi from 'joi'
import { Collection, ObjectId } from 'mongodb'
import mongodb from "../services/mongodb"

export default handleRequestError(async (req, res) => {
  const schema = Joi.object({
    key: Joi.string().invalid('collectionId').required(),
    type: Joi.string().valid('string', 'number', 'boolean').required(),
    required: Joi.boolean().required(),
    trim: Joi.boolean().required()
  })

  const collectionId = req.params.id
  const payload = await schema.validateAsync(req.body)

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections')
    
    const collection = await dbCollections.findOne({ _id: new ObjectId(collectionId) })
    
    if (!collection) throw new Error('COLLECTION_NOT_EXISTS')

    if (collection.fields.find(field => field.key === payload.key)) throw new Error('FIELD_ALREADY_EXISTS')
    
    await dbCollections.findOneAndUpdate({
      _id: collection._id
    }, {
      $push: {
        fields: {
          key: String(payload.key).toLowerCase(),
          type: payload.type,
          required: payload.required,
          trim: payload.trim
        }
      }
    })
  })

  res.send()
})