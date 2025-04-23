from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# Connect to SQLite database
conn = sqlite3.connect("HouseSalesSeattle.db", check_same_thread=False)
cursor = conn.cursor()

@app.route("/")
def home():
    return "✅ Flask backend is running."

@app.route("/api/listings")
def get_listings():
    # === Step 1: Read query parameters ===
    zip_code = request.args.get("zip")
    min_price = request.args.get("min_price", type=int)
    max_price = request.args.get("max_price", type=int)
    min_bedrooms = request.args.get("min_bedrooms", type=int)
    max_bedrooms = request.args.get("max_bedrooms", type=int)
    sort_by = request.args.get("sort_by")  # e.g. "price" or "year"
    order = request.args.get("order", "asc")  # default "asc"

    # === Step 2: Build SQL query dynamically ===
    base_query = """
        SELECT SalesID, SalePrice, YrBuilt, Bedrooms, SqMTotLiving, zip_code, Image
        FROM HouseSalesSeattle
        WHERE 1=1
    """
    params = []

    if zip_code:
        base_query += " AND zip_code = ?"
        params.append(zip_code)
    if min_price is not None:
        base_query += " AND SalePrice >= ?"
        params.append(min_price)
    if max_price is not None:
        base_query += " AND SalePrice <= ?"
        params.append(max_price)
    if min_bedrooms is not None:
        base_query += " AND Bedrooms >= ?"
        params.append(min_bedrooms)
    if max_bedrooms is not None:
        base_query += " AND Bedrooms <= ?"
        params.append(max_bedrooms)

    # === Step 3: Sorting ===
    sort_map = {
        "price": "SalePrice",
        "year": "YrBuilt"
    }
    if sort_by in sort_map:
        column = sort_map[sort_by]
        order = "DESC" if order == "desc" else "ASC"
        base_query += f" ORDER BY {column} {order}"

    # === Step 4: Execute and format result ===
    cursor.execute(base_query, params)
    rows = cursor.fetchall()

    listings = []
    for row in rows:
        listings.append({
            "SalesID": row[0],
            "SalePrice": row[1],
            "YrBuilt": row[2],
            "Bedrooms": row[3],
            "SqMTotLiving": row[4],
            "zip_code": row[5],
            "Image": row[6],
        })

    return jsonify(listings)

if __name__ == "__main__":
    app.run(debug=True)
