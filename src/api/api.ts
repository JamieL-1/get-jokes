/* eslint-disable import/prefer-default-export */
import axios from 'axios'

export const getJokes = async (filters: string, search: string) => {
	const { data } = await axios.get(
		`https://v2.jokeapi.dev/joke/${filters}?safe-mode&amount=10${search}`,
	)
	return data
}

export const getJokeInfo = async () => {
	const { data } = await axios.get(
		'https://v2.jokeapi.dev/info',
	)
	return data
}
