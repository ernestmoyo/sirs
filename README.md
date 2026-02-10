# SADC Impact Risk Studio (SIRS)

**A Regional Risk Intelligence and Decision-Support Layer for Southern Africa**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

SIRS is a regional risk intelligence platform that transforms how the Southern African Development Community (SADC) and its partners prepare for, anticipate, and respond to climate and weather-driven disasters. Built on top of the INFORM Subnational Risk Model, SIRS fuses hazard forecasts, exposure data, vulnerability indices, and sectoral information into a single, shared operational picture.

## Overview

SIRS functions as a **connective tissue layer** - an integration engine that plugs into existing SADC systems, partner workflows, and national disaster management architectures. Its purpose is to turn the rich but currently fragmented landscape of risk data into timely, actionable intelligence that decision-makers can act on within hours, not weeks.

### Key Capabilities

- **Risk Integration Engine** - Composite operational risk scores at subnational levels across all 16 SADC Member States
- **Impact Scenario Builder** - Create, run, and compare disaster impact scenarios in minutes
- **Early Action Trigger Layer** - Pre-agreed trigger frameworks for anticipatory action across partner organizations
- **Sector Lenses** - Health/WASH, Food Security, Logistics, and Social Protection analytical overlays
- **Data Collection & Feedback** - KoboToolbox integration for field assessments with model improvement feedback loops
- **Collaboration Workspace** - Shared analytical environment for multi-partner coordination

## Screenshots

The platform features a professional dark-theme operational dashboard designed for disaster management operations centers, including:

- Regional risk overview with interactive maps
- Real-time event monitoring and alerting
- Scenario comparison tools
- Trigger monitoring with traffic-light status indicators
- Sector-specific analytical views

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

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

### Build for Production

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
│   │   ├── page.tsx            # Regional Risk Dashboard
│   │   ├── risk-monitor/       # Detailed Risk Monitor
│   │   ├── scenarios/          # Impact Scenario Builder
│   │   ├── triggers/           # Early Action Trigger Layer
│   │   ├── sectors/            # Sector Lenses hub + individual lenses
│   │   ├── data-collection/    # Kobo integration & assessments
│   │   ├── collaboration/      # Collaboration Workspace
│   │   └── settings/           # Platform settings
│   ├── components/
│   │   ├── layout/             # Sidebar, Header, AppShell
│   │   ├── dashboard/          # Dashboard components (map, charts, tables)
│   │   ├── scenarios/          # Scenario builder, comparison, results
│   │   ├── triggers/           # Trigger cards, timeline, config
│   │   ├── sectors/            # Sector lens components
│   │   └── ui/                 # Reusable UI components
│   └── lib/
│       ├── mock-data.ts        # Simulated SADC risk data
│       ├── utils.ts            # Utility functions
│       └── demo-data-readme.ts # Data source documentation
└── docs/
    └── SIRS Concept Note.docx  # Full concept note
```

## Demo Data

This prototype uses **simulated data** that is realistic and based on actual SADC geography, risk profiles, and partner workflows. See [`src/lib/demo-data-readme.ts`](app/src/lib/demo-data-readme.ts) for complete documentation of:

- What data is simulated vs. what would come from real sources
- Real data source APIs and endpoints for production integration
- Integration roadmap for connecting to INFORM, meteorological services, KoboToolbox, Google Earth Engine, DHIS2, and more

### What's Real in the Demo
- Map tiles and geography (OpenStreetMap)
- SADC member state positions and relationships
- Realistic risk score ranges based on INFORM methodology
- Accurate partner organization names, roles, and workflows
- Correct SADC institutional structure

### What's Simulated
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
| **GIZ / RIA** | Programme support, capacity building |
| **UNDP** | Technical partner, early recovery programming |
| **WFP** | Anticipatory action, logistics data |
| **IFRC** | Field data collection, community verification |
| **MapAction** | Cartographic standards, rapid mapping |
| **CIMA Foundation** | Hazard modelling, scientific validation |
| **AUC** | Continental alignment (AMHEWAS) |
| **Google** | Cloud infrastructure, Earth Engine, AI/ML |
| **KoboToolbox** | Mobile data collection platform |

## Implementation Roadmap

- **Phase 0 (Months 1-4)**: Co-design with SADC partners
- **Phase 1 (Months 5-12)**: Prototype and pilot in Mozambique and Malawi
- **Phase 2 (Months 13-24)**: Regional scaling to 4-6 additional Member States

## Contributing

We welcome contributions from the SADC DRR community and beyond. Please see our contributing guidelines (coming soon).

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## About

**SIRS** is developed by [7Square Inc.](https://7squareinc.com) - *Converting Africa's Challenges into Opportunities*

**Contact**: Ernest Moyo, Co-founder - ernest@7squareinc.com

---

*Prepared for the SADC DRR Community of Practice | Version 1.0 - February 2026*
