import { Link } from 'react-router-dom'
import { Path, useForm } from 'react-hook-form'
import  omit  from 'lodash/omit'
import { Schema, schema } from '../../utils/rule.ts'
import Input from '../../components/Input'
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from '@tanstack/react-query'
import { resisterApi } from '../../apis/auth.apis.ts'
import { isAxiosUnprocessableEntity } from '../../utils/utils.ts'
import path from "../../constants/path.ts";
type FormData = Pick<Schema, 'email' | 'password'|'confirm_password'>
const registerSchema = schema.pick(['email', 'password','confirm_password'])
export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
  })
  const registerAccountMutation = useMutation({
    mutationFn:(body:Omit<FormData, 'confirm_password'>) => resisterApi(body)
  })
  const onSubmit = handleSubmit((data) => {
    const body = omit(data,'confirm_password')
    registerAccountMutation.mutate(body,{
      onError: (error) => {
        if(isAxiosUnprocessableEntity(error)){
          const formError = error.response?.data.data
          if(formError){
            Object.keys(formError).forEach(key => {
              setError(key as Path<FormData>,{
                message:formError[key],
                type:'Server'
              })
            })
          }
        }
      },
      onSuccess:(data)=>{
        console.log(data)
      },
    })
  })
  return (
    <div className={'bg-orange'}>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} className='p-10 rounded bg-white shadow-sm' noValidate>
              <div className='text-2xl'>Đăng ký</div>
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
              <Input
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm password'
                name={'confirm_password'}
                autoComplete={'on'}
              />
              <div className='mt-2'>
                <button className='w-full py-4 text-sm uppercase px-2 bg-orange text-white hover:bg-opacity-95'>
                  Đăng ký
                </button>
              </div>

              <div className={'mt-5 px-4 text-xs text-center'}>
                Bằng việc đăng kí, bạn đã đồng ý với Shopee về
                <a href={'/'} className={' text-orange'} target={'_blank'}>
                  &nbsp;Điều khoản dịch vụ
                </a>
                &nbsp;&&nbsp;
                <a href={'/'} className={' text-orange'} target={'_blank'}>
                  Chính sách bảo mật
                </a>
              </div>

              <div className={'mt-5 px-4 text-sm '}>
                <div className='flex items-center justify-center'>
                  <span className='text-zinc-400'> Bạn đã có tài khoản? </span>
                  <Link to={path.login} className={'text-orange ml-1'}>
                    Đăng nhập
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
