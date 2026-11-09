"""
Snippet 19: Azure App Configuration Provider with Label Stacking & Sentinel Dynamic Refresh
Microsoft AI-200 / Lesson 8 (app-config-python)

Demonstrates:
1. Connecting to Azure App Configuration using Microsoft Entra ID (DefaultAzureCredential).
2. Label Stacking: Loading default settings (label "\\0") as base, and stacking "Production" overrides on top.
3. Key Vault Reference resolution: Transparently resolving secrets via AzureAppConfigurationKeyVaultOptions.
4. Sentinel Dynamic Refresh: Monitoring a single watchdog key ("Sentinel") and reloading configuration atomically without app restart.
"""

import os
import time
from typing import Any, Dict
from azure.identity import DefaultAzureCredential
from azure.appconfiguration.provider import (
    load,
    SettingSelector,
    AzureAppConfigurationKeyVaultOptions,
)


def create_app_configuration_provider(
    endpoint: str | None = None,
    environment_label: str = "Production",
    refresh_interval_seconds: int = 30,
) -> Any:
    """
    Initializes and returns the Azure App Configuration Provider.
    
    Args:
        endpoint: Azure App Configuration Store endpoint URL (e.g. https://<name>.azconfig.io)
        environment_label: The environment label to stack on top of base settings (e.g. "Production")
        refresh_interval_seconds: Refresh interval for polling the Sentinel key
    """
    endpoint = endpoint or os.environ.get("AZURE_APPCONFIG_ENDPOINT")
    if not endpoint:
        raise ValueError("AZURE_APPCONFIG_ENDPOINT environment variable must be set.")

    # Entra ID authentication (Managed Identity in production / Azure CLI in local dev)
    credential = DefaultAzureCredential()

    # 1. Label Stacking:
    # First selector loads base default settings (null label represented by "\\0")
    # Second selector loads environment-specific settings (e.g. "Production") to override base keys
    selects = [
        SettingSelector(key_filter="*", label_filter="\\0"),
        SettingSelector(key_filter="*", label_filter=environment_label),
    ]

    # 2. Key Vault Options:
    # Resolves any Key Vault references stored in App Configuration automatically
    # using the specified Entra ID credential.
    key_vault_options = AzureAppConfigurationKeyVaultOptions(credential=credential)

    # 3. Dynamic Refresh on Sentinel Key:
    # Rather than watching all keys, watch only "Sentinel" to avoid 429 throttling
    # and guarantee atomic, consistent multi-key updates.
    provider = load(
        endpoint=endpoint,
        credential=credential,
        selects=selects,
        key_vault_options=key_vault_options,
        refresh_on=["Sentinel"],
        refresh_interval=refresh_interval_seconds,
    )

    return provider


def simulate_request_pipeline(provider: Any, num_requests: int = 5) -> None:
    """
    Simulates incoming requests in a web application (FastAPI / Flask / Django).
    Demonstrates periodic provider.refresh() checking without app restart.
    """
    print("=" * 70)
    print("Azure App Configuration Provider Pipeline Running")
    print("=" * 70)

    for i in range(1, num_requests + 1):
        print(f"\n[Request #{i}]")
        
        # In a web app middleware or background worker, call provider.refresh()
        # If Sentinel has not changed or refresh_interval hasn't elapsed, it's a no-op (instant).
        refreshed = provider.refresh()
        if refreshed:
            print("  >> [DYNAMIC REFRESH TRIGGERED] Configuration updated atomically from Cloud!")
        else:
            print("  >> [CACHE HIT] Configuration stable (Sentinel unchanged).")

        # Access settings like a standard Python mapping/dict
        openai_endpoint = provider.get("OpenAI:Endpoint", "Not configured")
        openai_model = provider.get("OpenAI:Model", "gpt-4o-mini")
        batch_size = provider.get("Pipeline:BatchSize", 100)
        sentinel_rev = provider.get("Sentinel", "1")
        
        # Secret resolved transparently from Key Vault!
        openai_key = provider.get("OpenAI:ApiKey", "None")
        masked_key = f"{openai_key[:7]}...{openai_key[-4:]}" if len(openai_key) > 12 else "***"

        print(f"  Endpoint   : {openai_endpoint}")
        print(f"  Model      : {openai_model}")
        print(f"  Batch Size : {batch_size}")
        print(f"  API Key    : {masked_key} (Resolved from Key Vault)")
        print(f"  Sentinel   : {sentinel_rev}")

        time.sleep(0.5)


if __name__ == "__main__":
    test_endpoint = os.environ.get("AZURE_APPCONFIG_ENDPOINT", "https://mock-appconfig.azconfig.io")
    print(f"Targeting Store: {test_endpoint}")
    print("This snippet is production-ready for deployment with Azure App Service / ACA.")

