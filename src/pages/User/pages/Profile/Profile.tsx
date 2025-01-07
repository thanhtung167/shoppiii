import Input from '../../../../components/Input'
import Button from '../../../../components/Button'
import { useMutation, useQuery } from '@tanstack/react-query'
import userApi from '../../../../apis/user.apis.ts'
import { userSchema, UserSchema } from '../../../../utils/rule.ts'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import InputNumber from '../../../../components/InputNumber'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import DaySelect from '../../components/DaySelect'
import { toast } from 'react-toastify'
import { AppContext } from '../../../../contexts/app.context.tsx'
import { User } from '../../../../types/user.type.ts'
import * as React from 'react'
import { saveUserProfile } from '../../../../utils/auth.ts'
import { getAvatar } from '../../../../utils/utils.ts'
import { config } from '../../../../constants/config.ts'

type FormData = Pick<UserSchema, 'name' | 'address' | 'date_of_birth' | 'avatar' | 'phone'>
const profileSchema = userSchema.pick(['name', 'address', 'date_of_birth', 'avatar', 'phone'])
const DEFAULT_DATE = new Date(1900, 0, 1)
export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File>()
  const previewImg = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return null
  }, [file])
  const { setProfile } = useContext(AppContext)
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      address: '',
      date_of_birth: DEFAULT_DATE,
      avatar: '',
      phone: ''
    },
    resolver: yupResolver(profileSchema)
  })

  const profile = profileData?.data?.data
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('address', profile.address)
      setValue('phone', profile.phone)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : DEFAULT_DATE)
      setValue('avatar', profile.avatar)
    }
  }, [profile, setValue])

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })

  const onSubmit = handleSubmit(async (data) => {
    let avatarName = avatar
    try {
      if(file){
        const formData = new FormData()
        formData.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(formData)
        avatarName = uploadRes.data.data
      }
      const res = await updateProfileMutation.mutateAsync({...data, avatar: avatarName})
      setProfile(res.data.data as User)
      saveUserProfile(res.data.data)
      toast.success(res.data.message)
      refetch()
    }catch (error) {
      // @ts-ignore
      toast.error(error.message)
    }

  })
  const handleUpload = () => {

    fileInputRef.current?.click()
  }
  const handleChangeFile = (event:React.ChangeEvent<HTMLInputElement>) => {
    const fileLocal = event.target.files?.[0]
    if(fileLocal && (fileLocal.size >= config.maxSize || !fileLocal.type.includes('image') ) ){
      toast.error('File không hợp lệ')
      return
    }
    setFile(fileLocal)
  }
  const avatar = watch('avatar')
  return (
    <div className={'bg-white rounded-sm px-7 pb-20 shadow'}>
      <div className='border-b-gray-200 py-6 border-b'>
        <div className={'text-lg font-medium capitalize text-gray-900'}>Hồ sơ của tôi</div>
        <div className={'mt-1 text-sm text-gray-700'}>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form onSubmit={onSubmit} className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <div className={'mt-6 flex-grow md:pr-12 md:mt-0 w-full'}>
          <div className='flex flex-wrap items-center'>
            <div className={'w-[20%] truncate  text-right'}>Email</div>
            <div className={'w-[80%] truncate pl-5 text-left'}>
              <div className=' text-gray-700 '>{profile?.email}</div>
            </div>
          </div>
          <div className='flex flex-wrap mt-6 items-center'>
            <div className={'w-[20%] truncate  text-right'}>Tên</div>
            <div className={'w-[80%] truncate pl-5 '}>
              <Input
                register={register}
                name='name'
                errorMessage={errors.name?.message}
                classNameInput={
                  'w-full py-2 px-3 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                }
              ></Input>
            </div>
          </div>
          <div className='flex flex-wrap mt-2 items-center'>
            <div className={'w-[20%] truncate  text-right'}>Số điện thoại</div>
            <div className={'w-[80%] truncate pl-5 '}>
              <Controller
                name={'phone'}
                control={control}
                render={({ field }) => (
                  <InputNumber
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    placeholder='Số điện thoại'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              ></Controller>
            </div>
          </div>
          <div className='flex flex-wrap mt-2 items-center'>
            <div className={'w-[20%] truncate text-right'}>Địa chỉ</div>
            <div className={'w-[80%] truncate pl-5 '}>
              <Input
                placeholder={'Địa chỉ'}
                register={register}
                name='address'
                errorMessage={errors.address?.message}
                classNameInput={
                  'w-full py-2 px-3 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                }
              ></Input>
            </div>
          </div>
          <div className='flex flex-wrap mt-2 items-center'>
            <div className={'w-[20%] truncate text-right'}>Ngày sinh</div>
            <div className={'w-[80%] truncate pl-5 '}>
              <Controller
                control={control}
                render={({ field }) => (
                  <DaySelect
                    onChange={field.onChange}
                    value={field.value}
                    error={errors.date_of_birth?.message}
                  ></DaySelect>
                )}
                name={'date_of_birth'}
              ></Controller>
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
        <div className={'flex justify-center md:w-80 px-5  md:border-l md:border-l-gray-200'}>
          <div className='flex items-center flex-col justify-center'>
            <div className={'my-5 h-24 w-24'}>
              <img src={previewImg || getAvatar(avatar)} alt='avt' className={'object-cover rounded-full w-full h-full'} />
            </div>
            <input
              ref={fileInputRef}
              onClick={ (event) =>{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ;(event.target as any).value = null
              } }
              onChange={handleChangeFile}
              id={'avatar'}
              className='hidden'
              type='file'
              accept='.jpg,.jpeg,.png'
            />
            <button
              type={'button'}
              onClick={handleUpload}
              className={
                'flex h-10 items-center justify-end rounded-sm border bg-white text-sm px-6 shadow-sm text-gray-600'
              }
            >
              Chọn ảnh
            </button>
            <div className={'text-gray-400  mt-2'}>Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG</div>
          </div>
        </div>
      </form>
    </div>
  )
}
