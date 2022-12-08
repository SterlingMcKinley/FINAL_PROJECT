//API root for now should be assumed to be the ip address this is running on
var APIRoot='http://'+window.location.hostname;

var UserMicroServicePort = 5000;

var AssignmentMicroServicePort = 5500;

//Log to console
function Log(Msg){
	console.log(Msg);
}

//Get the session Login API Key
function GetSessionAPIKey(){
	return sessionStorage.getItem("FRANNS-API-Key");
}

//Set the session Login API Key
function SetSessionAPIKey(ApiKey){
	sessionStorage.setItem("FRANNS-API-Key", ApiKey);
}

//Add a user
function AddUser(JSONData){
	var Request = new XMLHttpRequest();
	var PayLoad = JSON.stringify(JSONData);
	Request.open('POST', APIRoot+':'+UserMicroServicePort+'/add/user', true);
	Request.setRequestHeader("accept", "application/json");
	Request.setRequestHeader("Content-Type", "application/json");
	try{
		Request.send(PayLoad);
		Request.onload = function(){
			if(Request.status === 200){
				Log(Request.text)
				//Login API NEW USER
				//If Login Works THEN REDIRECT TO OVERVIEW
			}
			else{
				Log('Failed to use User Micro Service API, Request Error. Non 200 Status Code');
			}
		};
		Request.onerror = function() {
			Log('Failed to use User Micro Service API, Request Error');
		};
	}
	catch(err){
		Log('Failed to use User Micro Service API');
	}
}

//When the user clicks the bored button
function ClickedRegister(){
	var Firstname = document.getElementById('first_name').value;
	var Lastname = document.getElementById('last_name').value;
	var Email = document.getElementById('email').value;
	var Username = document.getElementById('username').value;
	var Password = document.getElementById('password').value;
	var ConfirmPassword = document.getElementById('confirmpassword').value;

	if(Password != ConfirmPassword){
		alert('Password does not match');
	}

	var JsonObj = new Object();
	JsonObj.first_name = Firstname;
	JsonObj.last_name = Lastname;
	JsonObj.email = Email;
	JsonObj.username = Username;
	JsonObj.password = Password;

	AddUser(JsonObj);
}