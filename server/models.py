import sqlite3
from server.db import get_db

class Restaurant(object):
    def __init__(self, place_id="", img_url="", id=0):
        self.place_id = place_id
        self.img_url = img_url
        self.id = id

    def create(self):
        if self.id != 0:
            raise Exception("Object already exists in db, use save() instead")
        query_str = "INSERT INTO restaurants (place_id, image_url) VALUES (?, ?)"
        db = get_db()
        c = db.execute(query_str, (self.place_id, self.img_url,))
        db.commit()
        self.id = c.lastrowid
        return self

    def save(self):
        if self.id == 0:
            raise Exception("Object doesn't exist, use create()")

        query_str = "UPDATE restaurants SET place_id = ?, image_url = ? WHERE id = ?"
        db = get_db()
        c = db.execute(query_str, (self.place_id, self.img_url, self.id))
        db.commit()
        return self

    @classmethod
    def get_by_id(Cls, id):
        query = "SELECT * FROM restaurants WHERE id = ?"
        res = get_db().execute(query, (id,)).fetchone()
        if res is None:
            return None
        res = dict(res)
        obj = Cls(place_id=res['place_id'], img_url=res['image_url'], id=res['id'])
        return obj

    @classmethod
    def get_by_place_id(Cls, place_id):
        query = "SELECT * FROM restaurants WHERE place_id = ?"
        res = get_db().execute(query, (place_id,)).fetchone()
        if res is None:
            return None
        res = dict(res)
        obj = Cls(place_id=res['place_id'], img_url=res['image_url'], id=res['id'])
        return obj
