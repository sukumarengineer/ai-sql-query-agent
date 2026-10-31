# Backend/test_summarizer.py — run this once, then delete it
from summarizer import summarize_results

columns = ["name", "department_id", "salary"]
rows = [
    {"name": "Ravi Kumar", "department_id": 1, "salary": 95000},
    {"name": "Carlos Mendes", "department_id": 1, "salary": 102000},
]

print(summarize_results("Which employees earn more than 80000?", columns, rows))
print(summarize_results("Which employees earn more than 80000?", columns, []))