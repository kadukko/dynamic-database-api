import Joi from 'joi';
import { Collection } from 'mongodb';
import handleRequestError from '../helpers/handleRequestError';
import mongodb from '../services/mongodb';
import { ICollection } from '../interfaces';

export default handleRequestError(async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const payload = await schema.validateAsync(req.body);

  await mongodb.open(async (client) => {
    const dbCollections: Collection<ICollection> = client.db().collection('collections');

    if (await dbCollections.findOne({ name: payload.name })) throw new Error('ALREADY_EXISTS');

    const collection: ICollection = {
      name: payload.name,
      fields: [],
    };

    await dbCollections.insertOne(collection);
  });

  res.send();
});
