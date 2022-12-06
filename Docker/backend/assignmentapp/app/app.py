#Import Flask
from flask import Flask, jsonify, request, abort

#Import SQLAlchemy and Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

#Import CORS
from flask_cors import CORS

#Import MSQL Connector
import mysqlx

#Import Date and Time
import datetime
import time

#Import Secrets
import secrets

#Setup the app with Flask
app = Flask(__name__)

#Set the app with CORS
CORS(app)

#Config the connector
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:~mysqlrootpassword~@localhost:3306/~mysqldatabase~'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

#Config the database tracking modifications
app.config['SQLALCHEMY_DATABASE_TRACK_MODIFICATIONS'] = False

#Config the tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#SQLAlchemy Database Connection
db = SQLAlchemy(app)

#Marshmallow Data Types
ma = Marshmallow(app)

#User Data Structure Class
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text())
    first_name = db.Column(db.Text())
    last_name = db.Column(db.Text())
    username = db.Column(db.Text())
    password = db.Column(db.Text())
    is_admin = db.Column(db.Boolean(), default = False)
    creation_datetime = db.Column(db.DateTime, default = datetime.datetime.now)

    def __init__(self, email, first_name, last_name, username, password, is_admin):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.password = password
        self.is_admin = is_admin

#User Schema
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'email', 'first_name', 'last_name', 'username', 'password', 'is_admin', 'creation_datetime')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

#Session Data Structure Class
class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text())
    apikey = db.Column(db.Text())
    creation_datetime = db.Column(db.DateTime, default = datetime.datetime.now)

    def __init__(self, username, apikey):
        self.username = username
        self.apikey = apikey

#Session Schema
class SessionSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username', 'apikey', 'creation_datetime')

session_schema = SessionSchema()
sessions_schema = SessionSchema(many=True)

#Assignment Data Structure Class
class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assignment_name = db.Column(db.Text())
    max_attempts = db.Column(db.Integer)
    release_date = db.Column(db.Text())
    due_date = db.Column(db.Text())
    creation_datetime = db.Column(db.DateTime, default = datetime.datetime.now)

    def __init__(self, assignment_name, max_attempts, release_date, due_date):
        self.assignment_name = assignment_name
        self.max_attempts = max_attempts
        self.release_date = release_date
        self.due_date = due_date

#Assignment Schema
class AssignmentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'assignment_name', 'max_attempts', 'release_date', 'due_date', 'creation_datetime')

assignment_schema = AssignmentSchema()
assignments_schema = AssignmentSchema(many=True)

#Userdata Data Structure Class
class Userdata(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text())
    assignment_id = db.Column(db.Integer)
    used_attempts = db.Column(db.Integer)
    grades = db.Column(db.Text())
    feedback = db.Column(db.Text())
    creation_date = db.Column(db.DateTime, default = datetime.datetime.now)

    def __init__(self, username, assignment_id, used_attempts, grades, feedback):
        self.username = username
        self.assignment_id = assignment_id
        self.used_attempts = used_attempts
        self.grades = grades
        self.feedback = feedback

#Userdata Schema
class UserdataSchema(ma.Schema):
    class Meta:
        fields = ('id', 'username', 'assignment_id', 'used_attempts', 'grades', 'feedback', 'creation_date')

userdata_schema = UserdataSchema()
userdatas_schema = UserdataSchema(many=True)

#Connect to the db
with app.app_context():
    while True:
        try:
            db.create_all()
            break
        except Exception as e:
            print('Error while connecting to db')
            print(str(e))
            time.sleep(15)

#Get all assignments, Open for everyone
@app.route('/get/all/assignments', methods = ['GET'])
def get_all_assignments():
    all_assignments = Assignment.query.all()
    results = assignments_schema.dump(all_assignments)
    return jsonify(results)

#Get a assignment by id, Open for everyone
@app.route('/get/assignment/<assignment_id>', methods = ['GET'])
def get_assignment(assignment_id):
    try:
        assignment = Assignment.query.filter_by(id=assignment_id).first()
        if assignment == None:
            raise
    except:
        abort(404)
    return assignment_schema.jsonify(assignment)

#Add a assignment if the assignment does not exist, Admin/Teacher only
@app.route('/add/assignment', methods = ['POST'])
def add_assignment():
    #Needs a API Key Attached to a Admin/Teacher Account
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
        if user.is_admin != True:
            raise
    except:
        abort(401)

    form_assignment_name = request.json['assignment_name']
    form_max_attempts = request.json['max_attempts']
    form_release_date = request.json['release_date']
    form_due_date = request.json['due_date']

    try:
        assignment = Assignment.query.filter_by(assignment_name=form_assignment_name).first()
        if assignment != None:
            raise
    except:
        abort(409)

    assignment = Assignment(form_assignment_name, form_max_attempts, form_release_date, form_due_date)
    db.session.add(assignment)
    db.session.commit()
    return assignment_schema.jsonify(assignment)

#Update an assignment by id, Admin/Teacher only
@app.route('/update/assignment/<assignment_id>', methods = ['PUT'])
def update_assignment(assignment_id):
    try:
        form_assignment_name = request.json['assignment_name']
        form_max_attempts = request.json['max_attempts']
        form_release_date = request.json['release_date']
        form_due_date = request.json['due_date']
    except:
        abort(400)

    #Needs a API Key Attached to a Admin/Teacher Account
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
        if user.is_admin != True:
            raise
    except:
        abort(401)

    try:
        assignment = Assignment.query.filter_by(id=assignment_id).first()
        if assignment == None:
            raise
    except:
        abort(404)

    assignment.assignment_name = form_assignment_name
    assignment.max_attempts = form_max_attempts
    assignment.release_date = form_release_date
    assignment.due_date = form_due_date

    db.session.commit()
    return assignment_schema.jsonify(assignment)

