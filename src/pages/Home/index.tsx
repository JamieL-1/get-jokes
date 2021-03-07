import {
	useQuery,
} from 'react-query';
import axios from 'axios';
import { makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import JokeCard from '../../components/JokeCard';
import Categories from '../../components/Categories';
import SearchInput from '../../components/SearchInput'
import { getJokeInfo } from '../../api/api';

interface JokesAPI {
	id: number;
	setup: string;
	delivery: string;
	punchline: string;
	joke: string
	type: string;
	category: string;
	isFetching: boolean;
}

const useStyles = makeStyles({
	textContainer: {
		margin: '15px 0px',
	},
});

function App() {
	const classes = useStyles()

	const getJoke = async () => {
		const { data } = await axios.get(
			'https://v2.jokeapi.dev/joke/Any?safe-mode&amount=10',
		)
		return data
	}

	// Considering we know how many jokes are available on initial load we can create an array with equal
	// amount of items to indicate to the user when the elements are loading.
	const tempData = []
	for (let i = 0; i < 10; i += 1) {
		tempData.push(i)
	}

	const jokes = useQuery('jokes', getJoke, { refetchOnWindowFocus: false });
	const jokeInfo = useQuery('jokesInfo', getJokeInfo)

	return (
		<>
			<div>
				<Typography variant="h3">Get Jokes</Typography>
				{jokeInfo.status === 'loading' && (
					<Skeleton width={170} height={56} />
				)}
				{jokeInfo.status === 'success' && (
					<Typography variant="h6" component="h4">{`Available Jokes: ${jokeInfo?.data?.jokes?.totalCount}`}</Typography>
				)}
			</div>
			<div className={classes.textContainer}>
				<Typography color="textSecondary">Welcome to, Get Jokes. To search for a joke just type into the search bar.</Typography>
				<Typography color="textSecondary">You&apos;re also able to filter by as many categories as you wish by clicking the checkboxes.</Typography>
			</div>
			<SearchInput />
			<Categories />
			{jokes.status === 'loading' && (
				tempData.map((id: number) => (
					<div key={id}>
						<div style={{ padding: 5 }}>
							<JokeCard
								isFetching={jokes.isFetching}
							/>
						</div>
					</div>
				))
			)}

			{jokes.status === 'error' && (
				<div>Error fetching data</div>
			)}

			{jokes.status === 'success' && (
				jokes.data?.error
					? <h2>{jokes.data.additionalInfo}</h2>
					: (jokes.data?.jokes.map((joke: JokesAPI) => (
						<div key={joke.id}>
							<div style={{ padding: 5 }}>
								<JokeCard
									joke={joke.setup || joke.joke}
									punchline={joke.delivery}
									type={joke.type}
									category={joke.category}
									isFetching={jokes.isFetching}
								/>
							</div>
						</div>
					)))
			)}
		</>
	);
}

export default App;
