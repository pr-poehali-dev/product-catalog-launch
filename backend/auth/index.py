import json
import os
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    """
    Регистрация и вход пользователей.
    POST body.action=register — регистрация
    POST body.action=login    — вход
    GET  ?action=me           — данные по X-Session-Id
    """
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    conn = psycopg2.connect(os.environ["DATABASE_URL"])

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # GET ?action=me
        if method == "GET" and params.get("action") == "me":
            session_id = event.get("headers", {}).get("x-session-id", "")
            if not session_id:
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "No session"})}
            cur.execute(
                "SELECT id, name, company, inn, email, role, country, description, verified FROM users WHERE id = %s",
                (session_id,)
            )
            user = cur.fetchone()
            if not user:
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "User not found"})}
            result = dict(user)
            result["id"] = str(result["id"])
            return {"statusCode": 200, "headers": headers, "body": json.dumps(result)}

        if method != "POST":
            return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}

        body = json.loads(event.get("body") or "{}")
        action = body.get("action", "")

        # register
        if action == "register":
            required = ["name", "company", "inn", "email", "password", "role"]
            for field in required:
                if not body.get(field):
                    return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": f"Missing: {field}"})}
            if body["role"] not in ("buyer", "seller"):
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Invalid role"})}

            cur.execute("SELECT id FROM users WHERE email = %s", (body["email"],))
            if cur.fetchone():
                return {"statusCode": 409, "headers": headers, "body": json.dumps({"error": "Email already registered"})}

            cur.execute(
                """INSERT INTO users (name, company, inn, email, password_hash, role, country, description)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                   RETURNING id, name, company, inn, email, role, country, description, verified""",
                (body["name"], body["company"], body["inn"], body["email"],
                 hash_password(body["password"]), body["role"],
                 body.get("country", "Россия"), body.get("description", ""))
            )
            user = dict(cur.fetchone())
            user["id"] = str(user["id"])
            conn.commit()
            return {"statusCode": 201, "headers": headers, "body": json.dumps(user)}

        # login
        if action == "login":
            if not body.get("email") or not body.get("password"):
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Email and password required"})}
            cur.execute(
                "SELECT id, name, company, inn, email, role, country, description, verified FROM users WHERE email = %s AND password_hash = %s",
                (body["email"], hash_password(body["password"]))
            )
            user = cur.fetchone()
            if not user:
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"error": "Invalid credentials"})}
            result = dict(user)
            result["id"] = str(result["id"])
            return {"statusCode": 200, "headers": headers, "body": json.dumps(result)}

        return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Unknown action"})}

    finally:
        conn.close()
