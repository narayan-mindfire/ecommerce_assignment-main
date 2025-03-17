import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, persistor } from "../redux/store"
import { authenticateUser, authenticateWithGoogle, authenticateWithFacebook, logoutUser } from "../redux/slices/authSlice";
import { productPersistConfig } from "../redux/reducer";
import { purgeStoredState } from "redux-persist";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, error, authMethod } = useSelector((state: RootState) => state.auth);

  const loginWithPassword = (username: string, password: string) => {
    dispatch(authenticateUser({ username, password }));
  };

  const loginWithGoogle = () => {
    dispatch(authenticateWithGoogle());
  };

  const loginWithFacebook = () => {
    dispatch(authenticateWithFacebook());
  };

  const logout = async () => {
    console.log("logging out user")
    dispatch(logoutUser());
            await persistor.purge();
            purgeStoredState(productPersistConfig).then(() => {
                console.log('Purge completed');
              }); 
  };

  return {
    user,
    token,
    error,
    authMethod,
    loginWithPassword,
    loginWithGoogle,
    loginWithFacebook,
    logout,
  };
};
