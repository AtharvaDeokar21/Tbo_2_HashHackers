
# 🌍 TBOAnalytica: AI Travel Growth & Decision Platform

An AI-powered Travel Operating System that combines:

- Intelligent Itinerary Optimization  
- AI Marketing Automation  
- Multi-Agent Decision Intelligence  
- WhatsApp Campaign Orchestration  

This platform transforms TBO from a booking inventory provider into a **Growth + Decision Intelligence Engine for Travel Agents**.

---

# 🏗 System Architecture

The system consists of:

| Component | Description |
|------------|-------------|
| `itinerary_module` | AI-powered itinerary creation, scoring, simulation & conversational reasoning |
| `agent_module` | AI-driven campaign intelligence, creative generation & WhatsApp automation |
| `frontend` | Web interface for interacting with both modules |
| `PostgreSQL` | Centralized relational database |

---

# 🗄 Database Setup

Before running the system, set up PostgreSQL.

## Create Database

Open terminal:

```bash
psql -U postgres
```
Create database:
```sql
CREATE DATABASE travel_ai;
```
Exit and import schema:
```bash
psql -U postgres -d travel_ai -f Backend/db/schema.sql
```
This will create all required tables.

## ER Diagram
![ER Diagram](./images/ERDiagram.png)
---

# Full Local Setup Guide
You must run three components:

1. Itinerary Backend
2. Agent Backend
3. Frontend

## 1. Itinerary Backend

```bash
cd Backend/itinerary_module
python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate
pip install -r requirements.txt
```

Create a .env file in `Backend` with:

```
DB_PASSWORD= "your_db_password"
SERP_API_KEY = "your_serpapi_key"
DATABASE_URL = "postgresql://username:password@localhost/travel_ai"
GROQ_INTENT_KEY = "your_groq_key"
GROQ_API_KEY = "your_groq_key"
GEMINI_API_KEY = "your_gemini_key"
PINECONE_API_KEY = "your_pinecone_key"
```

Run the server:

```bash
cd itinerary_module
python main.py
```

## 2. Agent Backend

```bash
cd Backend/agent_module
python -m venv myenv
source myenv/bin/activate  # On Windows: myenv\Scripts\activate
pip install -r requirements.txt
```
Create a .env file in `agent_module` with:

```
DB_PASSWORD= "your_db_password"
DATABASE_URL= postgresql://username:password@localhost/travel_ai

SERP_API_KEY = "your_serpapi_key"

# API keys for Groq
GROQ_API_KEY= "your_groq_key"
GROQ_API_KEY1= ... # add more keys if needed

# twilio credentials
TWILIO_SID= your_twilio_sid
TWILIO_AUTH_TOKEN= your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp: your_twilio_whatsapp_number
TWILIO_CALLER_ID= your_twilio_caller_id

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME= your_cloudinary_cloud_name
CLOUDINARY_API_KEY= your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Eleven Labs API Key and Agent ID
ELEVEN_API_KEY= your_elevenlabs_api_key
ELEVEN_AGENT_ID= your_eleven_agent_id
ELEVEN_PHONE_NUMBER_ID= your_eleven_phone_number_id

# Bluesky credentials
BLUESKY_HANDLE= your_bluesky_handle
BLUESKY_APP_PASSWORD=your_bluesky_app_password
```

To get proper campaign insights we need to seed the database with some dummy data. Run the seeding script:

```bash
python seed_data.py
```

Run the server:

```bash
python main.py
```
## 3. Frontend

```bash
cd frontend
npm i --legacy-peer-deps
npm start
```
The product will now be accessible at:
```
http://localhost:3000
```

# Startup Order
For smooth execution:

1. Start PostgreSQL
2. Run itinerary_module
3. Run agent_module
4. Start frontend

---

# 🧠 Itinerary Intelligence Module – Capabilities
- Natural language trip generation
- Live flight & hotel integration (SerpAPI)
- Combination engine (Flight × Hotel)
- Multi-objective scoring
- Risk & margin engines
- Multi-agent debate reasoning
- What-if simulation endpoint
- Day-wise structured experience planner
- Contextual conversational query bot (LangGraph-based)

# 📈 Campaign Intelligence Module – Capabilities
- Destination trend analysis
- Smart customer targeting (RFM-based)
- AI-generated campaign blueprints
- AI-powered creative generation
- Parallel WhatsApp automation (ThreadPoolExecutor)
- Agent autocalling for real-time campaign adjustments
- Bluesky integration for automated social media posting
- Communication logging & analytics
---

# 🛠 Tech Stack

## Backend
- Python
- Flask
- SQLAlchemy ORM
- PostgreSQL

## AI & Intelligence
- Google Gemini API
- Groq API 
- LangGraph
- Pinecone (Vector DB)
- Multi-agent deterministic reasoning layer

## External Intetgrations
- Twilio (WhatsApp)
- Cloudinary (Creative Hosting)
- ElevenLabs (Voice Synthesis)
- Bluesky (Social Media)

## Scheduling
- APScheduler (Python)

## Frontend
- Next.js

---

# 🚀 Why This Platform Is Different

## Traditional travel systems:
- Static listings
- Manual marketing
- No explainability
- No profitability visibility

## TBOAnalytica:
- AI-driven acquisition
- AI-driven decision optimization
- Margin intelligence
- Risk transparency
- Simulation modeling
- Structured campaign automation
- Conversational copilot
- Day-wise experiential planning

It merges Growth Intelligence + Decision Intelligence into one unified ecosystem.

# Vision
This project demonstrates how TBO can evolve into:

### An AI-Powered Travel Growth & Decision Operating System
Combining:
- Demand Intelligence
- Marketing Automation
- Booking Optimization
- Agent Profitability Intelligence
- Customer Experience Planning

All within one cohesive AI-driven platform.