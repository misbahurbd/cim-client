import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { searchFormSchema } from '@/validation'
import { SetURLSearchParams } from 'react-router-dom'
import { SearchIcon } from 'lucide-react'

interface ProductSearchProps {
  searchParams: URLSearchParams
  setSearchParams: SetURLSearchParams
}

const ProductSearch: React.FC<ProductSearchProps> = ({ searchParams, setSearchParams }) => {
  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: searchParams.get('search') || '',
    },
  })

  const onSearch = (value: z.infer<typeof searchFormSchema>) => {
    const prevSearch = Object.fromEntries([...searchParams])
    const params = {
      ...prevSearch,
    }
    if (value.search && value.search.length > 0) {
      params.search = value.search
    } else {
      delete params.search
    }

    setSearchParams(params)
  }

  return (
    <Form {...searchForm}>
      <form
        className='flex gap-2 w-full'
        onSubmit={searchForm.handleSubmit(onSearch)}>
        <FormField
          name='search'
          control={searchForm.control}
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormControl>
                <Input
                  placeholder='Search...'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          size='icon'>
          <SearchIcon className='w-4 h-4' />
        </Button>
      </form>
    </Form>
  )
}

export default ProductSearch
