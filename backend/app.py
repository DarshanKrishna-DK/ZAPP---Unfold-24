import os
import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from ml import chain

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict")
async def predict( query : str):
    return chain.invoke({
        "query" : query
    })
    

if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8000, reload=True)