import { createSearchParams, Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import productApi from '../../apis/product.api.ts'
import { formatCurrency, formatNumberToSocialStyle, rundomNumber } from '../../utils/utils.ts'
import Button from '../../components/Button'
import DOMPurePurify from 'dompurify'
import path from '../../constants/path.ts'
import NotFound from '../NotFound'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Loading from '../Loading'
import { Product } from '../../types/product.type.ts'
import QuantityController from '../../components/Quantity'
import purchasesApi from '../../apis/purchases.api.ts'
import { purchaseStatus } from '../../constants/purchases.ts'
import { AppContext } from '../../contexts/app.context.tsx'

export default function ProductDetail() {
  const [buyCount, setBuyCount] = useState(1)
  const { isAuthenticate } = useContext(AppContext)
  const queryClient = useQueryClient()
  const { id } = useParams()
  const { data: productDetailData, isLoading } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const navigate = useNavigate()
  const imgRef = useRef<HTMLImageElement>(null)
  const product = productDetailData?.data.data
  const [currentIndexImage, setCurrentIndexImage] = useState([0, 5])
  const currentImages = useMemo(
    () => (product ? product?.images.slice(...currentIndexImage) : []),
    [currentIndexImage, product]
  )
  const [activeImage, setActiveImage] = useState('')
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])
  const chooseActive = (img: string) => {
    setActiveImage(img)
  }
  const next = () => {
    if (currentIndexImage[1] < (product as Product).images.length) {
      setCurrentIndexImage((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentIndexImage[0] > 0) {
      setCurrentIndexImage((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget?.getBoundingClientRect()
    const image = imgRef.current as HTMLImageElement
    const { naturalWidth, naturalHeight } = image
    const { offsetX, offsetY } = e.nativeEvent
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.top = top + 'px'
    image.style.left = left + 'px'
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
  }

  const handleResetZoom = () => {
    imgRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCartMutation = useMutation({
    mutationFn:(purchasesApi.addToCart),
  })

  const addToCart = () => {
    if(!isAuthenticate){
      navigate(path.login)
      return
    }
    addToCartMutation.mutate({buy_count:buyCount, product_id:product?._id as string},{
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:['purchases', { status: purchaseStatus.inCart }],
        })
      }
    } )
  }

  const handleBuyNow = async () => {
    if(!isAuthenticate){
      navigate(path.login)
      return
    }
    const res = await addToCartMutation.mutateAsync({buy_count:buyCount, product_id:product?._id as string})
    const purchase = res.data.data
    navigate(path.cart,{
      state:purchase?._id
    })
  }

  if (isLoading) return <Loading />
  if (!product) return <NotFound />
  return (
    <div className={'bg-gray-100 py-6'}>
      <div className='container p-0 mb-6'>
        <nav className='flex text-slate-900 text-sm' aria-label='Breadcrumb'>
          <ol className='inline-flex items-center '>
            <li className='inline-flex items-center text-blue-600'>
              <Link to={path.home}>Shopee</Link>
            </li>
            <li className={'text-blue-600'}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    category: product?.category._id
                  }).toString()
                }}
                className='flex items-center'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-4 w-4 text-gray-500 mx-1'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
                {product?.category.name}
              </Link>
            </li>
            <li aria-current='page'>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-4 w-4 text-gray-500 mx-1'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>

                <span className=' text-sm font-medium text-slate-900 '>{product?.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div className='container shadow-sm bg-white p-4 rounded-sm'>
        {product && (
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                onMouseLeave={handleResetZoom}
                className='hover:cursor-zoom-in relative w-full pt-[100%] overflow-hidden'
                onMouseMove={handleZoom}
              >
                <img
                  ref={imgRef}
                  src={activeImage}
                  alt={product.name}
                  className='absolute inset-0 w-full h-full object-cover pointer-events-none'
                />
              </div>
              <div className='mt-4 relative grid grid-cols-5 gap-1'>
                <button
                  onClick={prev}
                  className={'absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.slice(0, 5).map((image) => {
                  const isActived = image === activeImage
                  return (
                    <div
                      role={'button'}
                      onMouseEnter={() => chooseActive(image)}
                      className={'relative w-full pt-[100%]'}
                      key={image}
                    >
                      <img
                        src={image}
                        alt={product.name}
                        className='w-full h-full cursor-pointer absolute top-0 left-0  object-cover bg-white'
                      />
                      {isActived && <div className={'absolute inset-0 border-2 border-orange'}></div>}
                    </div>
                  )
                })}
                <button
                  onClick={next}
                  className={'absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl uppercase font-medium '>{product.name}</h1>
              <div className='flex items-center mt-3'>
                <span className={'mr-1 border-b border-b-orange text-orange'}>{product.rating}</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className={'h-4 w-4  mr-[3px] text-orange fill-orange'}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                  />
                </svg>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <span>{formatNumberToSocialStyle(product.sold)}</span>
                <span className='ml-1 text-gray-500'>đã bán</span>
              </div>
              <div className='mt-3 flex items-center bg-orange/10 px-5 py-4'>
                <div className='text-orange text-3xl font-medium'>₫{formatCurrency(product.price)}</div>
                <div className='ml-3 text-[16px] font-light text-gray-400 line-through'>
                  ₫{formatCurrency(product.price_before_discount)}
                </div>
                <div className='ml-3 text-orange text-[10px] bg-red-100 p-0.5 font-bold rounded-sm'>{`-${rundomNumber(product.price_before_discount, product.price)}%`}</div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <QuantityController
                  max={product.quantity}
                  classNameWrapper={'ml-10'}
                  value={buyCount}
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                ></QuantityController>
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border-orange border
                   bg-orange/10 text-orange capitalize px-5 shadow-sm hover:bg-orange/5 '
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5 mr-2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                    />
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <Button
                  onClick={handleBuyNow}
                  className={
                    'ml-4 h-12 min-w-[5rem] rounded-sm hover:bg-opacity-90 bg-orange px-5 capitalize items-center text-white text-center justify-center flex shadow-sm outline-none'
                  }
                >
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='mt-6'>
        <div className='container bg-white rounded-sm p-4 shadow-sm'>
          <div className='text-xl font-medium uppercase p-3 bg-gray-100 text-slate-900'>Chi tiết sản phẩm</div>
          {product && (
            <div
              className='mt-12 mx-4 text-sm loading-loose'
              dangerouslySetInnerHTML={{
                __html: DOMPurePurify.sanitize(product?.description)
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  )
}
