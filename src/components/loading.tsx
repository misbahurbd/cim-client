import { HashLoader as Spinner } from 'react-spinners'

const Loading = () => {
  return (
    <div className='w-full z-50 h-full fixed inset-0 bg-background flex flex-col gap-6 items-center justify-center'>
      <Spinner size={30} />
      <p className='text-muted-foreground font-mono'>Loading...</p>
    </div>
  )
}

export default Loading
