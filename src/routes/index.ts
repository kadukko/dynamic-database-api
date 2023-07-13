import express from 'express';
import listCollectionsRoute from './listCollectionsRoute';
import createCollectionRoute from './createCollectionRoute';
import createCollectionFieldRoute from './createCollectionFieldRoute';
import createCollectionObjectRoute from './createCollectionObjectRoute';
import listCollectionObjectsRoute from './listCollectionObjectsRoute';
import getCollectionObjectRoute from './getCollectionObjectRoute';
import updateCollectionObjectRoute from './updateCollectionObjectRoute';

const routes = express.Router();

routes.get('/collections', listCollectionsRoute);
routes.post('/collections', createCollectionRoute);
routes.post('/collections/:id/fields', createCollectionFieldRoute);
routes.post('/collections/:id/objects', createCollectionObjectRoute);
routes.post('/collections/:id/objects/search', listCollectionObjectsRoute);
routes.get('/collections/:cid/objects/:id', getCollectionObjectRoute);
routes.put('/collections/:cid/objects/:id', updateCollectionObjectRoute);

export default routes;
