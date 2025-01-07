export interface User {
  _id: string
  email: string
  createdAt: string
  updatedAt: string
  roles: Role[]
  name?:string
  phone?:string
  date_of_birth?:Date
  avatar?:string
  address?:string
}
type Role = 'Admin' | 'User'