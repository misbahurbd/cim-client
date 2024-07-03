import SellForm from '@/components/form/sell-form'
import Loading from '@/components/loading'
import ProductCard from '@/components/product-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IProduct } from '@/interface'
import { selectCurrentUser } from '@/redux/features/auth/auth-slice'
import { useGetProductQuery, useGetRelatedProductQuery } from '@/redux/features/product/productApi'
import { useAppSelector } from '@/redux/hooks'
import { PackageOpen, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

const SingleProduct = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { productId } = useParams()
  const { data: product, isLoading } = useGetProductQuery({ productId })
  const { data: relatedProducts, isLoading: isRelatedLoading } = useGetRelatedProductQuery({
    productId,
  })
  const currentUser = useAppSelector(selectCurrentUser)

  if (isLoading || isRelatedLoading) {
    return <Loading />
  }

  if (!product) {
    return (
      <Navigate
        to='/shop'
        replace
      />
    )
  }

  return (
    <section className='flex flex-col gap-3'>
      <div className='flex flex-col md:flex-row gap-8 items-center'>
        <div className='w-full md:w-1/2 lg:w-2/5 border rounded-md'>
          <img
            className='w-full max-md:max-h-56 sm:aspect-[4/3] object-contain object-center p-2'
            src={product?.data?.image}
            alt={product?.data?.title}
          />
        </div>
        <div className='w-full md:w-1/2 lg:w-3/5'>
          <p className='text-muted-foreground text-sm'>{product?.data?.brand?.name}</p>
          <h1 className='text-xl font-bold'>{product?.data?.title}</h1>
          <ul className='space-y-1.5 text-sm text-muted-foreground my-4'>
            <li>Category: {product?.data?.category?.name}</li>
            {product?.data?.capacity && <li>Capacity: {product?.data?.capacity}</li>}
            <li>Stock: {product?.data?.quantity}</li>
            <li>
              Compatibility:{' '}
              {product?.data?.compatibility.map((item: string) => (
                <Badge
                  className='mr-1.5 capitalize'
                  variant='secondary'
                  key={item}>
                  {item}
                </Badge>
              ))}
            </li>
            <li>
              Interface:{' '}
              {product?.data?.interface.map((item: string) => (
                <Badge
                  className='mr-1.5 capitalize'
                  variant='secondary'
                  key={item}>
                  {item}
                </Badge>
              ))}
            </li>
          </ul>
          <p className='font-bold text-xl text-amber-500 mb-4'>
            {product?.data?.price.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
          <Dialog
            open={isOpen}
            onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
              <Button className='bg-teal-600 text-white mt-auto'>
                <ShoppingCart className='w-4 h-4 mr-2' />
                Buy now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buy product</DialogTitle>
              </DialogHeader>
              <SellForm
                product={product.data}
                btnLabel={'Buy'}
                customerName={currentUser?.name}
                customerEmail={currentUser?.email}
                onClose={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <h3 className='text-lg font-semibold'>Related Product</h3>
        {relatedProducts?.data?.length === 0 && (
          <div className='flex flex-col items-center justify-center py-10'>
            <PackageOpen className='w-10 h-10 text-muted-foreground' />
            <p className='text-muted-foreground'>No related product found</p>
          </div>
        )}
        {relatedProducts?.data?.length !== 0 && (
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
            {relatedProducts?.data?.map((product: IProduct) => (
              <ProductCard
                product={product}
                key={product._id}
                allowBuy={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default SingleProduct
