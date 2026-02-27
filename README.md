# SADC Impact Risk Studio (SIRS)

**A Regional Risk Intelligence and Decision-Support Platform for Southern Africa**

[![Live Demo](https://img.shields.io/badge/Live-sirs--vert.vercel.app-brightgreen)](https://sirs-vert.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

SIRS is a regional risk intelligence platform that transforms how the Southern African Development Community (SADC) and its partners prepare for, anticipate, and respond to climate and weather-driven disasters. Built on top of the INFORM Subnational Risk Model, SIRS fuses hazard forecasts, exposure data, vulnerability indices, and sectoral information into a single, shared operational picture.

**Live Platform**: [https://sirs-vert.vercel.app](https://sirs-vert.vercel.app)

## Status

SIRS was formally presented to the SADC Disaster Risk Reduction Unit and partner stakeholders on 27 February 2026. The session included representatives from SADC Secretariat, UNDP, GIZ, JRC (European Commission), MapAction, WFP, the African Union Commission, and other regional partners. The platform is currently in prototype stage with simulated data, and active discussions are underway on INFORM subnational data integration and alignment with SHOC operations.

## Overview

SIRS functions as a **connective tissue layer** — an integration engine that plugs into existing SADC systems, partner workflows, and national disaster management architectures. Its purpose is to turn the rich but currently fragmented landscape of risk data into timely, actionable intelligence that decision-makers can act on within hours, not weeks.

### Key Capabilities

- **Risk Integration Engine** — Composite operational risk scores at subnational levels across all 16 SADC Member States
- **Impact Scenario Builder** — Create, run, and compare disaster impact scenarios in minutes
- **Early Action Trigger Layer** — Pre-agreed trigger frameworks for anticipatory action across partner organisations
- **Sector Lenses** — Health/WASH, Food Security, Logistics, and Social Protection analytical overlays
- **AI-Powered Decision Support** — Integrated AI assistant that analyses live platform data, generates situation reports, country risk briefs, and scenario briefings on demand
- **Data Collection & Feedback** — KoboToolbox integration for field assessments with model improvement feedback loops
- **Collaboration Workspace** — Shared analytical environment with AI-assisted SitRep generation for multi-partner coordination

## AI Features

SIRS integrates AI across four areas of the platform:

| Feature | Location | Description |
|---------|----------|-------------|
| **SIRS AI Assistant** | Floating panel (all pages) | Conversational analyst that answers questions using live platform data — risk scores, active events, triggers, and facility information |
| **AI Situation Reports** | Collaboration page | Generates structured SitReps following OCHA conventions with configurable report type, audience, coverage, and tone |
| **AI Country Risk Briefs** | Risk Monitor page | One-click 150-200 word risk briefs for any country, using live risk scores, active events, and trigger status |
| **AI Scenario Briefings** | Scenarios page | Operational briefings for disaster scenarios covering situation overview, affected populations, and priority actions |

All AI features pull data dynamically from the same source that powers the dashboard, ensuring consistency between what the platform displays and what the AI reports.

## Getting Started

### Live Demo

Visit [https://sirs-vert.vercel.app](https://sirs-vert.vercel.app) to explore the platform without any setup.

### Local Development

#### Prerequisites

- Node.js 18+
- npm or yarn

#### Installation

```bash
# Clone the repository
git clone https://github.com/ernestmoyo/sirs.git
cd sirs/app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

#### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [Leaflet](https://leafletjs.com/) / [React Leaflet](https://react-leaflet.js.org/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)

## Project Structure

```
app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/ai/chat/        # AI API route (Claude integration)
│   │   ├── page.tsx            # Regional Risk Dashboard
│   │   ├── risk-monitor/       # Risk Monitor with AI briefs
│   │   ├── scenarios/          # Impact Scenario Builder with AI briefings
│   │   ├── triggers/           # Early Action Trigger Layer
│   │   ├── sectors/            # Sector Lenses hub + individual lenses
│   │   ├── data-collection/    # Kobo integration & assessments
│   │   ├── collaboration/      # Collaboration Workspace with AI SitRep generator
│   │   └── settings/           # Platform settings
│   ├── components/
│   │   ├── layout/             # Sidebar, Header, AppShell
│   │   ├── dashboard/          # Dashboard components (map, charts, tables)
│   │   ├── ai/                 # AI components (chat, SitRep, risk brief, scenario brief)
│   │   ├── scenarios/          # Scenario builder, comparison, results
│   │   ├── triggers/           # Trigger cards, timeline, config
│   │   ├── sectors/            # Sector lens components
│   │   └── ui/                 # Reusable UI components
│   └── lib/
│       ├── ai.ts               # AI utilities, prompt builders, data context
│       ├── mock-data.ts        # Simulated SADC risk data
│       ├── utils.ts            # Utility functions
│       └── demo-data-readme.ts # Data source documentation
```

## Demo Data

This prototype uses **simulated data** that is realistic and based on actual SADC geography, risk profiles, and partner workflows. See [`src/lib/demo-data-readme.ts`](app/src/lib/demo-data-readme.ts) for complete documentation of:

- What data is simulated vs. what would come from real sources
- Real data source APIs and endpoints for production integration
- Integration roadmap for connecting to INFORM, meteorological services, KoboToolbox, Google Earth Engine, DHIS2, and more

### What Is Real in the Demo
- Map tiles and geography (OpenStreetMap)
- SADC member state positions and relationships
- Realistic risk score ranges based on INFORM methodology
- Accurate partner organisation names, roles, and workflows
- Correct SADC institutional structure

### What Is Simulated
- Risk scores and time series data
- Active event details (based on realistic scenarios)
- Trigger configurations and thresholds
- Facility counts and district-level data
- Assessment responses and field data

## Partner Ecosystem

SIRS is designed for the SADC DRR community of practice, integrating with:

| Partner | Role |
|---------|------|
| **SADC DRR Unit + SHOC** | Institutional owner, primary operational user |
| **GIZ** | Programme support, capacity building |
| **UNDP** | Technical partner, early recovery programming |
| **WFP** | Anticipatory action, logistics data |
| **IFRC** | Field data collection, community verification |
| **MapAction** | Cartographic standards, rapid mapping, geospatial data |
| **JRC (European Commission)** | INFORM model, scientific methodology, Inforum platform |
| **AUC** | Continental alignment (AMHEWAS) |
| **KoboToolbox** | Mobile data collection platform |

## Implementation Roadmap

| Phase | Timeline | Focus |
|-------|----------|-------|
| **Phase 0** | Months 1–4 | Co-design with SADC partners, stakeholder validation |
| **Phase 1** | Months 5–12 | Prototype and pilot in Mozambique and Malawi, JRC API integration |
| **Phase 2** | Months 13–24 | Regional scaling to 4–6 additional Member States |

### Priority Enhancements (from stakeholder feedback)
- INFORM subnational data integration via JRC API
- Cascading effects analysis (hazard chains across crisis trajectories)
- Damage and loss cost overlay for infrastructure
- Risk-informed development lens beyond emergency response
- Domain expert-defined trigger thresholds

## Contributing

We welcome contributions from the SADC DRR community and beyond.

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m 'Add your feature'

# Push to the branch
git push origin feature/your-feature

# Open a Pull Request
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## About

**SIRS** is developed by [7Square Inc.](https://7squareinc.com) — *Converting Africa's Challenges into Opportunities*

**Contact**: Ernest Moyo, Co-founder — ernest@7squareinc.com

---

*Presented to the SADC DRR Community of Practice | Version 1.0 — February 2026*
