import LoginForm from '@/components/form/login-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <Card className='w-full max-w-[480px]'>
      <CardHeader className={cn('text-start')}>
        <CardTitle className='font-semibold text-lg md:text-2xl'>Welcome Back!</CardTitle>
        <CardDescription className='text-sm'>
          Log in to access your account and continue your journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className='justify-center text-sm text-muted-foreground w-full'>
        Don't have an account?
        <Link
          className='ml-1 underline hover:text-foreground'
          to='/register'>
          Register here
        </Link>
        .
      </CardFooter>
    </Card>
  )
}

export default LoginPage
