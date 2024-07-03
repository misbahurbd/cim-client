import ClientPagination from '@/components/client-pagination'
import Fetching from '@/components/fetching'
import Loading from '@/components/loading'
import MobileSidebar from '@/components/mobile-sidebar'
import ProductCard from '@/components/product-card'
import ProductSearch from '@/components/product-search'
import Sidebar from '@/components/sidebar'
import { IProduct } from '@/interface'
import { useGetAllBrandQuery } from '@/redux/features/brand/brandApi'
import { useGetAllCategoryQuery } from '@/redux/features/category/categoryApi'
import { useGetProductsQuery } from '@/redux/features/product/productApi'
import { PackageOpen } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    data: products,
    isLoading,
    isFetching,
  } = useGetProductsQuery({ query: Object.fromEntries([...searchParams]) })
  const { data: categories, isLoading: isCategoryLoading } = useGetAllCategoryQuery('')
  const { data: brands, isLoading: isBrandLoading } = useGetAllBrandQuery('')

  if (isLoading || isCategoryLoading || isBrandLoading) {
    return <Loading />
  }

  // prepare pagination
  const totalPage = Math.ceil(products?.meta?.total / products?.meta?.limit) || 0
  const page = products?.meta?.page || 1

  return (
    <section className='space-y-5'>
      <div className='flex items-center gap-5 justify-between'>
        <h1 className='text-xl md:text-2xl font-bold'>Shop</h1>

        <div className='flex items-center gap-2 '>
          <MobileSidebar
            brands={brands}
            categories={categories}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            products={products}
            className='lg:hidden mr-auto'
          />
          <ProductSearch
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
      </div>
      <div className='flex gap-5 items-start'>
        {/* sidebar */}
        <aside className='hidden lg:block lg:w-[320px]'>
          <Sidebar
            className='w-full'
            products={products}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            categories={categories}
            brands={brands}
          />
        </aside>
        {/* main content */}
        <section className='flex-1 space-y-3 relative'>
          <Fetching isFetching={isFetching} />
          <div className='flex-1 relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3'>
            {!products ||
              (products?.data?.length === 0 && (
                <div className='col-span-3 min-h-96 flex flex-col gap-4 items-center justify-center'>
                  <PackageOpen className='w-20 h-20 text-muted-foreground' />
                  <p className='text-lg text-muted-foreground'>No product found</p>
                </div>
              ))}
            {products?.data?.map((product: IProduct) => (
              <ProductCard
                product={product}
                key={product._id}
              />
            ))}
          </div>
          <ClientPagination
            currentPage={page}
            totalPages={totalPage}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </section>
      </div>
    </section>
  )
}

export default ShopPage
