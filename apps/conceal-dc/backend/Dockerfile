# 🐍 Base Image: Use an official Python image
FROM python:3.11-slim

# 🛠️ Set Environment Variables
ENV PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.6.1 \
    DYNAMODB_ENDPOINT=https://dynamodb.us-east-1.amazonaws.com \
    REGION=us-east-1

# 📁 Set Working Directory
WORKDIR /app

# 🗂️ Copy only backend files
COPY . .

# 📦 Install Dependencies
RUN pip install --upgrade pip \
    && pip install poetry==${POETRY_VERSION} \
    && poetry config virtualenvs.create false \
    && poetry install --without dev --no-root

# 🚀 Start the FastAPI Server
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "80"]
