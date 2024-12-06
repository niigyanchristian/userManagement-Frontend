import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrganizations = createAsyncThunk(
    "organizations/fetchOrganizations",
    async (_arg, thunkAPI) => {
        const token = localStorage.getItem("accesstoken");

        try {
            const response = await axios.get("http://localhost:3000/api/organization", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });

            return response.data.organizations;
        } catch (error: unknown) {
            let errorMessage = "Something went wrong";



            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    errorMessage = error.response?.status.toString();
                } else {
                    errorMessage = error.response?.data?.message || error.message || errorMessage;

                }
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

