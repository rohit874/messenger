import { useEffect, useState } from 'react';
import { BrowserRouter as Router , Route, Switch } from 'react-router-dom';
import './styles/home.css';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { userContext } from './userContext';
import axios from 'axios';
import {ReactComponent as ThemeIcon} from './images/theme_icon.svg';

function App() {

  //Check set login/logout state
  const [islogIn, setIsLogin] = useState(false);
  const [ currentUser , setCurrentUser] = useState(null);

  // fetching the current user data
  useEffect(()=>{
    if (localStorage.hasOwnProperty("authToken")) {
      const loadUserData = async () => {
        var config = {
          headers:{
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${window.localStorage.getItem('authToken')}`
        }};
    
        try {
          const response = await axios.get('http://localhost:5000/api/getuser',config)
          setCurrentUser(response.data.user);
        } catch (err) {
          Logout();
        }
      }
      loadUserData();
      setIsLogin(true);
    }
  },[islogIn]);

  const Logout = () => {
    localStorage.removeItem('authToken');
    setIsLogin(false);
    window.location.reload(false);
}


  //switch b/w light & Dark theme
  let theme_dark = "--theme: black; --text: white; --background:#383838;";
  let theme_light = "--theme: white; --text: black; --background:#ececec;";
  const [themeDark, setThemeDark] = useState(false);
  const [navStyle, setNavStyle] = useState("flex");
    //checking if dark theme already set 
    useEffect(()=>{
      if (!localStorage.hasOwnProperty("theme")) {
          localStorage.setItem('theme','light');
      }
      else{
        let theme = localStorage.getItem('theme');
        if (theme==="dark") {
        document.documentElement.style.cssText = theme_dark;
        document.getElementById('themeInput').checked = true;
        setThemeDark(true)
        }
      }
    },[theme_dark])
  
    const Changetheme = () => {
      if (!themeDark) {
        document.documentElement.style.cssText = theme_dark;
        localStorage.setItem('theme','dark');
      }
      else{
        document.documentElement.style.cssText = theme_light;
        localStorage.setItem('theme','light');
      }
      setThemeDark(!themeDark);
    }


  

  return (
    <>
    <Router>
    <userContext.Provider value={{ currentUser }}>
    <nav style={{display:navStyle}}>
      <div className="logo">
        <h1>MineChat</h1>
      </div>
      <div className="nav-right">
        <ThemeIcon className="theme-icon" />
        <label className="switch">
          <input id="themeInput" onChange={Changetheme} type="checkbox" />
          <span className="slider round"></span>
      </label>
      {currentUser?<img className="current_user_pic" src={currentUser.image} alt=""/>:""}
      { islogIn ? <button onClick={Logout}>Logout</button> : "" }
      
      </div>
    </nav>


    <Switch>
      <Route path="/login">
        <Login login={setIsLogin} />
      </Route>
      <Route path="/signup">
        <Signup login={setIsLogin} />
      </Route>
      <Route path="/">
      <Home setNavStyle={setNavStyle} />
      </Route>
    </Switch>

</userContext.Provider>
    </Router>


    </>
  );
}

export default App;
