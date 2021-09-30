import {React, useState } from 'react';
import axios from 'axios';
import '../styles/auth.css'
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';


function Login(props) {
    //styling on form inputs
    const [label_class, setlabel_class] = useState({
        email_label:"formLabel",
        password_label:"formLabel"
    })
    const inputClicked=(label)=>{
        setlabel_class({...label_class, [label] :"formLabel_focus"});
    }

    const history = useHistory();

    const [email,SetEmail] = useState("");
    const [password,SetPassword] = useState("");
    const [error, setError] = useState("");


    const LoginHandler = async (e) =>{
        e.preventDefault();
        const config = {
            header: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            },
          };

          try {
            const res = await axios.post('https://messenger-api-rohit.herokuapp.com/api/login', { email, password }, config);
            localStorage.setItem("authToken", res.data.access_token);
            props.login(true);
            history.push('/');
          } catch (err) {
            console.log(err);
            if (err.response) {
                      setError(err.response.data.message);
                      setTimeout(() => {
                              setError("");
                            }, 5000);
                    }
          }
}

    return (
        <div className="signnup_div_parent">
        <div className="signnup_div">
            
        <div className="form_heading_div">
                <h2 className="form_heading">Login</h2>
                {/* <button className="hide_form_btn" onClick={props.hidebtn}>&#x2715;</button> */}
                <Link to="/" className="hide_form_btn">&#x2715;</Link>
            </div>
            <p className="error">{error}</p>

            <form onSubmit={LoginHandler}>
            <div className="signInUp_input">
            <label className={label_class.email_label}>Email</label>
            <input type="email" onClick={()=>inputClicked("email_label")} onChange={(e)=>SetEmail(e.target.value)} value={email} name="Email" placeholder="" autoComplete="on"/>
            </div>

            <div className="signInUp_input">
            <label className={label_class.password_label}>Password</label>
            <input type="password" onClick={()=>inputClicked("password_label")} onChange={(e)=>SetPassword(e.target.value)} value={password} name="password" placeholder="" autoComplete="off"/>
            </div>
        
            <div className="signup_btn_div"><button className="signup_btn">Login</button></div>
            </form>
            <p className="signup_have">New to Messenger? <Link to="/signup">Create account</Link></p>
        </div>
        </div>
    )
}

export default Login
