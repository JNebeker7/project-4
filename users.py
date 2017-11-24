import sqlite3

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

class usersDB:

    def __init__(self):
        self.connection = sqlite3.connect("users.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()

    def exists(self, email):
        sql = 'SELECT * FROM users WHERE email = ?;'
        self.cursor.execute(sql, (email,))
        row = self.cursor.fetchone()
        if row is None:
            return None
        return row['id']

    def checkPassword(self, id):
        sql = 'SELECT * FROM users WHERE id = ?;'
        self.cursor.execute(sql, (id,))
        row = self.cursor.fetchone()
        if row is None:
            return False
        return row['encodedPassword']

    def createUser(self, data):
        sql = '''
                INSERT INTO users
                (userName, email, encodedPassword)
                VALUES (?, ?, ?)
              '''
        attributes = (
                data['userName'], data['email'], data['encodedPassword']
        )
        self.cursor.execute(sql, attributes)
        self.connection.commit()
