import {
  useQuery,
  useMutation,
  useQueryClient,
  // useInfiniteQuery,
} from '@tanstack/react-query'
import {
  createPost,
  createUserAccount,
  deletePost,
  deleteSavedPost,
  getCurrentUser,
  getPostByID,
  getRecentPost,
  likePost,
  savePost,
  signInAccount,
  signOutAccount,
  updatePost,
} from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types/types'
import { QUERY_KEYS } from './queryKey'

// ============================================================
// AUTH QUERIES
// ============================================================ 

// ============================== CREATE USER MUTATION
export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  })
}

// ============================== SIGN IN ACCOUNT MUTATION
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  })
}

// ============================== SIGN OUT ACCOUNT MUTATION
export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  })
}

// ============================================================
// POST QUERIES
// ============================================================

// ============================== CREATE POST MUTATION
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

// ============================== GET RECENT POST
export const useGetRecentPost = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPost,
  })
}

// ============================== LIKE / UNLIKE POST MUTATION
export const useLikePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string
      likesArray: string[]
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    },
  })
}

// ============================== SAVED POST MUTATION
export const useSavePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
    },
  })
}

// ============================== DELETE POST MUTATION
export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
}

// ============================== GET POST BY ID
export const useGetPostById = (postId:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostByID(postId),
    enabled: !!postId //this disable the automatic refechitng
  })
}

// ============================== UPDATE POST MUTATION
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  })
}

// ============================== DELETE POST MUTATION
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({postId, imageId}:{postId:string, imageId:string}) => deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
    },
  })
}

// ============================================================
// USER QUERIES
// ============================================================

// ============================== GET CURRENT USER
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  })
}