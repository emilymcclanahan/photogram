import React, { Component } from "react";
import './App.css';
import Start from './pages/login';
import Feed from './pages/feed';
import Profile from './pages/profile';
import Profile2 from './pages/profile2';
import Edit from './pages/edit';

import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

class App extends Component  {
constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
}

callAPI() {
    fetch("http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI")
        .then(res => res.text())
        .then(res => { this.setState({ apiResponse: res })});
}

componentDidMount() {
    this.callAPI();
}

render()  {
   return ( 
    <Router>
        <Switch>
            <Route path="/" exact component={(props) => <Start location={props.location}/>} />
            <Route path="/home" exact component={(props) => <Feed location={props.location}/>} />
            <Route path="/profile" exact component={(props) => <Profile location={props.location}/>} />
            <Route path="/profile2" exact component={(props) => <Profile2 location={props.location}/>} />
            <Route path="/edit" exact component={(props) => <Edit location={props.location}/>} />
        </Switch>
    </Router>
  )}
}

export default App;
