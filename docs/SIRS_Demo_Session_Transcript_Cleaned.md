# SIRS Demo Session Transcript — SADC Pitch
## Date: February 2026
## Platform: SADC Impact Risk Studio (SIRS) by 7Square Inc.

---

## Participants

| Name | Organisation | Role |
|------|-------------|------|
| Dr. Pius Ngobe | SADC Secretariat | Moderator, DRR Unit |
| Olga Mayaka | UNDP | DRL and Resilience Analyst |
| Mark | UNDP | Planning Department / Global Initiative for Disaster Risk Management |
| Lusancho | African Union Commission | Project Coordinator, MMS Programme |
| Luis Chungwane | SHOC | IT |
| Dr. Marzi | JRC (Inforum), Italy | Data Analyst |
| Carmen | JRC / European Commission, ISPRA | Scientific Coordinator, Product Development |
| Daniel Suarez | MapAction / APECTION | INFORM support for SADC |
| Dr. Tselese Anthony (Karl-Heinz) | GIZ SADC Team | Co-advisor, based in Gaborone |
| Andrea Sardi | JRC | Inforum Warning |
| Benedetta | WFP | FAO/RUAG |
| Caroline | — | Early Warning / Anticipatory Action Expert |
| Ernest Moyo | 7Square Inc. | Co-founder, PhD Candidate, Presenter |
| Roden | 7Square Inc. / BitLinks | Co-founder, Automation & Systems Integration |

---

## Opening & Introductions

Dr. Pius Ngobe introduced the session, noting that Ernest Moyo is a PhD candidate inspired by the INFORM work being rolled out in the SADC region and has developed a prototype to showcase. All participants introduced themselves.

---

## Presentation: Ernest Moyo

Ernest introduced himself as a PhD student, mathematical modeller (malaria risk maps in Africa), and co-founder of 7Square. He highlighted his M&E department experience which sparked his interest in disaster preparedness and data science applications.

### Key Points from Slide Deck

**The Opportunity:**
- Risk information in Southern Africa has room for improvement
- INFORM produces sub-national risk scores; SHOC monitors active events; WFP runs anticipatory action triggers; IFRC deploys rapid assessment forms; MapAction produces situation maps via KOBO
- These systems operate independently — a SHOC duty officer, WFP programme manager, and NDMA director all look at different pictures of the same crisis
- SIRS aims to be a decision support layer that sits on top of INFORM and SHOC, turning fragmented multi-hazard data into shared operational impact-based products

**What SIRS Offers:**
- Pre-positioning supplies before a health crisis
- Anticipatory cash — which districts cross the threshold
- Impact scenarios — what happens if the cyclone shifts 50km south
- AI layer that surfaces what matters, drafts what takes hours, and flags what humans might miss

**Architecture:**
- Open source, available on GitHub
- Integration-ready with KOBO and other systems
- Roden's automation expertise (SAP background, API integration, sensor data)
- Currently using simulated data; real data integration via JRC API is the next step

**Risks Acknowledged:**
- Integration complexity
- Data security
- Coordination and frameworks
- Funding (resources follow authentic products)
- Potential duplication (open to contributing to existing efforts)

---

## Live Demo Highlights

Ernest demonstrated the SIRS platform:

1. **Dashboard** — Active events, country risk scores on click, risk score trends (10-day), country risk index
2. **Risk Monitor** — INFORM risk matrix showing country positions (probability vs impact), detailed risk breakdowns
3. **AI Chat Assistant** — Asked "which country is affected most by the cyclone?" and received accurate response pulling from live platform data (Mozambique)
4. **Scenarios** — Scenario creation (Cyclone Batsirai, wind speed 185km/h), publish workflow, AI-generated scenario briefs
5. **Triggers** — Live monitoring by status (red/amber/green), filterable by organisation (SADC, WFP) and by country
6. **Sector Lenses** — Four sectors with facility data, WASH infrastructure, road corridors, bridges affected
7. **Data Collection** — KOBO integration, assessment management, completion tracking
8. **Collaboration** — Active team tracking, real-time input visibility

---

## Feedback & Discussion

### Dr. Karl-Heinz (GIZ) — Risk-Informed Development

