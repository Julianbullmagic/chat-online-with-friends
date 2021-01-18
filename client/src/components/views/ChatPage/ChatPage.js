import React, { Component } from 'react'
import { Form, Icon, Input, Button, Row, Col, } from 'antd';
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import { getChats, getGroupChats, afterPostMessage } from "../../../_actions/chat_actions"
import ChatCard from "./Sections/ChatCard"
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import CreateGroupForm from './CreateGroupForm'
import { CHAT_SERVER } from './Config.js';


export class ChatPage extends Component {

constructor(props){
  super(props)
  this.state = {
      chatMessage: "",
      groups:[],
      chosengroup:'',
      group:{},
  }
  this.handleGroupChange=this.handleGroupChange.bind(this)
  this.getGroupChat=this.getGroupChat.bind(this)

  fetch(`/api/chat/getGroups`).then(res => {
          return res.json();
        }).then(info=>{
          console.log("groups")
          console.log(info)
          this.setState({groups:info})
        })
}

handleGroupChange(event){
  var group=event.target.value
  this.setState({chosengroup: event.target.value });
  console.log(CHAT_SERVER)
this.getGroupChat(event.target.value)

}

getGroupChat(group){
  fetch(`${CHAT_SERVER}/getChats/${group}`)
      .then(response => response.json())
      .then(data=>this.props.dispatch(getGroupChats(data)))
}

    componentDidMount() {
        let server = "http://localhost:5000";

        this.props.dispatch(getChats());

        this.socket = io(server);


        this.socket.on("Output Chat Message", messageFromBackEnd => {
            console.log(messageFromBackEnd)
            this.props.dispatch(afterPostMessage(messageFromBackEnd));
        })
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    handleSearchChange = (e) => {
        this.setState({
            chatMessage: e.target.value
        })


    }




    onDrop = (files) => {
        console.log(files)


        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }



        let formData = new FormData;

        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append("file", files[0])

        Axios.post('api/chat/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    let chatMessage = response.data.url;
                    let userId = this.props.user.userData._id
                    let userName = this.props.user.userData.name;
                    let userImage = this.props.user.userData.image;
                    let nowTime = moment();
                    let type = "VideoOrImage"
                    this.socket.emit("Input Chat Message", {
                        chatMessage,
                        userId,
                        userName,
                        userImage,
                        nowTime,
                        type
                    });
                }
            })
    }




    submitChatMessage = (e) => {
        e.preventDefault();

        if (this.props.user.userData && !this.props.user.userData.isAuth) {
            return alert('Please Log in first');
        }



        let groupId=this.state.chosengroup
        let chatMessage = this.state.chatMessage
        let userId = this.props.user.userData._id
        let userName = this.props.user.userData.name;
        let userImage = this.props.user.userData.image;
        let nowTime = moment();
        let type = "Text"

        this.socket.emit("Input Chat Message", {
            chatMessage,
            userId,
            userName,
            groupId,
            userImage,
            nowTime,
            type
        });
        this.setState({ chatMessage: "" })
    }





    render() {
      var chats=  <p>No conversation so far.</p>

if(this.props.chats.chats){
  chats=this.props.chats.chats.map(chat =>{
    return (
      <ChatCard key={chat._id}  {...chat} />
    )
  })}


      var mappedgroups=  <option value="no groups">no groups</option>
      if(this.state.groups){
        mappedgroups=this.state.groups.map(group=>{
          return(
              <option key={group._id} value={group._id}>{group.title}</option>
          )
        })
      }return (
            <React.Fragment>
                <div>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}> Real Time Chat</p>
                </div>
<h1>Choose a Group</h1>
<form onSubmit={this.setGroup}>
  <div className="form-control">
    <label htmlFor="room">Room</label>
    <select name="room" id="room" onChange={this.handleGroupChange}>
      {mappedgroups}
    </select>
  </div>
  <button type="submit" className="btn">Join Chat</button>
</form>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="infinite-container" style={{ height: '500px', overflowY: 'scroll' }}>
                        {chats}
                        <div
                            ref={el => {
                                this.messagesEnd = el;
                            }}
                            style={{ float: "left", clear: "both" }}
                        />
                    </div>

                    <Row >
                        <Form layout="inline" onSubmit={this.submitChatMessage}>
                            <Col span={18}>
                                <Input
                                    id="message"
                                    prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Let's start talking"
                                    type="text"
                                    value={this.state.chatMessage}
                                    onChange={this.handleSearchChange}
                                />
                            </Col>
                            <Col span={2}>
                                <Dropzone onDrop={this.onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <Button>
                                                    <Icon type="upload" />
                                                </Button>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                            </Col>

                            <Col span={4}>
                                <Button type="primary" style={{ width: '100%' }} onClick={this.submitChatMessage} htmlType="submit">
                                    <Icon type="enter" />
                                </Button>
                            </Col>
                        </Form>
                    </Row>
                </div>
              <CreateGroupForm />
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        chats: state.chat
    }
}


export default connect(mapStateToProps)(ChatPage);
