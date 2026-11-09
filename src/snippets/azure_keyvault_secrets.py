"""
Snippet 20: Azure Key Vault SecretClient with Versioning, Metadata Audit & In-Memory TTL Caching
Microsoft AI-200 / Lesson 8 (key-vault-python)

Demonstrates:
1. Connecting to Azure Key Vault via Microsoft Entra ID (DefaultAzureCredential).
2. Storing secrets with MIME content-type and environment tags.
3. Secret versioning: Creating a new version while preserving historical immutable versions.
4. Least-privilege metadata audit: Listing properties of secrets without exposing sensitive values.
5. In-Memory TTL Caching: Eliminating HTTP 429 throttling errors by caching secrets in process memory.
"""

import os
import time
from typing import Any, Dict, List, Optional
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.core.exceptions import ResourceNotFoundError, HttpResponseError


class CachedSecretManager:
    """
    Manages Key Vault secret access with built-in time-to-live (TTL) memory caching
    to prevent Azure Key Vault API rate limiting (HTTP 429) and reduce network latency.
    """

    def __init__(self, vault_url: Optional[str] = None, cache_ttl_seconds: int = 30):
        self.vault_url = vault_url or os.environ.get("KEY_VAULT_URL")
        if not self.vault_url:
            raise ValueError("KEY_VAULT_URL environment variable must be set.")
        
        self.credential = DefaultAzureCredential()
        self.client = SecretClient(vault_url=self.vault_url, credential=self.credential)
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.cache_ttl = cache_ttl_seconds
        self.api_call_count = 0

    def get_secret_value(self, secret_name: str) -> str:
        """
        Retrieves secret value, returning from local memory cache if still valid (TTL).
        """
        now = time.monotonic()
        cached = self.cache.get(secret_name)

        if cached and (now - cached["timestamp"]) < self.cache_ttl:
            # Cache Hit: 0 network latency, 0 Key Vault API quota used
            return cached["value"]

        # Cache Miss: Query Azure Key Vault
        try:
            self.api_call_count += 1
            secret = self.client.get_secret(secret_name)
            self.cache[secret_name] = {
                "value": secret.value,
                "timestamp": now,
                "version": secret.properties.version,
            }
            return secret.value
        except ResourceNotFoundError:
            raise KeyError(f"Secret '{secret_name}' not found in Key Vault.")
        except HttpResponseError as ex:
            raise RuntimeError(f"Key Vault API error: {ex.message}")

    def list_secret_properties_safely(self) -> List[Dict[str, Any]]:
        """
        Lists secret metadata (Least Privilege):
        Audits secret existence, tags, and enabled status WITHOUT retrieving plain-text secret values.
        """
        results = []
        for prop in self.client.list_properties_of_secrets():
            results.append({
                "name": prop.name,
                "enabled": prop.enabled,
                "content_type": prop.content_type,
                "created_on": str(prop.created_on),
                "updated_on": str(prop.updated_on),
                "tags": prop.tags or {},
            })
        return results

    def rotate_secret(self, secret_name: str, new_value: str, content_type: str = "text/plain") -> Dict[str, Any]:
        """
        Rotates a secret by creating a new version.
        Previous versions remain accessible in Key Vault via their explicit version ID.
        """
        # Save old version info for audit trail
        try:
            current = self.client.get_secret(secret_name)
            old_version = current.properties.version
        except ResourceNotFoundError:
            old_version = None

        # Store new version
        new_secret = self.client.set_secret(
            secret_name,
            new_value,
            content_type=content_type,
            tags={"rotated": "true", "rotation_epoch": str(int(time.time()))}
        )

        # Invalidate local cache entry so subsequent calls fetch the fresh version
        if secret_name in self.cache:
            del self.cache[secret_name]

        return {
            "name": secret_name,
            "old_version": old_version,
            "new_version": new_secret.properties.version,
            "created_on": str(new_secret.properties.created_on),
        }


def demo_caching_simulation():
    """
    Demonstrates how caching prevents redundant API calls.
    """
    print("=" * 70)
    print("Key Vault In-Memory Caching & Throttling Resilience Demo")
    print("=" * 70)

    # Simulated run
    print("Simulating 5 consecutive secret accesses with TTL = 30 seconds:")
    cache = {}
    vault_calls = 0
    names = ["openai-api-key", "cosmosdb-connection-string"]

    for round_num in range(1, 6):
        print(f"\n--- Round {round_num} ---")
        now = time.monotonic()
        for name in names:
            if name in cache and (now - cache[name]["time"]) < 30:
                print(f"  [{name}] -> CACHE HIT (RAM read, 0ms, no API quota)")
            else:
                vault_calls += 1
                cache[name] = {"val": "sk-mock-key-123456", "time": now}
                print(f"  [{name}] -> CACHE MISS (Invoking Key Vault SecretClient)")

    print(f"\nTotal accesses: 10 | Key Vault API Calls: {vault_calls} (80% network calls saved!)")


if __name__ == "__main__":
    demo_caching_simulation()

