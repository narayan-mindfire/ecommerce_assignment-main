import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

interface Product {
    id: number;
    title: string;
    price: number;
    images: string[];
  }

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: "https://dummyjson.com"}),
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], void>({
            query: () => "/products",
            transformResponse: (response: {products : Product[]}) => response.products
        })
    })
})

export const {useGetProductsQuery} = apiSlice;
export default apiSlice