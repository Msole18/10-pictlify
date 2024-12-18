import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from '@/lib/react-query/queries'
import { checkIsLiked } from '@/lib/utils'
import { Models } from 'appwrite'
import { useEffect, useState } from 'react'
import { Loader } from './Loader'

type Props = {
  post?: Models.Document
  userId: string
}

export const PostStats = ({ post, userId }: Props) => {

  const likesList = post?.likes.map((user: Models.Document) => user.$id)

  const [likes, setLikes] = useState(likesList)
  const [isSaved, setIsSaved] = useState(false) 

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost, isPending: isSavingPost } = useSavePost()
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser()

  
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  ) 

  useEffect(() => {
    const newIsSaved = !!savedPostRecord
    setIsSaved(newIsSaved) // equal to said "savedPostRecord ? true : false"
  }, [currentUser])

  // ============================== HANDLE LIKE / UNLIKE POST
  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    let likesArray = [...likes]

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((id) => id !== userId)
    } else {
      likesArray.push(userId)
    }

    setLikes(likesArray)
    likePost({ postId: post?.$id || '', likesArray })
  }

  // ============================== HANDLE SAVE POST
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()
   
    if (savedPostRecord) {
      setIsSaved(false)
      deleteSavedPost(savedPostRecord.$id)
    } else {
      setIsSaved(true)
      savePost({ postId: post?.$id || '', userId })
    }
  }

  return (
    <div
      className={`flex justify-between items-center z-20`}
    >
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? '/assets/icons/liked.svg'
              : '/assets/icons/like.svg'
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? '/assets/icons/saved.svg' 
              : '/assets/icons/save.svg'}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  )
}
