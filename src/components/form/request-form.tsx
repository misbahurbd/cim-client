/* eslint-disable @typescript-eslint/no-explicit-any */
import { addRequestSchema } from '@/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import FormInput from '@/components/form/ui/form-input'
import FormTextArea from '@/components/form/ui/form-text-area'
import FormDatePicker from '@/components/form/ui/form-date-picker'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/redux/hooks'
import { selectCurrentToken } from '@/redux/features/auth/auth-slice'
import { Navigate, useNavigate } from 'react-router-dom'
import { JwtPayload } from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'
import { useAddRequestMutation } from '@/redux/features/request/requestApi'
import { toast } from 'sonner'

const RequestForm = () => {
  const token = useAppSelector(selectCurrentToken)
  const [addRequest, { isLoading }] = useAddRequestMutation()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof addRequestSchema>>({
    resolver: zodResolver(addRequestSchema),
    defaultValues: {
      title: '',
      brand: '',
      model: '',
      serialNumber: '',
      issueDetails: '',
      preferredSchedule: new Date(),
    },
  })

  if (!token) {
    return <Navigate to='/login' />
  }
  const user = jwtDecode(token) as JwtPayload

  const onSubmit = async (values: z.infer<typeof addRequestSchema>) => {
    const toastId = toast.loading('Adding request...')

    try {
      const res = await addRequest({ ...values, requestFrom: user.id }).unwrap()
      if (res.success) {
        toast.success('Request added successfully', { id: toastId })
        navigate('/requests', { replace: true })
      }
    } catch (error: any) {
      toast.error(error?.data?.errorMessage || error?.data?.message || 'Something went wrong', {
        id: toastId,
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <FormInput
          form={form}
          name='title'
          label='Title'
          className='sm:col-span-2'
          placeholder='Request title'
          disabled={isLoading}
          required
        />
        <FormInput
          form={form}
          name='brand'
          label='Brand'
          placeholder='Product brand'
          disabled={isLoading}
          required
        />
        <FormInput
          form={form}
          name='model'
          label='Model'
          placeholder='Product model'
          disabled={isLoading}
          required
        />
        <FormInput
          form={form}
          name='serialNumber'
          label='Serial number'
          placeholder='Product serial number'
          disabled={isLoading}
        />
        <FormDatePicker
          form={form}
          name='preferredSchedule'
          label='Preferred schedule'
          onFuture={true}
          disabled={isLoading}
        />
        <FormTextArea
          form={form}
          name='issueDetails'
          label='Request details'
          className='sm:col-span-2'
          placeholder='Explain your issue in detail.'
          disabled={isLoading}
          required
        />
        <div className='sm:col-span-2 flex flex-col sm:items-end'>
          <Button>Add Request</Button>
        </div>
      </form>
    </Form>
  )
}

export default RequestForm
