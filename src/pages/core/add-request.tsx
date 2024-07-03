import RequestForm from '@/components/form/request-form'

const AddRequestPage = () => {
  return (
    <section className='max-w-[600px] mx-auto space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Add Request</h1>
      </div>
      <div>
        <RequestForm />
      </div>
    </section>
  )
}

export default AddRequestPage
