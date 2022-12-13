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

//Remove the session Login API Key
function RemoveSessionAPIKey(){
	sessionStorage.removeItem("FRANNS-API-Key");
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
				alert('Account created!');
				if(window.location.href == APIRoot+'/registration.html'){
					location.href = APIRoot;
				}
			}
			if(Request.status === 409){
				alert('Account is already created!');
				if(window.location.href == APIRoot+'/registration.html'){
					location.href = APIRoot;
				}
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

//Login
function Login(JSONData){
	var Request = new XMLHttpRequest();
	var PayLoad = JSON.stringify(JSONData);
	Request.open('POST', APIRoot+':'+UserMicroServicePort+'/login', true);
	Request.setRequestHeader("accept", "application/json");
	Request.setRequestHeader("Content-Type", "application/json");
	try{
		Request.send(PayLoad);
		Request.onload = function(){
			if(Request.status === 200){
				Data = JSON.parse(Request.responseText);
				SetSessionAPIKey(Data.apikey)
				if(window.location.href == APIRoot+'/'){
					location.href = APIRoot+'/ss/home.html';
				}
			}
			else{
				Log('Failed to use User Micro Service API, Request Error. Non 200 Status Code');
				alert('Could not log in using that information!');
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

//Logout
function Logout(JSONData){
	var Request = new XMLHttpRequest();
	var PayLoad = JSON.stringify(JSONData);
	Request.open('POST', APIRoot+':'+UserMicroServicePort+'/logout', true);
	Request.setRequestHeader("accept", "application/json");
	Request.setRequestHeader("Content-Type", "application/json");
	try{
		Request.send(PayLoad);
		Request.onload = function(){
			if(Request.status === 200){
				RemoveSessionAPIKey();
				location.href = APIRoot+'/';
			}
			else{
				Log('Failed to use User Micro Service API, Request Error. Non 200 Status Code');
				alert('Could not logout using that information!');
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

//Greet
function Greet(JSONData){
	var Request = new XMLHttpRequest();
	var PayLoad = JSON.stringify(JSONData);
	Request.open('POST', APIRoot+':'+UserMicroServicePort+'/grab/session/user', true);
	Request.setRequestHeader("accept", "application/json");
	Request.setRequestHeader("Content-Type", "application/json");
	try{
		Request.send(PayLoad);
		Request.onload = function(){
			if(Request.status === 200){
				Data = JSON.parse(Request.responseText);
				document.getElementById('greeting').textContent = 'Hello '+Data.first_name;
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

//When the user clicks the register button
function ClickedRegister(){
	var Firstname = document.getElementById('first_name').value;
	var Lastname = document.getElementById('last_name').value;
	var Email = document.getElementById('email').value;
	var Username = document.getElementById('username').value;
	var Password = document.getElementById('password').value;
	var ConfirmPassword = document.getElementById('confirmpassword').value;

	if(Password != ConfirmPassword){
		alert('Password does not match!');
	}

	var JsonObj = new Object();
	JsonObj.first_name = Firstname;
	JsonObj.last_name = Lastname;
	JsonObj.email = Email;
	JsonObj.username = Username;
	JsonObj.password = Password;

	AddUser(JsonObj);
}

//When the user clicks the login button
function ClickedLogin(){
	var Username = document.getElementById('username').value;
	var Password = document.getElementById('password').value;

	var JsonObj = new Object();
	JsonObj.username = Username;
	JsonObj.password = Password;

	Login(JsonObj);
}

//When the user clicks the logout button
function ClickedLogout(){
	Session = GetSessionAPIKey();
	if(Session != null){
		var JsonObj = new Object();
		JsonObj.apikey = Session;

		Logout(JsonObj);
	}
	else{
		Log('Not Logged in Can Not Logout');
	}
}

//Greet the user
function GreetUser(){
	var GreetElement = document.getElementById('greeting');
	if(GreetElement != null){
		Session = GetSessionAPIKey();
		if(Session != null){
			var JsonObj = new Object();
			JsonObj.apikey = Session;
			Greet(JsonObj);
		}
		else{
			Log('Failed to Greet User, No Session Found');
		}
	}
	else{
		Log('Failed to Greet User, No Element Found');
	}
}

//Navigate
function Navigate(){
	Session = GetSessionAPIKey();
	if(Session != null){
		if(window.location.href == APIRoot+'/' || window.location.href == APIRoot+'/registration.html'){
			Log('Loged in and On Login or Registration Page. Redirecting');
			location.href = APIRoot+'/ss/home.html';
		}
		else{
			Log('No Navigation Needed');
		}
	}
	else{
		if(window.location.href != APIRoot+'/' && window.location.href != APIRoot+'/registration.html'){
			Log('Not Loged in and Not On Login or Registration Page. Redirecting');
			location.href = APIRoot+'/';
		}
		else{
			Log('No Navigation Needed');
		}
	}
}

//Main Function
function main(){
	//Navigate the User
	Navigate();//If on login page and loged in go to home page. 
	//Greet the User
	GreetUser();
}

//Run the main function
main();