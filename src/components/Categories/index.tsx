import {
	useQuery,
	useQueryClient,
} from 'react-query';
import axios from 'axios';
import {
	Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel,
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import { selectSearch, setFilters } from '../../reducers/jokes/jokesSlice'
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getJokeInfo } from '../../api/api';
import { SUCCESS } from '../../utils/constants';

// Rather than defining each state value as all the values are boolean
// just define the key as string so we can object keys/foreach over it
interface iState {
	[key: string]: boolean;
}

function Categories() {
	const dispatch = useAppDispatch()
	const search = useAppSelector(selectSearch)

	// Need to define default value for controlled components
	const [categories, setCategories] = useState<iState>({
		Programming: false,
		Misc: false,
		Pun: false,
		Spooky: false,
		Christmas: false,
		Any: false,
	})

	const init = useRef<boolean>(false)

	const getJokes = async () => {
		let selectedCategories = ''
		Object.keys(categories).forEach((category: string) => {
			if (categories[category]) {
				selectedCategories += `${category},`
			}
		})

		const { data, status } = await axios.get(
			`https://v2.jokeapi.dev/joke/${selectedCategories.slice(0, -1) || 'Any'}?safe-mode&amount=10${search}`,
		)

		if (status === SUCCESS) {
			dispatch(setFilters(selectedCategories.slice(0, -1) || 'Any'))
		}

		return data
	}

	const queryClient = useQueryClient()

	const categoryOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCategories((prevCategories: iState) => ({ ...prevCategories, [e.target.name]: e.target.checked }))
		let selectedCategories = ''
		Object.keys(categories).forEach((category: string) => {
			if (categories[category]) {
				selectedCategories += `${category},`
			}
		})
		dispatch(setFilters(selectedCategories.slice(0, -1) || 'Any'))
	}

	const getNewJoke = async () => queryClient.fetchQuery('jokes', getJokes)

	useEffect(() => {
		if (init.current) {
			getNewJoke()
		}
		init.current = true
	}, [categories])

	const jokeInfo = useQuery('jokesInfo', getJokeInfo)

	return (
		<FormControl component="fieldset" style={{ padding: 5, margin: '15px 0px', width: '100%' }}>
			<FormLabel component="legend">Select category / categories</FormLabel>
			<FormGroup style={{ flexDirection: 'row' }}>
				{jokeInfo.status === 'loading' && (
					<Skeleton width="100%" />
				)}
				{jokeInfo.status === 'error' && (
					<div>Error fetching data</div>
				)}
				{
					jokeInfo.status === 'success' && (
						jokeInfo.data.jokes.categories.map((category: string) => (
							category !== 'Dark' && (
								<FormControlLabel
									key={category}
									control={<Checkbox onChange={categoryOnChange} checked={categories[category]} name={category} color="primary" />}
									label={category}
								/>
							)
						))
					)
				}
			</FormGroup>
		</FormControl>
	);
}

export default Categories;
