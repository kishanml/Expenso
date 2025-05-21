import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/constant";

export const expenseApi = createApi({
    reducerPath: "expenseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}expense/`,
    }),

    endpoints: (builder) => ({
        addExpense: builder.mutation({
            query: ({ expenseData, access_token }) => {
                return {
                    url: "",
                    method: "POST",
                    body: expenseData,
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${access_token}`,
                    },
                };
            },
        }),
        uploadExpenseWithFile: builder.mutation({
            query: ({ file, access_token }) => {
              const formData = new FormData();
              formData.append("file", file);
      
              return {
                url: "",
                method: "POST",
                body: formData,
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              };
            },
          }),
        getAllExpense: builder.query({
            query: ({ access_token }) => {
                return {
                    url: "",
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${access_token}`,
                    },
                };
            },
        }),
        getExpenseById: builder.query({
            query: ({ access_token, id }) => {
                return {
                    url: "?id=" + id,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${access_token}`,
                    },
                };
            },
        }),

        editExpense: builder.mutation({
            query: ({ access_token, expenseData }) => {
                return {
                    url: "?id=" + expenseData.id,
                    method: "PUT",
                    body: expenseData,
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${access_token}`,
                    },
                };
            },
        }),

        deleteExpense: builder.mutation({
            query: ({ id, access_token }) => {
                return {
                    url: "?id=" + id,
                    method: "DELETE",
                    headers: {
                        authorization: `Bearer ${access_token}`,
                    },
                };
            },
        }),


    }),
});

export const {
    useAddExpenseMutation,
    useUploadExpenseWithFileMutation,
    useLazyGetAllExpenseQuery,
    useGetAllExpenseQuery,
    useGetExpenseByIdQuery,
    useEditExpenseMutation,
    useDeleteExpenseMutation,
} = expenseApi;
