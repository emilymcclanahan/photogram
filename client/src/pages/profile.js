import React, { Component } from "react";
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Header from './header';
import Post from './post';
import './profile.css'

class App extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.location.state===undefined?'':this.props.location.state.username,
            clickedusername: this.props.location.state===undefined?'':this.props.location.state.clickedusername,
            redir: this.props.location.state===undefined?'/':'/profile',
            user: [],
            posts: []
        };
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/profile' , {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({clickedusername: this.props.location.state.clickedusername})
        })
        .then(res => res.text())
        .then(res => {
            if (res !== "error" && res !== null && res !==''){
                var data = JSON.parse(res);
                this.setState({ user: data });
            }
            else {
                alert("user not found")
                this.setState({ redir: '/home' });
            }
        });

        //get posts
        fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/displayprofileposts' , {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({clickedusername: this.props.location.state.clickedusername})
        })
        .then(res => res.text())
        .then(res => {
            var data = JSON.parse(res);
            this.setState({ posts: data });
        });
    }

    edit() {
        this.setState({
            redir: '/edit'
        })
    }

    delete() {
        fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/deleteaccount' , {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.text())
        .then(res => {
            if (res === "success") {
                this.setState({
                    redir: '/'
                })
            }
        });
    }
    
    render()  {
        if (this.state.username === this.state.clickedusername) {
            return (
                <div>
                    <Header username={this.state.username} redir={'/profile'} />
                    <div id="profile">
                        <div id="prof-img">
                            <img src={this.state.user.profimgtag} alt="profile"/>
                        </div>
                        <div id="prof-info"> 
                            <h1 id="displayusername">{this.state.user.username}</h1>
                            <button onClick={this.edit}>Edit Profile</button>
                            <button onClick={this.delete}>Delete Account</button><br></br><br></br><br></br>
                            <p id="u_name">{this.state.user.name}</p><br></br>
                            <p id="u_bio"> {this.state.user.bio}</p>
                        </div>
                    </div>
                    <div>
                        {this.state.posts.map((post)=>
                            <Post key={post.id} id={post.id} username={this.state.username} redir={this.state.redir} profimgtag={post.profimgtag} postusername={post.username} postimgtag={post.imgtag} numLikes={post.likes} caption={post.caption} private={post.private}/>
                        )}
                    </div>
                    <Router></Router>
                    <Redirect push to= {{
                        pathname: this.state.redir,
                        state: { username: this.state.username, clickedusername: this.state.clickedusername}
                    }}/>
                </div>
                
            )
        }
        else {
            return (
                <div>
                    <Header username={this.state.username} redir={'/profile'}/>
                    <div id="profile">
                        <div id="prof-img">
                            <img src={this.state.user.profimgtag} alt="profile"/>
                        </div>
                        <div id="prof-info">
                            <h1 id="displayusername">{this.state.user.username}</h1><br></br><br></br><br></br>
                            <p id="u_name">{this.state.user.name}</p><br></br>
                            <p id="u_bio">{this.state.user.bio}</p>
                        </div>
                    </div>
                    <div>
                        {this.state.posts.map((post)=>
                            <Post key={post.id} id={post.id} username={this.state.username} redir={this.state.redir} profimgtag={post.profimgtag} postusername={post.username} postimgtag={post.imgtag} caption={post.caption} private={post.private}/>
                        )}
                    </div>
                    <Router></Router>
                    <Redirect to= {{
                        pathname: this.state.redir,
                        state: { username: this.state.username, clickedusername: this.state.clickedusername}
                    }}/>
                </div>
                
            )
        }
    }
}

export default App;