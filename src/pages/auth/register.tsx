import RegisterForm from '@/components/form/register-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  const [role, setRole] = useState<'buyer' | 'seller' | null>(null)

  return (
    <Card className='w-full max-w-[640px]'>
      <CardHeader className={cn('text-center', role && 'text-start')}>
        <CardTitle className='font-semibold text-lg md:text-2xl'>
          {!role ? 'Choose Your Role' : 'Join Us Today!'}
        </CardTitle>
        <CardDescription className='text-sm'>
          {!role
            ? "Buy products or Sell products. Let's get started!"
            : 'Register now to unlock all the features and start your adventure.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!role ? (
          <div className='flex gap-2'>
            <Button
              variant='outline'
              className='w-full hover:bg-foreground hover:text-white'
              onClick={() => setRole('seller')}>
              Sell Products
            </Button>
            <Button
              variant='outline'
              className='w-full hover:bg-foreground hover:text-white'
              onClick={() => setRole('buyer')}>
              Buy Products
            </Button>
          </div>
        ) : (
          <RegisterForm
            role={role}
            setRole={setRole}
          />
        )}
      </CardContent>
      <CardFooter className='justify-center text-sm text-muted-foreground'>
        Already have account?
        <Link
          to={'/login'}
          className='ml-1 underline hover:text-foreground'>
          Login here
        </Link>
        .
      </CardFooter>
    </Card>
  )
}

export default RegisterPage
