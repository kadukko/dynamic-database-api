import { ObjectId } from 'mongodb'

export interface ICollection {
  name: string
  fields: ICollectionField[]
}

export interface ICollectionField {
  key: string
  type: string
  required: boolean
  trim: boolean
}

export interface ICollectionObject {
  collectionId: ObjectId
  [key: string]: any
}