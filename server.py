from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
import json
from dndSheet import dndSheetDB
from users import usersDB
from http import cookies
from session_store import SessionStore

gSessionStore = SessionStore() # a global session store that needs to persist throughout the lifetime of the server.

class MyHandler(BaseHTTPRequestHandler):

    def end_headers(self):
        self.send_cookie()
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Credentials", "true")
        BaseHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        print("GET PATH:", self.path)
        self.load_session() # self.session is now ready
        path = self.path.split("/")[-1]
        if self.path == "/dndSheets":
            self.handleGetAllCharacterSheets()
        elif self.path == "/dndSheets/" + path:
            self.handleGetCharacterSheet(path)
        elif self.path == "/sessiontest":
            if "counter" in self.session:
                self.session["counter"] += 1
            else:
                self.session["counter"] = 1
            self.send_response(200)
            self.send_cookie()
            self.end_headers()
            self.wfile.write(bytes(str(self.session["counter"]), "utf-8"))
        else:
            self.handle404(path)

    def do_POST(self):
        print("POST PATH:", self.path)
        self.load_session() # self.session is now ready
        if self.path == "/dndSheets":
            self.handleCreateSheet()
        elif self.path == "/users":
            self.handleCreateUser()
        elif self.path == "/sessions":
            self.handleUserLogin()
        else:
            self.handle404general()
        # posting to sessions soon after authentication

    def do_PUT(self):
        print("PUT PATH:", self.path)
        self.load_session()
        path = self.path.split("/")[-1]
        if self.path == "/dndSheets/" + path:
            self.handleUpdateSheet(path)
        else:
            self.handle404(path)

    def do_DELETE(self):
        print("PATH:", self.path)
        self.load_session()
        path = self.path.split("/")[-1]
        if self.path == "/dndSheets/" + path:
            self.handleDeleteSheet(path)
        else:
            self.handle404(path)

    def load_session(self):
        self.load_cookie()
        if "sessionId" in self.cookie:
            print("sessionId found in cookie")
            sessionId = self.cookie["sessionId"].value
            print("current sessionId: ", sessionId)
            sessionData = gSessionStore.getSession(sessionId)
            if sessionData != None:
                print("sessionData Found... No cookies given")
                self.session = sessionData
            else:
                sessionId = gSessionStore.createSession()
                print("New Session Id: ", sessionId)
                self.cookie["sessionId"] = sessionId
                newCookie = self.cookie["sessionId"].value
                print("new cookie value: ", newCookie)
                self.session = gSessionStore.getSession(sessionId)
        else:
            print("no sessionId in cookie, assigning one...")
            sessionId = gSessionStore.createSession()
            self.cookie["sessionId"] = sessionId
            self.session = gSessionStore.getSession(sessionId)
        print("Session data current:    ..",self.session)

    def load_cookie(self):
        if "Cookie" in self.headers:
            self.cookie = cookies.SimpleCookie(self.headers["Cookie"])
        else:
            self.cookie = cookies.SimpleCookie()

    def send_cookie(self):
        for morsel in self.cookie.values():
            self.send_header("Set-Cookie", morsel.OutputString())

    def do_OPTIONS(self):
        self.load_session()
        self.send_response(200)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def handle201(self):
        self.send_response(201)
        self.end_headers()
        self.wfile.write(bytes("POSTED", "utf-8"))

    def handle401(self):
        self.send_response(401)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(bytes("401", "utf-8"))

    def handle404(self, path):
        self.send_response(404)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(bytes("<h1 style=font-size:75px;text-align:center;margin-top:250px;> 404 Not Found</h1>", "utf-8"))

    def handle422(self):
        self.send_response(422)
        self.end_headers()
        self.wfile.write(bytes("422", "utf-8"))

    def handle404general(self):
        self.send_response(404)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(bytes("<h1 style=font-size:75px;text-align:center;margin-top:250px;> 404 Not Found</h1>", "utf-8"))

    def handleUserLogin(self):
        self.load_cookie();
        db = usersDB()
        length = int(self.headers["Content-length"])
        body = self.rfile.read(length).decode("utf-8")
        parsed_body = parse_qs(body)
        print("Request body from returning user:", parsed_body)

        data = {
        "email": parsed_body['email'][0],
        "encodedPassword": parsed_body['password'][0],
        }

        print("email: ", data["email"])
        print("password: ", data["encodedPassword"])

        email = data['email']
        password = data['encodedPassword']
        userId = db.exists(email) # Takes and email and returns the id of the associated email.
        if userId != False: # find user in DB
            print("found similar email")
            encryptedPassword = db.checkPassword(userId) # takes the userId and returns the password
            if encryptedPassword == password: # will be a bcrypt verify plain text followed by the hash.
                print("Password Confirmed!.. creating session")
                # self.create_session()
                # create the user session

                self.session["userID"] = userId
                print("Session created")
                self.send_response(201)
                self.end_headers()
                self.wfile.write(bytes("POSTED", "utf-8"))
            else:
                print("Password Denied!")
                self.handle404general()
        else:
            print("No such User")
            self.handle404general()


    def handleCreateUser(self):
        db = usersDB()
        length = int(self.headers["Content-length"])
        body = self.rfile.read(length).decode("utf-8")
        parsed_body = parse_qs(body)
        print("Request body from create user:", parsed_body)

        data = {
        "userName": parsed_body['userName'][0],
        "email": parsed_body['email'][0],
        "encodedPassword": parsed_body['password'][0],
        }

        print("userName: ", data["userName"])
        print("email: ", data["email"])
        print("password: ", data["encodedPassword"])

        email = data['email']
        if db.exists(email) == None:
            db.createUser(data)
            self.handle201()
            print("User Created")
        else:
            print("User already exists")
            self.handle422()

    def handleCreateSheet(self):
        length = int(self.headers["Content-length"])
        body = self.rfile.read(length).decode("utf-8")
        parsed_body = parse_qs(body)
        self.send_response(201)
        self.end_headers()
        self.wfile.write(bytes("POSTED", "utf-8"))

        data = {
            "name": parsed_body['name'][0],
            "player": parsed_body['player'][0],
            "classs": parsed_body['classType'][0],
            "lvl": parsed_body['lvl'][0],
            "race": parsed_body['race'][0],
            "age": parsed_body['age'][0],
            "gender": parsed_body['gender'][0],
            "strength": parsed_body['str'][0],
            "dexterity": parsed_body['dex'][0],
            "constitution": parsed_body['con'][0],
            "intellect": parsed_body['int'][0],
            "wisdom": parsed_body['wis'][0],
            "charisma": parsed_body['cha'][0],
        }
        print("Name: ", data["name"])
        print("Player: ", data["player"])
        print("Class: ", data["classs"])
        db = dndSheetDB()
        db.createCharacterSheet(data)

    def handleGetAllCharacterSheets(self):
        print("Get all")
        db = dndSheetDB()
        rows = db.getCharacterSheets()
        json_string = json.dumps(rows)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(bytes(json_string, "utf-8"))

    def handleGetCharacterSheet(self, path):
        db = dndSheetDB()
        row = db.getCharacterSheet(path)
        if db.exists(path) == None:
            self.handle404(path)
            return False
        json_string = json.dumps(row)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(bytes(json_string, "utf-8"))

    def handleDeleteSheet(self, path):
        db = dndSheetDB()
        if db.exists(path) == None:
            self.handle404(path)
            return False
        db.deleteCharacterSheet(path)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

    def handleUpdateSheet(self, path):
        db = dndSheetDB()
        if db.exists(path) == None:
            self.handle404(path)
            return False
        length = int(self.headers["Content-length"])
        body = self.rfile.read(length).decode("utf-8")
        parsed_body = parse_qs(body)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(bytes("UPDATED", "utf-8"))

        data = {
            "name": parsed_body['name'][0],
            "player": parsed_body['player'][0],
            "classs": parsed_body['classType'][0],
            "lvl": parsed_body['lvl'][0],
            "race": parsed_body['race'][0],
            "age": parsed_body['age'][0],
            "gender": parsed_body['gender'][0],
            "strength": parsed_body['str'][0],
            "dexterity": parsed_body['dex'][0],
            "constitution": parsed_body['con'][0],
            "intellect": parsed_body['int'][0],
            "wisdom": parsed_body['wis'][0],
            "charisma": parsed_body['cha'][0],
        }

        db.upDateCharacterSheet(data, path)

