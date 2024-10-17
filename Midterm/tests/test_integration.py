import unittest
from flask import json
from main import app
import requests_mock

class TodoAppIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        response = self.app.post('/add', json={"task": "Test Task"})
        self.todo_id = response.get_json()["id"]

    @requests_mock.Mocker()
    def test_add_todo_integration(self, mock_requests):
        mock_requests.post('https://us-central1-western-avatar-435512-h0.cloudfunctions.net/process_user_inputs', json={}, status_code=200)
        mock_requests.post('https://us-central1-western-avatar-435512-h0.cloudfunctions.net/send_notification', json={}, status_code=200)
        
        response = self.app.post('/add', json={"task": "Integration Test Task"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("task", json.loads(response.data))

    @requests_mock.Mocker()
    def test_update_todo_integration(self, mock_requests):
        mock_requests.post('https://us-central1-western-avatar-435512-h0.cloudfunctions.net/process_user_inputs', json={}, status_code=200)
        mock_requests.post('https://us-central1-western-avatar-435512-h0.cloudfunctions.net/send_notification', json={}, status_code=200)

        response = self.app.put(f'/update/{self.todo_id}', json={"task": "Updated Task"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("task", json.loads(response.data))

    @requests_mock.Mocker()
    def test_delete_todo_integration(self, mock_requests):
        mock_requests.post('https://us-central1-western-avatar-435512-h0.cloudfunctions.net/send_notification', json={}, status_code=200)
        response = self.app.delete(f'/delete/{self.todo_id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", json.loads(response.data))

if __name__ == '__main__':
    unittest.main()
