import sqlite3

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

class dndSheetDB:

    def __init__(self):
        self.connection = sqlite3.connect("dndSheet.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()

    def exists(self, id):
        sql = 'SELECT * FROM dndSheet WHERE id = ?;'
        self.cursor.execute(sql, (id,))
        row = self.cursor.fetchone()
        if row is None:
            return False
        return row


    def createCharacterSheet(self, data):
        sql = '''
                INSERT INTO dndSheet
                (name, player, classs, lvl, race, age, gender,
                strength, dexterity, constitution, intellect, wisdom, charisma)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              '''
        attributes = (
                data['name'], data['player'], data['classs'], data['lvl'], data['race'], data['age'],
                data['gender'], data['strength'], data['dexterity'], data['constitution'], data['intellect'],
                data['wisdom'], data['charisma']
        )
        self.cursor.execute(sql, attributes)
        # self.cursor.execute("INSERT INTO dndSheet (name, player, classs, lvl, race, age, gender, strength, dexterity, constitution, intellect, wisdom, charisma) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (name, player, classs, lvl, race, age, gender, strength, dexterity, constitution, intellect, wisdom, charisma))
        self.connection.commit()

    def deleteCharacterSheet(self, path):
        if not self.exists(path):
            return False
        sql = 'DELETE FROM dndSheet WHERE id=?'
        self.cursor.execute(sql, (path,))
        self.connection.commit()

    def getCharacterSheets(self):
        sql = 'SELECT * FROM dndSheet'
        self.cursor.execute(sql)
        rows = self.cursor.fetchall()
        return rows

    def getCharacterSheet(self, path):
        if not self.exists(path):
            return False
        sql = 'SELECT * FROM dndSheet WHERE id=?'
        self.cursor.execute(sql, (path,))
        row = self.cursor.fetchone()
        self.connection.commit()
        return row

    def upDateCharacterSheet(self, data, id):
        if not self.exists(id):
            return False
        self.cursor.execute("UPDATE dndSheet \
            SET \
            name = ?, player = ?, classs = ?, lvl = ?, race = ?, age = ?, gender = ?, \
            strength = ?, dexterity = ?, constitution = ?, intellect = ?, wisdom = ?, charisma = ? \
            WHERE id = ?",
            (
            data['name'],
            data['player'],
            data['classs'],
            data['lvl'],
            data['race'],
            data['age'],
            data['gender'],
            data['strength'],
            data['dexterity'],
            data['constitution'],
            data['intellect'],
            data['wisdom'],
            data['charisma'],
            id
            )
        )
        # self.cursor.execute(sql)
        self.connection.commit()
        return True

    # SELECT * FROM dndSheet WHERE id = 1;
