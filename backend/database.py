import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.conn = None
        self.connect()
    
    def connect(self):
        self.conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            database=os.getenv('DB_NAME', 'hisaab'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'password')
        )
    
    def execute(self, query, params=None):
        """Execute query and return results"""
        cursor = self.conn.cursor(cursor_factory=RealDictCursor)
        try:
            cursor.execute(query, params or ())
            
            if query.strip().upper().startswith('SELECT'):
                result = cursor.fetchall()
            else:
                result = cursor.rowcount
                self.conn.commit()
            
            return result
        except Exception as e:
            self.conn.rollback()
            raise e
        finally:
            cursor.close()
    
    def execute_one(self, query, params=None):
        """Execute query and return one row"""
        cursor = self.conn.cursor(cursor_factory=RealDictCursor)
        try:
            cursor.execute(query, params or ())
            result = cursor.fetchone()
            return result
        except Exception as e:
            raise e
        finally:
            cursor.close()
    
    def execute_many(self, query, params_list):
        """Execute many queries with parameters"""
        cursor = self.conn.cursor()
        try:
            cursor.executemany(query, params_list)
            self.conn.commit()
            return cursor.rowcount
        except Exception as e:
            self.conn.rollback()
            raise e
        finally:
            cursor.close()

# Singleton
db = Database()