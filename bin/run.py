import uvicorn

if __name__ == "__main__":
    uvicorn.run("qanet.main:app", host="0.0.0.0", reload=True)
