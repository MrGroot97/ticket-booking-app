import { createSlice } from '@reduxjs/toolkit'

const loaderSlice = createSlice({
    name: 'loader',
    initialState: {
        loading: false
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        hideLoading: (state) => {
            state.loading = false
        }
    }
})

export const { setLoading, hideLoading } = loaderSlice.actions
export default loaderSlice.reducer