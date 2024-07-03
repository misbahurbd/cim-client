import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getQueryParams = (query: { [k: string]: string }) => {
  const params = new URLSearchParams()
  if (query.search) {
    params.append('search', query.search)
  }
  if (query.category?.length >= 0) {
    params.append('category', query.category)
  }
  if (query.brand?.length >= 0) {
    params.append('brand', query.brand)
  }
  if (query.interface?.length >= 0) {
    params.append('interface', query.interface)
  }
  if (query.compatibility?.length >= 0) {
    params.append('compatibility', query.compatibility)
  }
  if (query.condition?.length >= 0) {
    params.append('condition', query.condition)
  }
  if (query.capacity?.length >= 0) {
    params.append('capacity', query.capacity)
  }
  if (query.minPrice) {
    params.append('minPrice', query.minPrice)
  }
  if (query.maxPrice) {
    params.append('maxPrice', query.maxPrice)
  }
  if (query.page) {
    params.append('page', query.page)
  }
  if (query.limit) {
    params.append('limit', query.limit)
  }
  if (query.dateRange) {
    params.append('dateRange', query.dateRange)
  }

  return params
}
