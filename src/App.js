import React, { Component, Fragment } from 'react';
import Home from './components/Home';
import Movie from './components/Movie';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
// import {Route, Link} from 'react-router-dom';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ismovies: false,
			moviesData: {}
		};
	}

	componentDidMount() {
		// console.log("didmount");
	}

	isShowingmovies = flag => {
		this.setState({ ismovies: flag });
	};

	getmoviesData = movie => {
		this.setState({ moviesData: movie });
	};

	render() {
		const { ismovies, moviesData } = this.state;
		return (
			<Fragment>
				<NotificationContainer />
				{!ismovies && <Home isShowingmovies={this.isShowingmovies} getmoviesData={this.getmoviesData} />}
				{ismovies && <Movie isShowingmovies={this.isShowingmovies} moviesData={moviesData} />}
			</Fragment>
		);
	}
}

export default App;
