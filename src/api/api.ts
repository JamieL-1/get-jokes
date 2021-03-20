/* eslint-disable import/prefer-default-export */
import axios from 'axios'

export const getJokeInfo = async () => {
	const { data } = await axios.get(
		'https://v2.jokeapi.dev/info',
	)
	return data
}
