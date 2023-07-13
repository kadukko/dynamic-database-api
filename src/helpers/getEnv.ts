require('dotenv').config()

export default (key: string, defaultValue: any = null): any => {
  const value = process.env[key]
  return value === undefined ? defaultValue : value
}