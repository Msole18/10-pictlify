import { ID, Query } from 'appwrite'
import { INewUser } from '../../types/types'
import { account, appWriteConfig, avatars, databases } from './config'

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
    return error;
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
    return error
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