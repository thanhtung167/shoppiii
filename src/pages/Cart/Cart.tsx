import { useMutation, useQuery } from '@tanstack/react-query'
import { purchaseStatus } from '../../constants/purchases.ts'
import purchasesApi from '../../apis/purchases.api.ts'
import { Link, useLocation } from 'react-router-dom'
import path from '../../constants/path.ts'
import { formatCurrency, formatNumberToSocialStyle } from '../../utils/utils.ts'
import QuantityController from '../../components/Quantity'
import Button from '../../components/Button'
import { useContext, useEffect, useMemo } from 'react'
import { PurchasesType } from '../../types/purchases.type.ts'
import * as React from 'react'
import { produce } from 'immer'
import keyBy  from 'lodash/keyBy'
import no_cart from '../../assets/images/emptycart.png'
import { AppContext } from '../../contexts/app.context.tsx'

function Cart() {
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchasesApi.getPurchaseList({ status: purchaseStatus.inCart })
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: purchasesApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const deletePurchaseMutation = useMutation({
    mutationFn: purchasesApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyPurchaseMutation = useMutation({
    mutationFn: purchasesApi.buyProduct,
    onSuccess: () => {
      refetch()
    }
  })
  const location = useLocation()
  const purchaseId = location.state
  const purchasesInCart = purchasesInCartData?.data.data
  const { extendedPurchase, setExtendedPurchase } = useContext(AppContext)
  useEffect(() => {
    setExtendedPurchase((prevState) => {
      const extendPurchase = keyBy(prevState, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChecked = purchaseId == purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChecked || Boolean(extendPurchase[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchaseId, purchasesInCart, setExtendedPurchase])
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  })

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }
  const handleCheckeAll = () => {
    setExtendedPurchase((prevState) =>
      prevState.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchase[purchaseIndex]
      setExtendedPurchase(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }
  const handleQuantityType = (purchaseIndex: number, value: number) => {
    setExtendedPurchase(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }
  const checkedPurchase = useMemo(() => extendedPurchase?.filter((purchase) => purchase.checked), [extendedPurchase])
  const purchaseCount = checkedPurchase?.length
  const handleDelete = (purchaseIndex: number) => {
    const purchaseId = extendedPurchase[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }
  const handleDeleteMany = () => {
    const purchaseIds = checkedPurchase.map((purchase) => purchase._id)
    if (purchaseIds.length) {
      deletePurchaseMutation.mutate(purchaseIds)
    }
  }
  const totalCheckedPurchase = useMemo(()=> checkedPurchase.reduce(
    (total, purchase) => total + purchase.buy_count * purchase.product.price,
    0
  ),[checkedPurchase])
  const totalCheckedSavingPrice = useMemo(()=> checkedPurchase.reduce(
    (total, purchase) => total + (purchase.product.price_before_discount - purchase.product.price) * purchase.buy_count,
    0
  ),[checkedPurchase])

  const handleBuyPurchase = () => {
    if (checkedPurchase?.length) {
      const body = checkedPurchase.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyPurchaseMutation.mutate(body)
    }
  }

  const isAllChecked = useMemo(
    () => extendedPurchase?.every((purchase) => purchase.checked) && extendedPurchase?.length > 0,
    [extendedPurchase]
  )
  return (
    <div className={'bg-neutral-100 py-5'}>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid bg-white grid-cols-12 rounded-sm py-5 px-9 capitalize text-gray-500 shadow'>
              <div className='col-span-6 '>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 justify-center pr-3'>
                    <input
                      type={'checkbox'}
                      checked={isAllChecked}
                      onChange={handleCheckeAll}
                      className={'h-5 w-5 accent-orange'}
                    />
                  </div>
                  <div className='flex-grow text-black'> sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'> số lượng</div>
                  <div className='col-span-1'>số tiền</div>
                  <div className='col-span-1'>thao tác</div>
                  <div className='col-span-1'></div>
                </div>
              </div>
            </div>
            <div className='my-3 mt-3 rounded-sm bg-white p-5 shadow'>
              {extendedPurchase?.length > 0 &&
                extendedPurchase?.map((purchase, index) => (
                  <div
                    key={purchase._id}
                    className={
                      'grid grid-cols-12 text-center border border-gray-200 bg-white py-5 mb-5 last:mb-0 px-4 text-sm text-gray-500'
                    }
                  >
                    <div className='col-span-6'>
                      <div className='flex items-center'>
                        <div className='flex flex-shrink-0 justify-center pr-3'>
                          <input
                            type={'checkbox'}
                            checked={purchase.checked}
                            onChange={handleChecked(index)}
                            className={'h-5 w-5 accent-orange'}
                          />
                        </div>
                        <div className='flex-grow '>
                          <div className='flex'>
                            <Link to={`${path.home}${purchase.product._id}`} className={'h-20 w-20 flex-shrink-0 '}>
                              <img src={purchase.product.image} alt={purchase.product.name} />
                            </Link>
                            <div className={'flex-grow pt-1 pb-2 px-2 '}>
                              <Link to={`${path.home}${purchase.product._id}`} className={'line-clamp-2 text-left '}>
                                {purchase.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-6'>
                      <div className='grid grid-cols-5 items-center'>
                        <div className='col-span-2'>
                          <div className='flex items-center justify-center'>
                            <span className='text-gray-500 line-through'>
                              ₫{formatCurrency(purchase.product.price_before_discount)}
                            </span>
                            <span className={'ml-3 text-black'}>₫{formatCurrency(purchase.product.price)}</span>
                          </div>
                        </div>
                        <div className='col-span-1'>
                          <QuantityController
                            max={purchase.product.quantity}
                            onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                            onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                            onType={(value) => handleQuantityType(index, value)}
                            onFocusOut={(value) =>
                              handleQuantity(
                                index,
                                value,
                                value >= 1 &&
                                  value <= purchase.product.quantity &&
                                  value != (purchasesInCart as PurchasesType[])[index].buy_count
                              )
                            }
                            disabled={purchase.disabled}
                            value={purchase.buy_count}
                          ></QuantityController>
                        </div>
                        <div className='col-span-1'>
                          <span className={'text-orange'}>
                            ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                          </span>
                        </div>
                        <div className='col-span-1'>
                          <button
                            onClick={() => handleDelete(index)}
                            className={'bg-transparent text-black transition-colors hover:text-orange'}
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {extendedPurchase?.length === 0 && (
                <div className='p-2.5  text-center flex justify-center'>
                  <img className={'object-cover w-2/4 h-2/4'} src={no_cart} alt={'no'} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 flex border border-gray-100 rounded-sm bg-white shadow px-5 py-5'>
          <div className='flex w-full items-center justify-between '>
            <div className='flex items-center pl-2'>
              <div className='flex flex-shrink-0 justify-center pr-5'>
                <input
                  id={'checkAll'}
                  type={'checkbox'}
                  checked={isAllChecked}
                  onChange={handleCheckeAll}
                  className={'h-5 w-5 accent-orange'}
                />
              </div>
              <label htmlFor={'checkAll'} className='text-black mx-3 border-none bg-none outline-none cursor-pointer'>
                Chọn tất cả ({extendedPurchase?.length}){' '}
              </label>
              <button onClick={handleDeleteMany} className='text-black mx-3 border-none bg-none outline-none'>
                Xoá
              </button>
            </div>
            <div className={'ml-auto flex items-center'}>
              <div>
                <div className='flex items-center justify-end '>
                  <div>Tổng thanh toán ({purchaseCount} sản phẩm):</div>
                  <div className={'ml-2 text-2xl text-orange'}>₫{formatCurrency(totalCheckedPurchase)}</div>
                </div>
                <div className='flex items-center justify-end text-sm'>
                  <div className={'text-gray-300'}>Tiết kiệm</div>
                  <div className={'ml-6 text-orange'}>₫{formatNumberToSocialStyle(totalCheckedSavingPrice)}</div>
                </div>
              </div>
              <Button
                disabled={buyPurchaseMutation.isPending}
                onClick={handleBuyPurchase}
                className={
                  'w-52 ml-4 h-10  text-sm uppercase  bg-orange text-white hover:bg-opacity-95 justify-center items-center flex '
                }
              >
                Mua hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
