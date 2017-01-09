// @flow

export type Category = {
  text: string,
  link: string,
  pid: number
}

export type Handler = 'new' | 'changes' | 'ignore'

export type LinkItem = {
  link: string,
  text: string,
  match: [string]
}

export type DbCatItem = {
  url: string,
  name: string,
  handler: Handler,
  shop_id: string,
  pid: number
}

export type CategoryGetLinks = (html: string) => Array<Category>