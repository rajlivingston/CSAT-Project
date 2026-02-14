# from fastapi import FastAPI
# from app.routes import public, admin, reports
# from dotenv import load_dotenv
# load_dotenv()


# app = FastAPI()

# app.include_router(public.router)
# app.include_router(admin.router)
# app.include_router(reports.router)
# @app.get("/")
# async def root():    return {"message": "Welcome to the FastAPI application!"}

from fastapi import FastAPI
from .database import engine, Base
from .routes import public, reports, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CSAT API")

app.include_router(public.router)
app.include_router(admin.router)
app.include_router(reports.router)
