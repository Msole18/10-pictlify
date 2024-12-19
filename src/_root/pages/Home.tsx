import { Loader } from "@/components/shared/Loader"
import { PostCard } from "@/components/shared/PostCard"
import { UserCard } from "@/components/shared/UserCard"
import { GET_TOP_CREATOR_USERS_LIMIT } from "@/constants"
import { useGetCreatorUsers, useGetRecentPost } from "@/lib/react-query/queries"
import { Models } from "appwrite"

export const Home = () => {
  const {data: posts, isPending: isPostloading, isError: isErrorPosts} = useGetRecentPost()
  const {
    data: creators,
    isPending: isCreatorloading,
    isError: isErrorCreators,
  } = useGetCreatorUsers(GET_TOP_CREATOR_USERS_LIMIT)

   if (isErrorPosts || isErrorCreators) {
     return (
       <div className="flex flex-1">
         <div className="home-container">
           <p className="body-medium text-light-1">Something bad happened</p>
         </div>
         <div className="home-creators">
           <p className="body-medium text-light-1">Something bad happened</p>
         </div>
       </div>
     )
   }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md: h2-bold text-left w-full">Home feed</h2>
          {isPostloading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creator</h3>
        {isCreatorloading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator: Models.Document) => (
              <li key={creator.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

