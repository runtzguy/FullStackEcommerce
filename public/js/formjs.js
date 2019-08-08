const signUp = document.getElementById("signupForm");
const login = document.getElementById("loginForm");
const logs = document.getElementById("logs");
const tabs = document.querySelector(".tab-container");
const signupTab = document.querySelector("#tab-signup span");
const loginTab = document.querySelector("#tab-login span");
const signupForm = document.querySelector(".sign-up");
const loginForm = document.querySelector(".login");
const loginSignNav = document.querySelector("#loginSignNav");
const navBar = document.querySelector('.nav-bar');

tabs.addEventListener('click', (e)=>{
    if(e.target.dataset.value == "signup"){
        //Show Signup
        signupTab.style.background = "white";
        loginTab.style.background = "rgb(228, 228, 228)"
        loginForm.style.zIndex= "1"
        signupForm.style.zIndex = "2";

    }
    else if (e.target.dataset.value == "login" ){
        //Show Login
        loginTab.style.background = "white"
        signupTab.style.background = "rgb(228, 228, 228)";
        loginForm.style.zIndex = "2"
        signupForm.style.zIndex = "1";
        
    }
 
})
signUp.addEventListener('submit', function(e){
     //Prevents page from reloading and navigating away.
     e.preventDefault();
     let formData =  new FormData(signUp);
     //Outputs data from the formData in this pattern: key value
 //    for( let key of formData.entries()){
 //        console.log(key[0] + " " + key[1]); 
 //    }
     logs.innerHTML = "";
     fetch('/signUp', {
         method : 'post',
         body : formData,
         headers : {
             'Accept' : 'application/json'
         }
     }).then((response) =>{
         
         errorLogs(response,logs)
         if(response.status == 200){
             signUp.reset();  
         }
         
     })
     
 })
 login.addEventListener('submit', function(e){
      //Prevents page from reloading and navigating away.
      e.preventDefault();
     let formData =  new FormData(login);

     logs.innerHTML = "";
     fetch('/login', {
         method : 'post',
         body : formData,
         headers : {
             'Accept' : 'application/json'
         }
     }).then((response) =>{
         let resStatus = response.status;
         console.log(resStatus);
         if(resStatus == 200){
             response.json()
             .then( e => {
                 console.log(e);
                 login.reset(); 
             })
             
         } else if (resStatus == 307){
             console.log("hey man ");
         }
         else {
             errorLogs(response,logs)
         }
         
     })
 })
 function errorLogs( promiseData, logs){
     let cls = 'success';
     let returnData = [];
     if(promiseData.status == 200){
         promiseData.json()
         .then(e => {
             sessionStorage.setItem('token', e.token);
             logs.innerHTML = `<div class="${cls}"> Welcome back!</div>`;
         })
         
     } else {
         cls = "danger";
         promiseData.json()
             .then((e) => {
                 console.log(e);
                 for(let i of e){
                     //Find how to retrieve token from response object and then assign token to session or cookie?
                     //Assign whatever is remaining in the object to an array and pass it to getToken    
                     returnData.push(`<div class="${cls}">${i}</div>`);
                 }
                 logs.innerHTML = returnData.join('');
             })
     }
 }