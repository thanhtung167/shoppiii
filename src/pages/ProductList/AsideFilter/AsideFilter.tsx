import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '../../../constants/path.ts'
import Button from '../../../components/Button'
import InputNumber from '../../../components/InputNumber'
import { Controller, useForm } from 'react-hook-form'
import { Schema, schema } from '../../../utils/rule.ts'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from '../../../utils/utils.ts'
import { Category } from '../../../types/category.type.ts'
import { ObjectSchema } from 'yup'
import classNames from 'classnames'
import RatingStar from '../../../components/RatingStar'
import  omit  from 'lodash/omit'
import { QueryConfig } from '../../../../hooks/useQueryConfig.tsx'

type FormData = NoUndefinedField<Pick<Schema, 'price_min' | 'price_max'>>
interface Props {
  queryConfig: QueryConfig
  categories?: Category[]
}
const priceSchema = schema.pick(['price_min', 'price_max'])
export default function AsideFilter({ queryConfig, categories }: Props) {
  const navigate = useNavigate()
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<FormData>({
    resolver: yupResolver<FormData>(priceSchema as ObjectSchema<FormData>),
    defaultValues: {
      price_max: '',
      price_min: ''
    }
  })
  const handleClearFilter = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })
  return (
    <div className={'py-4'}>
      <Link to={path.home} className={'flex items-center font-bold '}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4 mr-2'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
          />
        </svg>
        <span className={'capitalize'}>Tất cả danh mục</span>
      </Link>
      <div className={'h-[1px] bg-gray-300 my-4'}></div>
      <ul>
        {categories?.map((categoryItem) => {
          const isActive = categoryItem._id === category
          return (
            <li key={categoryItem._id} className={'py-1 pl-2'}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2 text-black font-semibold text-sm', {
                  'text-orange': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='fill-orange absolute h-2 w-2 top-1 left-[-5px] '>
                    <polygon points='4 3.5 0 0 0 7'></polygon>
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className={'flex items-center font-bold uppercase mt-4 '}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4 mr-2'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
          />
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className={'h-[1px] bg-gray-300 my-4'}></div>
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form onSubmit={onSubmit} className='mt-5'>
          <div className='flex items-start'>
            <Controller
              control={control}
              name={'price_min'}
              render={({ field }) => (
                <InputNumber
                  type={'text'}
                  placeholder={'TỪ'}
                  className={'grow'}
                  classNameInput={
                    'w-full text-sm p-1 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  }
                  classNameError={'hidden '}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_max')
                  }}
                ></InputNumber>
              )}
            ></Controller>

            <div className='mx-2 mt-1 shrink-0'>-</div>
            <Controller
              control={control}
              name={'price_max'}
              render={({ field }) => (
                <InputNumber
                  type={'text'}
                  placeholder={'ĐẾN'}
                  className={'grow'}
                  classNameInput={
                    'w-full text-sm p-1 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                  }
                  classNameError={'hidden'}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event)
                    trigger('price_min')
                  }}
                ></InputNumber>
              )}
            ></Controller>
          </div>
          <div className={'mt-1 text-red-600 min-h-[1rem] text-xs'}>{errors.price_min?.message}</div>
          <Button
            className={
              'p-1.5 mt-1 bg-orange text-white text-sm shadow-sm rounded-sm hover:bg-orange/80 uppercase w-full'
            }
          >
            Áp dụng
          </Button>
        </form>
        <div className={'h-[1px] bg-gray-300 my-4'}></div>
        <div className='text-sm'>Đánh giá</div>
        <RatingStar queryConfig={queryConfig}></RatingStar>
        <div className={'h-[1px] bg-gray-300 my-4'}></div>
        <Button
          onClick={handleClearFilter}
          className={'p-1.5 bg-orange text-white text-sm shadow-sm rounded-sm hover:bg-orange/80 uppercase w-full'}
        >
          Xoá tất cả
        </Button>
      </div>
    </div>
  )
}
