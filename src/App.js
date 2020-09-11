import React, { useState } from 'react';

import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email:'',
    password:'',
    photo:''
  })

  const provider =new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn:true,
        name: displayName,
        email: email,
        photo:photoURL
      }
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignedOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const signOutUser = {
        isSignedOut: false,
        name: '',
        email:'',
        photo:'',
        error:''
      }
      setUser(signOutUser);
    })
    .catch(err =>{

    });
  }
  const handleBlur = (e) =>{
    // console.log(e.target.name, e.target.value);
    let isFormValid = true ;
    if(e.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      //console.log(isEmailValid);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6 ;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid=isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name]= e.target.value ;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) =>{
    //  console.log(user.email, user.password)
    if(user.email && user.password){
      //console.log('submitting');
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        console.log(res)
      })
      .catch(error => {
        // Handle Errors here.
        //var errorCode = error.code;
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        setUser(newUserInfo);
        // var errorMessage = error.message;
        // console.log(errorCode, errorMessage);
      });
    }
  }

  return (
    <div className='App'> 
            {
              user.isSignedIn ? <button onClick={handleSignedOut}>Sign Out</button> :
              <button onClick={handleSignIn}>Sign in</button>
            
            }
            {
              user.isSignedIn && <div><p>Welcome, {user.name}</p>
              </div>
            }
          
              <h1>Our own authentication system</h1>
              {/* <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Password: {user.password}</p> */}
          <form onSubmit={handleSubmit}>
              <input name="name" type="text" onBlur={handleBlur} placeholder="name"/>
              <br/>
              <input type="text" name="email" onBlur={handleBlur} placeholder="email" required/>
              <br/>
              <input type="password" name="password" id="" onBlur={handleBlur} placeholder="password" required/>
              <br/>
              <input type="submit" value="Submit"/>
          </form>
              <p style={{color:'red'}}>{user.error}</p>
    </div>
  );
}

export default App;
