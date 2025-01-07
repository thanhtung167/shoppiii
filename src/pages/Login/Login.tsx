import { Link, useNavigate } from 'react-router-dom'
import { Path, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from '../../utils/rule.ts'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../../apis/auth.apis.ts'
import Input from '../../components/Input'
import { isAxiosUnprocessableEntity } from '../../utils/utils.ts'
import { AppContext } from '../../contexts/app.context.tsx'
import { useContext } from 'react'
import Button from '../../components/Button'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])
export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })
  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => loginApi(body)
  })
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onError: (error) => {
        if (isAxiosUnprocessableEntity(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as Path<FormData>, {
                message: formError[key],
                type: 'Server'
              })
            })
          }
        }
      },
      onSuccess: (data) => {
        setIsAuthenticated(true)
        // @ts-ignore
        setProfile(data?.data?.data?.user)
        navigate('/')
      }
    })
  })
  return (
    <div className={'bg-orange'}>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='p-10 rounded bg-white shadow-sm'>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                placeholder='Email'
                name={'email'}
              />
              <Input
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.password?.message}
                placeholder='Password'
                name={'password'}
                autoComplete={'on'}
              />
              <div className='mt-2'>
                <Button
                  isLoading={loginAccountMutation.isPending}
                  disabled={loginAccountMutation.isPending}
                  className='w-full py-4 text-sm uppercase px-2 bg-orange text-white hover:bg-opacity-95 justify-center items-center flex'
                >
                  Đăng nhập
                </Button>
              </div>
              <div className={'mt-5 px-4 text-sm '}>
                <div className='flex items-center justify-center'>
                  <span className='text-zinc-400'> Bạn chưa có tài khoản? </span>
                  <Link to={'/register'} className={'text-orange ml-1'}>
                    Đăng ký
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
