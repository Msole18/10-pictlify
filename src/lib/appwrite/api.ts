import { ID } from 'appwrite'
import { INewUser } from '../../types/types'
import { account, appWriteConfig, avatars, dataBases } from './config'

// SIGN UP USER
export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(), // id generated from appwrite
      user.email,
      user.password,
      user.name
    )
    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.name,
      name: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    })

    return newUser
  } catch (error) {
    console.error('Error:', error)
    return error
  }
}

// SAVE USER TO DB
export const saveUserToDB = async (user: {
  accountId: string
  email: string
  name: string
  imageUrl: string
  username?: string
}) => {
  try {
    const newUser = await dataBases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      ID.unique(),
      user
    )

    return newUser
  } catch (error) {
    console.error('Error:', error)
    return error
  }
}


// SIGN IN USER
export const signInAccount = async (user: {
  email: string
  password: string
}) => {
  try {
    const session = await account.createEmailPasswordSession(
      user.email, user.password
    )

    return session
  } catch (error) {
    console.error('Error:', error)
    return error
  }
}