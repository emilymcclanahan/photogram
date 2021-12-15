import React, { Component } from "react";
import './register.css'

class App extends Component  {
constructor(props) {
    super(props);
    this.state = {
        apiResponse: '',
        username: '',
        password: '',
        error: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.register = this.register.bind(this);
}

callAPI() {
    fetch("http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI")
        .then(res => res.text())
        .then(res => {this.setState({ apiResponse: res })});
}

register() {
    fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/register' , {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
    .then(res => res.text())
    .then(res => {
        this.setState({
            error: res,
            username: "",
            password: ""
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
    this.register();

    event.preventDefault();
}

render()  {
   return (
    <form id="register" onSubmit={this.submit}>
        <h1 id="h1-register">Register</h1>
        <label>
          <input className="data" type="text" placeholder="Username" value={this.state.username} onChange={this.handleChange} name="username"/><br></br>
        </label>
        <label>
          <input className="data" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} name="password"/><br></br>
        </label>
        <input className="btn" type="submit" value="Submit" /><br></br>
        <p className="error">{this.state.error}</p>
    </form>
    )
  }
}

export default App;