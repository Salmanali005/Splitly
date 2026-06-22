import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'),
        database=os.getenv('DB_NAME', 'hisaab'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'password')
    )

def setup_database():
    print("📦 Creating database tables...")
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Read and execute SQL file
        with open('database.sql', 'r') as f:
            sql = f.read()
            cursor.execute(sql)
        
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database created successfully!")
    except FileNotFoundError:
        print("❌ Error: database.sql file not found!")
        print("Please create database.sql file in the backend folder.")
    except Exception as e:
        print(f"❌ Error: {e}")

def reset_database():
    print("⚠️  WARNING: This will DELETE ALL DATA!")
    confirm = input("Type 'yes' to continue: ")
    if confirm.lower() == 'yes':
        try:
            conn = get_connection()
            cursor = conn.cursor()
            
            with open('database.sql', 'r') as f:
                sql = f.read()
                cursor.execute(sql)
            
            conn.commit()
            cursor.close()
            conn.close()
            print("✅ Database reset successfully!")
        except Exception as e:
            print(f"❌ Error: {e}")
    else:
        print("❌ Cancelled")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'reset':
        reset_database()
    else:
        setup_database()