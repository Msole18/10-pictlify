import { ID, Query } from 'appwrite'
import { INewPost, INewUser } from '../../types/types'
import { account, appWriteConfig, avatars, databases, storage } from './config'

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
    throw error;
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
    throw error
  }
}


// SIGN IN ACCOUNT
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
    throw error
  }
}

// GET USER
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

// ============================== SIGN UP
export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession('current')
    return session
    
  } catch (error) {
    console.error('Error:', error)
    return null
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
     console.log({ uploadedFile })
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
    throw error
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
    throw error
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
      undefined, //gravity
      100 //quality
    )
    console.log({ fileUrl })
    return fileUrl

  } catch (error) {
    console.log(error)
    throw  error
  }
}

// ============================== DELETE FILE
export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appWriteConfig.savesCollectionId, fileId)

    return {status: 'ok'}

  } catch (error) {
    console.log(error)
    throw error
  }
}