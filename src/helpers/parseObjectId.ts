import {ObjectId} from 'mongodb'

export default (value: any) => {
  if (!ObjectId.isValid(value)) return null
  return new ObjectId(value)
}