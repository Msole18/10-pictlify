import { Loader } from "@/components/shared/Loader"
import { PostCard } from "@/components/shared/PostCard"
import { useGetRecentPost } from "@/lib/react-query/queries"
import { Models } from "appwrite"

export const Home = () => {
  const {data: posts, isPending: isPostloading, isError: isErrorPosts} = useGetRecentPost()
  return (
  <div className="flex flex-1">
    <div className="home-container">
      <div className="home-posts">
        <h2 className="h3-bold md: h2=bold text-left w-full">Home feed</h2>
        { isPostloading && !posts  
          ? <Loader /> 
          : (<ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id}>
                  <PostCard post={post}/>
                </li>
              ))} 
            </ul>)
        }
      </div>
    </div>
  </div>
)
}