> "When we set up the INFORM Risk Model, we were thinking of using it for risk-informing development decisions — not just early warning."

- The INFORM subnational model was designed to help every sector reduce risk (e.g., increasing access to electricity reduces vulnerability)
- Challenged the team to think beyond emergency response — use INFORM to break silos and make DRM everyone's business
- Suggested decentralising risk information to sectoral development units and ministries
- Shared the full validated SADC INFORM model with all variables recognised by member states

### Daniel Suarez (MapAction) — Data Integration & Subnational

> "If you could show more how you're connecting with the INFORM data itself. And also the subnational aspect."

- Asked about data sources for cyclone predictions and other hazards
- Asked about trigger definitions and data sources
- Offered three follow-up areas:
  1. INFORM integration discussion
  2. Geospatial data advice from MapAction expertise
  3. Linking SIRS with SHOC tools (starting a support project)
- Will follow up by email for bilateral discussion

### Dr. Pius Ngobe (SADC Secretariat) — AI, Damage & Loss

> "I liked the AI capability... Maybe we could look at damage and loss overlay where you overlay damage with cost."

- Praised the AI integration
- Suggested extending risk scores to include damage and loss cost overlays
- Noted the dashboard fits very well with SHOC's mandate (preparedness and response)
- Called for bilateral between Ernest/team and MapAction/Daniel
- Emphasised SADC's commitment to applied research and regional integration

### Benedetta (WFP) — Cascading Effects Analysis

> "Can the model support analysis of potential cascading effects from an initial hazard?"

- Cyclone → flooding → landslide → health risks (2 days later from water pollution)
- Crisis trajectory with multiple triggers along the timeline
- Early warning at different stages of a cascading event
- Acknowledged complexity but highlighted its importance, especially based on past events

### Ntate/Tselese (GIZ) — Limitations & Complementarity

- Asked about noticeable limitations of the innovation
- Asked about complementary aspects to existing INFORM risk

### Caroline — Methodology & Operationalisation

- Asked about the validated risk-informed model methodology (could not find it online)
- Concerned about INFORM global indicators potentially skewing early warning applications
- Asked how SADC plans to operationalise with member states down to community level

### Mark (UNDP) — Methodology Confirmation

> "This is a composite indicator methodology based on global best practice across risk, vulnerability, and capacity."

- Methodology available on JRC website
- Detailed methodology document available for download

### Daniel Suarez — SADC Methodology Timeline

- SADC-specific methodology is work in progress (not yet public)
- Final validation workshop postponed from February due to Mozambique floods
- Aiming for April 2026 publication of both the model and methodology

---

## Roden's Response on Data Integration

> "What we then do on the actual implementation plan is to map all relevant data with different API endpoints."

- JRC API is open and stable — serves as the data foundation
- Plan: 10-point mapping of JRC API to SIRS database
- Domain experts needed for threshold and trigger definitions
- Platform answers: "How can I get real-time data in case of a disaster?"
- Sensor-related data integration from Roden's automation experience

---

## Closing Remarks

**Dr. Pius Ngobe:**
- Congratulated Ernest and team
- Clear way forward: applied research at SADC Secretariat
- Ernest to link up with MapAction and SHOC
- Webinars planned where Ernest will present enhanced versions
- SADC's motto: capacity development, regional integration

**Ernest Moyo:**
- Expressed deep gratitude
- Looking forward to participating in the community
- "Asante sana" (Thank you very much)

---

## Key Action Items

1. **Ernest + Daniel (MapAction)** — Bilateral on INFORM integration, geospatial data, SHOC tools
2. **Ernest + SADC Secretariat** — Explore hosting SIRS within SHOC
3. **Team** — Incorporate risk-informed development lens (not just emergency response)
4. **Team** — Explore cascading effects analysis capability (Benedetta/WFP request)
5. **Team** — Investigate damage and loss cost overlay feature (Dr. Ngobe suggestion)
6. **Team** — Map JRC API endpoints for real data integration
7. **Team** — Engage domain experts for trigger thresholds
8. **Daniel** — Share SADC INFORM methodology once published (target: April 2026)
