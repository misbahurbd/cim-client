/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface FormComboboxProps {
  label: string
  name: string
  form: UseFormReturn<any>
  placeholder: string
  options: {
    label: string | number
    value: string | number
  }[]
  disabled: boolean
  required?: boolean
}

const FormCombobox: React.FC<FormComboboxProps> = ({
  label,
  name,
  form,
  placeholder,
  options,
  disabled,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className='w-full space-y-1'>
          <FormLabel>
            {label}
            {required && <span className='text-destructive ml-0.5'>*</span>}
          </FormLabel>
          <Popover
            open={isOpen}
            onOpenChange={(open) => setIsOpen(open)}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  disabled={disabled}
                  className={cn(
                    'w-full px-3 justify-between',
                    !field.value && 'text-muted-foreground',
                  )}>
                  {field.value
                    ? options.find((opt) => opt.value === field.value)?.label
                    : placeholder}
                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              align='end'
              className='w-[220px] max-w-full p-0 max-h-80 overflow-y-auto'>
              <Command>
                <CommandInput
                  placeholder={`Search ${name}...`}
                  className='h-9'
                />
                <CommandEmpty>No {name} found.</CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      value={opt.label.toString()}
                      key={opt.value}
                      onSelect={() => {
                        form.setValue(name, opt.value)
                        setIsOpen((crr) => !crr)
                      }}>
                      {opt.label}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          opt.value === field.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  )
}

export default FormCombobox
