from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .functions import load_prompts
import os
from openai import OpenAI
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

# Loads the environment variable
api_key = os.getenv("OPENAI_API_KEY")
# Protects against missing API key
if not api_key:
    raise RuntimeError("OPENAI_API_KEY environment variable not set. Configure it in Vercel Settings → Environment Variables or set it in your local .env file.")
# Remove any whitespace from the API key
api_key = api_key.strip()
if len(api_key) < 20:
    raise RuntimeError(f"OPENAI_API_KEY appears to be invalid or incomplete (length: {len(api_key)}). Expected length: ~164 characters.")
print("✓ API Key loaded successfully")
# Creates the client to use the API
client = OpenAI(api_key=api_key)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# Base model for text request
class TextRequest(BaseModel):
    text: str



# Defines a POST endpoint for /general-explanation
@app.post("/general-explanation")
async def general_explanation(req: TextRequest):
    try:
        data = load_prompts(1)
        # Calls the OpenAI API to respond to the conversation
        response = client.chat.completions.create(
            model = "gpt-4o-mini", # Chat model
            messages=[
                # Defines the system behavior pattern
                {"role": "system", "content": f"{data}"},

                # Defines the user's request
                {"role": "user", "content" : f"{req.text}"}
            ],
            temperature=0.3, # Creativity level
            max_tokens=800, # Token limit
            top_p=0.8, # Nucleus sampling
            presence_penalty=0.1 # Penalizes topic repetition
        )
        # Returns the assistant's explanation in JSON
        return {"explanation": response.choices[0].message.content}
    except Exception as e:
        # If something goes wrong, returns an HTTP 500 error with details
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint for future use
@app.post("/practical-explanation")
async def practical_explanation(req: TextRequest):
    try:
        data = load_prompts(2)
        response = client.chat.completions.create(
            model = "gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"{data}"},

                {"role": "user", "content": f"{req.text}"}
            ],
            temperature=0.5, # Creativity level
            max_tokens=1000, # Token limit
            top_p=0.9, # Nucleus sampling
            presence_penalty=0.2 # Penalizes topic repetition
        )
        return {"explanation": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint for future use
@app.post("/interpretations-explanation")
async def interpretations_explanation(req: TextRequest):
    try:
        data = load_prompts(3)
        response = client.chat.completions.create(
            model = "gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"{data}"},

                {"role": "user", "content": f"{req.text}"}
            ],
            temperature=0.6, # Creativity level
            max_tokens=1200, # Token limit
            top_p=0.95, # Nucleus sampling
            presence_penalty=0.3 # Penalizes topic repetition
        )
        return {"explanation": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/historical-explanation")
async def historical_explanation(req: TextRequest):
    try:
        data = load_prompts(4)
        response = client.chat.completions.create(
            model = "gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"{data}"},

                {"role": "user", "content": f"{req.text}"}
            ],
            temperature=0.4, # Lower creativity level for historical contextualization
            max_tokens=1200, # Token limit
            top_p=0.85, # Nucleus sampling
            presence_penalty=0.2 # Penalizes topic repetition
        )
        return {"explanation": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/study-guide-explanation")
async def study_guide_explanation(req: TextRequest):
    try:
        data = load_prompts(5)
        response = client.chat.completions.create(
            model = "gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"{data}"},

                {"role": "user", "content": f"{req.text}"}
            ],
            temperature=0.5, # Moderate creativity level for structuring
            max_tokens=1500, # Higher token limit for study guides
            top_p=0.9, # Nucleus sampling
            presence_penalty=0.2 # Penalizes topic repetition
        )
        return {"explanation": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/devotional-explanation")
async def devotional_explanation(req: TextRequest):
    try:
        data = load_prompts(6)
        response = client.chat.completions.create(
            model = "gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"{data}"},

                {"role": "user", "content": f"{req.text}"}
            ],
            temperature=0.7, # Higher creativity level for spiritual reflection
            max_tokens=1000, # Token limit
            top_p=0.95, # Nucleus sampling
            presence_penalty=0.1 # Penalizes topic repetition
        )
        return {"explanation": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Mounts files from the 'static' folder
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "..", "static")), name="static")


# Defines a GET endpoint at the root URL
@app.post("/test-api")
async def test_api(req: TextRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Você é um assistente útil."},
                {"role": "user", "content": req.text}
            ],
            max_tokens=100
        )
        return {"explanation": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    # Returns the HTML file
    return FileResponse(os.path.join(os.path.dirname(__file__), "..", "static", "index.html"))

