import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import { PostState } from '../types/interfaces';
import axios from 'axios';

const initialState: PostState = {
    posts: [],
    loading: false,
    error: null,
}

export const createPost = createAsyncThunk(
    "posts/createPost",
    async ({ title, description, organization_id }: { title: string, description: string, organization_id: string }, thunkAPI) => {
        const token = localStorage.getItem("accesstoken");

        try {
            const response = await axios.post(`http://localhost:3000/api/posts`, { title, description, organization_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            return response.data.posts;
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

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async ({ orgId }: { orgId: string }, thunkAPI) => {
        const token = localStorage.getItem("accesstoken");

        try {
            const response = await axios.get(`http://localhost:3000/api/posts/org/${orgId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });

            return response.data.posts;
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

export const updatePosts = createAsyncThunk(
    "posts/updatePosts",
    async ({ title, description, id }: { title: string, description: string, id: number }, thunkAPI) => {
        const token = localStorage.getItem("accesstoken");

        try {
            const response = await axios.put(`http://localhost:3000/api/posts/${id}`, { title, description }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });

            return response.data.posts;
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

export const deletePosts = createAsyncThunk(
    "posts/deletePosts",
    async ({ id }: { id: number }, thunkAPI) => {
        const token = localStorage.getItem("accesstoken");

        try {
            const response = await axios.delete(`http://localhost:3000/api/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.posts;
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



export const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<PostState['posts']>) => {
            state.posts = action.payload
        },
        clearPost: (state) => {
            state.posts = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchPosts.fulfilled,
                (state, action: PayloadAction<[]>) => {
                    state.posts = action.payload.reverse();
                    state.loading = false;
                    state.error = null;
                },
            )
            .addCase(
                fetchPosts.rejected,
                (state, action: PayloadAction<unknown>) => {
                    state.loading = false;
                    state.error = action.payload as string;
                },
            )
            .addCase(updatePosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                updatePosts.fulfilled,
                (state) => {
                    state.loading = false;
                    state.error = null;
                },
            )
            .addCase(
                updatePosts.rejected,
                (state, action: PayloadAction<unknown>) => {
                    state.loading = false;
                    state.error = action.payload as string;
                },
            )
            .addCase(deletePosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                deletePosts.fulfilled,
                (state) => {
                    state.loading = false;
                    state.error = null;
                },
            )
            .addCase(
                deletePosts.rejected,
                (state, action: PayloadAction<unknown>) => {
                    state.loading = false;
                    state.error = action.payload as string;
                },
            )
            .addCase(createPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                createPost.fulfilled,
                (state) => {
                    state.loading = false;
                    state.error = null;
                },
            )
            .addCase(
                createPost.rejected,
                (state, action: PayloadAction<unknown>) => {
                    state.loading = false;
                    state.error = action.payload as string;
                },
            )
    },
})

export const { setPosts, clearPost, } = organizationSlice.actions

export default organizationSlice.reducer