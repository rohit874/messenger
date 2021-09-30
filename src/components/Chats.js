import { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import '../styles/chats.css';
import Conversation from "./Conversation";
import { userContext } from '../userContext';
import { io } from 'socket.io-client';

function Chats(props) {
    const socket = useRef();
    const [ conversations, setConversations ] = useState([]);
    const { currentUser } = useContext(userContext);
    const [serachState, setSerachState] = useState(false);
    const [serachInput, setSerachInput] = useState("");
    const [serachedFriends, setserachedFriends] = useState([]);
    const [getMessage, setGetMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [chatStyle, setChatStyle] = useState("block")
    const [conversationStyle, setConversationStyle] = useState("block");
    const deviceWidth = window.innerWidth;
    const [refreshConversation, setRefreshConversation] = useState(false);

    //socket connections 
    useEffect(()=>{
        // alert(window.innerWidth)
        socket.current = io.connect('https://messenger-api-rohit.herokuapp.com');
        socket.current.on('welcome', message=>{
            // console.log(message);
        })
        socket.current.on('getUsers', users=>{
            // console.log(users);
               let updateOnline = users.map((user)=>{
                   return user.userId;
                })
                setOnlineUsers(updateOnline)
        })
    },[])

    useEffect(()=>{
        if (currentUser?.id) {
            socket.current.emit('addUser', currentUser?.id)
        }
    },[currentUser])
    
    useEffect(() => {
        //loading conversations of the current user
    const loadConversations = async () => {
        if (currentUser) {
            try{
                await axios.get(`https://messenger-api-rohit.herokuapp.com/api/conversations/${currentUser._id}`).then((res) => {
                    setConversations(res.data);
                })
            } catch(err){
                console.log(err); 
            }}
    };
        loadConversations();
    },[currentUser,refreshConversation]);

    var config = {
        headers:{
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${window.localStorage.getItem('authToken')}`
      }};

    //Searching Friends
    const HandleSearch = async () => {
        try {
            const res = await axios.post('https://messenger-api-rohit.herokuapp.com/api/search', {serachInput}, config);
            setserachedFriends(res.data.friends);
          } catch (err) {
            console.log(err);
          }
    };
    
    const RefreshConv = ()=>{
        setRefreshConversation(!refreshConversation);
    }


    //find in serach if already in chat
    function seachConversationID(data){
       var id =  conversations.find((find) => {
            if (find.friendId === data._id) {
                // setConversations([...conversations, {conversationID:find.conversationID , friendId:find.friendId, name:find.name, image:find.image}])
                return {conversationID:find.conversationID , friendId:find.friendId, name:find.name, image:find.image};
            }
            return null;
        });
        if (!id) {
            setConversations([...conversations,{conversationID:null , friendId:data._id, name:data.name, image:data.image}])
        }
        return id ? id : {conversationID:null , friendId:data._id, name:data.name, image:data.image};
    }

    const searchFriend = (e) =>{
        setSerachInput(e.target.value);
        HandleSearch();
    }

    const serachOn = () =>{
        setSerachState(true);
    }
    const serachOff = () =>{
        setTimeout(() => {
        setSerachState(false);
        }, 500);
    }

    const changeStyle = () =>{
        if (deviceWidth<768) {
        props.setNavStyle("none");
        setChatStyle("none");
        setConversationStyle("block")
        }
        
    }

    return (
        <>
        <div className="chats" style={{display:chatStyle}}>
            <div className="chat_header">
                <h2>Chats</h2>
                <input onFocus={serachOn} onBlur={serachOff} onChange={(e)=>{searchFriend(e)}} type="text" placeholder="Search Friend" />
            </div>
            <div className="friends_list">
            {
            !serachState?
            conversations.length? conversations.map((data,key)=>{
                return(
                    <div className="friend" onClick={()=>{setGetMessage(data); changeStyle()}} key={data.friendId}>
                    <div className="friend_pic"><img src={data.image} alt="" />{onlineUsers.includes(data.friendId)?<div className="online_dot"><div></div></div>:""}</div>
                    <h4>{data.name}</h4>
                    </div>
                )
            }) : <h3 className="no_chat">No Chat found. Search a friend and start chat</h3>
            :
            <>
            <p className="search_for">serach result for '{serachInput}' </p>
            {
             serachedFriends.map((data, key)=>{
                return(
                    <div className="friend" onClick={()=>{setGetMessage(seachConversationID(data)); changeStyle()}} key={key}>
                    <div className="friend_pic"><img src={data.image} alt="" />{ onlineUsers.includes(data._id)?<div className="online_dot"><div></div></div>:""}</div>
                    <h4>{data.name}</h4>
                    </div>
                )
            })
            }
            </>
            }
            </div>
        </div>
        <Conversation
        deviceWidth={deviceWidth}
        chatStyle={chatStyle}
        setChatStyle={setChatStyle} 
        conversationStyle={conversationStyle} 
        setConversationStyle={setConversationStyle} 
        onlineUsers={onlineUsers} 
        ChatData={getMessage} 
        socket={socket.current}
        setNavStyle={props.setNavStyle}
        RefreshConv={RefreshConv} />
        </>
    )
}

export default Chats
