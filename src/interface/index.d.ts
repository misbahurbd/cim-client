export interface IProduct {
  _id: string
  title: string
  price: number
  image: string
  quantity: number
  condition: string
  compatibility: string[]
  interface: string[]
  capacity: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  category: ICategory
  brand: IBrand
  createdBy: ICreatedBy
}

export interface IUser {
  _id: string
  name: string
  email: string
  phone: string
  stateAddress: string
  city: string
  country: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface ICategory {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface IBrand {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface ICreatedBy {
  _id: string
  name: string
  email: string
  phone: string
  stateAddress: string
  city: string
  country: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface ICoupon {
  _id: string
  code: string
  discount: number
  totalUsed: number
  discountType: string
  seller: string
  quantity: number
  isValid: boolean
  createdAt: string
  updatedAt: string
}

export interface IValidateCoupon {
  productId: string
  coupon: string
  price: number
  discountPrice: number
}

export interface IOrder {
  _id: string
  coupon?: string
  product: IProduct
  customerName: string
  customerEmail: string
  seller: IUser
  quantity: number
  discountPrice?: number
  price: number
  orderAt: string
  createdAt: string
  updatedAt: string
  totalPrice: number
}
export interface IRequest {
  _id: string
  title: string
  brand: string
  model: string
  serialNumber: string
  requestFrom: IUser
  provider?: IUser
  issueDetails: string
  status: 'pending' | 'solved'
  preferredSchedule: string
  schedule?: string
  createdAt: string
  updatedAt: string
}
