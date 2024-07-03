/// <reference types="vite/client" />

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string
    name: string
    email: string
    role: 'buyer' | 'seller'
  }
}
