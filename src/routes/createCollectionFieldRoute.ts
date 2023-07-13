import Joi from 'joi';
import { Collection, ObjectId } from 'mongodb';
import { ICollection, ICollectionField } from '../interfaces';
import handleRequestError from '../helpers/handleRequestError';
import mongodb from '../services/mongodb';
import FIELD_TYPES, { FIELD_TYPE_VALUES } from '../constants/fieldTypes';

const schema = Joi.object({
  key: Joi.string().invalid('collectionId').required(),
  type: Joi.string().valid(...FIELD_TYPE_VALUES).required(),
  required: Joi.boolean().required(),
  trim: Joi.boolean().required(),
  ref: Joi.string().allow(null).default(null),
});

export default handleRequestError(async (req, res) => {
  const collectionId = req.params.id;
  const payload : ICollectionField = await schema.validateAsync(req.body);

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections');

    const collection = await dbCollections.findOne({ _id: new ObjectId(collectionId) });

    if (!collection) throw new Error('COLLECTION_NOT_EXISTS');

    if (collection.fields.find((field) => field.key === payload.key)) throw new Error('FIELD_ALREADY_EXISTS');

    if (payload.type === FIELD_TYPES.OBJECT_ID && payload.ref) {
      const collectionRef = await dbCollections.findOne({ _id: new ObjectId(payload.ref) });
      if (!collectionRef) throw new Error('COLLECTION_REF_NOT_EXISTS');
    }

    await dbCollections.findOneAndUpdate({
      _id: collection._id,
    }, {
      $push: {
        fields: {
          key: payload.key,
          type: payload.type,
          required: payload.required,
          trim: payload.trim,
          ref: payload.ref,
        },
      },
    });
  });

  res.send();
});
