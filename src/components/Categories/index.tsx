import {
	useQuery,
	useQueryClient,
} from 'react-query';
import axios from 'axios';
import {
	Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, makeStyles,
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

const useStyles = makeStyles({
	formGroup: {
		flexDirection: 'row',
	},
	container: {
		padding: 5,
		margin: '15px 0px',
		width: '100%',
	},
});

const selectedCategories = (categories: iState) => {
	let tempSelectedCategories = ''
	Object.keys(categories).forEach((category: string) => {
		if (categories[category]) {
			tempSelectedCategories += `${category},`
		}
	})
	return tempSelectedCategories.slice(0, -1)
}

function Categories() {
	const dispatch = useAppDispatch()
	const search = useAppSelector(selectSearch)
	const classes = useStyles();

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
		const { data, status } = await axios.get(
			`https://v2.jokeapi.dev/joke/${selectedCategories(categories) || 'Any'}?safe-mode&amount=10${search}`,
		)

		if (status === SUCCESS) {
			dispatch(setFilters(selectedCategories(categories) || 'Any'))
		}

		return data
	}

	const queryClient = useQueryClient()

	const categoryOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCategories((prevCategories: iState) => ({ ...prevCategories, [e.target.name]: e.target.checked }))
		dispatch(setFilters(selectedCategories(categories) || 'Any'))
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
		<FormControl component="fieldset" className={classes.container}>
			<FormLabel component="legend">Select category / categories</FormLabel>
			<FormGroup className={classes.formGroup}>
				{jokeInfo.status === 'loading' && (
					<Skeleton width="100%" height={42} />
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