def main():
    listen = ("0.0.0.0", 8080)
    server = HTTPServer(listen, MyHandler)

    print("Listening...")
    server.serve_forever()

main()


# def do_GET(self):
    #  create a cookie anytime they visit the server.
    # if self.path == "/cookies":
    #
    #     cookie = cookies.SimpleCookie(self.headers["Cookie"]) # create object
    #     print("Cookie:", cookie)
    #     cookie["fname"] = "Jared"       # assign into object
    #     cookie["lname"] = "Nebeler"
    #     self.send_response(200)
    #     for morsel in cookie.values():
    #         self.send_header"Set-Cookie", morsel.OutputString()
    #     self.end_headers
    #     self.wfile(bytes("Yummy.", "utf-8"))
            # cookie fun

# session store itself is a disctionary of dictionaries

# def load_session(self):
    # create or establish existing session data. which means cookies.
    # load the cookie object
    # find if sessionId in cookie?
    # if "sessionId" in self.cookie: # if the key is in a disctionary
    #     sessionId = self.cookie["sessionId"].value
    #     sessionData = gSessionStore.getSession(sessionId):
    #   if present?
    #       find sessionId in session store.
    #           if presend?
    #               load/return the session data.
    #           else?
    #               create new sessionId
    #               assign sessionId in cookie
    #               create empty session data in session store
    #   else?

    #       create new sessionId
    #       assign sessionId in cookie
    #       create empty session data in session store

# to delete a session, then delete the user_id
# save the self.session in some data member.
