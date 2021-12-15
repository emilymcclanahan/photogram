import React, { Component } from "react";
import { BrowserRouter as Router, Link } from 'react-router-dom';
// import { post } from "../../../api/routes/testAPI";
import Comment from './comment';
import './post.css'


class App extends Component  {

constructor(props) {
    super(props);
    this.state = {
        username: this.props.username,
        redir: this.props.redir,
        id: this.props.id,
        clickedusername: '',
        comments: [],
        input: '',
        deleted: false,
        private: this.props.private,
        liked_icon: 'far fa-heart',
        num_likes: 0
    };
    this.profile = this.profile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.postcomment = this.postcomment.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.likepost = this.likepost.bind(this);
}

componentDidMount() {
    
    //likes
    fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/displaylike' , {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
    .then(res => res.text())
    .then(res => {
        var likes_array = JSON.parse(res);
        for(var i = 0; i<likes_array.length; i++){
            if(this.state.username === likes_array[i].liker_username){
                this.setState({
                    liked_icon: 'fas fa-heart'
                })
            }
        }
        this.setState({
            num_likes: likes_array.length
        })
    });

    //comments
    fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/displaycomments' , {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
    .then(res => res.text())
    .then(res => {
        var data = JSON.parse(res);
        this.setState({
            comments: data
        })
    });
}

profile(event) {
    this.setState({
        clickedusername: event.target.value,
        redir: '/profile'
    })
}

handleChange(event) {
    this.setState({
        input: event.target.value
    });
    if (event.target.value !== "") {
        event.target.parentElement.childNodes[1].style.opacity = "100%";
    }
    else {
        event.target.parentElement.childNodes[1].style.opacity = "50%";
    }
}

onKeyUp(event) {
    if (event.charCode === 13) {}
}

postcomment(event) {
    event.preventDefault();
    if (this.state.input !== "") {
        fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/postcomment' , {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.text())
        .then(res => {
            var comment_id = res;
            var commentObject = {
                comment_id: comment_id,
                comment_username: this.state.username,
                comment: this.state.input,
                post_id: this.state.id
            };
            var commentsection = event.target.parentElement.parentElement.childNodes[3];
            this.setState({
                input: '',
                comments: [...this.state.comments, commentObject]
            })
            commentsection.scrollTop = commentsection.scrollHeight;
        });
    }
}

deletePost() {
    fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/deletepost' , {
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

likepost(){
    fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/likepost' , {
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
                    liked_icon: 'fas fa-heart',
                    num_likes: this.state.num_likes + 1
                })
            }
        });
}

render()  {
    if (this.state.deleted) {
        return null;
    }
    else if (this.state.username === this.props.postusername) {
        return (
            <div className="post">
                <div className="post-header">
                    <img src={this.props.profimgtag} className="post-profile-pic" alt="profile"/>
                    <Router></Router>
                    <Link className="link" to= {{
                        pathname: "/profile",
                        state: { username: this.state.username, clickedusername: this.props.postusername }
                    }}>
                        {this.props.postusername}
                    </Link>
                    <span className="trash-span"><button className="trash" onClick={this.deletePost}><i className="fa fa-trash"></i></button></span>
                </div>
                <img src={this.props.postimgtag} className="post-img" width="700" alt="post"/>
                <div className="caption-section">
                    <p className="numLikes"><i className={this.state.liked_icon} onClick={this.likepost}></i>{this.state.num_likes} likes</p><br></br>
                    <Link className="link" to= {{
                        pathname: "/profile",
                        state: { username: this.state.username, clickedusername: this.props.postusername }
                    }}>
                        <span className="caption-user">{this.props.postusername}</span>
                    </Link>
                    <span className="caption">{this.props.caption}</span>
                </div>
                <div className="comment-section">
                    {this.state.comments.map((comment)=>
                        <Comment key={comment.comment_id} id={comment.comment_id} username={this.state.username} post_username={this.props.postusername} comment_username={comment.comment_username} comment_text={comment.comment}/>
                    )}
                </div>
                <form className="comment-form">
                    <input type="text" placeholder="Add a comment..." value={this.state.input} onChange={this.handleChange} onKeyPress={this.onKeyUp}></input>
                    <button onClick={this.postcomment} >Post</button>
                </form>
            </div>
        )
    }
    else if (!this.state.private){
        return (
            <div className="post">
                <div className="post-header">
                    <img src={this.props.profimgtag} className="post-profile-pic" alt="profile"/>
                    <Router></Router>
                    <Link className="link" to= {{
                        pathname: "/profile",
                        state: { username: this.state.username, clickedusername: this.props.postusername }
                    }}>
                        {this.props.postusername}
                    </Link>
                </div>
                <img src={this.props.postimgtag} className="post-img" width="700" alt="post"/>
                <div className="caption-section">
                    <p className="numLikes"><i className={this.state.liked_icon} onClick={this.likepost}></i>{this.state.num_likes} likes</p><br></br>
                    <Link className="link" to= {{
                        pathname: "/profile",
                        state: { username: this.state.username, clickedusername: this.props.postusername }
                    }}>
                        <span className="caption-user">{this.props.postusername}</span>
                    </Link>
                    <span className="caption">{this.props.caption}</span>
                </div>
                <div className="comment-section">
                    {this.state.comments.map((comment)=>
                        <Comment key={comment.comment_id} id={comment.comment_id} username={this.state.username} post_username={this.props.postusername} comment_username={comment.comment_username} comment_text={comment.comment}/>
                    )}
                </div>
                <form className="comment-form">
                    <input type="text" placeholder="Add a comment..." value={this.state.input} onChange={this.handleChange} onKeyPress={this.onKeyUp}></input>
                    <button onClick={this.postcomment} >Post</button>
                </form>
            </div>
        )
    }
    else {
        return null;
    }
   
  }
}

export default App;