/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { UseFormReturn } from 'react-hook-form'

interface FormDatePickerProps {
  label: string
  name: string
  form: UseFormReturn<any>
  disabled?: boolean
  className?: string
  onFuture?: boolean
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  name,
  form,
  disabled,
  className,
  onFuture = false,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full space-y-1', className)}>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger
              asChild
              disabled={disabled}>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}>
                  {field.value ? format(field.value, 'PP') : <span>Pick a date</span>}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0'
              align='start'>
              <Calendar
                mode='single'
                selected={field.value}
                onSelect={field.onChange}
                disabled={
                  onFuture
                    ? (date) => date < new Date() || date > new Date('2030-12-30')
                    : (date) => date > new Date() || date < new Date('1991-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormDatePicker
