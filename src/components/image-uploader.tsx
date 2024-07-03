/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, MouseEvent, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, UploadIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useUploadMutation } from '@/redux/features/product/productApi'
import { CircleLoader } from 'react-spinners'

interface ImageUploaderProps {
  form: UseFormReturn<any>
  label?: string
  name: string
  disabled: boolean
  className?: string
  imgClassName?: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  form,
  name,
  disabled,
  className,
}) => {
  const [upload, { isLoading }] = useUploadMutation()
  const [image, setImage] = useState<string | null>(null)

  const uploaderInput = useRef<HTMLInputElement>(null)

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      e.preventDefault()

      const file = e.target.files?.[0]
      if (!file) return
      if (!file.type.includes('image')) {
        toast.error('Please select an image file')
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImage(reader.result as string)
      }

      const formData = new FormData()
      formData.append('image', file)

      const res = await upload(formData).unwrap()

      setImage(res.data.secure_url)

      form.setValue(name, res.data.secure_url)
    } catch (error: any) {
      setImage(null)
      form.setValue(name, '')
      toast.error(error?.data?.errorMessage || error?.data?.message || 'Something went wrong')
    }
  }

  const onDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setImage(null)
    form.setValue(name, '')
  }

  return (
    <FormField
      name={name}
      control={form.control}
      render={() => (
        <FormItem className={cn('w-full space-y-1', className)}>
          <FormLabel
            htmlFor='uploader'
            className='block aspect-[16/9] rounded overflow-hidden cursor-pointer'>
            {form.watch(name) || image ? (
              <div className='w-full h-full relative'>
                <img
                  src={form.watch(name) || image}
                  className='w-full h-full object-contain p-3 object-center block'
                />
                {isLoading ? (
                  <div className='inset-0 absolute w-full h-full bg-gray-100/80 flex flex-col items-center justify-center gap-5'>
                    <CircleLoader />
                    <p>Image uploading...</p>
                  </div>
                ) : (
                  <Button
                    size='icon'
                    variant='destructive'
                    className='absolute top-2 right-2 p-1 w-6 h-6'
                    onClick={onDelete}
                    asChild>
                    <Trash2 className='w-4 h-4' />
                  </Button>
                )}
              </div>
            ) : (
              <div className='w-full h-full flex items-center justify-center flex-col gap-6 border border-dashed rounded'>
                <UploadIcon className='w-10 h-10' />
                <p>Click here to upload your product image</p>
              </div>
            )}
          </FormLabel>
          <FormControl>
            <FormItem>
              <FormControl>
                <Input
                  ref={uploaderInput}
                  type='file'
                  id='uploader'
                  className='sr-only hidden'
                  onChange={onChange}
                  disabled={disabled || form.watch(name)}
                />
              </FormControl>
            </FormItem>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
