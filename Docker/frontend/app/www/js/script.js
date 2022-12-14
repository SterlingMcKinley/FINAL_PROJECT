var MasterSpeed = 500;

var Loop;

//API root for now should be assumed to be the ip address this is running on
var APIRoot='http://'+window.location.hostname;

var UserMicroServicePort = 5000;

var AssignmentMicroServicePort = 5500;

var APIUser = null;
var APIGrades = null;
var APIAssignments = null;

var Greeted = false;

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
					location.href = APIRoot+'/student/home.html';
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
				RemoveSessionAPIKey();
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

//Grab Who am i
function GrabWhoami(JSONData){
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
				APIUser = Data;
			}
			else{
				Log('Failed to use User Micro Service API, Request Error. Non 200 Status Code');
				RemoveSessionAPIKey();
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

//Grab Grades
function GrabGrades(JSONData){
	var Request = new XMLHttpRequest();
	var PayLoad = JSON.stringify(JSONData);
	Request.open('POST', APIRoot+':'+AssignmentMicroServicePort+'/grab/userdata/username/'+APIUser.username, true);
	Request.setRequestHeader("accept", "application/json");
	Request.setRequestHeader("Content-Type", "application/json");
	try{
		Request.send(PayLoad);
		Request.onload = function(){
			if(Request.status === 200){
				Data = JSON.parse(Request.responseText);
				APIGrades = Data;
			}
			else{
				Log('Failed to use Assignment Micro Service API, Request Error. Non 200 Status Code');
			}
		};
		Request.onerror = function() {
			Log('Failed to use Assignment Micro Service API, Request Error');
		};
	}
	catch(err){
		Log('Failed to use Assignment Micro Service API');
	}
}

//Load All Grades of User
function LoadGrades(){
	Session = GetSessionAPIKey();
	if(Session != null && APIUser != null){
		var JsonObj = new Object();
		JsonObj.apikey = Session;

		GrabGrades(JsonObj);
	}
	else{
		Log('Not Logged in Can Not Load Grades');
	}
}

//Grab Assignments
function GrabAssignments(){
	var Request = new XMLHttpRequest();
	Request.open('POST', APIRoot+':'+AssignmentMicroServicePort+'/grab/all/assignments', true);
	Request.setRequestHeader("accept", "application/json");
	Request.setRequestHeader("Content-Type", "application/json");
	try{
		Request.send();
		Request.onload = function(){
			if(Request.status === 200){
				Data = JSON.parse(Request.responseText);
				APIAssignments = Data;
			}
			else{
				Log('Failed to use Assignment Micro Service API, Request Error. Non 200 Status Code');
			}
		};
		Request.onerror = function() {
			Log('Failed to use Assignment Micro Service API, Request Error');
		};
	}
	catch(err){
		Log('Failed to use Assignment Micro Service API');
	}
}

//Load All Assignments
function LoadAssignments(){
	GrabAssignments();
}

//Find the Highest Grade from the Grades String
function HighestGrade(String){
	if(String.search('/') > 0){
		var Grades = String.split('/');
		var HighestGrade = null;
		for(let i = 0; i < Grades.length; i++) {
			if(HighestGrade == null){
				HighestGrade = Grades[i];
			}
			else if(parseInt(HighestGrade) < parseInt(Grades[i])){
				HighestGrade = Grades[i];
			}
		}
		return HighestGrade
	}
	else{
		return String;
	}
}

//Match Assingment to Userdata
function MatchAssignment(Id, Assignments){
	for(let i = 0; i < Assignments.length; i++) {
		if(Assignments[i].id == Id){
			return Assignments[i].assignment_name;
		}
	}
	return 'N/A';
}

//Load All Assignments
function LoadTable(){
	var Table = document.getElementById('table');
	if(Table != null && APIGrades != null && APIAssignments != null){
		Table.innerHTML = "";
		var TableHeaderRow = document.createElement('tr');
		var TableHeaderAssignment = document.createElement('th');
		TableHeaderAssignment.textContent = 'Assignment';
		var TableHeaderHighestGrade = document.createElement('th');
		TableHeaderHighestGrade.textContent = 'Highest Grade';
		TableHeaderRow.appendChild(TableHeaderAssignment);
		TableHeaderRow.appendChild(TableHeaderHighestGrade);
		Table.appendChild(TableHeaderRow);
		for(let i = 0; i < APIGrades.length; i++) {
			var TableRow = document.createElement('tr');
			var RowAssignment = document.createElement('th');
			RowAssignment.textContent = MatchAssignment(APIGrades[i].assignment_id, APIAssignments)
			var RowGrade = document.createElement('th');
			RowGrade.textContent = HighestGrade(APIGrades[i].grades);
			TableRow.appendChild(RowAssignment);
			TableRow.appendChild(RowGrade);
			Table.appendChild(TableRow);
		}
	}
	else{
		alert('Table data is not yet ready please try again later');
		Log('Table data is not yet ready');
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

//Check if the user press entered
function CheckSubmit(e, func) {
	if(e && e.keyCode == 13) {
		func();
	}
}

//Load the page data
function LoadPageData(){
	if(window.location.href == APIRoot+'/student/home.html' || window.location.href == APIRoot+'/student/overview.html'){
		LoadGrades();
		LoadAssignments();
		Log('Loaded Userdata and Assignment Data');
	}
}

//Greet the user
function GreetUser(){
	var GreetElement = document.getElementById('greeting');
	if(GreetElement != null){
		document.getElementById('greeting').textContent = 'Hello '+APIUser.first_name;
		document.getElementById('greeting').style.visibility = "visible";
		Greeted = true;
	}
	else{
		Log('Failed to Greet User, No Element Found');
	}
}

//Navigate
function Navigate(){
	Session = GetSessionAPIKey();
	if(Session != null){
		if(APIUser != null){
			if(window.location.href == APIRoot+'/' || window.location.href == APIRoot+'/registration.html'){
				if(APIUser.is_admin != true){
					Log('Loged in and On Login or Registration Page. Redirecting to Student Pages');
					location.href = APIRoot+'/student/home.html';
				}
				else if(APIUser.is_admin == true){
					Log('Loged in and On Login or Registration Page. Redirecting to Admin Pages');
					location.href = APIRoot+'/admin/dashboard.html';
				}
			}
			// else{
			// 	Log('No Navigation Needed');
			// }
		}
	}
	else{
		if(window.location.href != APIRoot+'/' && window.location.href != APIRoot+'/registration.html'){
			Log('Not Loged in and Not On Login or Registration Page. Redirecting');
			location.href = APIRoot+'/';
		}
		// else{
		// 	Log('No Navigation Needed');
		// }
	}
}

//Who am i
function Whoami(){
	Session = GetSessionAPIKey();
	if(Session != null){
		var JsonObj = new Object();
		JsonObj.apikey = Session;

		GrabWhoami(Session);
	}
}

//Main Loop
function MainLoop(){
	if(APIUser == null){
		//Who am i
		Whoami()
	}
	//Navigate the User
	Navigate();
	if(APIUser != null && Greeted == false){
		//Greet the User
		GreetUser();
	}
	if(APIGrades == null || APIAssignments == null){
		//Load the page data
		LoadPageData();
	}
}

//Main Function
function main(){
	Log('Running: F.R.A.N.N.S. Grade Tracker');
	MainLoop();
	Loop = setInterval(MainLoop, MasterSpeed);
}

//Run the main function
main();