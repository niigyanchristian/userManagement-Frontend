import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchOrganizations } from './thunks';
import { InvitesInfo, Organization, OrganizationState } from '../types/interfaces';

const initialState: OrganizationState = {
    organizations: [],
    organizationUsers: [],
    loading: false,
    error: null,
}

export const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        setOrganization: (state, action: PayloadAction<OrganizationState['organizations']>) => {
            state.organizations = action.payload
        },
        setOrganizationUsers: (state, action: PayloadAction<InvitesInfo[]>) => {
            state.organizationUsers = action.payload
        },
        clearOrganization: (state) => {
            state.organizations = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrganizations.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchOrganizations.fulfilled,
                (state, action: PayloadAction<Organization[]>) => {
                    state.organizations = action.payload;
                    state.loading = false;
                    state.error = null;
                },
            )
            .addCase(
                fetchOrganizations.rejected,
                (state, action: PayloadAction<unknown>) => {
                    state.loading = false;
                    state.error = action.payload as string;
                },
            )
    },
})

export const { setOrganization, clearOrganization, setOrganizationUsers } = organizationSlice.actions

export default organizationSlice.reducer