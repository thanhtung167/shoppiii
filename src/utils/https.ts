import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import {clearAccessToken, getAccessToken, saveAccessToken, saveUserProfile} from './auth.ts'
import {AuthResponse} from "../types/auth.type.ts";
import { config } from '../constants/config.ts'

class Http {
  instance: AxiosInstance
  private accessToken: string
  // @ts-ignore
  constructor() {
    this.accessToken = getAccessToken()
    this.instance = axios.create({
      baseURL: config.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-type': 'application/json'
      }
    })
    this.instance.interceptors.request.use((config) => {
      if (this.accessToken && config.headers) {
        config.headers.authorization = this.accessToken
        return config
      }
      return config
    },(error) => {
      return Promise.reject(error)
    })
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url == '/login' || url == '/register') {
          const data = response.data as AuthResponse
          this.accessToken = data?.data?.access_token ?? ''
          saveAccessToken(this.accessToken)
          saveUserProfile(data.data?.user)
        }
        if (url == '/logout') {
          this.accessToken = ''
          clearAccessToken()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data = error.response?.data
           
          // @ts-expect-error
          const message = data.message || error.message
          console.log(message)
        }
        if (error.response?.status == HttpStatusCode.Unauthorized) {
          clearAccessToken()
          window.location.reload()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
