// @flow

export type Category = {
  text: string,
  link: string,
  pid: number
}

export type CategoryGetLinks = (html: string) => Array<Category>