#Delete an assignment by id, Admin/Teacher only
@app.route('/delete/assignment/<assignment_id>', methods = ['DELETE'])
def delete_assignment(assignment_id):
    #Needs a API Key Attached to a Admin/Teacher Account
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
        if user.is_admin != True:
            raise
    except:
        abort(401)

    try:
        assignment = Assignment.query.filter_by(id=assignment_id).first()
        if assignment == None:
            raise
    except:
        abort(404)

    db.session.delete(assignment)
    db.session.commit()
    return assignment_schema.jsonify(assignment)



#Get all userdata, Admin/Teacher only
@app.route('/get/all/userdata', methods = ['GET'])
def get_all_userdata():
    #Needs a API Key Attached to a Admin/Teacher Account
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
        if user.is_admin != True:
            raise
    except:
        abort(401)

    all_userdata = Userdata.query.all()
    results = userdatas_schema.dump(all_userdata)
    return jsonify(results)

#Get userdata by username, Admin/Teacher or logged in user only
@app.route('/get/userdata/username/<userdata_username>', methods = ['GET'])
def get_userdata_by_username(userdata_username):
    #Needs a API Key Attached to a Admin/Teacher Account or the account being pulled
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        sessionuser = User.query.filter_by(username=session.username).first()
        if sessionuser == None:
            raise
        lookupuser = User.query.filter_by(username=userdata_username).first()
        if lookupuser == None:
            if user.is_admin == True or sessionuser.username == userdata_username:
                abort(404)
            else:
                raise
        if user.is_admin != True and session.username != lookupuser.username:
            raise
    except:
        abort(401)

    try:
        userdata = Userdata.query.filter_by(username=userdata_username)
        if userdata == None:
            raise
    except:
        abort(404)

    return userdatas_schema.jsonify(userdata)

#Get userdata by id, Admin/Teacher or logged in user only
@app.route('/get/userdata/id/<userdata_id>', methods = ['GET'])
def get_userdata_by_id(userdata_id):
    #Needs a API Key Attached to a Admin/Teacher Account or the account being pulled
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        sessionuser = User.query.filter_by(username=session.username).first()
        if sessionuser == None:
            raise
        lookupuserdata = Userdata.query.filter_by(id=userdata_id).first()
        if lookupuser == None:
            if user.is_admin == True:
                abort(404)
            else:
                raise
        if user.is_admin != True and session.username != lookupuserdata.username:
            raise
    except:
        abort(401)

    return userdata_schema.jsonify(lookupuserdata)

#Add userdata if the userdata does not exist for the specific assignment_id, Admin/Teacher only
@app.route('/add/userdata', methods = ['POST'])
def add_userdata():
    try:
        form_username = request.json['username']
        form_assignment_id = request.json['assignment_id']
        form_used_attempts = request.json['used_attempts']
        form_grades = request.json['grades']
        form_feedback = request.json['feedback']
    except:
        abort(400)

    #Needs a API Key Attached to a Admin/Teacher Account
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
        if user.is_admin != True:
            raise
    except:
        abort(401)

    try:
        userdata = Userdata.query.filter_by(username=form_username)
        for data in userdata:
            if data.assignment_id == form_assignment_id:
                raise
    except:
        abort(409)

    userdata = Userdata(form_username, form_assignment_id, form_used_attempts, form_grades, form_feedback)
    db.session.add(userdata)
    db.session.commit()
    return userdata_schema.jsonify(userdata)

#Update userdata by id, Admin/Teacher only
@app.route('/update/userdata/<userdata_id>', methods = ['PUT'])
def update_userdata(userdata_id):
    try:
        form_username = request.json['username']
        form_assignment_id = request.json['assignment_id']
        form_used_attempts = request.json['used_attempts']
        form_grades = request.json['grades']
        form_feedback = request.json['feedback']
    except:
        abort(400)

    #Needs a API Key Attached to a Admin/Teacher Account
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
        if user.is_admin != True:
            raise
    except:
        abort(401)

    try:
        userdata = Userdata.query.filter_by(id=userdata_id).first()
        if userdata == None:
            raise
    except:
        abort(404)

    userdata.username = form_username
    userdata.assignment_id = form_assignment_id
    userdata.used_attempts = form_used_attempts
    userdata.grades = form_grades
    userdata.feedback = form_feedback

    db.session.commit()
    return userdata_schema.jsonify(userdata)

#Delete userdata by id, Admin/Teacher only
@app.route('/delete/userdata/<userdata_id>', methods = ['DELETE'])
def delete_userdata(userdata_id):
    #Needs a API Key Attached to a Admin/Teacher Account
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
        if user.is_admin != True:
            raise
    except:
        abort(401)

    try:
        userdata = Userdata.query.filter_by(id=userdata_id).first()
        if userdata == None:
            raise
    except:
        abort(404)

    db.session.delete(userdata)
    db.session.commit()
    return userdata_schema.jsonify(userdata)

#Health check
@app.route('/', methods = ['GET'])
def onlinecheck():
    return 'Okay'

#Run the app
if __name__ == "__main__":
    while True:
        try:
            app.run
            break
        except Exception as e:
            print('Error while running')
            print(str(e))
            time.sleep(15)