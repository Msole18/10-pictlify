import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Control } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/shared/Loader'
import { SignInValidation } from '@/lib/validation'
import { useUserContext } from '@/context/AuthContext'
import { useSignInAccount } from '@/lib/react-query/queries'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

interface Props {
  name: string
  type: 'email' | 'password'
  form: Control<z.infer<typeof SignInValidation>>
}

const FieldForm = ({ name, type, form }: Props) => {
  const inputType = type === 'email' ? 'email' : 'password'
  return (
    <FormField
      control={form}
      name={type}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{name}</FormLabel>
          <FormControl>
            <Input className="shad-input" type={inputType} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export const SignInForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  
    // Queries
    const { mutateAsync: signInAccount } = useSignInAccount()

  // Form definition
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    // Sign in user account
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })
    
    if (!session) {
      toast({ title: 'Something went wrong. Please login your new account' })
      navigate('/sign-in')
      return
    }

    // Login user account
    const isLoggenIn = await checkAuthUser()
    
    if (isLoggenIn) {
      form.reset()
      navigate('/')
    } else {
      toast({
        variant: 'destructive',
        title: 'Oops! Something went wrong.',
        description: 'Login  faild, please try again.',
      })
      return
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img
          src="/assets/images/pictlify-logo.png"
          alt="logo"
          className="w-24 m-2"
        />

        <h2 className="h3-bold md:h2-bold md:h2-bold mt-0">
            Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back!, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full mt-2"
        >
          <FieldForm type="email" name="Email" form={form.control} />
          <FieldForm type="password" name="Password" form={form.control} />

          <Button type="submit" className="shad-button_primary">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}
