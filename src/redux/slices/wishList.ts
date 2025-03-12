import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const wishlistAdapter = createEntityAdapter<WishlistItem>();

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: wishlistAdapter.getInitialState(),
  reducers: {
    addToWishlist: wishlistAdapter.addOne,
    removeFromWishlist: wishlistAdapter.removeOne,
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export const { selectAll: selectWishlistItems } = wishlistAdapter.getSelectors((state: RootState) => state.wishlist);
