import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Favorite from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
// import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { GET_MOVIES_URL, ROOT_URL } from '../conf/index';
import axios from 'axios';

const styles = theme => ({
	root: {
		width: '100%'
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
	appBar: {
		position: 'relative'
	},
	icon: {
		color: 'red'
	},
	iconBlue: {
		color: 'blue'
	},
	heroUnit: {
		backgroundColor: theme.palette.background.paper
	},
	heroContent: {
		maxWidth: 600,
		margin: '0 auto',
		padding: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 4}px`
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
		flexDirection: 'column',
		'&:hover': {
			cursor: 'pointer',
			background: 'rgba(0, 0, 0, 0.1)'
		}
	},
	cardMedia: {
		height: 190,
		paddingTop: '56.25%' // 16:9
	},
	cardContent: {
		flexGrow: 1
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing.unit * 6
	},
	textFieldInputTitle: {
		fontSize: 16,
		background: '#f3f3f3',
		padding: '16px 32px',
		borderRadius: 30,
		marginTop: theme.spacing.unit,
		transition: theme.transitions.create(['background-color', 'box-shadow'], {
			duration: theme.transitions.duration.complex * 2
		}),
		'&:focus': {
			backgroundColor: '#e3e3e3',
			boxShadow: '0 0 0 0.2rem #d3d3d3'
		}
	}
});

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allmovies: [],
			name: '',
			searchedMovies: []
		};
	}

	handleShowmovies = movie => {
		this.props.getmoviesData(movie);
		this.props.isShowingmovies(true);
	};

	handleChangeTextField = e => {
		this.setState({ [e.target.name]: e.target.value });
		const { allmovies } = this.state;
		let searchKey = e.target.value;
		let searchResutls = allmovies.filter(movie => movie.name.toLowerCase().includes(searchKey.toLowerCase()));
		this.setState({ searchedMovies: searchResutls });
	};

	async componentDidMount() {
		await axios.get(`${GET_MOVIES_URL}`).then(res => {
			this.setState({ allmovies: [...res.data.data] });
		});
	}

	render() {
		const { classes } = this.props;
		const { allmovies, name, searchedMovies } = this.state;
		return (
			<React.Fragment>
				<div className={classes.root}>
					<AppBar position='static'>
						<Toolbar>
							{/* <IconButton className={classes.menuButton} color='inherit' aria-label='Open drawer'>
								<MenuIcon />
							</IconButton> */}
							<Typography className={classes.title} variant='h6' color='inherit' noWrap>
								M-Rent
							</Typography>
							<div className={classes.grow} />
							<div className={classes.search}>
								<div className={classes.searchIcon}>
									<SearchIcon />
								</div>
								<InputBase
									placeholder='Search…'
									classes={{
										root: classes.inputRoot,
										input: classes.inputInput
									}}
									name='name'
									value={name}
									onChange={this.handleChangeTextField}
								/>
							</div>
						</Toolbar>
					</AppBar>
				</div>
				<main>
					<div className={classes.heroUnit}>
						<div className={classes.heroContent}>
							<Typography component='h1' variant='h3' align='center' color='textPrimary' gutterBottom>
								M-Rent
							</Typography>
						</div>
					</div>
					<div className={classNames(classes.layout, classes.cardGrid)}>
						{/* End hero unit */}
						<Grid container spacing={16}>
							{name === '' &&
								allmovies.map((movie, index) => (
									<Grid item key={index} xs={12} sm={6} md={3} lg={3}>
										<Card className={classes.card} onClick={() => this.handleShowmovies(movie)}>
											<CardMedia
												className={classes.cardMedia}
												image={`${ROOT_URL}/${movie.photo}`}
												title={movie.name}
											/>
											<CardContent className={classes.cardContent}>
												<Typography gutterBottom variant='h5' component='h2'>
													{movie.name} (${movie.purchaseprice})
												</Typography>
												<Typography>Rating: {movie.rating}</Typography>
											</CardContent>
											<CardActions>
												<IconButton className={classes.icon}>
													<Favorite />
												</IconButton>
												<span style={{ fontSize: 16 }}>{movie.like_count}</span>
											</CardActions>
										</Card>
									</Grid>
								))}
							{name !== '' &&
								searchedMovies.length !== 0 &&
								searchedMovies.map((movie, index) => (
									<Grid item key={index} xs={12} sm={6} md={3} lg={3}>
										<Card className={classes.card} onClick={() => this.handleShowmovies(movie)}>
											<CardMedia
												className={classes.cardMedia}
												image={`${ROOT_URL}/${movie.photo}`}
												title={movie.name}
											/>
											<CardContent className={classes.cardContent}>
												<Typography gutterBottom variant='h5' component='h2'>
													{movie.name} (${movie.purchaseprice})
												</Typography>
												<Typography>Rating: {movie.rating}</Typography>
											</CardContent>
											<CardActions>
												<IconButton className={classes.icon}>
													<Favorite />
												</IconButton>
												<span style={{ fontSize: 16 }}>{movie.like_count}</span>
											</CardActions>
										</Card>
									</Grid>
								))}
							{name !== '' && searchedMovies.length === 0 && <h3>No Results</h3>}
						</Grid>
					</div>
				</main>
			</React.Fragment>
		);
	}
}

Home.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
