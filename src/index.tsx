import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
	createMuiTheme, CssBaseline, ThemeProvider, useMediaQuery,
} from '@material-ui/core';
import { Provider } from 'react-redux';
import App from './layout/App';
import { store } from './store';

const CssWrappedApp = () => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = useMemo(
		() => createMuiTheme({
			palette: {
				type: prefersDarkMode ? 'dark' : 'light',
			},
		}),
		[prefersDarkMode],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	)
}

const queryClient = new QueryClient()

ReactDOM.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<CssWrappedApp />
			</Provider>
		</QueryClientProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
