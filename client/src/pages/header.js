import React, { Component } from "react";
import { BrowserRouter as Router, Redirect} from 'react-router-dom';
import FileUpload from './newpost';
import './header.css'

class App extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            redir: this.props.redir,
            clickedusername: '',
        };
        this.post = this.post.bind(this);
        this.home = this.home.bind(this);
        this.profile = this.profile.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.logout = this.logout.bind(this);
    }

    post() {
        document.getElementById("upload-box").style.display = "block";
    }

    home() {
        this.setState({
            redir: '/home'
        }) 
    }
    
    profile() {
        if (this.state.redir !== '/profile') {
            this.setState({
                clickedusername: this.state.username,
                redir: '/profile'
            })
        }
        else {
            this.setState({
                clickedusername: this.state.username,
                redir: '/profile2'
            })
        }
    }

    logout() {
        this.setState({
            redir: '/'
        })
    }
    
    //https://www.pluralsight.com/guides/how-to-enter-key-event-handler-on-a-react-bootstrap-input-component
    onKeyUp(event) {
        if (event.charCode === 13) {
            if (this.state.redir !== '/profile') {
                this.setState({
                    clickedusername: event.target.value,
                    redir: '/profile'
                })
            }
            else {
                this.setState({
                    clickedusername: event.target.value,
                    redir: '/profile2'
                })
            }
            event.target.value = '';
        }
    }

    render()  {
    return (
        <div id="nav">
            <Router></Router>
            <input id="search" type="search" placeholder="  &#xf002;  Search..." onKeyPress={this.onKeyUp}/>
            <div id="btns">
                <button id="home" onClick={this.home}><i className="fas fa-home"></i></button>
                <button onClick={this.profile} ><i className="fas fa-user-circle"></i></button>
                <button id="newpost" onClick={this.post}><i className="far fa-plus-square"></i></button>
                <button id="logout" onClick={this.logout}><i className="fas fa-sign-out-alt"></i></button>
            </div>
            
            <input type="hidden" value={this.state.username} id="hiddenUsername"/>
            <FileUpload />
            <Redirect to= {{
                pathname: this.state.redir,
                state: { username: this.state.username, clickedusername: this.state.clickedusername }
            }}/>
        </div>
        )
    }
    }

export default App;