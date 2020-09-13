import React, { useState } from 'react';

import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const[newUser, setNewUaser]= useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email:'',
    password:'',
    photo:''
  })

  const provider =new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
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
      console.log(displayName,  email, photoURL);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log('fb user', user);
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
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
    if(newUser && user.email && user.password){
      //console.log('submitting');
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        const newUserInfo = {...user};
        newUserInfo.error = '' ;
        //console.log(res)
        newUserInfo.success= true ;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch(error => {
        // Handle Errors here.
        //var errorCode = error.code;
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success= false;
        setUser(newUserInfo);
        // var errorMessage = error.message;
        // console.log(errorCode, errorMessage);
      });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '' ;
        newUserInfo.success= true ;
        setUser(newUserInfo);
        console.log('sign in user info' , res.user);
      })
      .catch(error => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success= false;
        setUser(newUserInfo);
      });
    }
    e.preventDefault(); 
  }

  const updateUserName = name =>{
    var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
  
}).then(function() {
  console.log('update successfully');
}).catch(function(error) {
  console.log(error);
});
  }
  return (
    <div className='App'> 
            {
              user.isSignedIn ? <button onClick={handleSignedOut}>Sign Out</button> :
              <button onClick={handleSignIn}>Sign in</button>
            
            }
            <br/>
            <button onClick={handleFbSignIn}>Sign in using Facebook</button>
            
            {
              user.isSignedIn && <div><p>Welcome, {user.name}</p>
              </div>
            }
          
              <h1>Our own authentication system</h1>
              <input type="checkbox" onChange={() => setNewUaser(!newUser)} name="newUser" id=""/>
              <label htmlFor="">New user Sign Up</label>
              {/* <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Password: {user.password}</p> */}
          <form onSubmit={handleSubmit}>
              {newUser &&<input name="name" type="text" onBlur={handleBlur} placeholder="name"/>}
              <br/>
              <input type="text" name="email" onBlur={handleBlur} placeholder="email" required/>
              <br/>
              <input type="password" name="password" id="" onBlur={handleBlur} placeholder="password" required/>
              <br/>
              <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
              
          </form>
          <p style={{color:'red'}}>{user.error}</p>
          {user.success && <p style={{color:'green'}}>User {newUser ? 'created' : 'Logged In'} successfully</p>}
              
    </div>
  );
}

export default App;
