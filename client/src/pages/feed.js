import React, { Component } from "react";
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Post from './post';
import Header from './header';


class App extends Component  {
constructor(props) {
    super(props);
    this.state = {
        username: this.props.location.state===undefined?'':this.props.location.state.username,
        redir: this.props.location.state===undefined?'/':'/home',
        posts: [],
        clickedusername: ''
    };
}

componentDidMount() {
    fetch("http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/displayposts")
        .then(res => res.text())
        .then(res => {
            var data = JSON.parse(res);
            this.setState({ posts: data });
        });
}

render()  {
   return (
    <div>
        <Header username={this.state.username} redir={'/home'} />
        {this.state.posts.map((post)=>
            <Post key={post.id} id={post.id} username={this.state.username} redir={this.state.redir} profimgtag={post.profimgtag} postusername={post.username} postimgtag={post.imgtag} caption={post.caption} private={post.private}/>
        )}
        <Router></Router>
        <Redirect to= {{
            pathname: this.state.redir,
            state: { username: this.state.username, clickedusername: this.state.clickedusername }
        }}/>
    </div>
    )
  }
}

export default App;