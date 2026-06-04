from google import genai
from pathlib import Path
from dotenv import load_dotenv
import os

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("WEATHER_APP_GEMINI_API_KEY")
if not api_key:
    raise ValueError("WEATHER_APP_GEMINI_API_KEY not found — check your .env path")

client = genai.Client(api_key=api_key)