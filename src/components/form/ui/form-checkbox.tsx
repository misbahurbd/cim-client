/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface DataItem {
  label: string
  key: string
}

interface FormCheckboxProps {
  name: string
  label?: string
  form: UseFormReturn<any>
  data: DataItem[]
  type?: string
  disabled?: boolean
  className?: string
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  className,
  form,
  data,
  disabled,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className='w-full flex flex-col gap-1'>
          {label && <FormLabel>{label}</FormLabel>}
          <div className={cn('flex gap-3 grow items-center', className)}>
            {data.map((item) => (
              <FormField
                key={item.key}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className='flex w-max items-center font-normal gap-1 space-x-0 space-y-0'>
                    <FormControl>
                      <Checkbox
                        disabled={disabled}
                        checked={field.value?.includes(item.key)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.key])
                            : field.onChange(
                                field.value?.filter((value: string) => value !== item.key),
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className='text-sm font-normal'>{item.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormCheckbox
