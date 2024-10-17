from locust import HttpUser, task, between

class TodoAppUser(HttpUser):
    wait_time = between(1, 3)

    @task(1)
    def add_todo(self):
        response = self.client.post("/add", headers={"api-key": "AIzaSyAa0paGkZS8yniRf4dEuOZjoErJH7_9VZM"}, json={"task": "Load Test Task"})
        if response.status_code == 200:
            todo_id = response.json().get("id")
            self.update_todo(todo_id)

    def update_todo(self, todo_id):
        response = self.client.put(f"/update/{todo_id}", headers={"api-key": "AIzaSyAa0paGkZS8yniRf4dEuOZjoErJH7_9VZM"}, json={"task": "Updated Load Test Task"})
        if response.status_code == 200:
            self.delete_todo(todo_id)

    def delete_todo(self, todo_id):
        self.client.delete(f"/delete/{todo_id}", headers={"api-key": "AIzaSyAa0paGkZS8yniRf4dEuOZjoErJH7_9VZM"})
    
    @task(1)
    def get_all_todos(self):
        self.client.get("/", headers={"api-key": "AIzaSyAa0paGkZS8yniRf4dEuOZjoErJH7_9VZM"})

if __name__ == "__main__":
    import os
    os.system("locust")
