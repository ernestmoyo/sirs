/**
 * SIRS Demo Data Documentation
 * =============================
 *
 * This file documents which data in the SIRS prototype is simulated/mock
 * and which would come from real data sources in production.
 *
 * DATA SOURCE MAPPING:
 *
 * 1. COUNTRY RISK SCORES (mock-data.ts: sadcCountries)
 *    - Status: SIMULATED
 *    - Real source: INFORM Subnational Risk Index for SADC
 *    - Update frequency: Annual baseline, enriched with dynamic indicators
 *    - API: Would connect to INFORM API (https://drmkc.jrc.ec.europa.eu/inform-index)
 *
 * 2. DISTRICT-LEVEL DATA (mock-data.ts: sadcCountries[].districts)
 *    - Status: SIMULATED with realistic values
 *    - Real source: National statistics offices, WorldPop/GRID3 for population
 *    - Facility counts: DHIS2 (health), national WASH databases, education MIS
 *
 * 3. ACTIVE EVENTS (mock-data.ts: activeEvents)
 *    - Status: SIMULATED based on realistic SADC scenarios
 *    - Real source:
 *      - Cyclones: RSMC La Reunion, JTWC, via WMO/GTS protocols
 *      - Floods: National hydro-met services, Copernicus EMS
 *      - Drought: FEWS NET, SADC CSC seasonal forecasts
 *    - Update frequency: Every 6 hours for cyclones, 3 hours for rainfall
 *
 * 4. TRIGGER CONFIGURATIONS (mock-data.ts: triggers)
 *    - Status: SIMULATED partner trigger rules
 *    - Real source: Partner-defined thresholds configured during co-design
 *    - Partners: WFP (anticipatory action), IFRC (DREF), NDMAs, SADC
 *
 * 5. SCENARIOS (mock-data.ts: scenarios)
 *    - Status: SIMULATED scenario runs
 *    - Real source: Would be computed by SIRS Scenario Engine using:
 *      - CIMA Foundation flood models
 *      - Cyclone wind field models
 *      - DEM data for inundation
 *      - Exposure/vulnerability layers
 *
 * 6. ASSESSMENTS (mock-data.ts: assessments)
 *    - Status: SIMULATED KoboToolbox integration
 *    - Real source: KoboToolbox REST API
 *    - Forms: Standard SIRS assessment forms deployed via Kobo
 *
 * 7. RISK TIME SERIES (mock-data.ts: riskTimeSeries)
 *    - Status: SIMULATED 10-day trend
 *    - Real source: SIRS Risk Integration Engine computed every 6 hours
 *
 * 8. MAP DATA
 *    - Status: Real OpenStreetMap tiles via Leaflet
 *    - Cyclone tracks: SIMULATED (real source: RSMC forecast tracks)
 *    - Country boundaries: Would use SADC official admin boundaries
 *
 * 9. SECTOR LENS DATA
 *    - Health/WASH: SIMULATED facility data (real: DHIS2, facility master lists)
 *    - Food Security: SIMULATED IPC data (real: IPC/CH, FEWS NET, WFP mVAM)
 *    - Logistics: SIMULATED road/bridge data (real: logistics cluster, OSM)
 *    - Social Protection: SIMULATED (real: national beneficiary registries)
 *
 * 10. SATELLITE/EARTH OBSERVATION
 *    - Status: NOT YET INTEGRATED
 *    - Real source: Google Earth Engine APIs for:
 *      - Near-real-time flood extent (Sentinel-1 SAR)
 *      - Vegetation health (NDVI from MODIS/Sentinel-2)
 *      - Building damage classification (AI/ML post-event)
 *
 * WHAT'S REAL IN THIS DEMO:
 * - Map tiles and geography (OpenStreetMap)
 * - Country coordinates and relative positions
 * - SADC member state list (all 16 members)
 * - Realistic risk score ranges based on INFORM methodology
 * - Realistic event types and partner workflows
 * - Accurate partner organization names and roles
 * - Correct SADC institutional structure
 *
 * PRODUCTION INTEGRATION ROADMAP:
 * Phase 0: Connect INFORM API for baseline risk scores
 * Phase 1: Connect meteorological feeds (RSMC, national services)
 * Phase 1: Connect KoboToolbox API for field assessments
 * Phase 1: Connect Google Earth Engine for satellite data
 * Phase 2: Connect DHIS2 for health facility data
 * Phase 2: Connect WFP/IFRC systems for trigger management
 * Phase 2: OGC services (WMS/WFS) for GIS interoperability
 */

export const DATA_SOURCES = {
  inform: {
    name: "INFORM Subnational Risk Index",
    status: "simulated",
    realEndpoint: "https://drmkc.jrc.ec.europa.eu/inform-index/API",
    refreshInterval: "annual",
  },
  meteorological: {
    name: "Meteorological Forecast Feeds",
    status: "simulated",
    realEndpoint: "RSMC La Reunion / National Met Services",
    refreshInterval: "6 hours",
  },
  kobo: {
    name: "KoboToolbox",
    status: "simulated",
    realEndpoint: "https://kf.kobotoolbox.org/api/v2/",
    refreshInterval: "real-time",
  },
  earthEngine: {
    name: "Google Earth Engine",
    status: "not_integrated",
    realEndpoint: "Earth Engine REST API",
    refreshInterval: "near-real-time",
  },
  dhis2: {
    name: "DHIS2 Health Information",
    status: "simulated",
    realEndpoint: "National DHIS2 instances",
    refreshInterval: "monthly",
  },
  copernicus: {
    name: "Copernicus EMS",
    status: "not_integrated",
    realEndpoint: "https://emergency.copernicus.eu/",
    refreshInterval: "event-based",
  },
} as const;
