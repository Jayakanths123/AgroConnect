# AgroConnect

AgroConnect is a full-stack agriculture commerce and advisory platform designed for Indian farmers, agri-entrepreneurs, and agri-business users. It brings together equipment discovery, lending support, expense tracking, market insights, scheme awareness, community discussions, and order flow into one unified digital experience.

## Deployed link

https://agrico-sooty.vercel.app/

## Why this project matters

Indian farmers often work across fragmented systems: equipment availability is scattered, subsidies are hard to discover, financing information is disconnected, and field-level market data is not centralized. AgroConnect solves this by creating one digital farmers' command center.

## Core value proposition

- connect farmers with equipment rental and buying options
- surface relevant schemes and financial opportunities
- help users manage field and farm costs
- provide market trends and sustainability insights
- build community discussions for crop knowledge sharing
- support a commerce flow from product viewing to booking and payment

## Key modules

- dashboard and home overview
- equipment marketplace and booking flow
- lending and financial support section
- expense tracking and budgeting
- government schemes and insights
- market intelligence and recommendations
- community forum and discussions
- cart, checkout, and payment flow
- location and route information

## Tech stack

- Frontend: React, TypeScript, Vite
- UI: Tailwind CSS, shadcn/ui
- Routing: React Router
- Data layer: Supabase + Express backend
- Services: Node.js backend APIs
- State: React Query and local cart context

## Project structure

- `src/` — frontend application code
- `server/` — backend and API services
- `public/` — static assets and images
- `database_schema.sql` — database schema
- `database_data.sql` — sample data

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Run the app locally

```bash
npm run dev -- --host 0.0.0.0
```

App runs on:

- http://localhost:8080/

### Run the backend

```bash
npm run backend
```

## Full project documentation

See the detailed end-to-end project guide here:

- [AGROCONNECT_PROJECT_GUIDE.md](AGROCONNECT_PROJECT_GUIDE.md)

This guide includes:

- system design diagram in text form
- ASCII architecture diagram
- module-by-module folder explanation
- route-by-route API map
- frontend file-by-file breakdown
- how to add a new product or category
- sequence diagram and interview-ready summary

## Repository

GitHub: https://github.com/Jayakanths123/AgroConnect.git

## License

This repository is intended for educational and project-demo use.
