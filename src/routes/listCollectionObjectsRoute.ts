import {
  Collection, ObjectId, Filter,
} from 'mongodb';
import Joi from 'joi';
import {
  ICollection, ICollectionObject, ICollectionObjectFilter, ICollectionObjectPagination, ICollectionObjectSort, ICollectionObjectsOutput,
} from '../interfaces';
import handleRequestError from '../helpers/handleRequestError';
import mongodb from '../services/mongodb';
import FIELD_TYPES from '../constants/fieldTypes';
import SORT_DIRECTIONS, { SORT_DIRECTION_VALUES } from '../constants/sortDirections';

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
    lte: Joi.number(),
  }),
  sort: Joi.object({
    key: Joi.string().required(),
    direction: Joi.string().valid(...SORT_DIRECTION_VALUES),
  }),
  pagination: Joi.object({
    itemsPerPage: Joi.number().integer().min(1).default(10),
    page: Joi.number().integer().min(0).default(0),
  }).default({ itemsPerPage: 10, page: 1 }),
});

interface IPayload {
  filters: ICollectionObjectFilter[],
  sort: ICollectionObjectSort,
  pagination: ICollectionObjectPagination,
}

export default handleRequestError(async (req, res) => {
  let data = null;

  const payload : IPayload = await schema.validateAsync(req.body);
  const { filters } = payload;

  const collectionId = req.params.id;

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections');
    const dbCollectionObjects: Collection<ICollectionObject> = client.db().collection('collection_objects');

    const collection = await dbCollections.findOne({ _id: new ObjectId(collectionId) });

    if (!collection) throw new Error('COLLECTION_NOT_EXISTS');

    const query : Filter<ICollectionObject> = { collectionId: collection._id };

    if (filters) {
      filters.forEach((filter) => {
        const field = collection.fields.find((item) => item.key === filter.key);

        if (!field) {
          throw new Error('INVALID_FILTER_KEY');
        }

        if (filter.equals !== undefined) {
          if (field.type === FIELD_TYPES.OBJECT_ID && typeof filter.equals === 'string') {
            query[filter.key] = new ObjectId(filter.equals);
          } else {
            query[filter.key] = filter.equals;
          }
        } else {
          const input: any = {};

          if (filter.notEquals !== undefined) {
            if (field.type === FIELD_TYPES.OBJECT_ID && typeof filter.notEquals === 'string') {
              input.$ne = new ObjectId(filter.notEquals);
            } else {
              input.$ne = filter.notEquals;
            }
          }

          switch (field.type) {
            case FIELD_TYPES.STRING: {
              if (filter.regex !== undefined) {
                input.$regex = filter.regex;
                if (filter.caseInsensitive) input.$options = 'i';
              }

              break;
            }

            case FIELD_TYPES.NUMBER: {
              if (filter.gt !== undefined) {
                input.$gt = filter.gt;
              } else
              if (filter.gte !== undefined) {
                input.$gte = filter.gte;
              }

              if (filter.lt !== undefined) {
                input.$lt = filter.lt;
              } else
              if (filter.lte !== undefined) {
                input.$lte = filter.lte;
              }

              break;
            }

            default: {
              // do nothing
            }
          }

          query[filter.key] = input;
        }
      });
    }

    let sort = ['_id', '-1'];

    if (payload.sort) {
      if (payload.sort.key !== '_id' && !collection.fields.find((item) => item.key === payload.sort.key)) {
        throw new Error('INVALID_SORT');
      }

      sort = [payload.sort.key, payload.sort.direction === SORT_DIRECTIONS.ASC ? '1' : '-1'];
    }

    const { itemsPerPage, page } = payload.pagination;

    const limit = itemsPerPage;
    const skip = page * limit;

    const items = await dbCollectionObjects.find(query, { sort, skip, limit }).toArray();
    const totalItems = await dbCollectionObjects.countDocuments(query);

    const output: ICollectionObjectsOutput = {
      items,
      totalItems,
      page,
      itemsPerPage,
      pages: Math.ceil(totalItems / itemsPerPage),
    };

    data = output;
  });

  res.send(data);
});
