import React, { Component } from "react";
import './comment.css';
import { BrowserRouter as Router, Link} from 'react-router-dom';

class App extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            comment_username: this.props.comment_username,
            post_username: this.props.post_username,
            id: this.props.id,
            deleted: false
        };
        this.delete = this.delete.bind(this);
    }

    delete() {
        fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/deletecomment' , {
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
                    deleted: true
                })
            }
        });
    }

    render()  {
        if (this.state.deleted) {
            return null;
        }
        else if (this.state.comment_username === this.state.username || this.state.post_username === this.state.username) {
            return (
                <div className="comment">
                    <Router></Router>
                    <Link className="link" to= {{
                        pathname: "/profile2",
                        state: { username: this.state.username, clickedusername: this.props.comment_username }
                    }}>
                        <b>{this.props.comment_username}</b>
                    </Link>
                    
                    <p>{this.props.comment_text}</p>
                    <button onClick={this.delete}>x</button>
                </div>
            )
        }
        else {
            return (
                <div className="comment">
                    <Router></Router>
                    <Link className="link" to= {{
                        pathname: "/profile2",
                        state: { username: this.state.username, clickedusername: this.props.comment_username }
                    }}>
                        <b>{this.props.comment_username}</b>
                    </Link>
                    <p>{this.props.comment_text}</p>
                </div>
            )
        }
    }
}

export default App;