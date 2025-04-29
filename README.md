# Plant Care App

Plant Care App is an app for tracing the weather conditions of your plants by using free apis.
This application combines a React frontend with a FastAPI backend and MongoDB database to provide a complete plant care management system.

## Features

- 🌱 **Plant Management**: Add, edit, and track all your plants
- 🌤️ **Weather Integration**: Local weather conditions
- 📊 **Health Analytics**: Monitor your plants' health with visual indicators, historical data and forecasts
- 📱 **Responsive Design**: Use on any device, from desktop to mobile
- 🔍 **Search & Filter**: Quickly find plants by name, type, or care needs

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, Motor (async MongoDB driver)
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Python 3.11+ (for local development)

### Running with Docker

The easiest way to run the entire application stack is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/mertarica/plant-care-app.git
cd plant-care-app

# Start the application
docker-compose up -d
```

The application will be available at:

- Frontend: http://localhost:80
- Backend API: http://localhost:8000

### Development Setup

#### Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```
/plant-care-app
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py          # Application entry point
│   │   ├── database.py      # Database connection
│   │   ├── routers/         # API routes
│   │   ├── schemas/         # Pydantic models
│   │   └── services/        # Business logic
│   └── requirements.txt     # Python dependencies
├── frontend/                # React frontend
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── hooks/           # Custom hooks
│   └── package.json         # Node dependencies
└── docker-compose.yml       # Docker configuration
```

## API Documentation

The API documentation is available at http://localhost:8000/docs when running the backend.

Key endpoints:

- `GET /plants`: List all plants (with pagination and search)
- `GET /plants/{plant_id}`: Get details about a specific plant
- `POST /plants`: Create a new plant
- `PATCH /plants/{plant_id}`: Update a plant
- `DELETE /plants/{plant_id}`: Delete a plant

## Environment Variables

### Backend

Create a `.env` file in the backend directory:

```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=plant_care_db
```

### Frontend

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenMeteo](https://open-meteo.com/) for weather data
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Google Maps Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

Made by Mert Arica
