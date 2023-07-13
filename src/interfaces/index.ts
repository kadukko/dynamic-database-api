import { ObjectId } from 'mongodb';

export interface ICollectionField {
  key: string
  type: string
  required: boolean
  trim: boolean
}

export interface ICollection {
  name: string
  fields: ICollectionField[]
}

export interface ICollectionObject {
  collectionId: ObjectId
  [key: string]: any
}

export interface ICollectionObjectFilter {
  key: string
  equals: any
  notEquals: any
  regex: string
  caseInsensitive: boolean
  gt: number
  gte: number
  lt: number
  lte: number
}
