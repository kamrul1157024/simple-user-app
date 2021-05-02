from flask import Flask, request
from flaskext.mysql import MySQL
import yaml

from flaskkr.user import User
from flaskkr.user_repository import UserRepository

app = Flask(__name__)

mysql = MySQL()
db = yaml.load(open("db.yaml"), Loader=yaml.FullLoader)
app.config["MYSQL_DATABASE_USER"] = db["MYSQL_USER"]
app.config["MYSQL_DATABASE_PASSWORD"] = db["MYSQL_PASSWORD"]
app.config["MYSQL_DATABASE_HOST"] = db["MYSQL_HOST"]
app.config["MYSQL_DATABASE_DB"] = db["MYSQL_DB"]
mysql.init_app(app)

user_repository = UserRepository(mysql)


@app.route("/")
def get_all_user():
    return user_repository.find_all()


@app.route("/", methods=["POST"])
def add_user():
    data = request.get_json()
    user_ = User(
        first_name=data["firstName"],
        last_name=data["lastName"],
        email_address=data["emailAddress"],
        mobile_no=data["mobileNo"],
    )
    user_repository.save(user_)
    users = user_repository.find_all()
    return users


@app.route("/<userId>", methods=["PUT"])
def update_user(userId):
    data = request.get_json()
    user_ = User(
        first_name=data["firstName"],
        last_name=data["lastName"],
        email_address=data["emailAddress"],
        mobile_no=data["mobileNo"],
    )
    user_repository.update_user(user_, userId)
    users = user_repository.find_all()
    return users


@app.route("/<userId>", methods=["DELETE"])
def delete_user(userId):
    user_repository.delete_by_id(userId)
    users = user_repository.find_all()
    return users


if __name__ == "__main__":
    app.run()
