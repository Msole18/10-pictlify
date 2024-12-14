import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import {
  createPost,
  createUserAccount,
  signInAccount,
  signOutAccount,
} from '../appwrite/api'
import { INewPost, INewUser } from '@/types/types'
import { QUERY_KEYS } from './queryKey'

// AUTH QUERIES

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  })
}

// Sign in user account mutation
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  })
}

// Sign out user account mutation
export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  })
}

// Crate new post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
    },
  })
}
