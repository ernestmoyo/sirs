"use client";

import { useState } from "react";
import { sadcCountries } from "@/lib/mock-data";
import {
  CloudLightning,
  Droplets,
  Sun,
  ChevronRight,
  ChevronLeft,
  Check,
  Play,
  Zap,
  Wind,
  Gauge,
  Waves,
  Thermometer,
  CloudRain,
  MapPin,
  X,
} from "lucide-react";

// ---- Types ----

type HazardType = "cyclone" | "flood" | "drought";

interface HazardOption {
  type: HazardType;
  icon: typeof CloudLightning;
  label: string;
  description: string;
  color: string;
  bg: string;
  border: string;
  ring: string;
}

interface CycloneParams {
  windSpeed: number;
  stormSurge: number;
  rainfallMm: number;
  category: number;
}

interface FloodParams {
  rainfallMm: number;
  riverLevel: number;
  returnPeriod: number;
  durationHours: number;
}

interface DroughtParams {
  rainfallDeficit: number;
  durationMonths: number;
  soilMoisture: number;
  temperatureAnomaly: number;
}

type HazardParams = CycloneParams | FloodParams | DroughtParams;

// ---- Constants ----

const hazardOptions: HazardOption[] = [
  {
    type: "cyclone",
    icon: CloudLightning,
    label: "Tropical Cyclone",
    description:
      "Model cyclone landfall scenarios with configurable wind speed, storm surge, and rainfall intensity.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    ring: "ring-violet-500/40",
  },
  {
    type: "flood",
    icon: Droplets,
    label: "Riverine / Urban Flood",
    description:
      "Simulate flooding from sustained rainfall, river overflow, or urban drainage failure with return period analysis.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    ring: "ring-blue-500/40",
  },
  {
    type: "drought",
    icon: Sun,
    label: "Drought / Dry Spell",
    description:
      "Assess slow-onset drought impacts on livelihoods, food security, and water availability across SADC member states.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    ring: "ring-amber-500/40",
  },
];

const steps = [
  { number: 1, label: "Hazard Type" },
  { number: 2, label: "Parameters" },
  { number: 3, label: "Geography" },
  { number: 4, label: "Review & Run" },
];

const defaultCycloneParams: CycloneParams = {
  windSpeed: 150,
  stormSurge: 2.5,
  rainfallMm: 250,
  category: 3,
};

const defaultFloodParams: FloodParams = {
  rainfallMm: 200,
  riverLevel: 8.5,
  returnPeriod: 50,
  durationHours: 72,
};

const defaultDroughtParams: DroughtParams = {
  rainfallDeficit: 40,
  durationMonths: 4,
  soilMoisture: 25,
  temperatureAnomaly: 2.5,
};

// ---- Helpers ----

function getCycloneCategory(windSpeed: number): number {
  if (windSpeed >= 252) return 5;
  if (windSpeed >= 209) return 4;
  if (windSpeed >= 178) return 3;
  if (windSpeed >= 154) return 2;
  if (windSpeed >= 119) return 1;
  return 0;
}

// ---- Sub-components ----

