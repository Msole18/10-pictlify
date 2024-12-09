import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Control } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SignUpValidation } from '@/lib/validation'
import { INewUser } from '@/lib/types/types'
import Loader from '@/components/shared/Loader'
import { Link } from 'react-router-dom'
import { createUserAccount } from '@/lib/appwrite/api'
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
          // eslint-disable-next-line react/react-in-jsx-scope
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SignUpForm = () => {
  const { toast } = useToast()
  const isLoading = false
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    const newUser = await createUserAccount(values)
    if (!newUser) {
      return toast({ 
        title: 'Sign up faild, please try again.'
      })
    }

    // const session = await signInAccount()
  }
  return (
    // <div className="flex flex-col justify-center items-center">
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
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
            {isLoading ? (
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

export default SignUpForm
