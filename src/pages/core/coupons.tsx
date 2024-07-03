import AddCoupon from '@/components/add-coupon'
import Fetching from '@/components/fetching'
import Loading from '@/components/loading'
import { Badge } from '@/components/ui/badge'
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
import { ICoupon } from '@/interface'
import { selectCurrentUser } from '@/redux/features/auth/auth-slice'
import { useGetCouponsQuery } from '@/redux/features/coupon/couponApi'
import { useAppSelector } from '@/redux/hooks'
import { format } from 'date-fns'
import { CheckCircle, Copy } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const CouponsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [copiedCouponIds, setCopiedCouponIds] = useState<string | null>(null)
  const currentUser = useAppSelector(selectCurrentUser)
  const {
    data: coupons,
    isLoading,
    isFetching,
  } = useGetCouponsQuery({
    userId: currentUser?.id || '',
    query: Object.fromEntries([...searchParams]),
  })

  if (isLoading) {
    return <Loading />
  }

  async function copyToClipboard(coupon: ICoupon) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(coupon.code).then(() => {
        setCopiedCouponIds(coupon._id)
        setTimeout(() => {
          setCopiedCouponIds(null)
        }, 1000)
      })
    }
  }

  // prepare pagination
  const totalPage = Math.ceil(coupons?.meta?.total / coupons?.meta?.limit) || 0
  const page = coupons?.meta?.page || 1

  return (
    <section className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl md:text-2xl font-bold'>
          Coupons
          <sup className='text-muted-foreground text-sm font-normal'>
            ({coupons?.meta?.total || 0})
          </sup>
        </h1>
        <div className='flex items-center gap-2'>
          <AddCoupon />
        </div>
      </div>
      <div className='flex-1 md:border rounded-md'>
        <Table>
          <TableHeader className='max-md:hidden'>
            <TableRow>
              <TableHead>Coupon code</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Total used</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='relative max-md:gap-3 max-md:mb-3 max-md:border-none max-md:grid max-sm:grid-cols-2 max-[500px]:grid-cols-1 max-md:grid-cols-3'>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={10}>
                  <Fetching isFetching={isFetching} />
                </TableCell>
              </TableRow>
            )}
            {coupons?.data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className='h-20 text-center'>
                  No coupon found
                </TableCell>
              </TableRow>
            )}
            {coupons?.data?.map((coupon: ICoupon) => (
              <TableRow
                key={coupon?._id}
                className='max-md:flex max-md:flex-col !border rounded-md'>
                <TableCell className='max-md:flex'>
                  <Badge className='text-lg max-md:w-full max-md:flex max-md:items-center max-md:justify-center max-md:text-2xl relative bg-emerald-200 border-dashed border-emerald-500 text-foreground hover:bg-emerald-200 cursor-default'>
                    {coupon.code}
                    {copiedCouponIds !== coupon._id ? (
                      <Copy
                        onClick={() => copyToClipboard(coupon)}
                        className='ml-3 cursor-pointer w-4 h-4'
                      />
                    ) : (
                      <CheckCircle className='ml-3 cursor-pointer w-4 h-4' />
                    )}
                  </Badge>
                </TableCell>
                <TableCell className='max-md:flex max-md:gap-x-2'>
                  <span className='text-muted-foreground hidden max-md:inline'>Value:</span>
                  <Badge>
                    {coupon?.discountType === 'percentage' ? (
                      <span className='mr-1'>{coupon?.discount}%</span>
                    ) : (
                      <span className='mr-1'>${coupon?.discount}</span>
                    )}
                    off
                  </Badge>
                </TableCell>
                <TableCell className='max-md:flex max-md:gap-x-2'>
                  <span className='text-muted-foreground hidden max-md:inline'>Created at:</span>
                  {format(coupon?.createdAt, 'do MMM yyyy')}
                </TableCell>
                <TableCell className='max-md:flex max-md:gap-x-2'>
                  <span className='text-muted-foreground hidden max-md:inline'>Total used:</span>
                  {coupon?.totalUsed}
                </TableCell>
                <TableCell className='max-md:flex max-md:gap-x-2'>
                  <span className='text-muted-foreground hidden max-md:inline'>Available:</span>
                  {coupon?.quantity}
                </TableCell>
                <TableCell className='max-md:flex max-md:gap-x-2'>
                  <span className='text-muted-foreground hidden max-md:inline'>Status:</span>
                  {coupon?.quantity > 0 ? (
                    <Badge className='bg-green-600'>Active</Badge>
                  ) : (
                    <Badge variant='destructive'>Expired</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className='max-md:border'>
            <TableRow>
              <TableCell
                colSpan={7}
                className='text-end'>
                <div className='flex gap-2 items-center justify-between'>
                  <span className='hidden md:inline mr-auto'>
                    Total coupon: {coupons?.meta?.total || 0}
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
                              page: (Number(coupons?.meta?.page) - 1).toString(),
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
                              page: (Number(coupons?.meta?.page) + 1).toString(),
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

export default CouponsPage
