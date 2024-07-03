import ProductForm from '@/components/form/product-form'
import Loading from '@/components/loading'
import { useGetProductQuery } from '@/redux/features/product/productApi'
import { useParams } from 'react-router-dom'

const CreateProductVariant = () => {
  const params = useParams()
  const { data: productData, isLoading } = useGetProductQuery({ productId: params.id })

  if (isLoading) {
    return <Loading />
  }

  return (
    <section className='max-w-[600px] mx-auto space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Update Product</h1>
      </div>
      <div>
        <ProductForm
          currentData={productData.data}
          btnLabel='Add Variant'
          requestType='VARIANT'
        />
      </div>
    </section>
  )
}

export default CreateProductVariant
