/* eslint-disable @typescript-eslint/no-explicit-any */
import FormInput from '@/components/form/ui/form-input'
import FormSelect from '@/components/form/ui/form-select'
import FormCheckbox from '@/components/form/ui/form-checkbox'
import FormMultiSelector from '@/components/form/ui/form-multi-selector'
import FormSelectWithApi from '@/components/form/ui/form-select-with-api'

import { ImageUploader } from '@/components/image-uploader'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import { IProduct } from '@/interface'

import { PRODUCT_COMPATIBILITY, PRODUCT_CONDITION, PRODUCT_INTERFACE } from '@/constants'
import { selectCurrentUser } from '@/redux/features/auth/auth-slice'
import { useCreateBrandMutation, useGetAllBrandQuery } from '@/redux/features/brand/brandApi'
import {
  useCreateCategoryMutation,
  useGetAllCategoryQuery,
} from '@/redux/features/category/categoryApi'
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from '@/redux/features/product/productApi'
import { useAppSelector } from '@/redux/hooks'

import { z } from 'zod'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { productFormSchema } from '@/validation'

import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'

interface ProductFormProps {
  btnLabel: string
  currentData?: IProduct
  requestType: 'CREATE' | 'EDIT' | 'VARIANT'
}

const ProductForm: React.FC<ProductFormProps> = ({ currentData, btnLabel, requestType }) => {
  const navigate = useNavigate()

  const { data: categories } = useGetAllCategoryQuery('')
  const { data: brands } = useGetAllBrandQuery('')

  const [addProduct, { isLoading }] = useAddProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [createCategory] = useCreateCategoryMutation()
  const [createBrand] = useCreateBrandMutation()

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      image: currentData?.image || '',
      title: currentData?.title || '',
      price: currentData?.price,
      quantity: currentData?.quantity,
      brand: currentData?.brand._id || '',
      capacity: currentData?.capacity || '',
      category: currentData?.category._id || '',
      condition: currentData?.condition || '',
      interface: currentData && currentData?.interface.length > 0 ? currentData?.interface : [],
      compatibility:
        currentData && currentData?.compatibility.length > 0 ? currentData?.compatibility : [],
    },
  })

  const user = useAppSelector(selectCurrentUser)
  if (!user) {
    return <Navigate to={'/login'} />
  }

  const onSubmit = async (value: z.infer<typeof productFormSchema>) => {
    const toastId = toast.loading('Creating product...')
    try {
      if (currentData) {
        if (requestType === 'EDIT') {
          await updateProduct({
            ...value,
            _id: currentData._id,
            createdBy: currentData.createdBy._id,
          }).unwrap()
          navigate('/products', { replace: true })
          toast.success('Product updated successfully', { id: toastId })
        } else if (requestType === 'VARIANT') {
          await addProduct({ ...value, createdBy: user.id }).unwrap()
          navigate('/products', { replace: true })
          toast.success('Product variant created successfully', { id: toastId })
        }
      } else {
        await addProduct({ ...value, createdBy: user.id }).unwrap()
        navigate('/products', { replace: true })
        toast.success('Product added successfully', { id: toastId })
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong!', { id: toastId })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'>
        <ImageUploader
          form={form}
          name='image'
          disabled={false}
        />
        <FormInput
          form={form}
          name='title'
          label='Product title'
          placeholder='Product title'
          disabled={isLoading}
        />
        <div className='flex flex-col sm:flex-row gap-4'>
          <FormInput
            form={form}
            name='price'
            label='Product price'
            placeholder='Product price'
            disabled={isLoading}
          />
          <FormInput
            form={form}
            name='quantity'
            label='Product quantity'
            placeholder='Product quantity'
            disabled={isLoading}
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <FormSelectWithApi
            name='category'
            form={form}
            label='Product category'
            placeholder='Select category'
            data={categories?.data || []}
            create={createCategory}
          />
          <FormSelectWithApi
            name='brand'
            form={form}
            label='Product brand'
            data={brands?.data || []}
            placeholder='Select brand'
            create={createBrand}
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <FormSelect
            name='condition'
            label='Product condition'
            form={form}
            data={PRODUCT_CONDITION}
            placeholder='Select condition'
            disabled={isLoading}
          />
          <FormCheckbox
            form={form}
            name='compatibility'
            label='Product compatibility'
            data={PRODUCT_COMPATIBILITY}
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <FormMultiSelector
            form={form}
            name='interface'
            label='Product interface'
            placeholder='Select interface'
            data={PRODUCT_INTERFACE}
          />
          <FormInput
            form={form}
            name='capacity'
            label='Product capacity (optional)'
            placeholder='Product capacity'
            disabled={isLoading}
          />
        </div>

        <div className='mt-5 flex justify-between'>
          <Button
            type='submit'
            className='w-full sm:w-fit sm:ml-auto'>
            {btnLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
