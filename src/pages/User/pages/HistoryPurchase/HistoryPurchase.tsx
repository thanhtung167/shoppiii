import { createSearchParams, Link } from 'react-router-dom'
import path from '../../../../constants/path.ts'
import { purchaseStatus } from '../../../../constants/purchases.ts'
import useQueryParams from '../../../../../hooks/useQueryParams.tsx'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import purchasesApi from '../../../../apis/purchases.api.ts'
import { Fragment } from 'react'
import { formatCurrency } from '../../../../utils/utils.ts'

const purchaseTab = [
  {
    status: purchaseStatus.all,
    name: 'Tất cả'
  },
  {
    status: purchaseStatus.waitForConfirm,
    name: 'Chờ xác nhận'
  },
  {
    status: purchaseStatus.waitForGet,
    name: 'Chờ lấy'
  },
  {
    status: purchaseStatus.inProgress,
    name: 'Đang giao'
  },
  {
    status: purchaseStatus.delivered,
    name: 'Đã giao'
  },
  {
    status: purchaseStatus.canceled,
    name: 'Đã huỷ'
  }
]

function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchaseStatus.all
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchasesApi.getPurchaseList({ status: status })
  })
  const purchasesInCart = purchasesInCartData?.data.data
  return (
    <Fragment>
      <div className={'sticky top-0 flex rounded-sm shadow-sm text-lg'}>
        {purchaseTab.map((item) => (
          <Link
            key={item.status}
            className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
              'border-b-orange text-orange': status == item.status,
              'border-b-black/10 text-black': status !== item.status
            })}
            to={{
              pathname: path.purchaseHistory,
              search: createSearchParams({
                status: String(item.status)
              }).toString()
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div>
        {purchasesInCart?.map((purchase) => (
          <div className={'mt-4 rounded-sm shadow-sm bg-white text-gray-800 p-6'} key={purchase._id}>
            <Link to={`${path.home}${purchase.product._id}`} className={'flex items-center'}>
              <div className={'flex-shrink-0'}>
                <img
                  className={'h-20 w-20 object-cover'}
                  src={purchase.product.image}
                  alt={purchase.product.name}
                ></img>
              </div>
              <div className='ml-3 flex-grow overflow-hidden'>
                <div className={'truncate'}>{purchase.product.name}</div>
                <div className='mt-3'>x{purchase.buy_count}</div>
              </div>
              <div className='ml-3 flex-shrink-0'>
                <span className={'line-through text-gray-500 truncate'}>
                  ₫ {formatCurrency(purchase.product.price_before_discount)}
                </span>
                <span className={'ml-2 text-orange truncate'}>₫ {formatCurrency(purchase.product.price)}</span>
              </div>
            </Link>
            <div className={'flex justify-end'}>
              <div>
                <span>Thành tiền:</span>
                <span className={'ml-4 text-orange text-xl '}>
                  {' '}
                  ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  )
}

export default HistoryPurchase
