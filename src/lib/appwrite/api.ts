import { ID } from "appwrite";
import { INewUser } from "../types/types";
import { account } from "./config";


// SIGN UP USER
export const createUserAccount = async (user:INewUser) => {
  try {
    
    const newAccount = await account.create(
      ID.unique(), // id generated from appwrite
      user.email,
      user.password,
      user.name,
    )
    
    return newAccount
  } catch (error) {
    // Si ocurre un error, lo manejamos aquí
    console.error('Error al obtener los datos:', error)
    return error
  }
}