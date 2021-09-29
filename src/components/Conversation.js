import react from 'react';
import { useState, useEffect, useContext, useRef } from 'react'
import '../styles/conversation.css'
import axios from 'axios';
import { userContext } from '../userContext';

function Conversation({onlineUsers,ChatData,socket,conversationStyle,deviceWidth,setConversationStyle,setChatStyle}) {
    const [chats, setChats] = useState([]);
    const [arrivalMsg, setArrivalMsg] = useState({});
    const { currentUser } = useContext(userContext);
    const [text, setText] = useState("");
    const data = {};
    const scrollRef = useRef(null);

    var config = {
        headers:{
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${window.localStorage.getItem('authToken')}`
      }};



    //Loading the chats from database
    useEffect(()=>{
        const loadChat = async () => {
            var config = {
                headers:{
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${window.localStorage.getItem('authToken')}`
              }};
            if (ChatData!=null) {
                try{
                    await axios.get(`https://messenger-api-rohit.herokuapp.com/api/message/${ChatData.conversationID}`, config).then((res) => {
                        setChats(res.data);
                    })
                } catch(err){
                    console.log(err);
                }}
        }
        loadChat();
    },[ChatData]);
    
    //creating conversation if this is first message
    const createConversation = async ()=>{
        try {
            const res = await axios.post('https://messenger-api-rohit.herokuapp.com/api/conversations', {senderID:currentUser._id,recieverID:ChatData.friendId}, config);
            return res.data._id;
          } catch (err) {
            console.log(err);
          }
    }

    //Sending text message
    const sendText = async () =>{
        document.getElementById("messageBox").focus();
        //if this is first message then creating the conversation first on the database
         if (ChatData.conversationID===null) {
            ChatData.conversationID = await createConversation();
        }
        setText(text.replace(/^\s+|\s+$/gm,''));
        //prepare the message data for the databse
        data.conversationId=ChatData.conversationID;
        data.senderID=currentUser._id;
        data.text=text;
        data.createdAt=Date.now();
        if (text.replace(/^\s+|\s+$/gm,'').length !== 0) {
            setChats([...chats,data]);
            socket.emit('sendMessage', {
                senderId:currentUser._id,
                receiverId:ChatData.friendId,
                text 
            })
            setText("");
            try {
                const res = await axios.post('https://messenger-api-rohit.herokuapp.com/api/message', data, config);
                // setChats([...chats,res.data]);
            } catch (err) {
                console.log(err);
            }
        }
    }

    //scroll the message when new message arrive
    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior:"smooth"});
    },[chats])

    //this scroll is for mobile device because when we open mobile keyboard the messages got hide 
    //so we run this function when we click on message box
    const scroll = ()=>{
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({behavior:"smooth"});
        }, 500);

    }
    //append new message from socket
    useEffect(()=>{
        if (arrivalMsg.senderID === ChatData?.friendId ) {
        setChats(prev=>([...prev,arrivalMsg]));
        }
    },[arrivalMsg])

    //getting new message from socket
    useEffect(()=>{
        socket?.on('getMessage', (msg)=>{
            setArrivalMsg({ 
                conversationID:ChatData?.conversationID,
                senderID:msg.senderId,
                text:msg.text,
                createdAt: Date.now()
            })
        })
    },[socket])

    //This is for mobile device responsive
    const changeStyle = () =>{
        setChatStyle("block");
        setConversationStyle("none")
    }
    var prevDate = ""; 

    return (
        <div className="conversation" style={{display:conversationStyle}}>
            { ChatData ? 
            <>
            <div className="conversation_header">
                {deviceWidth<768?<span className="back_button" onClick={changeStyle}> &#8592; </span>:""}
            <div className="friend_info">
                    <div className="friend_pic"><img src={ChatData.image} alt="" />{onlineUsers.includes(ChatData.friendId)?<div className="online_dot"><div></div></div>:""}</div>
                    <h4>{ChatData.name}</h4>
                </div>
            </div>
            <div className="conversation_wrapper">
                {  chats.length ? 
                    chats.map((mes,key)=>{
                        const messTime = mes.createdAt;
                        const date = new Date(messTime).toLocaleDateString('en-GB');
                        const time = new Date(messTime).toLocaleTimeString('en', { timeStyle: 'short', hour12: true, timeZone: 'Asia/Kolkata' });
                        let new_date=""
                        if (prevDate!==date) {
                            prevDate=date;
                            new_date=date;
                        }
                        else{
                            new_date="";
                        }
                        return(
                        <react.Fragment key={key}>
                        {new_date!==""?<span className="mess_date">{new_date}</span>:""}
                        <p ref={scrollRef} className={ mes.senderID === currentUser._id ? "sender" : "receiver" }>{mes.text} <span>{time}</span></p>
                        </react.Fragment>
                        )
                    }) : <h3 className="no_chat">No message found. Send a message to start conversation</h3>
                }

            </div>
            <div className="conversation_bottom">
                <textarea placeholder="Write your message" id="messageBox" onFocus={scroll} onChange={(e)=>setText(e.target.value)} value={text}></textarea>
                <button onClick={sendText}>Send</button>
            </div> </> : <h3 className="no_chat">Search a friend and select for chat</h3>
            }
        </div>
    )
}

export default Conversation
