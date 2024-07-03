/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerFormSchema } from '@/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import FormInput from '@/components/form/ui/form-input'
import { Button } from '@/components/ui/button'
import FormCombobox from '@/components/form/ui/form-combobox'
import { Country } from 'country-state-city'
import { useRegisterMutation } from '@/redux/features/auth/auth-api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

interface RegisterFormProps {
  role: 'buyer' | 'seller'
  setRole: (value: 'buyer' | 'seller' | null) => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ role, setRole }) => {
  const [register, { isLoading }] = useRegisterMutation()
  const counties = Country.getAllCountries()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      stateAddress: '',
      city: '',
      country: '',
      password: '',
      confirmPassword: '',
      role,
    },
  })

  const onRegister = async (values: z.infer<typeof registerFormSchema>) => {
    const toastId = toast.loading('Registering...')
    try {
      const res = await register(values).unwrap()
      if (res.success) {
        toast.success(res.message, { id: toastId })
        navigate('/login', { replace: true })
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
          onSubmit={form.handleSubmit(onRegister)}
          className='flex flex-col gap-2'>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            <FormInput
              form={form}
              name='name'
              label='Full name'
              placeholder='Your full name'
              disabled={isLoading}
              required
            />
            <FormInput
              form={form}
              name='email'
              type='email'
              label='Email address'
              placeholder='Your email address'
              disabled={isLoading}
              required
            />
          </div>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            <FormInput
              form={form}
              name='phone'
              label='Phone number'
              placeholder='+880 0000-000 000'
              disabled={isLoading}
            />
            <FormInput
              form={form}
              name='stateAddress'
              label='State address'
              placeholder='State address line'
              disabled={isLoading}
            />
          </div>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            <FormInput
              form={form}
              name='city'
              label='City'
              placeholder='Your city'
              disabled={isLoading}
            />
            <FormCombobox
              label='Country'
              name='country'
              form={form}
              placeholder='Select country'
              disabled={isLoading}
              required
              options={counties.map((country) => ({ label: country.name, value: country.name }))}
            />
          </div>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            <FormInput
              form={form}
              name='password'
              label='Password'
              placeholder='Your password'
              type='password'
              disabled={isLoading}
              required
            />
            <FormInput
              form={form}
              name='confirmPassword'
              label='Confirm password'
              placeholder='Confirm password'
              type='password'
              disabled={isLoading}
              required
            />
          </div>
          <div className='flex gap-3 justify-between mt-6 items-center'>
            <Button
              type='button'
              onClick={() => setRole(null)}
              variant='outline'>
              Back
            </Button>
            <Separator className='w-full shrink' />
            <Button
              type='submit'
              disabled={isLoading}>
              Register
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default RegisterForm
