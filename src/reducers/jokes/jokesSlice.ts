/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface jokesState {
	filters: string;
	search: string;
}

const initialState: jokesState = {
	filters: 'Any',
	search: '',
};

export const jokesSlice = createSlice({
	name: 'jokes',
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

export const { setFilters, setSearch } = jokesSlice.actions;

export const selectFilters = (state: RootState) => state.jokes.filters;
export const selectSearch = (state: RootState) => state.jokes.search

export default jokesSlice.reducer;
