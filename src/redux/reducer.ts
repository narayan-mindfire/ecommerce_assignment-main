import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import createSecureStore from "redux-persist-expo-securestore"
import themeReducer from "./slices/ThemeSlice"
import productReducer from "./slices/ProductSlice"
import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishList"
import apiSlice from "./slices/apiSlice"

const themePersistConfig = {
    storage: AsyncStorage,
    key: "theme",
    whiteList: ["mode"]
  }
  
export const productPersistConfig = {
    storage: AsyncStorage,
    key: "products",
    // whiteList: ["mode"]
  } 

const wishlistPersistConfig = {
  storage: AsyncStorage,
  key: "wishlist",
}
  
  const secureStorage = createSecureStore()
  
  const userPersistConfig = {
    storage: secureStorage,
    key: "auth",
    whiteList: ["user", "token"]
  }

  
  const rootReducer = combineReducers({
    auth: persistReducer(userPersistConfig, authReducer),
    theme: persistReducer(themePersistConfig, themeReducer),
    product: persistReducer(productPersistConfig,productReducer),
    [apiSlice.reducerPath] : apiSlice.reducer,
    wishlist: persistReducer(wishlistPersistConfig, wishlistReducer)
  })
  
export default rootReducer