/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { CheckIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DataItem {
  label: string
  key: string
}

interface FormMultiSelectorProps {
  name: string
  label: string
  form: UseFormReturn<any>
  placeholder: string
  data: DataItem[]
  type?: string
  disabled?: boolean
}

const FormMultiSelector: React.FC<FormMultiSelectorProps> = ({
  name,
  label,
  form,
  placeholder,
  data,
  disabled,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full space-y-1'>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger
              asChild
              disabled={disabled}>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn(
                    'w-full px-3 justify-start gap-1',
                    field.value.length == 0 && 'text-muted-foreground',
                  )}>
                  {field.value.length == 0 && placeholder}
                  {field.value.length < 4 &&
                    data
                      .filter((item) => field.value.includes(item.key))
                      .map((a) => <Badge key={a.key}>{a.label}</Badge>)}
                  {field.value.length >= 4 && (
                    <Badge>{field.value.length} interface selected</Badge>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
              <Command>
                <CommandEmpty>No {name} found.</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      value={item.label}
                      key={item.key}
                      onSelect={() => {
                        if (field.value.includes(item.key)) {
                          form.setValue(
                            name,
                            field.value.filter((val: string) => val !== item.key),
                          )
                        } else {
                          form.setValue(name, [...field.value, item.key])
                        }
                      }}>
                      {item.label}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          field.value.includes(item.key) ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormMultiSelector
