import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IOrder } from '@/interface'
import { selectCurrentUser } from '@/redux/features/auth/auth-slice'
import { useSellerOrderHistoryQuery } from '@/redux/features/order/orderApi'
import { useAppSelector } from '@/redux/hooks'
import { format } from 'date-fns'
import { useSearchParams } from 'react-router-dom'

const SellerOrderHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentUser = useAppSelector(selectCurrentUser)
  const { data: ordersData, isLoading } = useSellerOrderHistoryQuery({
    userId: currentUser?.id || '',
    query: Object.fromEntries([...searchParams]),
  })

  if (isLoading) {
    return <Loading />
  }

  // prepare pagination
  const totalPage = Math.ceil(ordersData?.meta?.totalOrder / ordersData?.meta?.limit) || 0
  const page = ordersData?.meta?.page || 1

  return (
    <section className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl md:text-2xl font-bold'>
          Orders
          <sup className='text-muted-foreground font-normal text-sm'>
            ({ordersData?.meta?.totalOrder})
          </sup>
        </h1>
      </div>
      <div className='border rounded-md'>
        <Table>
          <TableHeader className='max-lg:hidden'>
            <TableRow>
              <TableHead colSpan={2}>Product</TableHead>
              <TableHead>Order at</TableHead>
              <TableHead className='text-nowrap'>Customer Name</TableHead>
              <TableHead className='text-nowrap'>Email</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='max-lg:grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3'>
            {ordersData?.data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={76}
                  className='h-20 text-center'>
                  No order found
                </TableCell>
              </TableRow>
            )}
            {ordersData?.data?.map((order: IOrder) => (
              <TableRow
                key={order?._id}
                className='max-lg:flex max-lg:flex-col max-lg:p-2 max-lg:!border'>
                <TableCell className='w-[120px] max-lg:w-full'>
                  <img
                    src={order?.product?.image}
                    alt={order?.product?.title}
                    className='aspect-[12/8] object-contain'
                  />
                </TableCell>
                <TableCell className='max-lg:font-semibold'>{order?.product?.title}</TableCell>
                <TableCell className='text-nowrap py-1'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Order at:</span>
                  {format(order?.orderAt, 'PP')}
                </TableCell>
                <TableCell className='text-nowrap py-1'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Customer:</span>
                  {order?.customerName}
                </TableCell>
                <TableCell className='text-nowrap py-1'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Email:</span>
                  {order?.customerEmail}
                </TableCell>
                <TableCell className='py-1'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Quantity:</span>
                  {order?.quantity}
                </TableCell>
                <TableCell className='py-1'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Price:</span>
                  {order?.discountPrice ? (
                    <>
                      <p className='text-xs line-through text-destructive'>
                        $
                        {Number(order?.price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p>
                        $
                        {Number(order?.discountPrice).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </>
                  ) : (
                    <span>
                      $
                      {Number(order?.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </TableCell>
                <TableCell className='py-1'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Total:</span>$
                  {Number(order?.totalPrice).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={8}
                className='text-end'>
                <div className='flex gap-2 items-center justify-between'>
                  <span className='hidden md:inline mr-auto'>
                    Total orders: {ordersData?.meta?.totalOrder || 0}
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
                              page: (Number(ordersData?.meta?.page) - 1).toString(),
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
                              page: (Number(ordersData?.meta?.page) + 1).toString(),
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
    </section>
  )
}

export default SellerOrderHistory
