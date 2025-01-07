import { ResponseAPI } from './utils.type.ts'
import { User } from './user.type.ts'

export type AuthResponse = ResponseAPI<{
  access_token:string
  expires:string
  user:User
}>