import useQueryParams from './useQueryParams'
import  omitBy  from 'lodash/omitBy'
import  isUndefined  from 'lodash/isUndefined'
import { ProductListConfig } from '../src/types/product.type'
export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function useQueryConfig() {
  // @ts-ignore
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page ?? '1',
      limit: queryParams.limit,
      order: queryParams.order,
      name: queryParams.name,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      sort_by: queryParams.sort_by,
      category: queryParams.category
    },
    isUndefined
  ) as QueryConfig
  return queryConfig
}