import sqlite3
from server.db import get_db

class Restaurant(object):
    def __init__(self, place_id="", image_url="", id=0):
        self.place_id = place_id
        self.image_url = image_url
        self.id = id

    def create(self):
        if self.id != 0:
            raise Exception("Object already exists in db, use save() instead")
        query_str = "INSERT INTO restaurants (place_id, image_url) VALUES (?, ?)"
        db = get_db()
        c = db.execute(query_str, (self.place_id, self.image_url,))
        db.commit()
        self.id = c.lastrowid
        return self

    def save(self):
        if self.id == 0:
            raise Exception("Object doesn't exist, use create()")

        query_str = "UPDATE restaurants SET place_id = ?, image_url = ? WHERE id = ?"
        db = get_db()
        c = db.execute(query_str, (self.place_id, self.image_url, self.id))
        db.commit()
        return self

    @classmethod
    def get_by_id(Cls, id):
        query = "SELECT * FROM restaurants WHERE id = ?"
        res = get_db().execute(query, (id,)).fetchone()
        if res is None:
            return None
        res = dict(res)
        obj = Cls(place_id=res['place_id'], image_url=res['image_url'], id=res['id'])
        return obj

    @classmethod
    def get_by_place_id(Cls, place_id):
        query = "SELECT * FROM restaurants WHERE place_id = ?"
        res = get_db().execute(query, (place_id,)).fetchone()
        if res is None:
            return None
        res = dict(res)
        obj = Cls(place_id=res['place_id'], image_url=res['image_url'], id=res['id'])
        return obj

    @classmethod
    def get_all(Cls):
        query = "SELECT * FROM restaurants"
        res = get_db().execute(query).fetchall()
        res = [dict(r) for r in res]
        objects = [Cls(**params) for params in res]
        return objects

class User(object):
    def __init__(self, user_id="", score=0, id=0):
        self.user_id = user_id
        self.score = score
        self.id = id

    def create(self):
        if self.id != 0:
            raise Exception("Object already exists in db, use save() instead")
        query_str = "INSERT INTO scores (user_id, score) VALUES (?, ?)"
        db = get_db()
        c = db.execute(query_str, (self.user_id, self.score,))
        db.commit()
        self.id = c.lastrowid
        return self

    def save(self):
        if self.id == 0:
            raise Exception("Object doesn't exist, use create()")

        query_str = "UPDATE scores SET score = ? WHERE user_id = ?"
        db = get_db()
        c = db.execute(query_str, (self.score, self.user_id,))
        db.commit()
        return self

    @classmethod
    def get_by_id(Cls, id):
        query = "SELECT * FROM scores WHERE id = ?"
        res = get_db().execute(query, (id,)).fetchone()
        if res is None:
            return None
        res = dict(res)
        obj = Cls(user_id=res['user_id'], score=res['score'], id=res['id'])
        return obj

    @classmethod
    def get_by_user_id(Cls, user_id):
        query = "SELECT * FROM scores WHERE user_id = ?"
        res = get_db().execute(query, (user_id,)).fetchone()
        if res is None:
            return None
        res = dict(res)
        obj = Cls(user_id=res['user_id'], score=res['score'], id=res['id'])
        return obj

    @classmethod
    def get_all(Cls):
        query = "SELECT * FROM scores"
        res = get_db().execute(query).fetchall()
        res = [dict(r) for r in res]
        objects = [Cls(**params) for params in res]
        return objects
