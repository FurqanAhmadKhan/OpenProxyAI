#!/usr/bin/env python3
"""
OpenProxyAIFree - Python Implementation
A reverse API proxy for ChatGPT models using third-party services.

DISCLAIMER: This is for testing purposes only and is not maintained.
Last Updated: 3/22/2026 5:00 PM Sunday

Original Website: https://chatgpt-api.vercel.app/
"""

import requests
import json
from typing import List, Dict, Optional, Union

class ChatGPTProxy:
    """
    A Python client for interacting with ChatGPT models through a proxy service.
    
    Supported Models:
    - gpt-4o
    - o3
    - o4-mini
    - gpt-4.1
    - gpt-4.1-mini
    - gpt-4-turbo
    - gpt-4
    - gpt-3.5-turbo
    - gpt-3.5-turbo-16k
    """
    
    API_URL = "https://chatgpt-api.vercel.app/api/chat"
    
    SUPPORTED_MODELS = [
        "gpt-4o",
        "o3",
        "o4-mini",
        "gpt-4.1",
        "gpt-4.1-mini",
        "gpt-4-turbo",
        "gpt-4",
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-16k"
    ]
    
    def __init__(self, timeout: int = 30):
        """
        Initialize the ChatGPT Proxy client.
        
        Args:
            timeout (int): Request timeout in seconds (default: 30)
        """
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json"
        })
    
    def chat(
        self,
        model: str,
        message: Union[str, List[Dict[str, str]]],
        system_prompt: Optional[str] = None
    ) -> Dict:
        """
        Send a chat message to the specified model.
        
        Args:
            model (str): The model to use (e.g., "gpt-3.5-turbo")
            message (str or list): User message or list of message objects
            system_prompt (str, optional): System prompt to set context
        
        Returns:
            dict: The complete API response
        
        Raises:
            ValueError: If model is not supported
            requests.RequestException: If the API request fails
        """
        if model not in self.SUPPORTED_MODELS:
            raise ValueError(
                f"Model '{model}' is not supported. "
                f"Supported models: {', '.join(self.SUPPORTED_MODELS)}"
            )
        
        # Build messages array
        messages = []
        
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })
        
        if isinstance(message, str):
            messages.append({
                "role": "user",
                "content": message
            })
        elif isinstance(message, list):
            messages.extend(message)
        else:
            raise ValueError("Message must be a string or list of message objects")
        
        # Prepare payload
        payload = {
            "model": model,
            "messages": messages
        }
        
        # Make API request
        try:
            response = self.session.post(
                self.API_URL,
                json=payload,
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise requests.RequestException(f"API request failed: {str(e)}")
    
    def get_response_text(self, response: Dict) -> str:
        """
        Extract the text content from an API response.
        
        Args:
            response (dict): The API response
        
        Returns:
            str: The assistant's response text
        """
        try:
            return response["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            return ""
    
    def get_token_usage(self, response: Dict) -> Dict[str, int]:
        """
        Extract token usage information from an API response.
        
        Args:
            response (dict): The API response
        
        Returns:
            dict: Token usage statistics
        """
        return response.get("usage", {})
    
    def chat_simple(self, model: str, message: str) -> str:
        """
        Send a simple chat message and return only the response text.
        
        Args:
            model (str): The model to use
            message (str): User message
        
        Returns:
            str: The assistant's response text
        """
        response = self.chat(model, message)
        return self.get_response_text(response)


def test_all_models():
    """Test all supported models with sample queries."""
    proxy = ChatGPTProxy()
    
    test_cases = [
        ("gpt-4o", "What is artificial intelligence?"),
        ("o3", "Explain machine learning in one sentence."),
        ("o4-mini", "Write a haiku about coding."),
        ("gpt-4.1", "What is the speed of light?"),
        ("gpt-4.1-mini", "What is 2+2?"),
        ("gpt-4-turbo", "List 3 programming languages."),
        ("gpt-4", "What is Python?"),
        ("gpt-3.5-turbo", "Hello, how are you?"),
        ("gpt-3.5-turbo-16k", "Explain the concept of recursion."),
    ]
    
    print("Testing all models...\n")
    print("=" * 80)
    
    for model, message in test_cases:
        print(f"\nModel: {model}")
        print(f"Query: {message}")
        print("-" * 80)
        
        try:
            response = proxy.chat(model, message)
            text = proxy.get_response_text(response)
            usage = proxy.get_token_usage(response)
            
            print(f"Response: {text[:200]}...")
            print(f"Tokens: {usage.get('total_tokens', 'N/A')}")
            print("✓ Success")
        except Exception as e:
            print(f"✗ Error: {str(e)}")
        
        print("=" * 80)


def main():
    """Main function demonstrating usage examples."""
    print("OpenProxyAIFree - Python Client")
    print("=" * 80)
    print("DISCLAIMER: For testing purposes only. Not maintained.")
    print("Last Updated: 3/22/2026 5:00 PM Sunday")
    print("=" * 80)
    print()
    
    # Initialize the proxy
    proxy = ChatGPTProxy()
    
    # Example 1: Simple chat
    print("Example 1: Simple Chat")
    print("-" * 80)
    try:
        response_text = proxy.chat_simple("gpt-3.5-turbo", "Hello! Tell me a fun fact.")
        print(f"Response: {response_text}")
    except Exception as e:
        print(f"Error: {str(e)}")
    print()
    
    # Example 2: Chat with full response
    print("Example 2: Full Response")
    print("-" * 80)
    try:
        response = proxy.chat("gpt-3.5-turbo", "What is Python programming?")
        print(f"Response Text: {proxy.get_response_text(response)}")
        print(f"Token Usage: {proxy.get_token_usage(response)}")
    except Exception as e:
        print(f"Error: {str(e)}")
    print()
    
    # Example 3: Chat with system prompt
    print("Example 3: Chat with System Prompt")
    print("-" * 80)
    try:
        response = proxy.chat(
            model="gpt-3.5-turbo",
            message="Tell me about yourself.",
            system_prompt="You are a helpful coding assistant specialized in Python."
        )
        print(f"Response: {proxy.get_response_text(response)}")
    except Exception as e:
        print(f"Error: {str(e)}")
    print()
    
    # Example 4: Multi-turn conversation
    print("Example 4: Multi-turn Conversation")
    print("-" * 80)
    try:
        messages = [
            {"role": "user", "content": "What is JavaScript?"},
            {"role": "assistant", "content": "JavaScript is a programming language."},
            {"role": "user", "content": "What can I build with it?"}
        ]
        response = proxy.chat("gpt-3.5-turbo", messages)
        print(f"Response: {proxy.get_response_text(response)}")
    except Exception as e:
        print(f"Error: {str(e)}")
    print()
    
    # Example 5: Test different models
    print("Example 5: Testing Different Models")
    print("-" * 80)
    models_to_test = ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"]
    question = "What is the capital of France?"
    
    for model in models_to_test:
        try:
            response_text = proxy.chat_simple(model, question)
            print(f"{model}: {response_text[:100]}...")
        except Exception as e:
            print(f"{model}: Error - {str(e)}")
    print()
    
    # Uncomment to test all models
    # test_all_models()


if __name__ == "__main__":
    main()
