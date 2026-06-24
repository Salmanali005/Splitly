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
        self.conn.autocommit = False
    
    def execute(self, query, params=None):
        """Execute query and return results"""
        cursor = self.conn.cursor(cursor_factory=RealDictCursor)
        try:
            cursor.execute(query, params or ())
            
            # Check if this is a SELECT or has RETURNING
            query_upper = query.strip().upper()
            if query_upper.startswith('SELECT') or 'RETURNING' in query_upper:
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
            self.conn.commit()
            return result
        except Exception as e:
            self.conn.rollback()
            raise e
        finally:
            cursor.close()

# Singleton
db = Database()