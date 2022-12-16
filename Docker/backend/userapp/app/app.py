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
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://~mysqlrootuser~:~mysqlrootpassword~@~mysqldburl~:3306/~mysqldatabase~'
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

#UserNP Schema
class UserNPSchema(ma.Schema):
    class Meta:
        fields = ('id', 'email', 'first_name', 'last_name', 'username', 'is_admin', 'creation_datetime')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

usernp_schema = UserNPSchema()
usersnp_schema = UserNPSchema(many=True)

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

#Grab all users, Admin/Teacher only
@app.route('/grab/all/users', methods = ['POST'])
def grab_all_users():
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

    all_users = User.query.all()
    results = usersnp_schema.dump(all_users)
    return jsonify(results)

#Grab a user by username, Admin/Teacher only
@app.route('/grab/user/<requested_username>', methods = ['POST'])
def grab_user(requested_username):
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
        user = User.query.filter_by(username=requested_username).first()
        if user == None:
            raise
    except:
        abort(404)

    return usernp_schema.jsonify(user)

#Add a user if the username is available, Open for everyone
@app.route('/add/user', methods = ['POST'])
def add_user():
    try:
        form_email = request.json['email']
        form_first_name = request.json['first_name']
        form_last_name = request.json['last_name']
        form_username = request.json['username']
        form_password = request.json['password']
        #form_is_admin = request.json['is_admin']
        form_is_admin = False
    except:
        abort(400)

    try:
        user = User.query.filter_by(username=form_username).first()
        if user != None:
            raise
    except:
        abort(409)

    user = User(form_email, form_first_name, form_last_name, form_username, form_password, form_is_admin)
    db.session.add(user)
    db.session.commit()
    return usernp_schema.jsonify(user)

#Update a user by username, Open for logged in user only
@app.route('/update/user/<requested_username>', methods = ['PUT'])
def update_user(requested_username):
    try:
        form_email = request.json['email']
        form_first_name = request.json['first_name']
        form_last_name = request.json['last_name']
        form_current_password = request.json['current_password']
        form_new_password = request.json['new_password']
    except:
        abort(400)

    #Needs a API Key to target the account being modified
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
        if user.password != form_current_password:
            raise
    except:
        abort(401)

    user.email = form_email
    user.first_name = form_first_name
    user.last_name = form_last_name
    user.password = form_new_password

    db.session.commit()
    return usernp_schema.jsonify(user)

#Delete a user by username, Admin/Teacher only
@app.route('/delete/user/<requested_username>', methods = ['DELETE'])
def delete_user(requested_username):
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
        user = User.query.filter_by(username=requested_username).first()
        if user == None:
            raise
    except:
        abort(404)

    db.session.delete(user)
    db.session.commit()
    return usernp_schema.jsonify(user)

#Login and get a new API key, Open for everyone
@app.route('/login', methods = ['POST'])
def login():
    try:
        form_username = request.json['username']
        form_password = request.json['password']
    except:
        abort(400)

    try:
        user = User.query.filter_by(username=form_username).first()
        if user == None:
            raise
    except:
        abort(404)

    try:
        if user.username != form_username or user.password != form_password:
            raise
    except:
        abort(401)

    session = Session.query.filter_by(username=user.username).first()
    if session != None:
        db.session.delete(session)
        db.session.commit()

    session = Session(user.username, secrets.token_hex(16))
    db.session.add(session)

    db.session.commit()
    return session_schema.jsonify(session)

#Logout, delete the API key, Open for everyone
@app.route('/logout', methods = ['POST'])
def logout():
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
    except:
        abort(401)

    db.session.delete(session)
    db.session.commit()
    return session_schema.jsonify(session)

#Grab all sessions, Admin/Teacher only
@app.route('/grab/all/sessions', methods = ['POST'])
def grab_all_sessions():
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

    all_sessions = Session.query.all()
    results = sessions_schema.dump(all_sessions)
    return jsonify(results)

#Grab session session, Open for everyone
@app.route('/grab/session/session', methods = ['POST'])
def grab_session_session():
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
    except:
        abort(401)

    results = session_schema.dump(session)
    return jsonify(results)

#Grab session user, Open for everyone
@app.route('/grab/session/user', methods = ['POST'])
def grab_session_user():
    try:
        form_apikey = request.json['apikey']
        session = Session.query.filter_by(apikey=form_apikey).first()
        if session == None:
            raise
        user = User.query.filter_by(username=session.username).first()
        if user == None:
            raise
    except:
        abort(401)

    results = usernp_schema.dump(user)
    return jsonify(results)

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