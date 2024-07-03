import { IProduct } from '@/interface'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import SellForm from '@/components/form/sell-form'
import { useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { selectCurrentUser } from '@/redux/features/auth/auth-slice'
import { Link } from 'react-router-dom'

interface ProductCardProps {
  product: IProduct
  allowBuy?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ product, allowBuy = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const currentUser = useAppSelector(selectCurrentUser)

  return (
    <div
      key={product._id}
      className='border rounded-md flex flex-col bg-white'>
      <Link
        to={`/shop/${product._id}`}
        className='block w-full group/img'>
        <img
          src={product.image}
          alt={product.title}
          className='w-full group-hover/img:opacity-80 transition aspect-[16/9] sm:aspect-[16/12] p-3 object-contain object-center border-b rounded-md'
        />
      </Link>
      <div className='p-3 flex flex-col grow gap-1'>
        <p className='text-amber-600 font-bold'>
          {product?.price.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </p>
        <Link
          className='group/title'
          to={`/shop/${product._id}`}>
          <h2 className=' md:text-lg font-semibold transition group-hover/title:text-teal-600'>
            {product.title}
          </h2>
        </Link>
        <div className='flex flex-wrap gap-x-5 items-center mb-3'>
          <p className='text-sm'>
            <span className='text-muted-foreground'>Brand:</span> {product.brand.name}
          </p>
          <p className='text-sm'>
            <span className='text-muted-foreground'>Category:</span> {product.category.name}
          </p>
        </div>
        {allowBuy && (
          <Dialog
            open={isOpen}
            onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
              <Button className='w-full bg-teal-600 text-white mt-auto'>
                <ShoppingCart className='w-4 h-4 mr-2' />
                Buy now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buy product</DialogTitle>
              </DialogHeader>
              <SellForm
                product={product}
                btnLabel={'Buy'}
                customerName={currentUser?.name}
                customerEmail={currentUser?.email}
                onClose={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default ProductCard
