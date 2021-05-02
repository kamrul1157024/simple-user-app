from flaskext.mysql import MySQL

from flaskkr import User


class UserRepository:
    def __init__(self, mysql: MySQL):
        self._mysql = mysql
        self._conn = self._mysql.connect()
        self._select_in_json = (
                "SELECT JSON_ARRAYAGG"
                + "("
                + "JSON_OBJECT("
                + "'firstName',first_name, "
                + "'lastName', last_name,"
                + "'emailAddress',email_address,"
                + "'mobileNo',mobile_no"
                + ")"
                + ") "
                + "FROM Users;"
        )

    def save(self, user: User) -> bool:
        try:
            cursor = self._conn.cursor()
            insertion_query = (
                    "INSERT INTO Users (first_name,last_name,email_address,mobile_no)"
                    + f" VALUES ('{user.first_name}','{user.last_name}','{user.email_address}','{user.mobile_no}');"
            )
            cursor.execute(insertion_query)
            self._conn.commit()
            cursor.close()
            return True
        except Exception as e:
            print("Save Failed: " + str(e))
            return False

    def find_all(self) -> str:
        try:
            cursor = self._conn.cursor()
            cursor.execute(self._select_in_json)
            result = cursor.fetchall()
            self._conn.commit()
            cursor.close()
            return result[0][0]
        except Exception as e:
            print("Unable to get the information: " + str(e))
            return "{}"

    def find_by_id(self, user_id):
        pass

    def update_user(self, user: User, user_id: int) -> bool:
        try:
            cursor = self._conn.cursor()
            query = (
                    "UPDATE Users SET "
                    + f"first_name = '{user.first_name}',"
                    + f"last_name = '{user.last_name}',"
                    + f"email_address = '{user.email_address}',"
                    + f"mobile_no = '{user.mobile_no}' "
                    + f"WHERE id = {user_id} ;"
            )
            cursor.execute(query)
            self._conn.commit()
            cursor.close()
            return True
        except Exception as e:
            print("Update Failed: " + str(e))
            return False

    def delete_by_id(self, user_id: int) -> bool:
        try:
            cursor = self._conn.cursor()
            cursor.execute(f"DELETE FROM Users WHERE id={user_id};")
            self._conn.commit()
            cursor.close()
            return True
        except Exception as e:
            print("Delete Failed: " + str(e))
            return False
