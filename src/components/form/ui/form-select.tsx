/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface DataItem {
  label: string
  key: string
}

interface FormSelectProps {
  name: string
  label?: string
  id?: string
  form: UseFormReturn<any>
  placeholder: string
  data: DataItem[]
  type?: string
  disabled: boolean
  className?: string
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  form,
  id,
  placeholder,
  data,
  disabled,
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full space-y-1', className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}>
              <SelectTrigger id={id}>
                <SelectValue
                  className='capitalize'
                  placeholder={placeholder}
                />
              </SelectTrigger>
              <SelectContent>
                {data.map((item) => (
                  <SelectItem
                    key={item.key}
                    value={item.key}>
                    {item.label.toLocaleUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormSelect
