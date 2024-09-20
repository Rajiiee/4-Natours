import '@babel/polyfill';
import { login, logout,signup,resetPassword, forgotPassword } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const signupForm = document.querySelector('.form--signup');
const resetPasswordForm = document.querySelector('.form--reset-password');
const forgotPasswordForm = document.querySelector('.form--forgot-password');
//Values

//DELEGATIONS
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (signupForm) { // Add this block
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    //console.log(form);
    
    updateSettings(form,'data');
  });
}
  if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent='Upadting....';
      const currentPassword = document.getElementById('password-current').value;
      const passwordNew = document.getElementById('password').value;
      const passwordConfirmNew = document.getElementById('password-confirm').value;
      await updateSettings({currentPassword, passwordNew, passwordConfirmNew},'password');

      document.querySelector('.btn--save-password').textContent='Save password';      
      document.getElementById('password-current').value='';
      document.getElementById('password').value='';
      document.getElementById('password-confirm').value='';
      
    });
}


if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });
}

// Reset Password Form

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const token = window.location.pathname.split('/')[2]; // Extract token from URL
    resetPassword(password, passwordConfirm, token);
  });
}
