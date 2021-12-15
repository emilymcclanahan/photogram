import React, { Component } from "react";
import { BrowserRouter as Router, Redirect } from 'react-router-dom';

class App extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.location.state===undefined?'':this.props.location.state.username,
            clickedusername: this.props.location.state===undefined?'':this.props.location.state.clickedusername,
            redir: this.props.location.state===undefined?'/':'/profile',
        };
    }
    
    render()  {
        return(
            <div>
                <Router></Router>
                <Redirect to= {{
                    pathname: '/profile',
                    state: { username: this.state.username, clickedusername: this.state.clickedusername }
                }}/>
            </div>
        )
    }
}

export default App;