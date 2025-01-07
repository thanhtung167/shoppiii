import { sortBy, orderBy } from '../../../constants/product.ts'
import classNames from 'classnames'
import { ProductListConfig } from '../../../types/product.type.ts'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from '../../../constants/path.ts'
import  omit  from 'lodash/omit'
import { QueryConfig } from '../../../../hooks/useQueryConfig.tsx'

interface Props {
  queryConfig: QueryConfig
  pageSize?: number
}
export default function SortProductList({ queryConfig, pageSize }: Props) {
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const page = Number(queryConfig.page)
  const navigate = useNavigate()
  const isActiveSortBy = (value: Exclude<ProductListConfig['sort_by'], undefined>) => sort_by === value
  const handleSort = (value: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: value
          },
          ['order']
        )
      ).toString()
    })
  }
  const handleOrder = (value: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        order: value
      }).toString()
    })
  }
  return (
    <div className={'bg-gray-200 py-3 text-sm px-4 rounded-sm'}>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <div className='text-slate-500 '>Sắp xếp theo</div>
          <button
            onClick={() => handleSort(sortBy.view)}
            className={classNames(' text-center rounded-sm h-8 px-4 text-sm ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
          >
            Phổ biến
          </button>

          <button
            onClick={() => handleSort(sortBy.createdAt)}
            className={classNames(' text-center rounded-sm h-8 px-4 text-sm ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
          >
            Mới nhất
          </button>

          <button
            onClick={() => handleSort(sortBy.sold)}
            className={classNames(' text-center rounded-sm h-8 px-4 text-sm ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
          >
            Bán chạy
          </button>
          <select
            className={classNames(' capitalize  rounded-sm text-left h-8 px-3 text-sm outline-none  ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            onChange={(e) => handleOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
            value={order || ''}
          >
            <option className={'bg-white text-black'} value={''} disabled>
              Giá
            </option>
            <option className={'bg-white text-black'} value={orderBy.asc}>
              Giá: Thấp đến cao
            </option>
            <option className={'bg-white text-black'} value={orderBy.desc}>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div>
            <span className={'text-orange'}>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-6 h-8 flex'>
            {page == 1 ? (
              <div
                className={
                  'h-8 px-3 rounded-tl-sm rounded-bl-sm bg-white/60 flex items-center cursor-not-allowed shadow-sm'
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3 text-neutral-500'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </div>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className={
                  'h-8 px-3 rounded-tl-sm rounded-bl-sm bg-white  flex items-center hover:bg-slate-100 shadow-sm'
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3 '
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}

            {page == pageSize ? (
              <div
                className={
                  'h-8 px-3 rounded-tl-sm rounded-bl-sm bg-white/60 flex items-center cursor-not-allowed shadow-sm'
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3 text-neutral-500'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </div>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className={
                  'h-8 px-3 rounded-tl-sm rounded-bl-sm bg-white flex items-center hover:bg-slate-100 shadow-sm'
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
