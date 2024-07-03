/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { DollarSign, Percent } from 'lucide-react'
import { InputHTMLAttributes } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface FormDiscountInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'form'> {
  label?: string
  name: string
  form: UseFormReturn<any>
  placeholder?: string
  disabled: boolean
  required?: boolean
  className?: string
}

const FormDiscountInput: React.FC<FormDiscountInputProps> = ({
  label,
  name,
  form,
  placeholder,
  disabled,
  required,
  className,
  ...props
}) => {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className={cn('space-y-1 w-full', className)}>
          <FormLabel>
            {label}
            {required && <span className='text-destructive ml-0.5'>*</span>}
          </FormLabel>
          <FormControl>
            <div className='relative'>
              <Input
                placeholder={placeholder}
                disabled={disabled || !form.watch('discountType')}
                className='pr-10'
                {...field}
                {...props}
              />
              {form.watch('discountType') && (
                <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                  {form.watch('discountType') === 'percentage' ? (
                    <Percent className='w-4 h-4' />
                  ) : (
                    <DollarSign className='w-4 h-4' />
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  )
}

export default FormDiscountInput
