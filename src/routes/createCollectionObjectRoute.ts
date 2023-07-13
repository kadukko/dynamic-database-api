import Joi from 'joi';
import { Collection, ObjectId } from 'mongodb';
import { ICollection, ICollectionObject } from '../interfaces';
import handleRequestError from '../helpers/handleRequestError';
import mongodb from '../services/mongodb';
import FIELD_TYPES from '../constants/fieldTypes';

export default handleRequestError(async (req, res) => {
  const collectionId = req.params.id;

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections');
    const dbCollectionObjects: Collection<ICollectionObject> = client.db().collection('collection_objects');

    const collection = await dbCollections.findOne({ _id: new ObjectId(collectionId) });

    if (!collection) throw new Error('COLLECTION_NOT_EXISTS');

    const schemaObj: Joi.PartialSchemaMap<any> = { };

    collection.fields.forEach((field) => {
      switch (field.type) {
        case FIELD_TYPES.STRING: {
          let schema = Joi.string();
          if (field.required) schema = schema.required();
          if (field.trim) schema = schema.trim();

          schemaObj[field.key] = schema;
          break;
        }
        case FIELD_TYPES.NUMBER: {
          let schema = Joi.number();
          if (field.required) schema = schema.required();

          schemaObj[field.key] = schema;
          break;
        }
        case FIELD_TYPES.BOOLEAN: {
          let schema = Joi.boolean();
          if (field.required) schema = schema.required();

          schemaObj[field.key] = schema;
          break;
        }
        default:
          // do nothing
      }
    });

    const payload = await Joi.object(schemaObj)
      .validateAsync(req.body);

    await dbCollectionObjects.insertOne({
      collectionId: new ObjectId(collectionId),
      ...payload,
    });
  });

  res.send();
});
