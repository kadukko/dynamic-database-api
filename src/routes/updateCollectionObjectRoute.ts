import { Collection, ObjectId } from 'mongodb';
import Joi from 'joi';
import handleRequestError from '../helpers/handleRequestError';
import { ICollection, ICollectionObject } from '../interfaces';
import mongodb from '../services/mongodb';

export default handleRequestError(async (req, res) => {
  let data = null;

  const collectionId = req.params.cid;
  const objectId = req.params.id;

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections');
    const dbCollectionObjects: Collection<ICollectionObject> = client.db().collection('collection_objects');

    const collection = await dbCollections.findOne({ _id: new ObjectId(collectionId) });

    if (!collection) throw new Error('COLLECTION_NOT_EXISTS');

    const object = await dbCollectionObjects.findOne({
      collectionId: collection._id,
      _id: new ObjectId(objectId),
    });

    if (!object) throw new Error('OBJECT_NOT_EXISTS');

    const schemaObj: Joi.PartialSchemaMap<any> = { };

    collection.fields.forEach((field) => {
      switch (field.type) {
        case 'string': {
          let schema = Joi.string();
          if (field.required) schema = schema.invalid(null);
          if (field.trim) schema = schema.trim();

          schemaObj[field.key] = schema;
          break;
        }
        case 'number': {
          let schema = Joi.number();
          if (field.required) schema = schema.invalid(null);

          schemaObj[field.key] = schema;
          break;
        }
        case 'boolean': {
          let schema = Joi.boolean();
          if (field.required) schema = schema.invalid(null);

          schemaObj[field.key] = schema;
          break;
        }
        default:
          // do nothing
      }
    });

    const payload = await Joi.object(schemaObj)
      .validateAsync(req.body);

    if (!Object.keys(payload).length) throw new Error('NO_FIELDS');

    await dbCollectionObjects.updateOne({ _id: object._id }, { $set: payload });

    data = await dbCollectionObjects.findOne({ _id: object._id });
  });

  res.send(data);
});
