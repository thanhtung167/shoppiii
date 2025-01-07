import {ResponseAPI} from "../types/utils.type.ts";
import https from "../utils/https.ts";
import { PurchaseListStatus, PurchasesType } from '../types/purchases.type.ts'
const URL = 'purchases'
const purchasesApi = {
  addToCart: (params:{product_id:string;buy_count:number}) => {
    return https.post<ResponseAPI<PurchasesType>>(`${URL}/add-to-cart`,params)
  },
  getPurchaseList: (params:{status:PurchaseListStatus}) => {
    return https.get<ResponseAPI<PurchasesType[]>>(`${URL}`,{
      params
    })
  },
  buyProduct: (params:{product_id:string;buy_count:number}[]) => {
    return https.post<ResponseAPI<PurchasesType[]>>(`${URL}/buy-products`,params)
  },
  updatePurchase: (params:{product_id:string;buy_count:number}) => {
    return https.put<ResponseAPI<PurchasesType>>(`${URL}/update-purchase`,params)
  },
  deletePurchase: (purchaseIds:string[]) => {
    return https.delete<ResponseAPI<{deleted_count:number}>>(`${URL}`,{
      data:purchaseIds
    })
  },
}
export default purchasesApi