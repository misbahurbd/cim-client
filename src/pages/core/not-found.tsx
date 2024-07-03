import { Button } from '@/components/ui/button'
import { LinkBreak2Icon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className='h-full border grow flex flex-col items-center justify-center gap-5'>
      <LinkBreak2Icon className='text-muted-foreground h-24 w-2/4' />
      <p className='text-muted-foreground text-center'>
        The page you are looking for does not exist.
      </p>
      <Link
        className='text-muted-foreground text-center'
        to='/'
        replace>
        <Button variant='secondary'>Go back to the home page</Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
