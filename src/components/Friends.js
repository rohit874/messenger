import { useEffect, useState } from 'react';
import axios from 'axios';
function Friends(props) {
    const { conversation, currentUser } = props;
    const [user, setUser] = useState([]);

  useEffect(() => {
    const getUser = async () => {
    //getting friends ids to fetch friends data
    const friendsIds = await conversation.map((data)=>{
                return data.members.find((m) => m !== currentUser._id);
        })

        var config = {
          headers:{
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${window.localStorage.getItem('authToken')}`
        }};
        
      try {
        const res = await axios.post('/getfriends', friendsIds, config);
        setUser(res.data.friends);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [conversation]);

    return (
      user.map((data,key)=>{
        return(
          <div className="friend" onClick={()=>{props.getChat({cID:conversation[key]._id, frnd:{name:data.name, image:data.image}})}} key={key}>
            <img src={data.image} alt="" />
            <h4>{data.name}</h4>
        </div>
        )})
    )
}

export default Friends
