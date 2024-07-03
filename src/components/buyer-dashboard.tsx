import {
  useGetProductsQuery,
  useGetTopSellingProductQuery,
} from '@/redux/features/product/productApi'
import Loading from '@/components/loading'
import { IProduct } from '@/interface'
import ProductCard from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const BuyerDashboard = () => {
  const { data: topSellingProducts, isLoading: isTopSellingProductLoading } =
    useGetTopSellingProductQuery('')
  const { data: products, isLoading: isProductsLoading } = useGetProductsQuery('')

  if (isTopSellingProductLoading || isProductsLoading) return <Loading />

  return (
    <section className='space-y-5'>
      <h3 className='font-semibold text-lg md:text-xl mt-3'>Top selling products</h3>
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {topSellingProducts?.data?.map((product: IProduct) => (
          <ProductCard
            product={product}
            key={product._id + 'top'}
            allowBuy={false}
          />
        ))}
      </div>
      <h3 className='font-semibold text-lg md:text-xl mt-3'>Latest products</h3>
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {products?.data?.map((product: IProduct) => (
          <ProductCard
            product={product}
            key={product._id}
          />
        ))}
      </div>
      <div className='flex items-center justify-center'>
        <Link
          to={'/shop'}
          className='cursor-pointer'>
          <Button>View all products</Button>
        </Link>
      </div>
    </section>
  )
}

export default BuyerDashboard
