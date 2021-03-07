import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';

interface Props {
	joke?: string;
	punchline?: string;
	type?: string;
	category?: string;
	isFetching?: boolean;
}

const useStyles = makeStyles({
	root: {
		minWidth: 275,
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

const SimpleCard: React.FC<Props> = ({
	joke, punchline, type, category, isFetching,
}) => {
	const classes = useStyles();

	return (
		<Card className={classes.root} variant="outlined">
			<CardContent>
				<Typography className={classes.title} color="textSecondary" gutterBottom>
					{
						isFetching
							? <Skeleton />
							: type
					}
				</Typography>
				<Typography variant="h5" component="h2">
					{
						isFetching
							? <Skeleton />
							: joke
					}
				</Typography>
				<Typography className={classes.pos} color="textSecondary">
					{
						isFetching
							? <Skeleton />
							: punchline
					}
				</Typography>
				<Typography variant="body2" component="p">
					{
						isFetching
							? <Skeleton />
							: category
					}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default SimpleCard
