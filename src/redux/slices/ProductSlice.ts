import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Alert } from "react-native";

const PRODUCT_API = "https://dummyjson.com/products";
interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
}
interface ProductState {
  products: Product[];
  loading: boolean
}
const initialState: ProductState = {
  products: [],
  loading: false
};
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await axios.get<{ products: Product[] }>(PRODUCT_API);
  return response.data.products;
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        Alert.alert("failed to load products")
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
