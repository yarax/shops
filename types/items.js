export type GrabItems = (shopId: number, categoryId: number, url: string) => any

export type Item = {
  url: string,
  name: string,
  pic: string,
  oldPrice: ?number,
  price: number
}

export type ExistingItem = {
  id: number,
  price: number,
  old_price: ?number
}