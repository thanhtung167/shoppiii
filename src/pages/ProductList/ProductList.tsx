import AsideFilter from './AsideFilter'
import SortProductList from './SortProductList'
import Product from './Product'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import productApi from '../../apis/product.api.ts'
import Paginate from '../../components/Paginate'
import { ProductListConfig } from '../../types/product.type.ts'
import categoriesApi from '../../apis/category.apis.ts'
import Loading from "../Loading";
import useQueryConfig from '../../../hooks/useQueryConfig.tsx'


export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data,isLoading } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    placeholderData: keepPreviousData
  })

  const { data: CategoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getListCategories(),
    placeholderData: keepPreviousData
  })
  if(isLoading) return <Loading/>
  return (
    <div className={'bg-gray-100 py-6'}>
      <div className='container'>
        {data && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter categories={CategoriesData?.data.data} queryConfig={queryConfig}></AsideFilter>
            </div>
            <div className='col-span-9'>
              <SortProductList
                queryConfig={queryConfig}
                pageSize={data?.data?.data?.pagination?.page_size}
              ></SortProductList>
              <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                {data &&
                  data.data?.data?.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product}></Product>
                    </div>
                  ))}
              </div>
              <Paginate queryConfig={queryConfig} pageSize={data?.data?.data?.pagination?.page_size ?? 20} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
