import { ICollection, ICollectionObject, ICollectionObjectFilter } from "../interfaces"
import handleRequestError from "../helpers/handleRequestError"
import mongodb from "../services/mongodb"
import { Collection, ObjectId, Filter, RootFilterOperators } from 'mongodb'
import Joi from 'joi'

const schema = Joi.object({
  filters: Joi.array().items({
    key: Joi.string().required(),
    equals: Joi.any(),
    notEquals: Joi.any(),
    regex: Joi.string(),
    caseInsensitive: Joi.boolean(),
    gt: Joi.number(),
    gte: Joi.number(),
    lt: Joi.number(),
    lte: Joi.number()
  })
})

interface FilterValue { [key: string]: any }

export default handleRequestError(async (req, res) => {
  let data = null

  const payload = await schema.validateAsync(req.body)
  const filters : ICollectionObjectFilter[] = payload.filters

  const collectionId = req.params.id

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections')
    const dbCollectionObjects: Collection<ICollectionObject> = client.db().collection('collection_objects') 
    
    const collection = await dbCollections.findOne({ _id: new ObjectId(collectionId) })
    
    if (!collection) throw new Error('COLLECTION_NOT_EXISTS')

    const query : Filter<ICollectionObject> = { collectionId: collection._id }
    
    if (filters) {
      filters.forEach(filter => {
        const field = collection.fields.find(field => field.key === filter.key)
        
        if (!field) {
          throw new Error('INVALID_FILTER_KEY')
        }

        if (filter.equals !== undefined) {
          query[filter.key] = filter.equals
        } else {
          const input: any = {}

          if (filter.notEquals !== undefined) {
            input['$ne'] = filter.notEquals
          }

          switch (field.type) {
            case 'string': {
              if (filter.regex !== undefined) {
                input['$regex'] = filter.regex
                if (filter.caseInsensitive) input['$options'] = 'i'
              }
              
              break
            }

            case 'number': {
              if (filter.gt !== undefined) {
                input['$gt'] = filter.gt
              } else 
              if (filter.gte !== undefined) {
                input['$gte'] = filter.gte
              }

              if (filter.lt !== undefined) {
                input['$lt'] = filter.lt
              } else 
              if (filter.lte !== undefined) {
                input['$lte'] = filter.lte
              }

              break
            }

            default: {
              // do nothing
            }
          }

          query[filter.key] = input
        }
        
      })
    }
  
    data = await dbCollectionObjects.find(query).toArray()
  })

  res.send(data)
})