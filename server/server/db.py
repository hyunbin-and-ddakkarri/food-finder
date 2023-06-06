import psycopg2
from server.env import get_env

conn = psycopg2.connect('dbname=' + get_env("MYSQL_DB") + ' user=' + get_env("MYSQL_USER") + ' password=' + get_env("MYSQL_PASSWORD") + ' host=' + get_env("MYSQL_HOST"))
cur = conn.cursor()

