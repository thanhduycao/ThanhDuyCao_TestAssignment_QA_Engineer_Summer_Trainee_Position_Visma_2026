from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()  # loads from .env file


class GPTAgent:

    def __init__(self, model="gpt-4o", temperature=0.0):
        print(os.getenv("OPENAI_API_KEY"))
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = model
        self.temperature = temperature

    def run(self, prompt: str) -> str:
        """Send a text prompt and return the response."""
        response = self.client.chat.completions.create(
            model=self.model,
            temperature=self.temperature,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content.strip()


class GPTVisionAgent:

    def __init__(self, model="gpt-4o", temperature=0.0):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = model
        self.temperature = temperature

    def build_message(self, role: str, text: str, image_base64: str = None) -> dict:
        """Build a message dict with optional image content."""
        content = [{"type": "text", "text": text}]

        if image_base64:
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/png;base64,{image_base64}",
                    "detail": "high"
                }
            })

        return {"role": role, "content": content}

    def run(self, prompt: str, image_base64: str = None) -> str:
        """Send a text prompt with an optional base64 screenshot."""
        content = [{"type": "text", "text": prompt}]

        if image_base64:
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/png;base64,{image_base64}",
                    "detail": "high"
                }
            })

        response = self.client.chat.completions.create(
            model=self.model,
            temperature=self.temperature,
            messages=[
                {"role": "user", "content": content}
            ]
        )
        return response.choices[0].message.content.strip()

    def run_with_history(self, conversation_history: list) -> str:
        """Send a conversation history with text and optional images."""
        response = self.client.chat.completions.create(
            model=self.model,
            temperature=self.temperature,
            messages=conversation_history
        )
        return response.choices[0].message.content.strip()