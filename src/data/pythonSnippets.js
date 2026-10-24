// Chứa code Python dưới dạng string để hiển thị trong UI
export const pythonSnippets = [
    {
        id: "dynamic-sessions-client",
        title: "Dynamic Sessions Client",
        description: "Client để chạy code AI-generated an toàn trong Azure Container Apps Dynamic Sessions.",
        category: "Azure Container Apps",
        code: `import os
from pathlib import Path
from uuid import uuid4
from azure.identity import DefaultAzureCredential

API_VERSION = "2024-02-02-preview"
TOKEN_SCOPE = "https://dynamicsessions.io/.default"

class DynamicSessionClient:
    def __init__(self, endpoint, credential, identifier):
        self.endpoint = endpoint.rstrip("/")
        self.credential = credential
        self.identifier = identifier

    def _headers(self):
        token = self.credential.get_token(TOKEN_SCOPE).token
        return {"Authorization": f"Bearer {token}"}

    def _params(self):
        return {"api-version": API_VERSION, "identifier": self.identifier}

    # ... (các method khác)
`,
    },
    // Thêm các snippet khác...
];