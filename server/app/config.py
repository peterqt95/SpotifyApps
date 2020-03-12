import os
import cx_Oracle
import datetime

host = "localhost"
port = "1521"
SID = "orcl"
user = "system"
password = "Kittyboy1"
sid = cx_Oracle.makedsn(host, port, SID)

class Config(object):
    SQLALCHEMY_DATABASE_URI = "oracle://{user}:{password}@{sid}".format(
        user = user,
        password = password,
        sid = sid
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "super secret key"
    JWT_SECRET_KEY = SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=14)
    # JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=1)