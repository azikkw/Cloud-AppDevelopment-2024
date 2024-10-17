import unittest
from flask import json
from main import app, todos

class TodoAppUnitTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        # print(todos)
        response = self.app.post('/add', json={"task": "Test Task"})
        self.todo_id = response.get_json()["id"]

    def test_add_todo(self):
        todo_data = {"task": "Test Task"}
        response = self.app.post('/add', json=todo_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("task", json.loads(response.data))

    def test_update_todo(self):
        response = self.app.put(f'/update/{self.todo_id}', json={"task": "Updated Task"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("task", json.loads(response.data))

    def test_delete_todo(self):
        response = self.app.delete(f'/delete/{self.todo_id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", json.loads(response.data))

    def test_get_all_todos(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(json.loads(response.data)), 1)

if __name__ == '__main__':
    unittest.main()