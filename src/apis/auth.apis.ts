import https from '../utils/https.ts'
import { AuthResponse } from '../types/auth.type.ts'

export const resisterApi = (body:{email:string,password:string}) => {
    return https.post<AuthResponse>('/register',body)
}

export const loginApi = (body:{email:string,password:string}) => {
    return https.post<AuthResponse>('/login',body)
}
export const logoutApi = () => {
    return https.post('/logout')
}