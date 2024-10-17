import psycopg2

conn = psycopg2.connect( 
    user = 'postgres',
    password = 'postgres',
    database = 'sample_db',
    host = '34.46.76.171',
    port = 5432
)

cursor = conn.cursor()
cursor.execute('SELECT * FROM users')

rows = cursor.fetchall()

for row in rows:
    print(row)
    
cursor.close()
conn.close()