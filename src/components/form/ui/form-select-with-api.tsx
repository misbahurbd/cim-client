/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

interface DataItem {
  name: string
  _id: string
}

interface FormSelectWithApiProps {
  name: string
  label: string
  form: UseFormReturn<any>
  placeholder: string
  data: DataItem[]
  type?: string
  disabled?: boolean
  create: any
}
const FormSelectWithApi: React.FC<FormSelectWithApiProps> = ({
  create,
  name,
  label,
  placeholder,
  form,
  data,
  disabled,
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const onSubmit = async () => {
    const toastId = toast.loading(`${label} creating...`)
    try {
      const res = await create({ name: value }).unwrap()
      toast.success(res.message, { id: toastId })
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.errorMessage || 'Something went wrong!', { id: toastId })
    }
  }

  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full space-y-1'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className='max-h-[12rem] overflow-y-auto'>
                  {data.length === 0 && (
                    <p className='text-center p-2 text-sm text-muted-foreground'>
                      No {name} found!
                    </p>
                  )}
                  {data.map((item) => (
                    <SelectItem
                      key={item._id}
                      value={item._id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </ScrollArea>
                <Separator className='my-1' />
                <Dialog
                  open={open}
                  onOpenChange={(open) => {
                    setOpen(open)
                  }}>
                  <DialogTrigger asChild>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='w-full uppercase'>
                      Create {name}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='max-w-80'>
                    <DialogHeader className='flex flex-col gap-3'>
                      <DialogTitle>Create {name}</DialogTitle>
                      <div className='flex flex-col gap-2'>
                        <Input onChange={(e) => setValue(e.target.value)} />
                        <Button onClick={onSubmit}>Create</Button>
                      </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormSelectWithApi
