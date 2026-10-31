# Backend/test_sql_generator.py — run this once, then delete it
from database import build_schema_context, get_schema_info, init_sample_database
from sql_generator import generate_sql_query, validate_query_safety

init_sample_database()
schema_context = build_schema_context(get_schema_info())

result = generate_sql_query("Which res earn more than 80000?", schema_context)
print("SQL:", result.sql_query)
print("Explanation:", result.explanation)

is_safe, reason = validate_query_safety(result.sql_query)
print("Safe:", is_safe, reason)
