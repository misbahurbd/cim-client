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
import { IRequest } from '@/interface'
import { cn } from '@/lib/utils'
import { selectCurrentUser } from '@/redux/features/auth/auth-slice'
import { useGetBuyerRequestsQuery } from '@/redux/features/request/requestApi'
import { useAppSelector } from '@/redux/hooks'
import { format } from 'date-fns'
import { PlusIcon } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

const BuyerRequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentUser = useAppSelector(selectCurrentUser)
  const { data: requestsData, isLoading } = useGetBuyerRequestsQuery({
    userId: currentUser?.id,
    query: Object.fromEntries([...searchParams]),
  })

  if (isLoading) {
    return <Loading />
  }

  // prepare pagination
  const totalPage = Math.ceil(requestsData?.meta?.totalRequest / requestsData?.meta?.limit) || 0
  const page = requestsData?.meta?.page || 1

  return (
    <section className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Requests</h1>
        <div className='flex items-center gap-2'>
          <Link to={'/requests/add'}>
            <Button
              type='button'
              variant='ghost'>
              <PlusIcon className='w-4 h-4 mr-2' /> Add request
            </Button>
          </Link>
        </div>
      </div>
      <div className='border rounded-md'>
        <Table>
          <TableHeader className='max-lg:hidden'>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Last update</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='max-lg:grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3'>
            {requestsData?.data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className='h-20 text-center'>
                  No service found
                </TableCell>
              </TableRow>
            )}
            {requestsData?.data?.map((request: IRequest) => (
              <TableRow
                key={request?._id}
                className='max-lg:flex max-lg:flex-col max-lg:p-4 max-lg:border-r'>
                <TableCell className='py-2'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Date:</span>
                  {format(request?.createdAt, 'PP')}
                </TableCell>
                <TableCell className='py-2'>
                  <span className='text-muted-foreground lg:hidden mr-2 '>Title:</span>
                  <span className='font-semibold'>{request?.title}</span>
                </TableCell>
                <TableCell className='py-2'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Update:</span>
                  {format(request?.updatedAt, 'PP')}
                </TableCell>
                <TableCell className='py-2'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Provider:</span>
                  {request?.provider?.name || 'N/A'}
                </TableCell>
                <TableCell className='py-2'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Schedule:</span>
                  {request?.schedule ? format(request?.schedule, 'PP') : 'N/A'}
                </TableCell>
                <TableCell className='py-2 capitalize'>
                  <span className='text-muted-foreground  lg:hidden mr-2'>Status:</span>
                  <Badge
                    className={cn(
                      request.status === 'pending' ? 'bg-destructive' : 'bg-green-700',
                    )}>
                    {request?.status}
                  </Badge>
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
                    Total request: {requestsData?.meta?.totalRequest || 0}
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
                              page: (Number(requestsData?.meta?.page) - 1).toString(),
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
                              page: (Number(requestsData?.meta?.page) + 1).toString(),
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

export default BuyerRequestsPage
