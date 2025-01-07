import https from "../utils/https.ts";
import {Product, ProductList, ProductListConfig} from "../types/product.type.ts";
import {ResponseAPI} from "../types/utils.type.ts";

const URL = 'products'
const productApi = {
    getProducts: (params:ProductListConfig) => {
        return https.get<ResponseAPI<ProductList>>(URL,{
            params
        })
    },
    getProductDetail: (id:string) => {
        return https.get<ResponseAPI<Product>>(`${URL}/${id}`)
    },
}
export default productApi