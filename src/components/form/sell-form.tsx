/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import FormInput from '@/components/form/ui/form-input'
import FormDatePicker from '@/components/form/ui/form-date-picker'
import { toast } from 'sonner'
import { useCreateOrderMutation } from '@/redux/features/order/orderApi'
import { IProduct, IValidateCoupon } from '@/interface'
import { sellFormSchema } from '@/validation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRef, useState } from 'react'
import { useValidateCouponMutation } from '@/redux/features/coupon/couponApi'
import { XIcon } from 'lucide-react'

interface SellFormProps {
  product: IProduct
  customerName?: string
  customerEmail?: string
  btnLabel?: string
  onClose: () => void
}

const SellForm: React.FC<SellFormProps> = ({
  product,
  customerName,
  customerEmail,
  btnLabel,
  onClose,
}) => {
  const [sellProduct, { isLoading }] = useCreateOrderMutation()
  const couponInput = useRef<HTMLInputElement>(null)
  const [discountData, setDiscountData] = useState<null | IValidateCoupon>(null)
  const [validateCoupon, { isLoading: isValidationLoading }] = useValidateCouponMutation()

  const form = useForm<z.infer<typeof sellFormSchema>>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      product: product._id,
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      seller: product?.createdBy?._id,
      quantity: '1',
      price: product?.price.toString(),
      orderAt: new Date(),
    },
  })
  const handleDeleteCoupon = () => {
    setDiscountData(null)
    form.setValue('discountPrice', undefined)
    form.setValue('coupon', undefined)
  }

  const onSubmit = async (value: z.infer<typeof sellFormSchema>) => {
    const toastId = toast.loading('Selling product...')

    try {
      await sellProduct({
        ...value,
        quantity: Number(value.quantity),
        price: Number(value.price),
      }).unwrap()
      form.reset()
      handleDeleteCoupon()
      onClose()
      toast.success('Product sold successfully!', { id: toastId })
    } catch (error: any) {
      toast.error(error?.data?.errorMessage || 'Something went wrong', { id: toastId })
    }
  }

  const applyCoupon = async (code: string | undefined, productId: string) => {
    if (code && productId) {
      try {
        const res = await validateCoupon({ code, productId }).unwrap()
        if (res.success) {
          setDiscountData(res.data)
          form.setValue('discountPrice', res?.data?.discountPrice)
          form.setValue('coupon', res?.data?.coupon)
          toast.success('Coupon applied successfully!')
        } else if (!res.success) {
          toast.error(res.error)
        }
      } catch (error: any) {
        toast.error(error?.data?.errorMessage || error?.data?.message || 'Something went wrong')
      }
    }
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-2'
        onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex items-center gap-3'>
          <img
            src={product.image}
            alt={product.title}
            className='block p-2 max-h-28 aspect-square object-contain object-center border rounded-md'
          />
          <div>
            <p className='font-bold'>{product.title}</p>
            <p className='text-sm'>Quantity: {product.quantity}</p>
            {discountData?.discountPrice ? (
              <div>
                <p className='text-md font-bold'>
                  $
                  {discountData.discountPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <sup className='ml-2 text-destructive line-through'>
                    $
                    {product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </sup>
                </p>
              </div>
            ) : (
              <p className='text-md font-bold'>
                $
                {product.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>
        </div>
        <FormInput
          name='product'
          form={form}
          className='sr-only'
          disabled={isLoading}
        />
        <FormInput
          name='seller'
          form={form}
          className='sr-only'
          disabled={isLoading}
        />
        <FormInput
          name='customerName'
          label='Name'
          placeholder='Customer name'
          form={form}
          disabled={isLoading}
        />
        <FormInput
          name='customerEmail'
          label='Email'
          placeholder='Customer email'
          type='email'
          form={form}
          disabled={isLoading}
        />
        <div className='flex flex-col sm:flex-row gap-3'>
          <FormInput
            name='quantity'
            label='Quantity'
            placeholder='Quantity'
            type='number'
            className='appearance-none'
            form={form}
            disabled={isLoading}
            onBlur={() => {
              const quantity = form.watch('quantity')
              if (Number(product.quantity) < Number(quantity)) {
                form.setValue('quantity', product.quantity.toString())
                form.setError('quantity', {
                  message: `Only ${product.quantity} product are available`,
                })
              } else {
                form.clearErrors()
              }
            }}
          />
          <FormDatePicker
            name='orderAt'
            label='Date of sell'
            form={form}
          />
        </div>
        <div className='space-y-1 mb-2'>
          <Label
            htmlFor='coupon'
            className='font-semibold'>
            Coupon
          </Label>
          {discountData && discountData.coupon ? (
            <div className='flex justify-between gap-3 items-center'>
              <p className='text-muted-foreground'>{discountData.coupon} is applied</p>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => handleDeleteCoupon()}>
                <XIcon className='w-4 h-4' />
              </Button>
            </div>
          ) : (
            <div className='flex gap-3'>
              <Input
                id='coupon'
                ref={couponInput}
                placeholder='Coupon'
                disabled={isValidationLoading}
              />
              <Button
                onClick={() => applyCoupon(couponInput?.current?.value, product._id)}
                type='button'>
                Apply
              </Button>
            </div>
          )}
        </div>
        <Button
          type='submit'
          disabled={isLoading}>
          {btnLabel ? btnLabel : 'Sell Product'}
        </Button>
      </form>
    </Form>
  )
}

export default SellForm
