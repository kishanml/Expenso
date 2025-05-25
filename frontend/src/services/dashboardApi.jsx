import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/constant";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}dashboard/`,
    }),
    endpoints: (builder) => ({
        getDashboardData: builder.query({
            query: ({ access_token, type = "weekly", path = "overview" }) => ({
                url: `${path}/?type=${type}`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            }),
        }),
    }),
});

export const {
    useGetDashboardDataQuery,
    useLazyGetDashboardDataQuery,
} = dashboardApi;
