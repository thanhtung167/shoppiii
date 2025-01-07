import {Category} from "./category.type.ts";

export interface Product  {
    _id: string
    images: string[]
    price: number
    rating: number
    price_before_discount: number
    quantity: number
    sold: number
    view: number
    name: string
    category: Category
    image: string
    createdAt: string
    updatedAt: string
    description: string
}

export interface ProductList  {
    products: Product[]
    pagination: {
        total: number
        limit: number
        page_size: number
    }
}

export interface ProductListConfig  {
    page?: number | string
    limit?: number | string
    sort_by?: 'createdAt' | 'price' | 'rating' | 'sold' | 'view'
    name: string
    order:'asc' | 'desc'
    exclude?: string
    rating_filter?: number | string
    price_min?: number
    price_max?: number
    category?: string
}