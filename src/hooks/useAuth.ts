import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store"
import { authenticateUser, authenticateWithGoogle, authenticateWithFacebook, logoutUser } from "../redux/slices/authSlice";
import { resetState } from "../redux/middlewares/resetMiddleware";

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

  const logout = () => {
    console.log("logging out user")
    dispatch(resetState());
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
