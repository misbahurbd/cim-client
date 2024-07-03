/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusIcon } from 'lucide-react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { couponFormSchema } from '@/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppSelector } from '@/redux/hooks'
import { selectCurrentUser } from '@/redux/features/auth/auth-slice'
import { Form } from '@/components/ui/form'
import FormInput from '@/components/form/ui/form-input'
import FormSelect from '@/components/form/ui/form-select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DISCOUNT_TYPE } from '@/constants'
import FormDiscountInput from '@/components/form/ui/form-discount-input'
import { Label } from '@/components/ui/label'
import { useAddCouponMutation } from '@/redux/features/coupon/couponApi'
import { toast } from 'sonner'
import { useState } from 'react'

const AddCoupon = () => {
  const currentUser = useAppSelector(selectCurrentUser)
  const [addCoupon, { isLoading }] = useAddCouponMutation()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: '',
      seller: currentUser?.id || '',
      discountType: '',
      discount: '',
      quantity: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof couponFormSchema>) => {
    const data = { ...values, discount: Number(values.discount), quantity: Number(values.quantity) }
    try {
      const res = await addCoupon(data).unwrap()
      if (res.success) {
        form.reset()
        toast.success(res.message)
        setIsOpen(false)
      }
    } catch (error: any) {
      toast.error(error?.data?.errorMessage || error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button variant='ghost'>
          <PlusIcon className='w-4 h-4 mr-2' />
          Add coupon
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold leading-none tracking-tight mb-4 !text-start'>
            Add new coupon
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col items-start sm:grid sm:grid-cols-3 gap-1 sm:gap-x-2 sm:items-center'>
            <Label
              htmlFor='code'
              className='text-end mt-1.5 sm:mt-0'>
              Coupon code
            </Label>
            <FormInput
              form={form}
              name='code'
              id='code'
              placeholder='Coupon code'
              className='sm:col-span-2'
              disabled={isLoading}
            />
            <Label
              htmlFor='quantity'
              className='text-end mt-1.5 sm:mt-0'>
              Quantity
            </Label>
            <FormInput
              form={form}
              id='quantity'
              name='quantity'
              className='sm:col-span-2'
              placeholder='Number of coupon'
              disabled={isLoading}
            />
            <Label
              htmlFor='type'
              className='text-end mt-1.5 sm:mt-0'>
              Discount type
            </Label>
            <FormSelect
              form={form}
              id='type'
              data={Object.values(DISCOUNT_TYPE).map((type) => ({ label: type, key: type }))}
              name='discountType'
              placeholder='Select discount type'
              className='sm:col-span-2'
              disabled={isLoading}
            />
            <Label
              htmlFor='type'
              className='text-end mt-1.5 sm:mt-0'>
              Discount
            </Label>
            <FormDiscountInput
              form={form}
              id='discount'
              name='discount'
              placeholder='Amount'
              className='sm:col-span-2'
              disabled={isLoading}
            />
            <FormInput
              form={form}
              name='seller'
              className='sr-only hidden grid-rows-subgrid'
              disabled={isLoading}
            />
            <DialogFooter className='mt-8 self-stretch sm:flex sm:col-span-3 sm:justify-end'>
              <Button type='submit'>Add coupon</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCoupon
