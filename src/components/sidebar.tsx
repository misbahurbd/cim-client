/* eslint-disable @typescript-eslint/no-explicit-any */
import { filterFormSchema } from '@/validation'
import FilterCard from '@/components/filter-card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormCheckbox from '@/components/form/ui/form-checkbox'
import FormInput from '@/components/form/ui/form-input'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PRODUCT_COMPATIBILITY, PRODUCT_CONDITION, PRODUCT_INTERFACE } from '@/constants'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SetURLSearchParams } from 'react-router-dom'

interface SidebarProps {
  searchParams: URLSearchParams
  setSearchParams: SetURLSearchParams
  products: any
  brands: any
  categories: any
  className?: string
  setIsOpen?: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  searchParams,
  setSearchParams,
  products,
  categories,
  brands,
  setIsOpen,
}) => {
  const filterForm = useForm<z.infer<typeof filterFormSchema>>({
    // resolver: zodResolver(filterFormSchema),
    defaultValues: {
      category: searchParams.getAll('category') || [],
      brand: searchParams.getAll('brand') || [],
      condition: searchParams.getAll('condition') || [],
      compatibility: searchParams.getAll('compatibility') || [],
      interface: searchParams.getAll('interface') || [],
      capacity: searchParams.getAll('capacity') || [],
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 0,
    },
  })

  const onFilter = (value: z.infer<typeof filterFormSchema>) => {
    const prevSearch = Object.fromEntries([...searchParams])
    delete prevSearch.page

    const params = {
      ...prevSearch,
    }

    if (value.minPrice && value.maxPrice) {
      params.minPrice = value.minPrice.toString()
      params.maxPrice = value.maxPrice.toString()
    }

    if (value.category && value.category.length > 0) {
      params.category = value.category?.join(',')
    } else {
      delete params.category
    }
    if (value.brand && value.brand.length > 0) {
      params.brand = value.brand?.join(',')
    } else {
      delete params.brand
    }
    if (value.interface && value.interface.length > 0) {
      params.interface = value.interface?.join(',')
    } else {
      delete params.interface
    }
    if (value.compatibility && value.compatibility.length > 0) {
      params.compatibility = value.compatibility?.join(',')
    } else {
      delete params.compatibility
    }
    if (value.condition && value.condition.length > 0) {
      params.condition = value.condition?.join(',')
    } else {
      delete params.condition
    }
    if (value.capacity && value.capacity.length > 0) {
      params.capacity = value.capacity?.join(',')
    } else {
      delete params.capacity
    }

    setSearchParams(params)
    setIsOpen && setIsOpen(false)
  }

  useEffect(() => {
    if (products && products.success) {
      filterForm.setValue(
        'minPrice',
        Number(searchParams.get('minPrice')) || products.meta.minPrice,
      )
      filterForm.setValue(
        'maxPrice',
        Number(searchParams.get('maxPrice')) || products.meta.maxPrice,
      )
    }
  }, [filterForm, products, searchParams])

  return (
    <div className={cn('w-[300px] border rounded-md space-y-2', className)}>
      <h2 className='font-bold p-2 border-b'>Filter</h2>
      <Form {...filterForm}>
        <form
          className='space-y-2 p-2'
          onSubmit={filterForm.handleSubmit(onFilter)}>
          <div className='flex gap-2 items-center '>
            <div className='relative w-full'>
              <span className='text-xs bg-white px-1 absolute left-1.5 -top-1 text-muted-foreground'>
                Min price
              </span>
              <FormInput
                name='minPrice'
                placeholder='XXXX'
                form={filterForm}
                onBlur={() => {
                  const maxPrice = filterForm.watch('maxPrice')
                  const minPrice = filterForm.watch('minPrice')
                  if (Number(minPrice) > Number(maxPrice)) {
                    filterForm.setValue('maxPrice', minPrice)
                  }
                }}
                disabled={false}
              />
            </div>
            <Separator className='w-2' />
            <div className='relative w-full'>
              <span className='text-xs bg-white px-1 absolute left-1.5 -top-1 text-muted-foreground'>
                Max price
              </span>
              <FormInput
                name='maxPrice'
                placeholder='XXXX'
                form={filterForm}
                onBlur={() => {
                  const maxPrice = filterForm.watch('maxPrice')
                  const minPrice = filterForm.watch('minPrice')
                  if (Number(minPrice) > Number(maxPrice)) {
                    filterForm.setValue('maxPrice', minPrice)
                  }
                }}
                disabled={false}
              />
            </div>
          </div>

          <FilterCard label='Category'>
            <FormCheckbox
              name='category'
              form={filterForm}
              disabled={false}
              className='flex-col justify-start gap-2 py-0 space-y-0 items-start'
              data={categories?.data?.map((item: any) => ({ label: item.name, key: item.name }))}
            />
          </FilterCard>

          <FilterCard label='Brand'>
            <FormCheckbox
              name='brand'
              form={filterForm}
              disabled={false}
              className='flex-col justify-start gap-2 py-0 space-y-0 items-start'
              data={brands?.data?.map((item: any) => ({ label: item.name, key: item.name }))}
            />
          </FilterCard>

          <FilterCard label='Interface'>
            <FormCheckbox
              name='interface'
              form={filterForm}
              disabled={false}
              className='flex-col justify-start gap-2 py-0 space-y-0 items-start'
              data={PRODUCT_INTERFACE?.map((item: any) => ({ label: item.label, key: item.key }))}
            />
          </FilterCard>

          <FilterCard label='Compatibility'>
            <FormCheckbox
              name='compatibility'
              form={filterForm}
              disabled={false}
              className='flex-col justify-start gap-2 py-0 space-y-0 items-start'
              data={PRODUCT_COMPATIBILITY?.map((item: any) => ({
                label: item.label,
                key: item.key,
              }))}
            />
          </FilterCard>

          <FilterCard label='Condition'>
            <FormCheckbox
              name='condition'
              form={filterForm}
              disabled={false}
              className='flex-col justify-start gap-2 py-0 space-y-0 items-start'
              data={PRODUCT_CONDITION?.map((item: any) => ({ label: item.label, key: item.key }))}
            />
          </FilterCard>

          {products && products?.data?.filterValue?.capacities && (
            <FilterCard label='Capacity'>
              <FormCheckbox
                name='capacity'
                form={filterForm}
                disabled={false}
                className='flex-col justify-start gap-2 py-0 space-y-0 items-start'
                data={products?.data?.filterValue?.capacities
                  ?.filter((item: string) => !!item)
                  .map((item: any) => ({ label: item, key: item }))}
              />
            </FilterCard>
          )}

          <Button
            type='submit'
            className='w-full'>
            Filter
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Sidebar
