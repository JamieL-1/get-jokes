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
import { iState } from '../../utils';

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
		const { selectedCategories } = await import('../../utils')
		const { data, status } = await axios.get(
			`https://v2.jokeapi.dev/joke/${selectedCategories(categories) || 'Any'}?safe-mode&amount=10${search}`,
		)

		if (status === SUCCESS) {
			dispatch(setFilters(selectedCategories(categories) || 'Any'))
		}

		return data
	}

	const queryClient = useQueryClient()

	const categoryOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setCategories((prevCategories: iState) => ({ ...prevCategories, [e.target.name]: e.target.checked }))
		const { selectedCategories } = await import('../../utils')
		await dispatch(setFilters(selectedCategories(categories) || 'Any'))
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
