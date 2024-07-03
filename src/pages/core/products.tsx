/* eslint-disable @typescript-eslint/no-explicit-any */
import Fetching from '@/components/fetching'
import SellForm from '@/components/form/sell-form'
import Loading from '@/components/loading'
import MobileSidebar from '@/components/mobile-sidebar'
import ProductSearch from '@/components/product-search'
import Sidebar from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IProduct } from '@/interface'
import { selectCurrentUser } from '@/redux/features/auth/auth-slice'
import { useGetAllBrandQuery } from '@/redux/features/brand/brandApi'
import { useGetAllCategoryQuery } from '@/redux/features/category/categoryApi'
import {
  useDeleteProductMutation,
  useDeleteProductsMutation,
  useGetCurrentUserProductsQuery,
} from '@/redux/features/product/productApi'
import { useAppSelector } from '@/redux/hooks'
import { PlusIcon } from '@radix-ui/react-icons'
import { MoreVertical, ShoppingBag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const ProductsPage = () => {
  const user = useAppSelector(selectCurrentUser)

  const [searchParams, setSearchParams] = useSearchParams()
  const [selectProductIds, setSelectProductIds] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const {
    data: products,
    isLoading,
    isFetching,
  } = useGetCurrentUserProductsQuery({
    userId: user?.id,
    query: Object.fromEntries([...searchParams]),
  })
  const { data: categories, isLoading: isCatLoading } = useGetAllCategoryQuery('')
  const { data: brands, isLoading: isBrandLoading } = useGetAllBrandQuery('')

  const [deleteProduct] = useDeleteProductMutation()
  const [deleteProducts] = useDeleteProductsMutation()

  const onDeleteProduct = async (id: string) => {
    const toastId = toast.loading('Deleting product...')
    try {
      const res = await deleteProduct(id).unwrap()
      if (res.success) {
        toast.success(res.message, { id: toastId })
      }
    } catch (error: any) {
      toast.error(error?.data?.errorMessage || error?.data?.message || 'Something went wrong', {
        id: toastId,
      })
    }
  }

  const onDeleteProducts = async () => {
    const toastId = toast.loading('Deleting products...')
    try {
      const res = await deleteProducts(selectProductIds).unwrap()
      if (res.success) {
        setSelectProductIds([])
        toast.success(res.message, { id: toastId })
      }
    } catch (error: any) {
      toast.error(error?.data?.errorMessage || error?.data?.message || 'Something went wrong', {
        id: toastId,
      })
    }
  }

  if (isLoading || isCatLoading || isBrandLoading) {
    return <Loading />
  }

  // prepare pagination
  const totalPage = Math.ceil(products?.meta?.total / products?.meta?.limit) || 0
  const page = products?.meta?.page || 1

  return (
    <section className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl md:text-2xl font-bold'>
          Products
          <sup className='text-muted-foreground text-sm font-normal'>
            ({products?.meta?.total || 0})
          </sup>
        </h1>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            asChild>
            <Link to={'/products/add-product'}>
              <PlusIcon className='mr-2 w-5 h-5' />
              Add Product
            </Link>
          </Button>
          {selectProductIds.length > 0 && (
            <Button
              onClick={onDeleteProducts}
              variant='destructive'>
              <Trash2 className='mr-2 h-4 w-4' />
              Delete All
            </Button>
          )}
        </div>
      </div>

      <div className='flex gap-5 items-start'>
        {/* lest sidebar */}
        <div className='hidden lg:block lg:w-[320px]'>
          <Sidebar
            className='w-full'
            products={products}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            categories={categories}
            brands={brands}
          />
        </div>
        {/* right content */}
        <div className='flex flex-col gap-2 flex-1'>
          <div className='flex gap-2 justify-between'>
            <MobileSidebar
              products={products}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              categories={categories}
              brands={brands}
              className='lg:hidden'
            />
            <ProductSearch
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
          <div className='flex-1 border rounded-md space-y-2'>
            <Table>
              <TableHeader className='max-lg:hidden'>
                <TableRow>
                  <TableHead className='w-[30px]'>#</TableHead>
                  <TableHead className='w-[120px]'>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='max-lg:grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 relative'>
                {isFetching && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Fetching isFetching={isFetching} />
                    </TableCell>
                  </TableRow>
                )}
                {products?.data?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className='h-20 text-center'>
                      No product found
                    </TableCell>
                  </TableRow>
                )}
                {products?.data?.map((product: IProduct) => (
                  <TableRow
                    className='max-lg:flex max-lg:flex-col max-lg:!border max-lg:relative'
                    key={product?._id}>
                    <TableCell className='w-[40px] max-lg:absolute top-2 right-2'>
                      {product._id && (
                        <Checkbox
                          checked={selectProductIds.includes(product._id)}
                          onCheckedChange={() => {
                            if (selectProductIds.includes(product._id)) {
                              setSelectProductIds(
                                selectProductIds.filter((id) => id !== product._id),
                              )
                            } else {
                              setSelectProductIds([...selectProductIds, product._id])
                            }
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <img
                        src={product?.image}
                        alt={product?.title}
                        className='h-48 sm:h-52 lg:h-auto object-contain object-center w-full'
                      />
                    </TableCell>
                    <TableCell className='max-lg:font-semibold max-lg:text-lg'>
                      {product?.title}
                    </TableCell>
                    <TableCell className='py-1'>
                      <span className='text-muted-foreground mr-2 lg:hidden'>Brand:</span>
                      {product?.brand.name}
                    </TableCell>
                    <TableCell className='py-1'>
                      <span className='text-muted-foreground mr-2 lg:hidden'>Stock:</span>
                      {product?.quantity}
                    </TableCell>
                    <TableCell className='py-1'>
                      <span className='text-muted-foreground mr-2 lg:hidden'>Price:</span>$
                      {Number(product?.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className='max-lg:mt-auto'>
                      <div className='flex items-center gap-1'>
                        <Dialog
                          open={isOpen}
                          onOpenChange={(open) => setIsOpen(open)}>
                          <DialogTrigger asChild>
                            <Button
                              className='bg-amber-600 hover:bg-amber-600/90 w-full'
                              size='sm'>
                              <ShoppingBag className='w-4 h-4 mr-2' />
                              Sell
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Sell product</DialogTitle>
                            </DialogHeader>
                            <SellForm
                              product={product}
                              onClose={() => setIsOpen(false)}
                            />
                          </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className='w-full'
                              size='sm'>
                              <MoreVertical className='w-4 h-4 mr-2' />
                              Action
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              className='cursor-pointer'
                              asChild>
                              <Link
                                className='block w-full h-full'
                                to={`/products/${product._id}/create-variant`}>
                                Create Variant
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='cursor-pointer'
                              asChild>
                              <Link
                                className='block w-full h-full'
                                to={`/products/${product._id}/edit`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeleteProduct(product._id)}
                              className='cursor-pointer'>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-end'>
                    <div className='flex gap-2 items-center justify-between'>
                      <span className='hidden md:inline mr-auto'>
                        Total product: {products?.meta?.total || 0}
                      </span>
                      <span>
                        Page: {page} of {totalPage}
                      </span>
                      <ul className='flex gap-2 items-center'>
                        <li>
                          <Button
                            size='sm'
                            variant='outline'
                            disabled={page <= 1}
                            onClick={() =>
                              setSearchParams((prev) => {
                                const prevSearch = Object.fromEntries([...prev])
                                return {
                                  ...prevSearch,
                                  page: (Number(products?.meta?.page) - 1).toString(),
                                }
                              })
                            }>
                            Prev
                          </Button>
                        </li>
                        <li>
                          <Button
                            size='sm'
                            variant='outline'
                            disabled={totalPage === 0 || page >= totalPage}
                            onClick={() =>
                              setSearchParams((prev) => {
                                const prevSearch = Object.fromEntries([...prev])
                                return {
                                  ...prevSearch,
                                  page: (Number(products?.meta?.page) + 1).toString(),
                                }
                              })
                            }>
                            Next
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductsPage
