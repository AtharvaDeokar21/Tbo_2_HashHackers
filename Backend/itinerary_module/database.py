# import psycopg2
# import os
# import requests
# import dotenv
# dotenv.load_dotenv()

# def get_db_connection():
#     conn = psycopg2.connect(
#         host="localhost",
#         database="travel_ai",
#         user="postgres",
#         password=os.getenv("DB_PASSWORD")
#     )
#     return conn
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
