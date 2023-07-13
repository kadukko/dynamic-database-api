import express from "express"
import listCollectionsRoute from "./listCollectionsRoute"
import createCollectionRoute from "./createCollectionRoute"
import createCollectionFieldRoute from "./createCollectionFieldRoute"
import createCollectionObjectRoute from "./createCollectionObjectRoute"
import listCollectionObjectsRoute from "./listCollectionObjectsRoute"

const routes = express.Router()

routes.get('/collections', listCollectionsRoute)
routes.post('/collections', createCollectionRoute)
routes.post('/collections/:id/fields', createCollectionFieldRoute)
routes.post('/collections/:id/objects', createCollectionObjectRoute)
routes.get('/collections/:id/objects', listCollectionObjectsRoute)

export default routes