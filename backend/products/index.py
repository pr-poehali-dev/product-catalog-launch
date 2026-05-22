import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    """
    CRUD для товаров.
    GET    /          — список всех товаров (с фильтрами)
    GET    /{id}      — один товар
    POST   /          — создать товар (продавец, X-Session-Id)
    PUT    /{id}      — обновить товар (продавец-владелец)
    POST   /{id}/inquiry — отправить запрос покупателя
    """
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    params = event.get("queryStringParameters") or {}
    session_id = event.get("headers", {}).get("x-session-id", "")

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # POST /{id}/inquiry
        if method == "POST" and "/inquiry" in path:
            product_id = path.rstrip("/").replace("/inquiry", "").split("/")[-1]
            body = json.loads(event.get("body") or "{}")
            required = ["buyer_name", "buyer_company", "buyer_phone"]
            for f in required:
                if not body.get(f):
                    return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": f"Missing: {f}"})}

            cur.execute("SELECT id FROM products WHERE id = %s", (product_id,))
            if not cur.fetchone():
                return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Product not found"})}

            cur.execute(
                """INSERT INTO inquiries (product_id, buyer_name, buyer_company, buyer_phone, buyer_email, quantity, note)
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (product_id, body["buyer_name"], body["buyer_company"], body["buyer_phone"],
                 body.get("buyer_email", ""), body.get("quantity", ""), body.get("note", ""))
            )
            cur.execute("UPDATE products SET inquiries_count = inquiries_count + 1 WHERE id = %s", (product_id,))
            conn.commit()
            return {"statusCode": 201, "headers": headers, "body": json.dumps({"ok": True})}

        # GET /{id}
        path_parts = [p for p in path.split("/") if p]
        if method == "GET" and len(path_parts) >= 1 and path_parts[-1] not in ("", "products"):
            product_id = path_parts[-1]
            cur.execute(
                """SELECT p.*, u.name as seller_name, u.company as seller_company,
                          u.country as seller_country, u.verified as seller_verified
                   FROM products p JOIN users u ON p.seller_id = u.id
                   WHERE p.id = %s""",
                (product_id,)
            )
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
            return {"statusCode": 200, "headers": headers, "body": json.dumps(_serialize(dict(row)))}

        # GET / — список с фильтрами
        if method == "GET":
            where = ["1=1"]
            args = []
            if params.get("category"):
                where.append("p.category = %s")
                args.append(params["category"])
            if params.get("seller_id"):
                where.append("p.seller_id = %s")
                args.append(params["seller_id"])
            if params.get("in_stock") == "true":
                where.append("p.in_stock = TRUE")
            if params.get("verified") == "true":
                where.append("u.verified = TRUE")
            if params.get("q"):
                where.append("(p.name ILIKE %s OR u.company ILIKE %s OR %s = ANY(p.tags))")
                q = f"%{params['q']}%"
                args += [q, q, params["q"]]

            order = "p.created_at DESC"
            if params.get("sort") == "popular":
                order = "p.inquiries_count DESC"
            elif params.get("sort") == "price_asc":
                order = "CAST(REPLACE(p.price, ' ', '') AS BIGINT) ASC NULLS LAST"
            elif params.get("sort") == "price_desc":
                order = "CAST(REPLACE(p.price, ' ', '') AS BIGINT) DESC NULLS LAST"

            sql = f"""SELECT p.*, u.company as seller_name, u.country as seller_country, u.verified as seller_verified
                      FROM products p JOIN users u ON p.seller_id = u.id
                      WHERE {' AND '.join(where)} ORDER BY {order}"""
            cur.execute(sql, args)
            rows = [_serialize(dict(r)) for r in cur.fetchall()]
            return {"statusCode": 200, "headers": headers, "body": json.dumps(rows)}

        # POST / — создать товар
        if method == "POST":
            if not session_id:
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Auth required"})}
            cur.execute("SELECT id, role FROM users WHERE id = %s", (session_id,))
            user = cur.fetchone()
            if not user or user["role"] != "seller":
                return {"statusCode": 403, "headers": headers, "body": json.dumps({"error": "Sellers only"})}

            body = json.loads(event.get("body") or "{}")
            if not body.get("name") or not body.get("category") or not body.get("price"):
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "name, category, price required"})}

            specs = body.get("specs", [])
            if isinstance(specs, list):
                specs = [s for s in specs if s.get("key") and s.get("value")]

            tags = body.get("tags", [])
            if isinstance(tags, str):
                tags = [t.strip() for t in tags.split(",") if t.strip()]

            cur.execute(
                """INSERT INTO products (seller_id, name, category, price, price_unit, min_order, description, specs, tags, in_stock)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                   RETURNING id, seller_id, name, category, price, price_unit, min_order, description, specs, tags, in_stock, inquiries_count, created_at""",
                (
                    session_id, body["name"], body["category"], body["price"],
                    body.get("price_unit", "шт"), body.get("min_order", "1 шт"),
                    body.get("description", ""), json.dumps(specs), tags,
                    body.get("in_stock", True)
                )
            )
            row = dict(cur.fetchone())
            conn.commit()
            return {"statusCode": 201, "headers": headers, "body": json.dumps(_serialize(row))}

        # PUT /{id} — обновить товар
        if method == "PUT":
            if not session_id:
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Auth required"})}
            product_id = path_parts[-1]
            cur.execute("SELECT seller_id FROM products WHERE id = %s", (product_id,))
            prod = cur.fetchone()
            if not prod:
                return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
            if str(prod["seller_id"]) != session_id:
                return {"statusCode": 403, "headers": headers, "body": json.dumps({"error": "Forbidden"})}

            body = json.loads(event.get("body") or "{}")
            specs = body.get("specs", [])
            if isinstance(specs, list):
                specs = [s for s in specs if s.get("key") and s.get("value")]
            tags = body.get("tags", [])
            if isinstance(tags, str):
                tags = [t.strip() for t in tags.split(",") if t.strip()]

            cur.execute(
                """UPDATE products SET name=%s, category=%s, price=%s, price_unit=%s,
                   min_order=%s, description=%s, specs=%s, tags=%s, in_stock=%s
                   WHERE id=%s
                   RETURNING id, seller_id, name, category, price, price_unit, min_order, description, specs, tags, in_stock, inquiries_count, created_at""",
                (body["name"], body["category"], body["price"], body.get("price_unit", "шт"),
                 body.get("min_order", "1 шт"), body.get("description", ""),
                 json.dumps(specs), tags, body.get("in_stock", True), product_id)
            )
            row = dict(cur.fetchone())
            conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps(_serialize(row))}

        return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}

    finally:
        conn.close()


def _serialize(row: dict) -> dict:
    """Конвертирует UUID и datetime в строки, specs из JSON."""
    for key in ("id", "seller_id"):
        if key in row and row[key] is not None:
            row[key] = str(row[key])
    if "created_at" in row and row["created_at"] is not None:
        row["created_at"] = str(row["created_at"])[:10]
    if "specs" in row and isinstance(row["specs"], str):
        row["specs"] = json.loads(row["specs"])
    if "tags" in row and row["tags"] is None:
        row["tags"] = []
    return row
