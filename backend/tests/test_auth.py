import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_login_placeholder():
    # Placeholder for auth test
    assert True

@pytest.fixture
def mock_ollama(monkeypatch):
    class MockResponse:
        def json(self):
            return {"answer": "Mocked response"}
    def mock_post(*args, **kwargs):
        return MockResponse()
    monkeypatch.setattr("httpx.post", mock_post)

def test_quiz_with_mock_ollama(mock_ollama):
    # Test would go here
    assert True
