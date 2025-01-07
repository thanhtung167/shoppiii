import Input from '../../../../components/Input'
import { useForm } from 'react-hook-form'
import Button from '../../../../components/Button'
import { yupResolver } from '@hookform/resolvers/yup'
import { userSchema, UserSchema } from '../../../../utils/rule.ts'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import userApi from '../../../../apis/user.apis.ts'
import { isAxiosUnprocessableEntity, NoUndefinedField } from '../../../../utils/utils.ts'
import { ObjectSchema } from 'yup'
import  omit  from 'lodash/omit'


type FormData = NoUndefinedField<Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>>
const passwordSchema = userSchema.pick(['new_password', 'confirm_password','password'])

function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<FormData>({
    defaultValues: {
      new_password: '',
      confirm_password: '',
      password:''
    },
    resolver: yupResolver<FormData>(passwordSchema as ObjectSchema<FormData>)
  })
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const onSubmit = handleSubmit(async (data) => {
    try {
      // @ts-ignore
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntity(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  return (
    <div className={'bg-white rounded-sm px-7 pb-20 shadow'}>
      <div className='border-b-gray-200 py-6 border-b'>
        <div className={'text-lg font-medium capitalize text-gray-900'}>Đổi mật khẩu</div>
        <div className={'mt-1 text-sm text-gray-700'}>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </div>
      </div>
      <form onSubmit={onSubmit} className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <div className={'mt-6 flex-grow md:pr-12 md:mt-0 w-full'}>
          <div className='flex flex-wrap mt-2 items-center'>
            <div className={'w-[20%] truncate  text-right'}>Mật khẩu cũ
            </div>
            <div className={'w-[80%] truncate pl-5 '}>
              <Input
                type={'password'}
                register={register}
                name='password'
                errorMessage={errors.password?.message}
                classNameInput={
                  'w-full py-2 px-3 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                }
              ></Input>
            </div>
          </div>
          <div className='flex flex-wrap mt-2 items-center'>
            <div className={'w-[20%] truncate  text-right'}>Mật khẩu mới
            </div>
            <div className={'w-[80%] truncate pl-5 '}>
              <Input
                type={'password'}
                register={register}
                name='new_password'
                errorMessage={errors.new_password?.message}
                classNameInput={
                  'w-full py-2 px-3 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                }
              ></Input>
            </div>
          </div>
          <div className='flex flex-wrap mt-2 items-center'>
            <div className={'w-[20%] truncate text-right'}>Xác nhận mật khẩu
            </div>
            <div className={'w-[80%] truncate pl-5 '}>
              <Input
                type={'password'}
                register={register}
                name='confirm_password'
                errorMessage={errors.confirm_password?.message}
                classNameInput={
                  'w-full py-2 px-3 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                }
              ></Input>
            </div>
          </div>
          <div className='flex flex-wrap mt-5 items-center'>
            <div className={'w-[20%] truncate sm:text-right'}></div>
            <div className={'sm:w-[80%] sm:pl-5'}>
              <Button
                type={'submit'}
                className={'flex items-center bg-orange h-9 px-5 text-center text-sm text-white hover:bg-orange/80'}
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword