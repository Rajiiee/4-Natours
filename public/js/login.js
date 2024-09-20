import axios from 'axios';
import { showAlert } from './alerts';


export const login = async (email, password) => {
   
  try{
    const res=await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        data: {
          email,
          password
        }
      });
      if(res.data.status==='success'){
        showAlert('success', 'Logged in successfully!');
        window.setTimeout(() => {
          location.assign('/');
        }, 150);
      }
      console.log(res);
  }catch(err){
    showAlert('error', err.response.data.message);
    //console.log(err);
  }
    
};

export const logout= async ()=>{
  try{
    const res=await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    if(res.data.status==='success') location.reload(true);
    console.log(res);

  }catch(err){
    console.log(err.response);
    showAlert('error','Error logging out! Try again.')
  }
}


export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', "unable to sent request");
    console.log(err);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: { email },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Reset link sent to your email!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// Reset Password
export const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: { password, passwordConfirm },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password reset successful!');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};