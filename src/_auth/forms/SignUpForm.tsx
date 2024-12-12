import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Control } from 'react-hook-form'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {Loader} from '@/components/shared/Loader'
import { SignUpValidation } from '@/lib/validation'
import { useUserContext } from '@/context/AuthContext'
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queries'
import { INewUser } from '@/types/types'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

interface Props {
  name: string
  type: keyof INewUser
  form: Control<z.infer<typeof SignUpValidation>>
}

const FieldForm = ({ name, type, form }: Props) => {
  const inputType =
    type === 'email' ? 'email' : type === 'password' ? 'password' : 'text'
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

export const SignUpForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  // Form definition
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount()
  const { mutateAsync: signInAccount, isPending: isSignIn } = useSignInAccount()

  // Submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    // Create new user account
    const newUser = await createUserAccount(values)
    if (!newUser) {
      return toast({
        title: 'Sign up faild, please try again.'
      })
    }

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
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Pictlify, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 w-full mt-2"
        >
          <FieldForm type="name" name="Name" form={form.control} />
          <FieldForm type="username" name="Username" form={form.control} />
          <FieldForm type="email" name="Email" form={form.control} />
          <FieldForm type="password" name="Password" form={form.control} />

          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              'Sign Up'
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}


