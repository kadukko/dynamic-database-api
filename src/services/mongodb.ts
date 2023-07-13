import { MongoClient } from 'mongodb'
import getEnv from "../helpers/getEnv"

export default {
  open(callback: (client: MongoClient) => Promise<any>) {
    const MONGO_URI = getEnv('MONGO_URI')
    const client = new MongoClient(MONGO_URI)

    return client.connect()
      .then(callback)
      .finally(() => {
        client.close()
      })
  }
}