import mysql.connector
import json

# Establish database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="newDB"
)

# Build the query
query = request.args['query']
totalRecords = request.args['totalRecords']

# Execute the query and get the total number of records
cursor = db.cursor()
cursor.execute(query)
rows = cursor.fetchall()
cursor.execute(totalRecords)
total = cursor.fetchone()[0]

# Format the response as JSON and send it back to the client-side
response = {"data": rows, "found": len(rows), "total": total}
json_response = json.dumps(response, default=str)

print(json_response)