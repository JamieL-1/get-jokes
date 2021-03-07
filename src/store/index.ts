import { configureStore } from '@reduxjs/toolkit'
import urlParamsReducer from '../features/urlParams/urlParamsSlice'

export const store = configureStore({
	reducer: {
		urlParams: urlParamsReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
