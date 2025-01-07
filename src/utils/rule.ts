import * as yup from 'yup'
export const schema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Nhập lại là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
  price_min: yup.string().test({
    name: 'price_not_allow',
    message: 'Giá không hợp lệ',
    test: function (value) {
      const price_min = Number(value)
      const price_max = Number(this.parent?.price_max)
      if (price_min && price_max) {
        return price_min <= price_max
      }
      return price_min || price_max
    }
  }),
  price_max: yup.string().test({
    name: 'price_not_allow',
    message: 'Giá không hợp lệ',
    test: function(value) {
      const price_max = Number(value)
      const price_min = Number(this.parent?.price_min)
      if (price_min && price_max) {
        return price_min <= price_max
      }
      return price_min || price_max
    }
  })
})


export const handleValidateConfirmPassword = (value: string, compareValue: string) =>
  value == compareValue || 'Mật khẩu không khớp'

export type Schema = yup.InferType<typeof schema>


export  const userSchema = yup.object({
  name:yup.string().max(160,'Độ dài tối đa 160 ký tự'),
  phone:yup.string().max(20,'Độ dài tối đa 20 ký tự'),
  address:yup.string().max(160,'Độ dài tối đa 160 ký tự'),
  date_of_birth:yup.date().max(new Date(),'Ngày sinh không hợp lệ'),
  password:schema.fields.password,
  new_password:schema.fields.password,
  confirm_password:schema.fields.confirm_password,
  avatar:yup.string().max(1000,'Độ dài tối đa 1000 ký tự')
})

export type UserSchema = yup.InferType<typeof userSchema>