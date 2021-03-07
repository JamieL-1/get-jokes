import { makeStyles } from '@material-ui/core';
import React, { lazy, Suspense } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from 'react-router-dom';

const Home = lazy(() => import('../../pages/Home'))

const renderLoader = () => <p>loading</p>

const useStyles = makeStyles({
	root: {
		maxWidth: 800,
		margin: 'auto',
		padding: 15,
	},
});

function App() {
	const classes = useStyles()
	return (
		<div className={classes.root}>
			<Suspense fallback={renderLoader()}>
				<Router>
					<Switch>
						<Route path="/">
							<Home />
						</Route>
					</Switch>
				</Router>
			</Suspense>
		</div>
	);
}

export default App;
