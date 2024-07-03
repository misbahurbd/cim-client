/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { InputHTMLAttributes } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'form'> {
  label?: string
  name: string
  form: UseFormReturn<any>
  placeholder?: string
  disabled: boolean
  required?: boolean
  className?: string
}

const FormInput: React.FC<FormInputProps> = ({
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
            <Input
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              {...props}
            />
          </FormControl>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  )
}

export default FormInput
