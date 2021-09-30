import { useEffect } from 'react';
import { useHistory } from 'react-router';
import Chats from "./Chats";


function Home(props) {
    const history = useHistory();
    useEffect(() => {
        if (!localStorage.hasOwnProperty("authToken")) {
            history.push('/login');
        }
    })
    return (
        <div className="home_section">
            <Chats setNavStyle={props.setNavStyle}/>
        </div>
    )
}

export default Home
