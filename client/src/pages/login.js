import React, { Component } from "react";
import reg from './register';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './login.css'

class App extends Component  {

constructor(props) {
    super(props);
    this.state = {
        apiResponse: '',
        username: '',
        password: '',
        error: '',
        redir: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.login = this.login.bind(this);

}


callAPI() {
    fetch("http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI")
        .then(res => res.text())
        .then(res => {this.setState({ apiResponse: res })});
}

login() {
    fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/login' , {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
    .then(res => res.text())
    .then(res => {
        if (res === 'success'){
            this.setState({
                redir: '/home',
            }) 
        }
        this.setState({
            error: res,
            username: '',
            password: ''
        })
    });

    
}

componentDidMount() {
    this.callAPI();
}

handleChange(event) {
    this.setState({
        [event.target.name]: event.target.value
    });
}

submit(event) {
    this.login();

    event.preventDefault();
}

render()  {
   return (
    <div id="login">
        <form onSubmit={this.submit}>
            <h1 id="h1-login">Login</h1>
            <label>
                <input className="data" type="text" placeholder="Username" value={this.state.username} onChange={this.handleChange} name="username"/><br></br>
            </label>
            <label>
                <input className="data" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} name="password"/><br></br>
            </label>
            <input className="btn" type="submit" value="Submit" /><br></br>
            <p className="error">{this.state.error}</p>
        </form>
        <Router>
            <Route exact path="/" component={reg} />    
        </Router>
        
        <Redirect to= {{
            pathname: this.state.redir,
            state: { username: this.state.username }
        }}/>
    </div>
    
    )
  }
}

export default App;