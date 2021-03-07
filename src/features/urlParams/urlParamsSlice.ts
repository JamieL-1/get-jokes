/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface urlParamsState {
	filters: string;
	search: string;
}

const initialState: urlParamsState = {
	filters: 'Any',
	search: '',
};

export const urlParamsSlice = createSlice({
	name: 'urlParams',
	initialState,
	reducers: {
		setFilters: (state, action: PayloadAction<string>) => {
			state.filters = action.payload;
		},
		setSearch: (state, action: PayloadAction<string>) => {
			state.search = action.payload;
		},
	},
});

export const { setFilters, setSearch } = urlParamsSlice.actions;

export const selectFilters = (state: RootState) => state.urlParams.filters;
export const selectSearch = (state: RootState) => state.urlParams.search

export default urlParamsSlice.reducer;
