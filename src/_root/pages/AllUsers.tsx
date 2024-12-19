import { Loader } from '@/components/shared/Loader'
import { UserCard } from '@/components/shared/UserCard'
import { GET_TOP_CREATOR_USERS_LIMIT } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import { useGetCreatorUsers } from '@/lib/react-query/queries'
import { Models } from 'appwrite'

export const AllUsers = () => {
  const { toast } = useToast()

  const {
      data: creators,
      isPending: isCreatorloading,
      isError: isErrorCreators,
    } = useGetCreatorUsers(GET_TOP_CREATOR_USERS_LIMIT)

  if (isErrorCreators) {
    toast({ title: 'Something went wrong.' })
    return
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <div className='flex gap-2'>
          <img
            src={'/assets/icons/people.svg'}
            alt="people"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        </div>
        {isCreatorloading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator: Models.Document) => (
              <li key={creator.$id} className="flex-1 min-w-[200px] w-full">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
