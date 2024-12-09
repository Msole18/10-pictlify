import { Client, Account, Databases, Storage, Avatars} from 'appwrite'

export const appWriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_USER_COLLECTION_ID,
  postCollectionId: import.meta.env.VITE_POST_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_SAVES_COLLECTION_ID,
}

export const client= new Client()

client
      .setProject(appWriteConfig.projectId)
      .setEndpoint(appWriteConfig.url)

export const account = new Account(client)
export const dataBases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)
