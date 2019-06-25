import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import productImg from '../assets/images/upload.png';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { ADD_MOVIE_URL } from '../conf/index';
import { NotificationManager } from 'react-notifications';

const styles = theme => ({
	icon: {
		color: 'red'
	},
	heroUnit: {
		backgroundColor: theme.palette.background.paper
	},
	heroContent: {
		maxWidth: '90%',
		margin: '0 auto',
		padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
	},
	textFieldInput: {
		fontSize: 16,
		background: '#f3f3f3',
		padding: '16px 28px',
		borderRadius: 30,
		transition: theme.transitions.create(['background-color', 'box-shadow'], {
			duration: theme.transitions.duration.complex * 2
		}),
		'&:focus': {
			backgroundColor: '#e3e3e3',
			boxShadow: '0 0 0 0.2rem #d3d3d3'
		}
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
	},
	textFieldFormLabel: {
		fontSize: 18
	},
	buttn: {
		marginTop: theme.spacing.unit * 3,
		marginBottom: theme.spacing.unit,
		textTransform: 'capitalize'
	}
});

class AddProduct extends Component {
	constructor(props) {
		super(props);
		this.state = {
			state: '',
			isLiked: false,
			fileUrl: '',
			name: '',
			duration: '',
			price: 0,
			selectedFile: null
		};
	}

	handleBackHome = () => {
		this.props.isAddProduct(false);
	};

	handleselectedFile = event => {
		this.setState({
			selectedFile: event.target.files[0],
			fileUrl: URL.createObjectURL(event.target.files[0]),
			loaded: 0
		});
	};

	changeIcon = () => {
		document.getElementById('fileId').click();
	};

	formSubmit = async () => {
		const { name, duration, price, selectedFile } = this.state;
		let price_temp = parseInt(price, 10);
		const formData = new FormData();
		formData.append('file', selectedFile);
		formData.append('name', name);
		formData.append('duration', duration);
		formData.append('price', price_temp);

		if (selectedFile === null) {
			NotificationManager.error('movie photo should be filled.', 'Error!', 5000);
		} else if (name === '') {
			NotificationManager.error('movie name should be filled.', 'Error!', 5000);
		} else if (duration === '') {
			NotificationManager.error('movie duration should be filled.', 'Error!', 5000);
		} else if (price_temp === 0) {
			NotificationManager.error('movie price cannot be 0.', 'Error!', 5000);
		} else {
			await axios.post(`${ADD_MOVIE_URL}`, formData, {}).then(res => {
				if (!res.data.error) {
					this.handleBackHome();
					this.setState({ open: true, result: 'success' });
					NotificationManager.success('New movie has been added successfully.', 'Success!', 5000);
				} else {
					this.setState({ open: true, result: 'error' });
				}
			});
		}
	};

	handleChangeTextField = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		const { classes } = this.props;
		const { fileUrl, name, duration, price } = this.state;

		return (
			<React.Fragment>
				<main>
					<div className={classes.heroUnit}>
						<div className={classes.heroContent}>
							<Fab size='small' aria-label='Back' onClick={this.handleBackHome}>
								<ArrowBack />
							</Fab>
							<Typography component='h2' variant='h3' align='center' color='textPrimary' gutterBottom>
								Add Movie
							</Typography>
						</div>
					</div>
					<div style={{ textAlign: 'center' }}>
						<Grid
							container
							className={classes.root}
							direction='column'
							justify='center'
							alignItems='center'
						>
							<Grid item xs={12} sm={8} md={6} lg={4}>
								{fileUrl === '' && (
									<img src={productImg} alt='avatar' width='80%' style={{ borderRadius: 10 }} />
								)}
								{fileUrl !== '' && (
									<img src={fileUrl} alt='avatar' width='80%' style={{ borderRadius: 10 }} />
								)}
							</Grid>
							<Grid item xs={12} sm={8} md={6} lg={4}>
								<Button
									variant='outlined'
									size='medium'
									color='primary'
									style={{ borderRadius: 40 }}
									className={classes.buttn}
									onClick={this.changeIcon}
								>
									Movie Poster
								</Button>
								<input hidden type='file' name='file' id='fileId' onChange={this.handleselectedFile} />
							</Grid>
						</Grid>
					</div>
					<Grid container className={classes.root} direction='column' justify='center' alignItems='center'>
						<Grid item xs={12} sm={8} md={6} lg={4}>
							<TextField
								id='outlined-normal'
								name='name'
								label='Movie Name'
								className={classes.textField}
								margin='normal'
								variant='standard'
								fullWidth={true}
								value={name}
								InputProps={{
									disableUnderline: true,
									classes: {
										input: classes.textFieldInputTitle
									}
								}}
								onChange={this.handleChangeTextField}
								InputLabelProps={{
									shrink: true,
									className: classes.textFieldFormLabel
								}}
							/>
							<TextField
								id='outlined-multiline-static'
								name='duration'
								label='duration'
								multiline
								rows='5'
								className={classes.textField}
								margin='normal'
								variant='standard'
								fullWidth={true}
								value={duration}
								InputProps={{
									disableUnderline: true,
									classes: {
										input: classes.textFieldInput
									}
								}}
								InputLabelProps={{
									shrink: true,
									className: classes.textFieldFormLabel
								}}
								onChange={this.handleChangeTextField}
							/>
							<TextField
								id='outlined-normal'
								name='price'
								label='Price'
								className={classes.textField}
								margin='normal'
								variant='standard'
								fullWidth={true}
								value={price}
								InputProps={{
									disableUnderline: true,
									classes: {
										input: classes.textFieldInputTitle
									}
								}}
								onChange={this.handleChangeTextField}
								InputLabelProps={{
									shrink: true,
									className: classes.textFieldFormLabel
								}}
							/>
							<Button
								variant='contained'
								size='large'
								color='primary'
								style={{ borderRadius: 40 }}
								className={classes.buttn}
								fullWidth={true}
								onClick={this.formSubmit}
							>
								Submit
							</Button>
						</Grid>
					</Grid>
				</main>
			</React.Fragment>
		);
	}
}

AddProduct.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddProduct);
