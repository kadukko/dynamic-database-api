import handleRequestError from "../helpers/handleRequestError"
import mongodb from "../services/mongodb"

export default handleRequestError(async (req, res) => {
  let data = null

  await mongodb.open(async (client) => {
    data = await client.db().collection('collections').find().toArray()    
  })

  res.send(data)
})