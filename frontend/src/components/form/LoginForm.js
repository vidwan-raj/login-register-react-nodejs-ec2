import React from "react";
import InputField from "./inputField";
import SubmitButton from "./SubmitButton";
import UserStore from "../../stores/UserStore";
import { Link } from "react-router-dom";


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      buttonDisabled: false
    }
  }

  
  setInputValue(property, val){
    val = val.trim();
    if(val.length > 12){
      return;
    }
    this.setState({
      [property] : val
    })
  }

  resetForm(){
    this.setState ({
      username :'',
      password : '',
      buttonDisabled : false
    })
  }

  async doLogin() {
    if(!this.state.username){
      return;
    }

    if(!this.state.password){
      return;
    }

    this.setState({
      buttonDisabled : true
    })

    try{
       let res = await fetch('http://ec2-18-222-135-160.us-east-2.compute.amazonaws.com:4000/login', {
         method : 'POST',
         headers : {
           'Accept' : 'application/json',
           'Content-Type' : 'application/json'
         },
        body : JSON.stringify({ username :  this.state.username, password : this.state.password })
       });
       let result = await res.json();

       if(result && result.success){
         UserStore.isLoggedIn = true;
         UserStore.username = result.username;
       }else if(result && result.success === false){
         this.resetForm();
         alert(result.msg);
       }
    }catch(e){
        console.log(e);
        this.resetForm();
    }
  }


  render() {
    return (
      <div className="LoginForm">
        Log in
        <InputField type='text'
          placeholder='username'
          value={this.state.username ? this.state.username : ''}
          onChange={(val) => this.setInputValue('username', val)} />

        <InputField type='password'
          placeholder='password'
          value={this.state.password ? this.state.password : ''}
          onChange={(val) => this.setInputValue('password', val)} />
        <SubmitButton text='Login'
          disable={this.state.buttonDisabled}
          onClick={() => this.doLogin()} />
          <Link to="/Register" style = {{fontSize : 20 ,  color:'white'}}> Not a User? Create an account</Link>
      </div>
    );
  }
}

export default LoginForm;