import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Favorite from '@material-ui/icons/Favorite';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Save from '@material-ui/icons/Save';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ThumbUp from '@material-ui/icons/ThumbUp';
import { UPDATE_MOVIE_URL, ROOT_URL } from '../conf/index';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import ReactPlayer from 'react-player';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
	root: {
		margin: 0
	},
	grow: {
		flexGrow: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		}
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing.unit,
			width: 'auto'
		}
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	inputRoot: {
		color: 'inherit',
		width: '100%'
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 120,
			'&:focus': {
				width: 200
			}
		}
	},
	closeButton: {
		position: 'absolute',
		right: 8,
		top: 8,
		color: theme.palette.grey[500]
	},
	appBar: {
		position: 'relative'
	},
	icon: {
		color: 'red',
		'&:hover': {
			color: 'white',
			backgroundColor: 'RGBA(255, 0, 0, 0.5)'
		}
	},
	favicon: {
		color: 'red'
	},
	aicon: {
		marginRight: theme.spacing.unit * 2,
		marginTop: theme.spacing.unit * 2
	},
	bicon: {
		marginLeft: theme.spacing.unit * 1
	},
	iconLiked: {
		color: 'white',
		backgroundColor: 'RGBA(255, 0, 0, 0.7)',
		'&:hover': {
			backgroundColor: 'RGBA(0, 0, 255, 0.8)'
		}
	},
	iconBlue: {
		color: 'blue'
	},
	heroUnit: {
		backgroundColor: theme.palette.background.paper
	},
	heroContent: {
		maxWidth: '90%',
		margin: '0 auto',
		padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit}px`
	},
	heroButtons: {
		marginTop: theme.spacing.unit * 4
	},
	layout: {
		width: 'auto',
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
			width: 1100,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	cardGrid: {
		padding: `${theme.spacing.unit * 2}px 0`
	},
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column'
	},
	cardMedia: {
		height: 475,
		width: 320
		// paddingTop: '56.25%' // 16:9
	},
	cardContent: {
		flexGrow: 1
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing.unit * 6
	},
	backBtn: {
		position: 'absolute'
	},
	control: {
		padding: 10,
		height: 500
	}
});

const DialogTitle = withStyles(styles)(props => {
	const { children, classes, onClose } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root}>
			<Typography variant='h6'>{children}</Typography>
			{onClose ? (
				<IconButton aria-label='Close' className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles(theme => ({
	root: {
		padding: 16
	}
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
	root: {
		margin: 0,
		padding: 8
	}
}))(MuiDialogActions);

class Product extends Component {
	constructor(props) {
		super(props);
		this.state = {
			state: '',
			isLiked: false,
			localCount: 0,
			open: false
		};
	}

	handleBackHome = () => {
		this.props.isShowingmovies(false);
	};

	handleLike = () => {
		this.setState({ isLiked: true, localCount: this.state.localCount + 1 });
		let { moviesData } = this.props;
		let new_like_count = moviesData.like_count + 1;
		let movie = { ...moviesData, like_count: new_like_count };
		axios.put(`${UPDATE_MOVIE_URL}`, { movie: movie }).then(res => {
			NotificationManager.success('You liked this movie.', 'Like!', 5000);
		});
	};

	handleClickOpen = () => {
		this.setState({
			open: true
		});
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	componentDidMount() {
		let { moviesData } = this.props;
		this.setState({ localCount: moviesData.like_count });
	}

	render() {
		const { classes, moviesData } = this.props;
		const { isLiked, localCount } = this.state;

		return (
			<React.Fragment>
				<Dialog
					onClose={this.handleClose}
					aria-labelledby='customized-dialog-title'
					open={this.state.open}
					maxWidth='md'
				>
					<DialogTitle id='customized-dialog-title' onClose={this.handleClose}>
						{moviesData.name}
					</DialogTitle>
					<DialogContent>
						<ReactPlayer url={moviesData.url} width={850} height={480} playing />
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color='primary'>
							Close
						</Button>
					</DialogActions>
				</Dialog>
				<div className={classes.root}>
					<AppBar position='static'>
						<Toolbar>
							<IconButton
								className={classes.menuButton}
								color='inherit'
								aria-label='Open drawer'
								onClick={this.handleBackHome}
							>
								<ArrowBack />
							</IconButton>
							<Typography className={classes.title} variant='h6' color='inherit' noWrap>
								{moviesData.name}
							</Typography>
						</Toolbar>
					</AppBar>
				</div>
				<main>
					<div className={classes.heroUnit}>
						<div className={classes.heroContent}>
							<Typography component='h2' variant='h3' align='center' color='textPrimary' gutterBottom>
								Movie Details
							</Typography>
						</div>
					</div>
					<div className={classNames(classes.layout, classes.cardGrid)}>
						{/* End hero unit */}
						<Grid container spacing={16}>
							<Grid item xs={12} sm={12} md={5} lg={5}>
								<Card style={{ width: 320, margin: '0 auto' }}>
									<CardMedia
										className={classes.cardMedia}
										image={`${ROOT_URL}/${moviesData.photo}`}
										title='Movie Image'
									/>
									<CardActions>
										<IconButton className={classes.favicon}>
											<Favorite />
										</IconButton>
										<span style={{ fontSize: 16 }}>{localCount}</span>
										{!isLiked && (
											<IconButton
												className={classes.icon}
												style={{ marginLeft: 'auto' }}
												onClick={this.handleLike}
											>
												<ThumbUp />
											</IconButton>
										)}
										{isLiked && (
											<IconButton className={classes.iconLiked} style={{ marginLeft: 'auto' }}>
												<ThumbUp />
											</IconButton>
										)}
									</CardActions>
								</Card>
							</Grid>
							<Grid item xs={12} sm={12} md={7} lg={7}>
								<Typography variant='h5' align='left' color='textPrimary' gutterBottom>
									Name: {moviesData.name} (${moviesData.purchaseprice})
								</Typography>
								<Typography component='p' align='left' color='textPrimary' gutterBottom>
									Duration: {moviesData.duration}
								</Typography>
								<Typography component='p' align='left' color='textPrimary' gutterBottom>
									Genre: {moviesData.genre}
								</Typography>
								<Typography component='p' align='left' color='textPrimary' gutterBottom>
									Stars: {moviesData.cast}
								</Typography>
								<Typography component='p' align='left' color='textPrimary' gutterBottom>
									Director: {moviesData.director}
								</Typography>
								<Typography component='p' align='left' color='textPrimary' gutterBottom>
									Summary: {moviesData.summary}
								</Typography>
								<Typography component='p' align='left' color='textPrimary' gutterBottom>
									Review: Excellent
								</Typography>
								<Typography component='p' align='left' color='textPrimary' gutterBottom>
									Rating: {moviesData.rating}
								</Typography>
								<Button variant='outlined' color='primary' className={classes.aicon}>
									Save for Later
									<Save className={classes.bicon} />
								</Button>
								<Button variant='contained' color='primary' className={classes.aicon}>
									Purchase Movie {`($${moviesData.purchaseprice})`}
								</Button>
								<Button variant='contained' color='primary' className={classes.aicon}>
									Rent Movie {`($${moviesData.rentalprice})`}
								</Button>
								<br />
								<br />
								<Button
									variant='contained'
									color='secondary'
									className={classes.aicon}
									onClick={this.handleClickOpen}
								>
									Watch <PlayCircleOutline className={classes.bicon} />
								</Button>
							</Grid>
						</Grid>
					</div>
				</main>
			</React.Fragment>
		);
	}
}

Product.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Product);
