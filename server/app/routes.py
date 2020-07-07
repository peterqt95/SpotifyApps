import json
from app import api, jwt, db, sp_oauth
from .models import User, UserSchema
from flask import request, session, current_app, jsonify, send_file
from flask_restful import Resource, Api
from http import HTTPStatus
from flask_jwt_extended import (
    jwt_required, create_access_token, get_jwt_identity, create_refresh_token,
    jwt_refresh_token_required
)
import spotipy
import spotipy.util as sp_util

class Error():
    def __init__(self):
        self.status = False
        self.error = None
    
    def to_json(self):
        return {
            "error": self.error,
            "status": self.status
        }

class Token(Error):
    def __init__(self):
        super().__init__()
        self.access_token = ''
        self.refresh_token = ''
        self.name = ''
        self.user_id = -1
    
    def to_json(self):
        return {
            "error": self.error,
            "status": self.status,
            "accessToken": self.access_token,
            "refreshToken": self.refresh_token,
            "name": self.name,
            "userId": self.user_id,
        }

class DefaultResource(Resource):
    def get(self):
        return {'task': 'Hello world'}
        
class UsersResource(Resource):
    def __init__(self):
        self.users_schema = UserSchema(many=True)

    # @jwt_required
    def get(self):
        users = User.query.all()
        return self.users_schema.dump(users)
    
    # @jwt_required
    def post(self):
        return_status = HTTPStatus.CREATED
        data = request.get_json(force = True)
        try:
            user = User(data['name'], data['password'])
            user.post()
        except Exception as e:
            print(e)
            return_status = HTTPStatus.FORBIDDEN

        return data, return_status

class UserResource(Resource):
    def __init__(self):
        self.user_schema = UserSchema()

    # @jwt_required
    def get(self, id):
        return_status = HTTPStatus.OK
        try:
            user = User.query.get(id)
        except Exception as e:
            print(e)
            return_status = HTTPStatus.NOT_FOUND
        
        return self.user_schema.dump(user)

    # @jwt_required
    def put(self, id):
        return_status = HTTPStatus.CREATED
        data = request.get_json(force = True)
        try:
            # Get the information
            user = User.query.filter_by(myid=id).first()

            # Update information from request
            user.put(data)
        except Exception as e:
            print(e)
            return_status = HTTPStatus.FORBIDDEN

        return data, return_status

class LoginRequired(Resource):
    @jwt_required
    def get(self):
        return_status = HTTPStatus.OK
        status = Error()
        try:
            current_user = get_jwt_identity()
            if current_user:
                status.status = True
            else:
                status.error = "Not logged in"
        except Exception as e:
            status.error = str(e)
            return_status = HTTPStatus.BAD_REQUEST

        return status.to_json(), return_status

    def post(self):
        return_status = HTTPStatus.OK
        status = Token()
        data = request.get_json(force = True)
        try:
            # Get the info
            user = User.query.filter_by(name=data['name']).first()
            if user and data['password'] == user.password:
                session[user.name] = True
                status.status = True
                status.access_token = create_access_token(identity=user.name)
                status.refresh_token = create_refresh_token(identity=user.name)
                status.name = user.name
                status.user_id = user.myid
            else:
                status.error = "Invalid username or password"
        except Exception as e:
            status.error = str(e)
            return_status = HTTPStatus.BAD_REQUEST
        
        return status.to_json(), return_status

class RefreshTokenResource(Resource):
    @jwt_refresh_token_required
    def get(self):
        return_status = HTTPStatus.OK
        status = Token()
        current_user = get_jwt_identity()
        if current_user:
            status.status = True
            status.access_token = create_access_token(identity=current_user)
        else:
            status.error = "Invalid refresh token"

        return status.to_json(), return_status, {'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept, x-auth"}

class TestResource(Resource):
    def get(self):
        return send_file("images/test.png", mimetype="image/png")

api.add_resource(DefaultResource, '/')
api.add_resource(UsersResource, '/users')
api.add_resource(UserResource, '/users/<int:id>')
api.add_resource(LoginRequired, '/login')
api.add_resource(RefreshTokenResource, '/refresh')
api.add_resource(TestResource, '/test')

# Add other routes?
from app import spotify_routes

spotify_routes.add_routes()
