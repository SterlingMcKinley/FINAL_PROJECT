var MasterSpeed = 500;

var Loop;

//API root for now should be assumed to be the ip address this is running on
var APIRoot='http://'+window.location.hostname;

var UserMicroServicePort = 5000;

var AssignmentMicroServicePort = 5500;

var APIUser = null;
var APIGrades = null;
var APIAssignments = null;
var APIStudents = null;

var Greeted = false;
var Charted = false;
var LoadedData = false;
var LoadStudents = false;

var WhoamiErrors = 0;

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
				if(WhoamiErrors > 0){
					WhoamiErrors = 0;
				}
			}
			else{
				Log('Failed to use User Micro Service API, Request Error. Non 200 Status Code');
				WhoamiErrors = WhoamiErrors + 1;
				if(WhoamiErrors > 100){
					RemoveSessionAPIKey();
				}
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

//Grab Students
function GrabStudents(JSONData){
	var Request = new XMLHttpRequest();
	var PayLoad = JSON.stringify(JSONData);
	Request.open('POST', APIRoot+':'+UserMicroServicePort+'/grab/all/users', true);
	Request.setRequestHeader("accept", "application/json");
	Request.setRequestHeader("Content-Type", "application/json");
	try{
		Request.send(PayLoad);
		Request.onload = function(){
			if(Request.status === 200){
				Data = JSON.parse(Request.responseText);
				var Students = [];
				for(let i = 0; i < Data.length; i++) {
					if(Data[i].is_admin == false){
						Students.push(Data[i]);
					}
				}
				APIStudents = Students;
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

//Admin Load Student Grade
function AdminLoadStudentGrade(JSONData, Username){
	var Request = new XMLHttpRequest();
	var PayLoad = JSON.stringify(JSONData);
	Request.open('POST', APIRoot+':'+AssignmentMicroServicePort+'/grab/userdata/username/'+Username, true);
	Request.setRequestHeader("accept", "application/json");
	Request.setRequestHeader("Content-Type", "application/json");
	try{
		Request.send(PayLoad);
		Request.onload = function(){
			if(Request.status === 200){
				var UrlArray = Request.responseURL.split("/");
				var User = UrlArray[(UrlArray.length - 1)];
				Data = JSON.parse(Request.responseText);
				if(Data != null){
					var Table = document.getElementById(User)
					Table.innerHTML = "";
					if(Table != null){
						var TableD = document.createElement('td');
						var TableDiv = document.createElement('div');
						var TableTable = document.createElement('table');
						var TBody = document.createElement('tbody');
						var TableHeaderRow = document.createElement('tr');
						var TableHeaderAssignment = document.createElement('th');
						TableHeaderAssignment.textContent = 'Assignment';
						TableHeaderAssignment.style.textAlign = "center";
						var TableHeaderA1 = document.createElement('th');
						TableHeaderA1.textContent = 'Take One';
						TableHeaderA1.style.textAlign = "center";
						var TableHeaderA2 = document.createElement('th');
						TableHeaderA2.textContent = 'Take Two';
						TableHeaderA2.style.textAlign = "center";
						var TableHeaderA3 = document.createElement('th');
						TableHeaderA3.textContent = 'Take Three';
						TableHeaderA3.style.textAlign = "center";
						TableHeaderRow.appendChild(TableHeaderAssignment);
						TableHeaderRow.appendChild(TableHeaderA1);
						TableHeaderRow.appendChild(TableHeaderA2);
						TableHeaderRow.appendChild(TableHeaderA3);
						Table.appendChild(TableD);
						TableD.appendChild(TableDiv);
						TableDiv.appendChild(TableTable);
						TableTable.appendChild(TBody);
						TBody.appendChild(TableHeaderRow);
						for(let i = 0; i < Data.length; i++) {
							var TableRow = document.createElement('tr');
							var RowAssignment = document.createElement('td');
							RowAssignment.textContent = MatchAssignment(Data[i].assignment_id, APIAssignments)
							var RowGradeA1 = document.createElement('td');
							RowGradeA1.textContent = PositionGrade(Data[i].grades, 0)
							var RowGradeA2 = document.createElement('td');
							RowGradeA2.textContent = PositionGrade(Data[i].grades, 1)
							var RowGradeA3 = document.createElement('td');
							RowGradeA3.textContent = PositionGrade(Data[i].grades, 2)
							TableRow.appendChild(RowAssignment);
							TableRow.appendChild(RowGradeA1);
							TableRow.appendChild(RowGradeA2);
							TableRow.appendChild(RowGradeA3);
							TBody.appendChild(TableRow);
						}
						Table.style.display = 'table-row';
					}
					else{
						alert('Table data is not yet ready please try again later');
						Log('Table data is not yet ready');
					}
				}
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

//Find the Highest Grade from the Grades String
function HighestGrade(String){
	if(String.search('/') > -1){
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

//Find the Given Position Grade from the Grades String
function PositionGrade(String, Position){
	if(String.search('/') > -1){
		var Grades = String.split('/');
		if(Grades[Position] != null){
			return Grades[Position];
		}
		else{
			return null
		}
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

function ClickedLoadStudentsGrades(self){
	var Table = document.getElementById(self.srcElement.getAttribute('student'));
	if(Table.style.display == 'table-row'){
		Table.style.display = 'none';
		return;
	}
	Session = GetSessionAPIKey();
	if(Session != null){
		var JsonObj = new Object();
		JsonObj.apikey = Session;

		AdminLoadStudentGrade(JsonObj, self.srcElement.getAttribute('student'));
	}
	else{
		Log('Not Logged in Can Not Load Students Grades');
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
		if(APIAssignments == null){
			LoadAssignments();
		}
		else if(APIGrades == null){
			LoadGrades();
		}
		else{
			LoadedData = true;
		}
	}
	else if(window.location.href == APIRoot+'/admin/dashboard.html'){
		if(APIAssignments == null){
			LoadAssignments();
		}
		else{
			LoadedData = true;
		}
	}
	Log('Loaded Page Data');
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

function GenerateChart(Ctx, Labels, Attempt1, Attempt2, Attempt3){
	var GenChart = new Chart(Ctx, {
		type: 'line',
		data: {
		  labels: Labels,
		  datasets: [{
			  label: 'Attempt 1',
			  data: Attempt1,
			  borderColor: 'rgba(144, 190, 29)',
			  backgroundColor: 'rgba(144, 190, 29)',
			  fill: false,
			  borderWidth: 2
			},
			{
			  label: 'Attempt 2',
			  data: Attempt2,
			  borderColor: 'rgba(145, 145, 145)',
			  backgroundColor: 'rgba(145, 145, 145)',
			  fill: false,
			  borderWidth: 2
			},
			{
			  label: 'Attempt 3',
			  data: Attempt3,
			  borderColor: 'rgba(97, 142, 187)',
			  backgroundColor: 'rgba(97, 142, 187)',
			  fill: false,
			  borderWidth: 2
			}
		  ]
		},
		options: {
		  scales: {
			yAxes: [{
			  ticks: {
				beginAtZero: true
			  }
			}]
		  }
		}
	  });
	
	return GenChart
}

//Chart the data
function ChartData(){
	if(chart_1 != null && chart_2 != null && chart_3 != null){
		var ctx_1 = document.getElementById('chart_1').getContext('2d');
		var ctx_2 = document.getElementById('chart_2').getContext('2d');
		var ctx_3 = document.getElementById('chart_3').getContext('2d');
		
		var DiagnosticList = [];
		var DiagnosticLabelList = [];
		var DiagnosticTake1List = [];
		var DiagnosticTake2List = [];
		var DiagnosticTake3List = [];

		var BuildScriptList = [];
		var BuildScriptLabelList = [];
		var BuildScriptTake1List = [];
		var BuildScriptTake2List = [];
		var BuildScriptTake3List = [];

		var DeploymentList = [];
		var DeploymentLabelList = [];
		var DeploymentTake1List = [];
		var DeploymentTake2List = [];
		var DeploymentTake3List = [];
		
		for(let i = 0; i < APIAssignments.length; i++) {
			if(APIAssignments[i].assignment_name.search('Diagnostic') > -1){
				DiagnosticList.push(APIAssignments[i]);
				DiagnosticLabelList.push(APIAssignments[i].assignment_name);
			}
			else if(APIAssignments[i].assignment_name.search('Build Script') > -1){
				BuildScriptList.push(APIAssignments[i]);
				BuildScriptLabelList.push(APIAssignments[i].assignment_name);
			}
			else if(APIAssignments[i].assignment_name.search('Deployment') > -1){
				DeploymentList.push(APIAssignments[i]);
				DeploymentLabelList.push(APIAssignments[i].assignment_name);
			}
		}

		for(let i = 0; i < DiagnosticList.length; i++) {
			var Grade = null;
			for(let j = 0; j < APIGrades.length; j++) {
				if(APIGrades[j].assignment_id == DiagnosticList[i].id){
					Grade = APIGrades[j];
					break;
				}
			}
			if(Grade == null){
				DiagnosticTake1List.push(null);
				DiagnosticTake2List.push(null);
				DiagnosticTake3List.push(null);
			}
			else{
				DiagnosticTake1List.push(PositionGrade(Grade.grades, 0));
				DiagnosticTake2List.push(PositionGrade(Grade.grades, 1));
				DiagnosticTake3List.push(PositionGrade(Grade.grades, 2));
			}
		}

		for(let i = 0; i < BuildScriptList.length; i++) {
			var Grade = null;
			for(let j = 0; j < APIGrades.length; j++) {
				if(APIGrades[j].assignment_id == BuildScriptList[i].id){
					Grade = APIGrades[j];
					break;
				}
			}
			if(Grade == null){
				BuildScriptTake1List.push(null);
				BuildScriptTake2List.push(null);
				BuildScriptTake3List.push(null);
			}
			else{
				BuildScriptTake1List.push(PositionGrade(Grade.grades, 0));
				BuildScriptTake2List.push(PositionGrade(Grade.grades, 1));
				BuildScriptTake3List.push(PositionGrade(Grade.grades, 2));
			}
		}

		for(let i = 0; i < DeploymentList.length; i++) {
			var Grade = null;
			for(let j = 0; j < APIGrades.length; j++) {
				if(APIGrades[j].assignment_id == DeploymentList[i].id){
					Grade = APIGrades[j];
					break;
				}
			}
			if(Grade == null){
				DeploymentTake1List.push(null);
				DeploymentTake2List.push(null);
				DeploymentTake3List.push(null);
			}
			else{
				DeploymentTake1List.push(parseInt(PositionGrade(Grade.grades, 0)));
				DeploymentTake2List.push(parseInt(PositionGrade(Grade.grades, 1)));
				DeploymentTake3List.push(parseInt(PositionGrade(Grade.grades, 2)));
			}
		}

		// chart_1.destroy();
		// chart_2.destroy();
		// chart_3.destroy();

		chart_1 = GenerateChart(ctx_1, DiagnosticLabelList, DiagnosticTake1List, DiagnosticTake2List, DiagnosticTake3List)
		chart_2 = GenerateChart(ctx_2, BuildScriptLabelList, BuildScriptTake1List, BuildScriptTake2List, BuildScriptTake3List)
		chart_3 = GenerateChart(ctx_3, DeploymentLabelList, DeploymentTake1List, DeploymentTake2List, DeploymentTake3List)

		Charted = true;
	}
	else{
		Log('Failed to Chart Data, No Chart Page Data Found');
	}
}

//Admin dashboard load students
function AdminLoadStudents(){
	var Table = document.getElementById('studentlist');
	if(Table != null && APIStudents != null){
		Table.innerHTML = "";
		for(let i = 0; i < APIStudents.length; i++) {
			var TableRow = document.createElement('tr');
			var TableDataName = document.createElement('td');
			TableDataName.textContent = APIStudents[i].first_name+' '+APIStudents[i].last_name;
			var TableDataEmail = document.createElement('td');
			TableDataEmail.textContent = APIStudents[i].email;
			var TableDataEditScores = document.createElement('td');
			var TableDataEditScoresButton = document.createElement('button');
			TableDataEditScoresButton.type = "button";
			TableDataEditScoresButton.className = "btn btn-link btn-rounded btn-sm fw-bold";
			TableDataEditScoresButton.setAttribute("data-mdb-ripple-color", "dark");
			TableDataEditScoresButton.onclick = ClickedLoadStudentsGrades;
			TableDataEditScoresButton.setAttribute("student", APIStudents[i].username);
			TableDataEditScoresButton.textContent = "Edit Scores";
			TableDataEditScores.appendChild(TableDataEditScoresButton);
			var TableHiddenScoreRow = document.createElement('tr');
			TableHiddenScoreRow.id = APIStudents[i].username;
			TableHiddenScoreRow.className = "hidden_row";
			TableHiddenScoreRow.style.display = "none";
			TableHiddenScoreRow.style.textAlign = "center";
			TableRow.appendChild(TableDataName);
			TableRow.appendChild(TableDataEmail);
			TableRow.appendChild(TableDataEditScores);
			Table.appendChild(TableRow);
			Table.appendChild(TableHiddenScoreRow);
		}
		LoadStudents = true;
	}
	else{
		Log('Admin Student data is not yet ready');
	}
}

//Load students data
function LoadStudentsData(){
	Session = GetSessionAPIKey();
	if(Session != null){
		var JsonObj = new Object();
		JsonObj.apikey = Session;

		GrabStudents(JsonObj);
	}
	else{
		Log('Not Logged in Can Grab Students Data');
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

		GrabWhoami(JsonObj);
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
	if(APIUser != null && APIUser.is_admin == false && Greeted == false){
		//Greet the User
		GreetUser();
	}
	if(APIUser != null && LoadedData == false){
		//Load the page data
		LoadPageData();
	}
	if(APIUser != null && APIUser.is_admin == false && APIGrades != null && APIAssignments != null && Charted == false && typeof ChartPage !== 'undefined' && ChartPage == true){
		//Chart the data
		ChartData();
	}
	if(APIUser != null && APIUser.is_admin == true && AdminDashboardPage != null && AdminDashboardPage == true && APIStudents == null){
		//load students data
		LoadStudentsData();
	}
	if(APIUser != null && APIUser.is_admin == true && AdminDashboardPage != null && AdminDashboardPage == true && LoadStudents == false){
		//Admin dashboard load students
		AdminLoadStudents();
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