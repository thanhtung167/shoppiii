import https from '../utils/https.ts'
import { User } from '../types/user.type.ts'
import { ResponseAPI } from '../types/utils.type.ts'
interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}

const userApi = {
  getProfile() {
    return https.get<ResponseAPI<User>>('me')
  },
  updateProfile(body: BodyUpdateProfile) {
    return https.put<ResponseAPI<User>>('user', body)
  },
  uploadAvatar(body: FormData) {
    return https.post<ResponseAPI<string>>('user/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi