from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import scan_policy, compare_policies

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PolicyRequest(BaseModel):
    policy_text: str

class CompareRequest(BaseModel):
    policy_a: str
    policy_b: str
    name_a: str
    name_b: str

@app.post("/scan")
async def scan(request: PolicyRequest):
    result = scan_policy(request.policy_text)
    return {"result": result}

@app.post("/compare")
async def compare(request: CompareRequest):
    result = compare_policies(
        request.policy_a,
        request.policy_b,
        request.name_a,
        request.name_b
    )
    return {"result": result}

@app.get("/")
async def root():
    return {"message": "AI Policy Scanner API is running"}