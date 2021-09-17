import React from "react";
import UserStore from "../../stores/UserStore";
import InputField from "./inputField";
import { Link } from "react-router-dom";
import SubmitButton from "./SubmitButton";

class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            buttonDisabled: false
        }
    }

    setInputValue(property, val){
        val = val.trim();
        
        this.setState({
          [property] : val
        })
      }

      resetForm(){
        this.setState ({
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        })
      }

    async doRegister() {
        if (!this.state.username) {
            return;
        }
        if (!this.state.password) {
            return;
        }

        try {
            let res = await fetch('http://localhost:4000/Register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username : this.state.username,
                    password : this.state.password,
                    firstName : this.state.firstName,
                    lastName : this.state.lastName,
                    email: this.state.email})
            });
           
            let result = await res.json();

            if(result && result.success){
                alert('Registerd Succesfully , your username is ' + this.state.username + ' and password is '+ this.state.password);
                this.resetForm();
            }else if( result && result.success === false){
                this.resetForm();
                alert(result.msg);
            }
        } catch (e) {
            console.log(e);
            this.resetForm();
        }

    }

    render() {
        return (
            <div className="RegistrationForm">
                Register
                <InputField type='text'
                    placeholder='username'
                    value={this.state.username ? this.state.username : ''}
                    onChange={(val) => this.setInputValue('username', val)} />
                <InputField type='text'
                    placeholder='First Name'
                    value={this.state.firstName ? this.state.firstName : ''}
                    onChange={(val) => this.setInputValue('firstName', val)} />

                <InputField type='text'
                    placeholder='Last Name'
                    value={this.state.lastName ? this.state.lastName : ''}
                    onChange={(val) => this.setInputValue('lastName', val)} />

                <InputField type='text'
                    placeholder='Email'
                    value={this.state.email ? this.state.email : ''}
                    onChange={(val) => this.setInputValue('email', val)} />

                <InputField type='password'
                    placeholder='password'
                    value={this.state.password ? this.state.password : ''}
                    onChange={(val) => this.setInputValue('password', val)} />


                <SubmitButton text='Register'
                    onClick={() => this.doRegister()} />
                <Link to="/" style = {{fontSize : 20 ,  color:'white'}}> Login Here</Link>    
            </div>);
    }
}

export default RegistrationForm;