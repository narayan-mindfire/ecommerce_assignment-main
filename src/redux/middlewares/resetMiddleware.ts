import { Middleware } from "@reduxjs/toolkit";
import { logoutUser } from "../slices/authSlice";
import { persistor, RootState } from "../store";
logoutUser

import purgeStoredState from "redux-persist/es/purgeStoredState";
import { productPersistConfig } from "../reducer";

export const RESET_STATE = "RESET_STATE";

export const resetMiddleware: Middleware<
{},
RootState
> = ({dispatch}) => (next) => async (action : any) => {
    if (action.type === RESET_STATE) {
        dispatch(logoutUser() as any);
        await persistor.purge();
        purgeStoredState(productPersistConfig).then(() => {
            console.log('Purge completed');
          });   
    }
    return next(action);
};
export const resetState = () => ({
    type: RESET_STATE,
});