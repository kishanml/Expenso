import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/constant";

export const userAuthApi = createApi({
    reducerPath: "userAuthApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}api/user/`,
    }),

    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (user) => {
                return {
                    url: "register/",
                    method: "POST",
                    body: user,
                    headers: {
                        "Content-type": "application/json",
                    },
                };
            },
        }),
        verifyEmail: builder.query({
            query: (token) => {
                return {
                    url: `email-verify/?token=${token}`,
                    method: "GET",
                };
            },
        }),

        loginUser: builder.mutation({
            query: (user) => {
                return {
                    url: "login/",
                    method: "POST",
                    body: user,
                    headers: {
                        "Content-type": "application/json",
                    },
                };
            },
        }),
        edituser: builder.mutation({
            query: ({ access_token, id, body }) => {
                console.log(id);
                return {
                    url: `profile/?id=${id}`,
                    method: "PUT",
                    body: body,
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${access_token}`,
                    },
                };
            },
        }),

        getLoggedUser: builder.query({
            query: (access_token) => {
                console.log("coming heree")
                return {
                    url: "profile/",
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${access_token}`,
                    },
                };
            },
        }),

        changeUserPassword: builder.mutation({
            query: ({ form, access_token }) => {
                return {
                    url: "changepassword/",
                    method: "POST",
                    body: form,
                    headers: {
                        authorization: `Bearer ${access_token}`,
                    },
                };
            },
        }),

        sendPasswordResetEmail: builder.mutation({
            query: (user) => {
                return {
                    url: "send-reset-password-email/",
                    method: "POST",
                    body: user,
                    headers: {
                        "Content-type": "application/json",
                    },
                };
            },
        }),

        resetPassword: builder.mutation({
            query: ({ form, uid, token }) => {
                return {
                    url: `reset-password/${uid}/${token}/`,
                    method: "POST",
                    body: form,
                    headers: {
                        "Content-type": "application/json",
                    },
                };
            },
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useVerifyEmailQuery,
    useLoginUserMutation,
    useEdituserMutation,
    useGetLoggedUserQuery,
    useChangeUserPasswordMutation,
    useSendPasswordResetEmailMutation,
    useResetPasswordMutation,
} = userAuthApi;
