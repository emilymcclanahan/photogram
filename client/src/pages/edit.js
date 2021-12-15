import React, { Component } from "react";
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Header from './header';
import './edit.css'

class App extends Component  {
    constructor(props) {
        super(props);

        this.state = {
            username: this.props.location.state===undefined?'':this.props.location.state.username,
            redir: "/edit",
            user: '',
            name: '',
            bio: '',
            profimgtag: '',
            file: '',
            private: false

        };
        this.changeProfPic = this.changeProfPic.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.database = this.database.bind(this);
        this.private = this.private.bind(this);
    }

    componentDidMount() {
        fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/profile' , {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({clickedusername: this.props.location.state.username})
        })
        .then(res => res.text())
        .then(res => {
            if (res !== "error" && res !== null && res !==''){
                var data = JSON.parse(res);
                this.setState({ 
                    user: data,
                    name: data.name,
                    bio: data.bio,
                    profimgtag: data.profimgtag,
                    imgtag: data.profimgtag,
                    private: data.private
                });
            }
            else {
                alert("user not found")
                this.setState({ redir: '/home' });
            }
        });
    }

    changeProfPic(event) {
        var file = event.target.files[0];
        this.setState({
            file: file,
            imgtag: URL.createObjectURL(file)
        });
    }

    handleSubmit() {
        if (this.state.file.type === "image/jpeg" || this.state.file.type === "image/png") {
            const self=this;
            var formData = new FormData();
            formData.append("file", this.state.file, this.state.file.name);

            var xhr = new XMLHttpRequest();

            xhr.open("POST", "http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/newpost", true);

            xhr.onreadystatechange = function () {  
                if (xhr.readyState === 4 && xhr.status === 200) {  
                    self.setState({
                        profimgtag: xhr.responseText
                    })
                    self.database();
                }  
            };

            xhr.send(formData);
        }
        else {
            this.database();
        }
        
    }

    database() {
        fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/edit' , {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                name: this.state.name,
                bio: this.state.bio,
                profimgtag: this.state.profimgtag,
                private: this.state.private
            })
        })
        .then(res => res.text())
        .then(res => {
            this.setState({
                redir: '/profile'
            })
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    private(event) {
        this.setState({
            private: event.target.checked
        })
    }

    render()  {
        return (
            <div >
                <Header username={this.state.username} redir={'/profile'} />
                <div id="edit">
                    <div id="pic-section">
                        <img id="prof-pic" src={this.state.imgtag} width="200" height="200" alt="profile"/><br></br>
                        <input type="file" onChange={this.changeProfPic} id="file-input" />
                    </div>
                    <div id="info-section">
                        <h1 id="u">{this.state.user.username}</h1>
                        <label className="label">
                            Name: 
                            <input value={this.state.name} onChange={this.handleChange} name="name"/><br></br>
                        </label>
                        <label className="label">
                            Bio: 
                            <textarea value={this.state.bio} onChange={this.handleChange} name="bio"/><br></br>
                        </label>
                        <label htmlFor="priv">Private Account</label>
                        <input id="priv" type="checkbox" name="priv" checked={this.state.private} onChange={this.private}/>
                        <br></br><br></br> 
                    </div>
                    <div id="b-div">
                       <button onClick={this.handleSubmit} id="b">Submit</button>
                    </div>
                    
                </div>
                <Router></Router>
                <Redirect to= {{
                    pathname: this.state.redir,
                    state: { username: this.state.username, clickedusername: this.state.username}
                }}/>
            </div>
            
        )

    }
}

export default App;