import ProductForm from '@/components/form/product-form'

const AddProduct = () => {
  return (
    <section className='max-w-[600px] mx-auto space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Add Product</h1>
      </div>
      <div>
        <ProductForm
          btnLabel='Add Product'
          requestType='CREATE'
        />
      </div>
    </section>
  )
}

export default AddProduct
