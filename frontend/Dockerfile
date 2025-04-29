version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://backend:8000 

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql://dbuser:dbpass@db:5432/plantdb
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=dbuser
      - POSTGRES_PASSWORD=dbpass
      - POSTGRES_DB=plantdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data: 