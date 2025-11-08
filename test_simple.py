#!/usr/bin/env python3
"""
Teste muito simples para identificar problema na API
"""

import requests
import json

def teste_simples():
    try:
        print("Testando endpoint /api/test...")
        response = requests.get("http://127.0.0.1:5000/api/test", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"Erro: {e}")
        return False

def teste_chat_simples():
    try:
        print("Testando chat simples...")
        data = {
            "message": "oi",
            "bot_type": "querrybot",
            "chat_id": "test"
        }
        response = requests.post("http://127.0.0.1:5000/api/chat", json=data, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Success: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    if teste_simples():
        teste_chat_simples()