/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface FormTextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'form'> {
  label?: string
  name: string
  form: UseFormReturn<any>
  placeholder?: string
  disabled: boolean
  required?: boolean
  className?: string
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
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
            <Textarea
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

export default FormTextArea