function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  icon: Icon,
  onChange,
  colorClass = "accent-blue-500",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: typeof Wind;
  onChange: (v: number) => void;
  colorClass?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Icon className="h-4 w-4 text-slate-500" />
          {label}
        </div>
        <div className="rounded-md bg-slate-800 px-2.5 py-1 text-sm font-semibold text-slate-100 tabular-nums">
          {value}
          <span className="ml-0.5 text-xs font-normal text-slate-500">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-700 ${colorClass} [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-current [&::-webkit-slider-thumb]:shadow-lg`}
        style={
          {
            background: `linear-gradient(to right, currentColor ${pct}%, rgb(51 65 85) ${pct}%)`,
          } as React.CSSProperties
        }
      />
      <div className="mt-1 flex justify-between text-[10px] text-slate-600">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

// ---- Main component ----

interface ScenarioBuilderProps {
  onClose: () => void;
  onComplete?: (scenario: {
    name: string;
    type: HazardType;
    params: HazardParams;
    countries: string[];
    description: string;
  }) => void;
}

export default function ScenarioBuilder({ onClose, onComplete }: ScenarioBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<HazardType | null>(null);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioDescription, setScenarioDescription] = useState("");

  // Params per type
  const [cycloneParams, setCycloneParams] = useState<CycloneParams>(defaultCycloneParams);
  const [floodParams, setFloodParams] = useState<FloodParams>(defaultFloodParams);
  const [droughtParams, setDroughtParams] = useState<DroughtParams>(defaultDroughtParams);

  // Geography
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  // Derived
  const currentParams: HazardParams | null =
    selectedType === "cyclone"
      ? cycloneParams
      : selectedType === "flood"
        ? floodParams
        : selectedType === "drought"
          ? droughtParams
          : null;

  const canAdvance = (): boolean => {
    switch (currentStep) {
      case 1:
        return selectedType !== null;
      case 2:
        return currentParams !== null;
      case 3:
        return selectedCountries.length > 0;
      case 4:
        return scenarioName.trim().length > 0;
      default:
        return false;
    }
  };

  const toggleCountry = (countryName: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryName)
        ? prev.filter((c) => c !== countryName)
        : [...prev, countryName]
    );
  };

  const handleRun = () => {
    if (!selectedType || !currentParams) return;
    onComplete?.({
      name: scenarioName,
      type: selectedType,
      params: currentParams,
      countries: selectedCountries,
      description: scenarioDescription,
    });
  };

  // ---- Step Renderers ----

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-slate-100">Select Hazard Type</h3>
        <p className="text-sm text-slate-400">
          Choose the type of natural hazard to model. Each type provides specific parameters
          relevant to SADC regional risk analysis.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {hazardOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => setSelectedType(opt.type)}
              className={`group relative flex flex-col items-center rounded-xl border p-6 text-center transition-all duration-200 ${
                isSelected
                  ? `${opt.border} ${opt.bg} ring-1 ${opt.ring}`
                  : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${opt.bg} ${opt.border} border`}
                  >
                    <Check className={`h-3 w-3 ${opt.color}`} />
                  </div>
                </div>
              )}
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${opt.bg} ${opt.border} border`}
              >
                <Icon className={`h-7 w-7 ${opt.color}`} />
              </div>
              <h4 className="mb-1.5 text-sm font-semibold text-slate-200">{opt.label}</h4>
              <p className="text-xs leading-relaxed text-slate-500">{opt.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderCycloneParams = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <RangeSlider
        label="Wind Speed"
        value={cycloneParams.windSpeed}
        min={60}
        max={300}
        step={5}
        unit=" km/h"
        icon={Wind}
        colorClass="accent-violet-500 text-violet-500"
        onChange={(v) =>
          setCycloneParams({ ...cycloneParams, windSpeed: v, category: getCycloneCategory(v) })
        }
      />
      <RangeSlider
        label="Storm Surge"
        value={cycloneParams.stormSurge}
        min={0.5}
        max={8}
        step={0.1}
        unit=" m"
        icon={Waves}
        colorClass="accent-violet-500 text-violet-500"
        onChange={(v) => setCycloneParams({ ...cycloneParams, stormSurge: v })}
      />
      <RangeSlider
        label="Rainfall Intensity"
        value={cycloneParams.rainfallMm}
        min={50}
        max={600}
        step={10}
        unit=" mm"
        icon={CloudRain}
        colorClass="accent-violet-500 text-violet-500"
        onChange={(v) => setCycloneParams({ ...cycloneParams, rainfallMm: v })}
      />
      <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Zap className="h-4 w-4 text-slate-500" />
          Saffir-Simpson Category
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((cat) => (
            <div
              key={cat}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                cycloneParams.category >= cat
                  ? cat >= 4
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : cat >= 3
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "bg-slate-800/50 text-slate-600 border border-slate-700/30"
              }`}
            >
              {cat}
            </div>
          ))}
          <span className="ml-2 text-xs text-slate-500">
            Cat {cycloneParams.category} ({cycloneParams.windSpeed} km/h)
          </span>
        </div>
      </div>
    </div>
  );

  const renderFloodParams = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <RangeSlider
        label="Total Rainfall"
        value={floodParams.rainfallMm}
        min={50}
        max={500}
        step={10}
        unit=" mm"
        icon={CloudRain}
        colorClass="accent-blue-500 text-blue-500"
        onChange={(v) => setFloodParams({ ...floodParams, rainfallMm: v })}
      />
      <RangeSlider
        label="River Level"
        value={floodParams.riverLevel}
        min={2}
        max={15}
        step={0.1}
        unit=" m"
        icon={Waves}
        colorClass="accent-blue-500 text-blue-500"
        onChange={(v) => setFloodParams({ ...floodParams, riverLevel: v })}
      />
      <RangeSlider
        label="Return Period"
        value={floodParams.returnPeriod}
        min={5}
        max={500}
        step={5}
        unit=" yr"
        icon={Gauge}
        colorClass="accent-blue-500 text-blue-500"
        onChange={(v) => setFloodParams({ ...floodParams, returnPeriod: v })}
      />
      <RangeSlider
        label="Duration"
        value={floodParams.durationHours}
        min={6}
        max={168}
        step={6}
        unit=" hrs"
        icon={Gauge}
        colorClass="accent-blue-500 text-blue-500"
        onChange={(v) => setFloodParams({ ...floodParams, durationHours: v })}
      />
    </div>
  );

  const renderDroughtParams = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <RangeSlider
        label="Rainfall Deficit"
        value={droughtParams.rainfallDeficit}
        min={10}
        max={80}
        step={5}
        unit="%"
        icon={CloudRain}
        colorClass="accent-amber-500 text-amber-500"
        onChange={(v) => setDroughtParams({ ...droughtParams, rainfallDeficit: v })}
      />
      <RangeSlider
        label="Duration"
        value={droughtParams.durationMonths}
        min={1}
        max={12}
        step={1}
        unit=" mo"
        icon={Gauge}
        colorClass="accent-amber-500 text-amber-500"
        onChange={(v) => setDroughtParams({ ...droughtParams, durationMonths: v })}
      />
      <RangeSlider
        label="Soil Moisture"
        value={droughtParams.soilMoisture}
        min={5}
        max={60}
        step={1}
        unit="%"
        icon={Droplets}
        colorClass="accent-amber-500 text-amber-500"
        onChange={(v) => setDroughtParams({ ...droughtParams, soilMoisture: v })}
      />
      <RangeSlider
        label="Temperature Anomaly"
        value={droughtParams.temperatureAnomaly}
        min={0}
        max={6}
        step={0.5}
        unit=" C"
        icon={Thermometer}
        colorClass="accent-amber-500 text-amber-500"
        onChange={(v) => setDroughtParams({ ...droughtParams, temperatureAnomaly: v })}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-slate-100">Configure Parameters</h3>
        <p className="text-sm text-slate-400">
          Adjust the hazard parameters below. These values drive the impact estimation model.
        </p>
      </div>
      {selectedType === "cyclone" && renderCycloneParams()}
      {selectedType === "flood" && renderFloodParams()}
      {selectedType === "drought" && renderDroughtParams()}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-slate-100">Select Geography</h3>
        <p className="text-sm text-slate-400">
          Choose one or more SADC member states. The model will estimate impact across all
          districts within the selected countries.
        </p>
      </div>

      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCountries.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400"
            >
              <MapPin className="h-3 w-3" />
              {name}
              <button
                onClick={() => toggleCountry(name)}
                className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-blue-500/20"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sadcCountries.map((country) => {
          const isSelected = selectedCountries.includes(country.name);
          return (
            <button
              key={country.id}
              onClick={() => toggleCountry(country.name)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                isSelected
                  ? "border-blue-500/40 bg-blue-500/10"
                  : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600/60 hover:bg-slate-800/50"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isSelected
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {country.code}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-200">{country.name}</div>
                <div className="text-[10px] text-slate-500">
                  Pop: {(country.population / 1_000_000).toFixed(1)}M
                </div>
              </div>
              {isSelected && <Check className="h-4 w-4 shrink-0 text-blue-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep4 = () => {
    const typeOpt = hazardOptions.find((h) => h.type === selectedType);
    const TypeIcon = typeOpt?.icon ?? CloudLightning;

    return (
      <div className="space-y-5">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-slate-100">Review & Run</h3>
          <p className="text-sm text-slate-400">
            Name your scenario, review the configuration, and launch the impact model.
          </p>
        </div>

        {/* Name & description */}
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Scenario Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="e.g., Cyclone Cat 3 - Sofala Landfall"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Description (optional)
            </label>
            <textarea
              value={scenarioDescription}
              onChange={(e) => setScenarioDescription(e.target.value)}
              rows={3}
              placeholder="Describe the scenario assumptions and purpose..."
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
            />
          </div>
        </div>

        {/* Review summary */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5">
          <h4 className="mb-3 text-sm font-semibold text-slate-300">Configuration Summary</h4>
          <div className="space-y-3">
            {/* Hazard type */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg border ${typeOpt?.bg} ${typeOpt?.border}`}
              >
                <TypeIcon className={`h-4.5 w-4.5 ${typeOpt?.color}`} />
              </div>
              <div>
                <div className="text-xs text-slate-500">Hazard Type</div>
                <div className="text-sm font-medium text-slate-200">{typeOpt?.label}</div>
              </div>
            </div>

            {/* Parameters summary */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {selectedType === "cyclone" && (
                <>
                  <SummaryChip label="Wind Speed" value={`${cycloneParams.windSpeed} km/h`} />
                  <SummaryChip label="Storm Surge" value={`${cycloneParams.stormSurge} m`} />
                  <SummaryChip label="Rainfall" value={`${cycloneParams.rainfallMm} mm`} />
                  <SummaryChip label="Category" value={`Cat ${cycloneParams.category}`} />
                </>
              )}
              {selectedType === "flood" && (
                <>
                  <SummaryChip label="Rainfall" value={`${floodParams.rainfallMm} mm`} />
                  <SummaryChip label="River Level" value={`${floodParams.riverLevel} m`} />
                  <SummaryChip label="Return Period" value={`${floodParams.returnPeriod} yr`} />
                  <SummaryChip label="Duration" value={`${floodParams.durationHours} hrs`} />
                </>
              )}
              {selectedType === "drought" && (
                <>
                  <SummaryChip label="Deficit" value={`${droughtParams.rainfallDeficit}%`} />
                  <SummaryChip label="Duration" value={`${droughtParams.durationMonths} mo`} />
                  <SummaryChip label="Soil Moisture" value={`${droughtParams.soilMoisture}%`} />
                  <SummaryChip label="Temp. Anomaly" value={`+${droughtParams.temperatureAnomaly}C`} />
                </>
              )}
            </div>

            {/* Countries */}
            <div>
              <div className="mb-1.5 text-xs text-slate-500">Geography</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCountries.map((c) => (
                  <span
                    key={c}
                    className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---- Render ----

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700/50 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100">New Impact Scenario</h2>
            <p className="text-xs text-slate-500">
              Step {currentStep} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress stepper */}
        <div className="border-b border-slate-800 px-6 py-3">
          <div className="flex items-center gap-1">
            {steps.map((step, idx) => {
              const isActive = step.number === currentStep;
              const isComplete = step.number < currentStep;
              return (
                <div key={step.number} className="flex items-center gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        isComplete
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isActive
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-slate-800 text-slate-600 border border-slate-700/30"
                      }`}
                    >
                      {isComplete ? <Check className="h-3.5 w-3.5" /> : step.number}
                    </div>
                    <span
                      className={`hidden text-xs font-medium sm:inline ${
                        isActive ? "text-slate-200" : isComplete ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`mx-2 h-px flex-1 ${
                        isComplete ? "bg-emerald-500/30" : "bg-slate-800"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
          <button
            onClick={() => (currentStep === 1 ? onClose() : setCurrentStep((s) => s - 1))}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleRun}
              disabled={!canAdvance()}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play className="h-4 w-4" />
              Run Scenario
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Small helper component ----

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800/60 px-3 py-2 text-center">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className="text-xs font-semibold text-slate-200">{value}</div>
    </div>
  );
}
