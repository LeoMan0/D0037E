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
    # === Search query parameters ===
    zip_code = request.args.get("zip")
    min_sqm = request.args.get("min_sqm", type=int)
    max_sqm = request.args.get("max_sqm", type=int)
    min_bedrooms = request.args.get("min_bedrooms", type=int)
    max_bedrooms = request.args.get("max_bedrooms", type=int)
    sort_by = request.args.get("sort_by")  # e.g. "price" or "year"
    order = request.args.get("order", "asc")  # default "asc"

    # === Pagination queary paramters ===
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default=5, type=int)
    offset = (page - 1) * limit
    # === SQL query ===
    base_query = """
        SELECT SalesID, SalePrice, YrBuilt, Bedrooms, SqMTotLiving, zip_code, Image
        FROM HouseSalesSeattle
        WHERE 1=1
    """
    count_query = "SELECT COUNT(*) FROM HouseSalesSeattle WHERE 1=1"
    params = []
    count_params = []

    if zip_code:
        base_query += " AND zip_code = ?"
        params.append(zip_code)
        count_query += " AND zip_code = ?"
        count_params.append(zip_code)
    if min_sqm is not None:
        base_query += " AND SqMTotLiving >= ?"
        params.append(min_sqm)
        count_query += " AND SqMTotLiving >= ?"
        count_params.append(min_sqm)
    if max_sqm is not None:
        base_query += " AND SqMTotLiving <= ?"
        params.append(max_sqm)
        count_query += " AND SqMTotLiving <= ?"
        count_params.append(max_sqm)
    if min_bedrooms is not None:
        base_query += " AND Bedrooms >= ?"
        params.append(min_bedrooms)
        count_query += " AND Bedrooms >= ?"
        count_params.append(min_bedrooms)
    if max_bedrooms is not None:
        base_query += " AND Bedrooms <= ?"
        params.append(max_bedrooms)
        count_query += " AND Bedrooms <= ?"
        count_params.append(max_bedrooms)

    # === Sorting ===
    sort_map = {
        "price": "SalePrice",
        "year": "YrBuilt"
    }
    if sort_by in sort_map:
        column = sort_map[sort_by]
        order = "DESC" if order == "desc" else "ASC"
        base_query += f" ORDER BY {column} {order}"

     # Add LIMIT/OFFSET for pagination
    base_query += " LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    # === Step 4: Execute and format result ===
    cursor.execute(base_query, params)
    rows = cursor.fetchall()

    cursor.execute(count_query, count_params)
    total = cursor.fetchone()[0]

    listings = []
    for row in rows:
        listings.append({
            "SalesID": row[0],
            "SalePrice": row[1],
            "YrBuilt": row[2],
            "Bedrooms": row[3],
            "SqMTotLiving": row[4],
            "zip_code": row[5],
            "Image": row[6]
        })
    return jsonify({
        "results": listings,
        "total": total,
        "page": page,
        "limit": limit
    })

if __name__ == "__main__":
    app.run(debug=True)
