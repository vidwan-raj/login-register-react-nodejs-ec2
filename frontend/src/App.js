import React from 'react';
import { observer } from 'mobx-react';
import UserStore from './stores/UserStore';
import LoginForm from './components/form/LoginForm';
import SubmitButton from './components/form/SubmitButton';
import { Route, Switch } from 'react-router';
import './App.css';
import RegistrationForm from './components/form/RegistrationForm';


class App extends React.Component {
  async componentDidMount() {
    try {
      let res = await fetch('http://ec2-18-222-222-26.us-east-2.compute.amazonaws.com::4000/isLoggedIn', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;

      } else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;

      }
    }
    catch (e) {
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
    }
  }


  async doLogout() {
    try {
      let res = await fetch('http://ec2-18-222-222-26.us-east-2.compute.amazonaws.com::4000/logout', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.isLoggedIn = false;
        UserStore.username = '';

      }
    }
    catch (e) {
      console.log(e);
    }
  }

  render() {
    if (UserStore.loading) {
      return (
        <div className="App">
          <div className='container'>
            Loading, Please wait..
          </div>
        </div>
      );
    }else{
      if(UserStore.isLoggedIn){
        return (
          <div className="App">
            <div className='container'>
              Welcome {UserStore.username}
              <SubmitButton text = {'Log out'}
                disabled = {false}
                onClick = {() => this.doLogout()} />
            </div>
          </div>
        );
      }

      return (
        <div className="App">
          <div className='container'>
            <Switch>
            <Route exact path = '/' component = {LoginForm} />
            <Route exact path = '/Register' component = {RegistrationForm} />
            </Switch>
          </div>
        </div>
      );
    }
    
  }
}

export default observer(App);
