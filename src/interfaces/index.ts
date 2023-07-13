import { ObjectId } from 'mongodb';

export interface ICollectionField {
  key: string
  type: string
  required: boolean
  trim: boolean
  ref: ObjectId | null
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
  in: any[]
  notIn: any[]
}

export interface ICollectionObjectSort {
  key: string
  direction: string
}

export interface ICollectionObjectPagination {
  itemsPerPage: number
  page: number
}

export interface ICollectionObjectsOutput {
  items: any[]
  pages: number
  page: number
  itemsPerPage: number
  totalItems: number
}
