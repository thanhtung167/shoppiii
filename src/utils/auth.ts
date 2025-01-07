import { User } from '../types/user.type.ts'

export const saveAccessToken = (access_token: string) => {
  return localStorage.setItem('access_token', access_token)
}

export const clearAccessToken = () => {
  localStorage.removeItem('profile')
  localStorage.removeItem('access_token')
}

export const getAccessToken = () => localStorage.getItem('access_token') ?? ''
export const getUserProfile = () => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
}

export const saveUserProfile = (profile: User | undefined) => {
  return localStorage.setItem('profile', JSON.stringify(profile))
}