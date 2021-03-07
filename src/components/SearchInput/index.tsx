import React, { useEffect, useRef, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilters, setSearch } from '../../reducers/jokes/jokesSlice';
import { SUCCESS } from '../../utils/constants';

const useStyles = makeStyles((theme: Theme) => createStyles({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
}));

export default function SearchInput() {
	const dispatch = useDispatch()
	const filters = useSelector(selectFilters)
	const classes = useStyles();

	const [searchValue, setSearchValue] = useState<string>('')

	const init = useRef<boolean>(false)

	const getJoke = async () => {
		const { data, status } = await axios.get(
			`https://v2.jokeapi.dev/joke/${filters}?safe-mode&amount=10&contains=${searchValue}`,
		)

		if (status === SUCCESS) {
			dispatch(setSearch(`${searchValue ? `&contains=${searchValue}` : ''}`))
		}
		return data
	}

	const queryClient = useQueryClient()

	const getNewJoke = async () => queryClient.fetchQuery('jokes', getJoke)

	useEffect(() => {
		if (init.current) {
			const timeout = setTimeout(() => {
				getNewJoke()
			}, 1000);
			return () => clearTimeout(timeout);
		}
		init.current = true
		return () => clearTimeout();
	}, [searchValue]);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	return (
		<Paper component="form" className={classes.root}>
			<InputBase
				onChange={handleOnChange}
				className={classes.input}
				placeholder="Search Jokes"
				inputProps={{ 'aria-label': 'search jokes' }}
			/>
			<IconButton className={classes.iconButton} aria-label="search">
				<SearchIcon />
			</IconButton>
		</Paper>
	);
}
