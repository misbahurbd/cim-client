/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginFormSchema } from '@/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import FormInput from '@/components/form/ui/form-input'
import { Button } from '@/components/ui/button'
import { useLoginMutation } from '@/redux/features/auth/auth-api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAppDispatch } from '@/redux/hooks'
import { setCredentials } from '@/redux/features/auth/auth-slice'

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onLogin = async (values: z.infer<typeof loginFormSchema>) => {
    const toastId = toast.loading('Logging in...')
    try {
      const res = await login(values).unwrap()
      if (res.success) {
        const { accessToken } = res.data
        const user = jwtDecode(accessToken)

        dispatch(setCredentials({ user, accessToken }))
        toast.success('Login successful!', { id: toastId })
        navigate('/', { replace: true })
      }
    } catch (error: any) {
      toast.error(error?.data?.errorMessage || error?.data?.message || 'Something went wrong', {
        id: toastId,
      })
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onLogin)}
          className='flex flex-col gap-2'>
          <FormInput
            form={form}
            name='email'
            type='email'
            label='Email address'
            placeholder='Your email address'
            disabled={isLoading}
            required
          />
          <FormInput
            form={form}
            name='password'
            label='Password'
            placeholder='Your password'
            type='password'
            disabled={isLoading}
            required
          />

          <div className='flex gap-3 justify-between mt-6 '>
            <Button
              type='submit'
              className='flex-1'
              disabled={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LoginForm
