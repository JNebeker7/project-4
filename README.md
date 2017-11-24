# Dungeon and dragons sheet

##### Character Sheet
* Character name
* Player name
* Class and Level
* Race
* Age
* Gender

*D&D 3.5 Character attributes will be auto-filled based on character class*

##### D&D Character sheet db schema
CREATE TABLE dndSheet (id INTEGER PRIMARY KEY, name VARCHAR(255), player VARCHAR(255), classs VARCHAR(255), lvl INTEGER, race VARCHAR(255), age INTEGER, gender VARCHAR(255), strength INTEGER, dexterity INTEGER, constitution INTEGER, intellect INTEGER, wisdom INTEGER, charisma INTEGER)

##### REST
Resource | GET | POST | PUT | DELETE | OPTIONS
------------ | ------------- | ------------- | ------------- | ------------- | -------------
/dndSheets | X | | | | |
/dndSheets/123 | retrieveSheet | createSheet | updateSheet | deleteSheet | |




List of User attributes. What makes up a user
The user will have his/her own database
One user table. Name | Email address | encrypted_password | first_name | last_name

one html page total still

in dndSheet i might have to add a userID
data ownership then ya go to dndSheet and add userID

data validation. quick check to see if email already exists
python call to check for the Email

422 - failed data validation

create a session when they log in an delete the session when they logout.
