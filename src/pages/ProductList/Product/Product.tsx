import { Link } from 'react-router-dom'
import { Product as ProductType } from '../../../types/product.type.ts'
import { formatNumberToSocialStyle, formatCurrency, rundomNumber,formatRating } from '../../../utils/utils.ts'
import path from "../../../constants/path.ts";
interface Props {
  product: ProductType
}
export default function Product({ product }: Props) {
  return (
    <Link to={`${path.home}${product._id}`}>
      <div className='bg-white  border hover:border-orange duration-100 transition-transform hover:shadow-md'>
        <div className='w-full pt-[100%] relative'>
          <img src={product.image} alt={product.name} className='absolute inset-0 w-full h-full object-cover' />
        </div>
        <div className='p-2'>
          <div className='overflow-hidden'>
            <div className='min-h-[2rem] line-clamp-2 text-sm'>{product.name}</div>
          </div>
          <div className='mt-2'>
            <div className='flex truncate items-center '>
              <div className='text-sm text-orange'>₫</div>
              <div className='text-orange'>{formatCurrency(product.price)}</div>
              { <div className={'bg-red-100 rounded-sm  h-4 px-1 py-0.5 ml-2 flex items-center text-[10px]'}>
                <span className={'text-orange '}> {`-${rundomNumber(product.price_before_discount, product.price)}%`}</span>
              </div> }
            </div>
            <div className='mt-2 flex items-center text-xs'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-4 w-4 text-yellow-400 fill-amber-400 mr-[3px]'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                />
              </svg>
              <span>{formatRating(product.rating)}</span>
              <div className={'h-3.5 mt-0.5 w-[1px] bg-slate-200 mx-[4px]'}></div>
              <span>Đã bán {formatNumberToSocialStyle(product.sold)}</span>
            </div>
            <div className='mt-2 flex items-center text-[10px]'>
              <img
                className={'h-auto max-w-[100%] object-cover'}
                alt={'icon'}
                src={
                  'https://deo.shopeemobile.com/shopee/modules-federation/live/0/shopee__item-card-standard-v2/0.1.40/pc/76dff349290d20891fc1.svg'
                }
              ></img>
              <span className={'text-cyan-600 ml-[3px]'}>3 - 5 ngày</span>
              <div className={'h-3 mt-0.5 w-[1px] bg-slate-200 mx-[4px]'}></div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3 mr-[0.9px] text-gray-500'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z'
                />
              </svg>

              <span className={'text-gray-500 capitalize'}>Hà nội</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
