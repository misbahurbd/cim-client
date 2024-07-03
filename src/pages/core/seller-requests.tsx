/* eslint-disable @typescript-eslint/no-explicit-any */
import FormDatePicker from '@/components/form/ui/form-date-picker'
import Loading from '@/components/loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import {
  useGetPendingRequestsQuery,
  useUpdateRequestMutation,
} from '@/redux/features/request/requestApi'
import { useAppSelector } from '@/redux/hooks'
import { updateRequestSchema } from '@/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const SellerRequestsPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const reqId = useRef<HTMLInputElement | null>(null)
  const proId = useRef<HTMLInputElement | null>(null)

  const currentUser = useAppSelector(selectCurrentUser)
  const { data: requestsData, isLoading: isDataLoading } = useGetPendingRequestsQuery({
    userId: currentUser?.id,
    query: Object.fromEntries([...searchParams]),
  })
  const [updateRequest, { isLoading }] = useUpdateRequestMutation()

  const form = useForm<z.infer<typeof updateRequestSchema>>({
    resolver: zodResolver(updateRequestSchema),
  })

  const onSubmit = async (values: z.infer<typeof updateRequestSchema>) => {
    const toastId = toast.loading('Updating request...')
    try {
      const res = await updateRequest({
        ...values,
        provider: proId?.current?.value,
        requestId: reqId?.current?.value,
      }).unwrap()
      if (res.success) {
        toast.success('Request updated successfully', { id: toastId })
        setIsOpen(false)
      }
    } catch (error: any) {
      toast.error(error?.data?.errorMessage || error?.data?.message || 'Something went wrong', {
        id: toastId,
      })
    }
  }

  if (isDataLoading) {
    return <Loading />
  }

  // prepare pagination
  const totalPage = Math.ceil(requestsData?.meta?.totalRequest / requestsData?.meta?.limit) || 0
  const page = requestsData?.meta?.page || 1

  return (
    <section className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Pending requests</h1>
      </div>
      <div className='border rounded-md'>
        <Table>
          <TableHeader className='max-lg:hidden'>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Customer name</TableHead>
              <TableHead>Preferred schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='max-lg:grid max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3'>
            {requestsData?.data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className='h-20 text-center'>
                  No pending request found
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
                  <span className='text-muted-foreground lg:hidden mr-2'>Customer:</span>
                  {request?.requestFrom?.name || 'N/A'}
                </TableCell>
                <TableCell className='py-2'>
                  <span className='text-muted-foreground lg:hidden mr-2'>Preferred schedule:</span>
                  {request?.preferredSchedule ? format(request?.preferredSchedule, 'PP') : 'N/A'}
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
                <TableCell className='py-2 capitalize w-20'>
                  <Dialog
                    open={isOpen}
                    onOpenChange={(open) => setIsOpen(open)}>
                    <DialogTrigger asChild>
                      <Button size='sm'>View Request</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{request.title}</DialogTitle>
                      </DialogHeader>
                      <div className='flex flex-col gap-4'>
                        <div className='grid grid-cols-2 gap-x-2 gap-y-1 text-sm'>
                          <p>
                            Brand: <span className='text-muted-foreground'>{request.brand}</span>
                          </p>
                          <p>
                            Model: <span className='text-muted-foreground'>{request.model}</span>
                          </p>
                          {request.serialNumber && (
                            <p>
                              Serial number:{' '}
                              <span className='text-muted-foreground'>{request.serialNumber}</span>
                            </p>
                          )}

                          <p>
                            Preferred schedule:{' '}
                            <span className='text-muted-foreground'>
                              {format(request.preferredSchedule, 'PP')}
                            </span>
                          </p>
                        </div>
                        <div className='text-sm'>
                          <p>Details:</p>
                          <p className='text-muted-foreground'>{request.issueDetails}</p>
                        </div>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex flex-col gap-3'>
                            <Input
                              name='requestId'
                              ref={reqId}
                              className='sr-only'
                              defaultValue={request._id}
                            />
                            <Input
                              name='provider'
                              ref={proId}
                              className='sr-only'
                              defaultValue={currentUser?.id}
                            />

                            <FormDatePicker
                              form={form}
                              name='schedule'
                              label='Schedule'
                              onFuture={true}
                            />
                            <Button disabled={isLoading}>Book schedule</Button>
                          </form>
                        </Form>
                      </div>
                    </DialogContent>
                  </Dialog>
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

export default SellerRequestsPage
