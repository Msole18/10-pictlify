import { ID, ImageGravity, Query } from 'appwrite'
import { INewPost, INewUser, IUpdatePost } from '../../types/types'
import { account, appWriteConfig, avatars, databases, storage } from './config'

// ============================================================
// AUTH ACCOUNT
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl: string = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}


// ============================== SIGN IN ACCOUNT
export const signInAccount = async (user: {
  email: string
  password: string
}) => {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    )

    return session
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// ============================== GET USER
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get()

    if(!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appWriteConfig.databaseId, 
      appWriteConfig.userCollectionId, 
      [Query.equal('accountId', currentAccount.$id)]
    )
    if (!currentUser) throw Error

    return currentUser.documents[0]

  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// ============================== SIGN OUT
export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession('current')
    return session
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export const createPost = async (post: INewPost) => {
   try {
     // 1. Upload file to appwrite storage
     const uploadedFile = await uploadFile(post.file[0])

     if (!uploadedFile) throw Error

     // 2. Get file url
     const fileUrl = getFilePreview(uploadedFile.$id)

     if (!fileUrl) {
       await deleteFile(uploadedFile.$id) // we delete de corrupted file
       throw Error
     }

     // 3. Convert tags in an array
     const tags = post.tags?.replace(/ /g, '').split(',')

     // 4. Save post to databases
     const newPost = await databases.createDocument(
       appWriteConfig.databaseId,
       appWriteConfig.postCollectionId,
       ID.unique(),
       {
         creator: post.userId,
         caption: post.caption,
         imageUrl: fileUrl,
         imageId: uploadedFile.$id,
         location: post.location,
         tags: tags,
       }
     )

     if (!newPost) {
       await deleteFile(uploadedFile.$id) // we delete de corrupted file
       throw Error
     }
     return newPost
   } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export const uploadFile = async (file: File) => {
  try {
    const uploadFile = await storage.createFile(
      appWriteConfig.storageId,
      ID.unique(),
      file
    )

    return uploadFile
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET FILE URL
export const getFilePreview = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(
      appWriteConfig.storageId,
      fileId,
      2000, // width
      2000, // height
      ImageGravity.Top, //gravity
      100 //quality
    )
    return fileUrl

  } catch (error) {
    console.log(error)
  }
}

// ============================== DELETE FILE
export const deleteFile = async (fileId: string) => {
  try {
   const statusCode = await storage.deleteFile(
     appWriteConfig.savesCollectionId,
     fileId
   )
    
    if (!statusCode) throw Error
    
    return {status: 'ok'}

  } catch (error) {
    console.log(error)
  }
}

// ============================== GET FILE URL
export const getRecentPost = async () => {
  try {
    const post = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    )

    if (!post) throw Error

    return post

  } catch (error) {
    console.log(error)
  }
}

// ============================== LIKE / UNLIKE POST
export const likePost = async ( postId:string, likesArray: string[]) => {
  try {
    const updatedPost = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if(!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

// ============================== SAVE POST
export const savePost = async (postId: string, userId: string) => {
  try {
    const updatedPost = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )

    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

// ============================== DELETE SAVED POST
export const deleteSavedPost = async (savedRecordId: string) => {
  try {
    const statusCode = await databases.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.savesCollectionId,
      savedRecordId
    )

    if (!statusCode) throw Error

    return { status: 'ok' }
    
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET POST BY ID
export const getPostByID = async (postId:string) => {
  try {
    const post = await databases.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      postId
    )

    if (!post) throw Error

    return post
  } catch (error) {
    console.log(error)
  }
}

// ============================== UPDATE POST
export const updatePost = async (post: IUpdatePost) => {
  const hasFileToUpdate = post.file.length > 0

   try {
    let image = {imageUrl: post.imageUrl, imageId: post.imageId}

    if (hasFileToUpdate) {
      // 1. Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0])
 
      if (!uploadedFile) throw Error
      
      // 2. Get file url
      const fileUrl = getFilePreview(uploadedFile.$id)
  
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id) // we delete de corrupted file
        throw Error
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }

     // 3. Convert tags in an array
     const tags = post.tags?.replace(/ /g, '').split(',')

     // 4. Save post to databases
     const updatedPost = await databases.updateDocument(
       appWriteConfig.databaseId,
       appWriteConfig.postCollectionId,
       post.postId,
       {
         caption: post.caption,
         imageUrl: image.imageUrl,
         imageId: image.imageId,
         location: post.location,
         tags: tags,
       }
     )

     if (!updatedPost) {
       await deleteFile(post.imageId) // we delete de corrupted file
       throw Error
     }

     return updatedPost
   } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE POST
export const deletePost = async (postId: string, imageId:string) => {
  if (!postId || imageId) throw Error
  try {
    const statusCode = await databases.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      postId
    )

    if (!statusCode) throw Error

    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

// ============================== INFINITE POST
export const getInfinitePosts = async ({
  pageParam,
}: {
  pageParam: string | null
}) => {
  console.log('Page Param:', pageParam)
  const queries: any[] = [
    Query.orderDesc('$updatedAt'), 
    Query.limit(10)
  ]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam))
  }

  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      queries
    )

    console.log('Posts:', posts)
    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

// ============================== SEARCH POST
export const searchPost = async (searchTerm:string) => {

  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    )
    
    if(!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

// ============================================================
// USER
// ============================================================
// ============================== GET TOP CREATOR USER
export const getCreatorUsers = async (limit: number) => {
  try {
    const creatorUsers = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(limit)]
    )

    if (!creatorUsers) throw Error

    return creatorUsers
  } catch (error) {
    console.log(error)
  }
}