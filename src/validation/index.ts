import { DISCOUNT_TYPE, PRODUCT_COMPATIBILITY, PRODUCT_CONDITION } from '@/constants'
import { z } from 'zod'

// Register form validation
export const registerFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' })
      .toLowerCase()
      .trim(),
    phone: z.string().optional(),
    stateAddress: z.string().optional(),
    city: z.string().optional(),
    country: z.string().min(1, { message: 'Country is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
    role: z.enum(['buyer', 'seller'], {
      description: 'Role must be "buyer" or "seller"',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  })

// Login form validation
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

// Product Form Schema
export const productFormSchema = z.object({
  image: z
    .string({
      required_error: 'Product image is required',
      invalid_type_error: 'Product image must be a string',
    })
    .min(1, { message: 'Product image is required' }),
  title: z
    .string({
      required_error: 'Product name is required',
      invalid_type_error: 'Product name must be a string',
    })
    .min(1, { message: 'Product name is required' }),
  price: z
    .any()
    .refine((value) => !isNaN(Number(value)), {
      message: 'Price must be a valid number',
    })
    .transform((value) => Number(value)),
  quantity: z
    .any()
    .refine((value) => !isNaN(Number(value)), {
      message: 'Quantity must be a valid number',
    })
    .transform((value) => Number(value)),
  condition: z.enum(PRODUCT_CONDITION.map((item) => item.key) as [string, ...string[]], {
    required_error: 'Product condition is required',
    invalid_type_error: 'Product condition must be a string',
  }),
  category: z
    .string({
      required_error: 'Product category is required',
      invalid_type_error: 'Product category must be a string',
    })
    .min(1, { message: 'Category is required' }),
  brand: z
    .string({
      required_error: 'Product brand is required',
      invalid_type_error: 'Product brand must be a string',
    })
    .min(1, { message: 'Brand is required' }),
  compatibility: z
    .array(
      z.enum(PRODUCT_COMPATIBILITY.map((item) => item.key) as [string, ...string[]], {
        required_error: 'Product compatibility is required',
      }),
    )
    .min(1, { message: 'Compatibility is required' }),
  interface: z
    .array(
      z.string({
        required_error: 'Product interface is required',
        invalid_type_error: 'Product interface must be a string',
      }),
    )
    .min(1, { message: 'Interface is required' }),
  capacity: z
    .string({
      invalid_type_error: 'Product capacity must be a string',
    })
    .optional(),
})

// filter form schema
export const filterFormSchema = z.object({
  category: z.array(z.string()).optional(),
  brand: z.array(z.string()).optional(),
  condition: z.array(z.string()).optional(),
  compatibility: z.array(z.string()).optional(),
  interface: z.array(z.string()).optional(),
  capacity: z.array(z.string()).optional(),
  minPrice: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number()),
  maxPrice: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number()),
})

// search form schema
export const searchFormSchema = z.object({
  search: z.string({
    required_error: 'Search terms is required',
  }),
})

// sell form schema
export const sellFormSchema = z.object({
  product: z.string().min(1, { message: 'Product ID is required' }),
  customerName: z.string().min(1, { message: 'Customer name is required' }),
  customerEmail: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Customer email is required' })
    .toLowerCase()
    .trim(),
  seller: z.string().min(1, { message: 'Seller id is required' }),
  orderAt: z.date(),
  quantity: z.string().min(1, { message: 'Quantity is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
  coupon: z.string().optional(),
  discountPrice: z.number().optional(),
})

// add coupon form schema
export const couponFormSchema = z.object({
  code: z
    .string()
    .min(1, { message: 'Coupon code is required' })
    .min(6, { message: 'Coupon code must be 6 letter' })
    .max(6, { message: 'Coupon code must be 6 letter' })
    .trim()
    .toUpperCase(),
  quantity: z.string().min(1, { message: 'Coupon quantity is required' }),
  discount: z.string().min(1, { message: 'Coupon discount is required' }),
  discountType: z
    .enum(Object.values(DISCOUNT_TYPE) as [string, ...string[]])
    .refine((value) => Object.values(DISCOUNT_TYPE).includes(value), {
      message: 'Discount type must be Percentage or Amount',
    }),
  seller: z.string().min(1, { message: 'Seller is required' }).trim(),
})

// add request form schema
export const addRequestSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  brand: z.string().min(1, { message: 'Brand is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  serialNumber: z.string().optional(),
  issueDetails: z.string().min(1, { message: 'Issue Details is required' }),
  preferredSchedule: z.date(),
})

// update request form schema
export const updateRequestSchema = z.object({
  schedule: z.date({ required_error: 'Please select schedule' }),
})
