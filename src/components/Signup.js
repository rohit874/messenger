import {React,useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/auth.css'
import { useHistory } from 'react-router';

function Signup(props) {
    //styling on form inputs
    const history = useHistory();
    const data = new FormData();
    const [label_class, setlabel_class] = useState({
        name_label:"formLabel",
        email_label:"formLabel",
        image_lebel:"formLabel",
        password_label:"formLabel"
    })
    const inputClicked=(label)=>{
        setlabel_class({...label_class, [label] :"formLabel_focus"});
    }
    const [name,SetName] = useState("");
    const [email,SetEmail] = useState("");
    const [image,SetImage] = useState(null);
    const [password,SetPassword] = useState("");
    const [error, setError] = useState("");

    const imageHandler = (e) => {
     SetImage(e.target.files[0]);
    }

    const SignUpHandler = async (e) =>{
        e.preventDefault();

        // data = {...data, name, email, password };
        data.append("name", name);
        data.append("email", email);
        data.append("image", image);
        data.append("password", password);



        // console.log(data);
        const config = {
            header: {
              "Content-Type": "form-data"
            },
          };
      // console.log(data);

      axios.post(
      "https://messenger-api-rohit.herokuapp.com/api/register",
      data,
      config).then(res => {
        // do good things
        localStorage.setItem("authToken", res.data.access_token);
        props.login(true);
        history.push('/');
})
.catch(err => {
    if (err.response) {
      setError(err.response.data.message);
      setTimeout(() => {
              setError("");
            }, 5000);
    }
})
  }


    return (
        <div className="signnup_div_parent">
        <div className="signnup_div">
            <div className="form_heading_div">
                <h2 className="form_heading">Sign up</h2>
                <button className="hide_form_btn" onClick={props.hidebtn}>&#x2715;</button>
            </div>

            <p className="error">{error}</p>

            <form onSubmit={SignUpHandler} encType="multipart/form-data">
            <div className="signInUp_input">
            <label className={label_class.name_label}>Full Name</label>
            <input type="text" onClick={()=>inputClicked("name_label")} onChange={(e)=>SetName(e.target.value)} value={name} name="name" placeholder="" autoComplete="on"/>
            </div>

            <div className="signInUp_input">
            <label className={label_class.email_label}>Email</label>
            <input type="email" onClick={()=>inputClicked("email_label")} onChange={(e)=>SetEmail(e.target.value)} value={email} name="Email" placeholder="" autoComplete="on"/>
            </div>

            <div className="signInUp_input">
            <label className={label_class.image_lebel}>Profile Image</label>
            <input type="file" onClick={()=>inputClicked("image_lebel")} onChange={(e)=>{imageHandler(e)}} name="image" placeholder="" autoComplete="on"/>
            </div>

            <div className="signInUp_input">
            <label className={label_class.password_label}>Password</label>
            <input type="password" onClick={()=>inputClicked("password_label")} onChange={(e)=>SetPassword(e.target.value)} value={password} name="password" placeholder="" autoComplete="on"/>
            </div>
        
            <div className="signup_btn_div"><button className="signup_btn">Create Account</button></div>
            </form>
            <p className="signup_have">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
        </div>
    )
}

export default Signup
