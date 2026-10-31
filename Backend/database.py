# Backend/database.py
import sqlite3
from pathlib import Path

SAMPLE_DB_PATH = Path(__file__).parent / "sample_data.db"


def get_sample_connection():
    conn = sqlite3.connect(SAMPLE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_sample_database():
    conn = get_sample_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='departments'"
    )
    if cursor.fetchone()[0] > 0:
        conn.close()
        return

    cursor.executescript("""
        CREATE TABLE departments (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        );

        CREATE TABLE employees (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            department_id INTEGER NOT NULL,
            salary REAL NOT NULL,
            hire_date TEXT NOT NULL,
            FOREIGN KEY (department_id) REFERENCES departments (id)
        );

        CREATE TABLE customers (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            city TEXT NOT NULL
        );

        CREATE TABLE products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL
        );

        CREATE TABLE orders (
            id INTEGER PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            order_date TEXT NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        );
    """)

    departments = [(1, "Engineering"), (2, "Sales"), (3, "Marketing"), (4, "Support")]
    cursor.executemany("INSERT INTO departments (id, name) VALUES (?, ?)", departments)

    employees = [
        (1, "Ravi Kumar", 1, 95000, "2021-03-14"),
        (2, "Ananya Rao", 1, 88000, "2022-07-01"),
        (3, "Steve Lin", 2, 72000, "2020-11-20"),
        (4, "Priya Nair", 2, 76000, "2023-01-09"),
        (5, "Marcus Webb", 3, 68000, "2019-05-30"),
        (6, "Fatima Sheikh", 3, 71000, "2022-09-15"),
        (7, "John Okafor", 4, 60000, "2021-12-02"),
        (8, "Lena Fischer", 4, 63000, "2023-04-18"),
        (9, "Carlos Mendes", 1, 102000, "2018-06-11"),
        (10, "Grace Park", 2, 79000, "2020-02-27"),
    ]
    cursor.executemany(
        "INSERT INTO employees (id, name, department_id, salary, hire_date) VALUES (?, ?, ?, ?, ?)",
        employees,
    )

    customers = [
        (1, "Aditi Sharma", "aditi@example.com", "Mumbai"),
        (2, "Tom Becker", "tom@example.com", "Berlin"),
        (3, "Wei Zhang", "wei@example.com", "Shanghai"),
        (4, "Sara Ali", "sara@example.com", "Dubai"),
        (5, "Liam Connor", "liam@example.com", "Dublin"),
        (6, "Meera Iyer", "meera@example.com", "Bengaluru"),
    ]
    cursor.executemany(
        "INSERT INTO customers (id, name, email, city) VALUES (?, ?, ?, ?)", customers
    )

    products = [
        (1, "Wireless Mouse", "Electronics", 25.99),
        (2, "Mechanical Keyboard", "Electronics", 89.99),
        (3, "Standing Desk", "Furniture", 349.00),
        (4, "Office Chair", "Furniture", 199.50),
        (5, "Notebook Set", "Stationery", 12.00),
        (6, "Desk Lamp", "Furniture", 34.75),
    ]
    cursor.executemany(
        "INSERT INTO products (id, name, category, price) VALUES (?, ?, ?, ?)", products
    )

    orders = [
        (1, 1, 1, 2, "2024-01-15"),
        (2, 1, 3, 1, "2024-01-15"),
        (3, 2, 2, 1, "2024-02-03"),
        (4, 3, 4, 2, "2024-02-20"),
        (5, 4, 5, 5, "2024-03-01"),
        (6, 5, 6, 1, "2024-03-05"),
        (7, 6, 2, 1, "2024-03-18"),
        (8, 2, 1, 3, "2024-04-02"),
        (9, 3, 3, 1, "2024-04-10"),
        (10, 1, 6, 2, "2024-04-22"),
    ]
    cursor.executemany(
        "INSERT INTO orders (id, customer_id, product_id, quantity, order_date) VALUES (?, ?, ?, ?, ?)",
        orders,
    )

    conn.commit()
    conn.close()


def get_schema_info():
    conn = get_sample_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    )
    table_names = [row["name"] for row in cursor.fetchall()]

    tables = []
    for table_name in table_names:
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [{"name": row["name"], "type": row["type"]} for row in cursor.fetchall()]
        tables.append({"name": table_name, "columns": columns})

    conn.close()
    return {"tables": tables}


def build_schema_context(schema):
    lines = []
    for table in schema["tables"]:
        column_list = ", ".join(f"{col['name']} ({col['type']})" for col in table["columns"])
        lines.append(f"Table {table['name']}: {column_list}")
    return "\n".join(lines)


if __name__ == "__main__":
    init_sample_database()
    print(build_schema_context(get_schema_info()))