"use client";

import { useState, useMemo } from "react";
import {
  X,
  Plus,
  Trash2,
  Eye,
  Save,
  Building2,
  MapPin,
  Activity,
  Bell,
  Layers,
  ChevronDown,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  ReferenceLine,
} from "recharts";
import { sadcCountries } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface TriggerConfigFormProps {
  onClose: () => void;
  onSave?: (config: FormState) => void;
}

interface TriggerLevel {
  name: string;
  threshold: number;
  color: "green" | "amber" | "red";
  actions: string;
}

interface FormState {
  organization: string;
  country: string;
  metric: string;
  thresholdValue: number;
  recipients: string[];
  levels: TriggerLevel[];
}

const organizations = [
  "WFP",
  "IFRC",
  "SADC",
  "UNICEF",
  "WHO",
  "FAO",
  "UNDP",
  "OCHA",
  "NDMA Mozambique",
  "NDMA Malawi",
  "Tanzania NDMA",
];

const countries = [
  "Regional",
  ...sadcCountries.map((c) => c.name).sort(),
];

const metrics = [
  "Composite Flood Risk Score",
  "Cyclone Impact Score",
  "Composite Risk Score",
  "Food Insecurity Risk Score",
  "Urban Flood Risk Score",
  "Multi-Country Risk Index",
  "Drought Severity Index",
  "Displacement Risk Score",
  "Health Emergency Index",
  "WASH Vulnerability Score",
];

// Mock sparkline data for preview
function generatePreviewData(
  threshold: number,
  levels: TriggerLevel[]
): { value: number; date: string }[] {
  const points = [];
  const baseValue = threshold * 0.5;
  for (let i = 0; i < 7; i++) {
    const noise = (Math.sin(i * 1.3) * 0.15 + Math.cos(i * 0.7) * 0.1);
    const trend = (i / 6) * threshold * 0.6;
    const value = Math.max(0, Math.min(1, baseValue + trend + noise));
    points.push({
      value: Number(value.toFixed(3)),
      date: `Day ${i + 1}`,
    });
  }
  return points;
}

function SelectField({
  label,
  icon: Icon,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-600/50 bg-slate-800/80 px-3 py-2.5 text-sm text-slate-200 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors cursor-pointer"
        >
          <option value="" className="bg-slate-800">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-800">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

export default function TriggerConfigForm({
  onClose,
  onSave,
}: TriggerConfigFormProps) {
  const [formState, setFormState] = useState<FormState>({
    organization: "",
    country: "",
    metric: "",
    thresholdValue: 0.7,
    recipients: [""],
    levels: [
      {
        name: "Readiness",
        threshold: 0.5,
        color: "amber",
        actions: "Alert duty officers, review contingency plans",
      },
      {
        name: "Activation",
        threshold: 0.7,
        color: "red",
        actions:
          "Activate response, release pre-positioned stocks, deploy teams",
      },
      {
        name: "Stand-down",
        threshold: 0.35,
        color: "green",
        actions: "Deactivate trigger, file after-action report",
      },
    ],
  });

  const [showPreview, setShowPreview] = useState(true);

  const previewData = useMemo(
    () => generatePreviewData(formState.thresholdValue, formState.levels),
    [formState.thresholdValue, formState.levels]
  );

  // Determine preview status based on last preview data point
  const previewCurrentValue = previewData[previewData.length - 1]?.value ?? 0;
  const previewStatus: "red" | "amber" | "green" =
    previewCurrentValue >= formState.thresholdValue
      ? "red"
      : previewCurrentValue >= formState.levels[0]?.threshold
      ? "amber"
      : "green";

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const addRecipient = () => {
    updateField("recipients", [...formState.recipients, ""]);
  };

  const removeRecipient = (idx: number) => {
    updateField(
      "recipients",
      formState.recipients.filter((_, i) => i !== idx)
    );
  };

  const updateRecipient = (idx: number, value: string) => {
    const updated = [...formState.recipients];
    updated[idx] = value;
    updateField("recipients", updated);
  };

  const updateLevel = (idx: number, field: keyof TriggerLevel, value: string | number) => {
    const updated = [...formState.levels];
    updated[idx] = { ...updated[idx], [field]: value };
    updateField("levels", updated);
  };

  const handleSave = () => {
    onSave?.(formState);
    onClose();
  };

  const isValid =
    formState.organization &&
    formState.country &&
    formState.metric &&
    formState.thresholdValue > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-400" />
              Configure New Trigger
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Set up an anticipatory action trigger with multi-level
              thresholds
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Form section */}
          <div className="flex-1 p-6 space-y-6">
            {/* Organization, Country, Metric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Organization"
                icon={Building2}
                value={formState.organization}
                options={organizations}
                onChange={(val) => updateField("organization", val)}
                placeholder="Select organization..."
              />
              <SelectField
                label="Country / Region"
                icon={MapPin}
                value={formState.country}
                options={countries}
                onChange={(val) => updateField("country", val)}
                placeholder="Select country..."
              />
            </div>

            <SelectField
              label="Metric"
              icon={Activity}
              value={formState.metric}
              options={metrics}
              onChange={(val) => updateField("metric", val)}
              placeholder="Select monitoring metric..."
            />

            {/* Threshold slider */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                <Activity className="h-3.5 w-3.5" />
                Primary Activation Threshold
              </label>
              <div className="rounded-lg border border-slate-600/50 bg-slate-800/80 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-slate-100 tabular-nums">
                    {formState.thresholdValue.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Normal
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Warning
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Activated
                    </span>
                  </div>
                </div>

                {/* Slider track with gradient */}
                <div className="relative">
                  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500/40 via-amber-500/40 to-red-500/40" />
                  <input
                    type="range"
                    min="0.1"
                    max="0.95"
                    step="0.01"
                    value={formState.thresholdValue}
                    onChange={(e) =>
                      updateField(
                        "thresholdValue",
                        parseFloat(e.target.value)
                      )
                    }
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                  />
                  {/* Custom thumb */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white border-2 border-blue-500 shadow-lg pointer-events-none transition-all"
                    style={{
                      left: `calc(${
                        ((formState.thresholdValue - 0.1) / 0.85) * 100
                      }% - 10px)`,
                      marginTop: "-3px",
                    }}
                  />
                </div>

                <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                  <span>0.10</span>
                  <span>0.50</span>
                  <span>0.95</span>
                </div>
              </div>
            </div>

            {/* Multi-level trigger setup */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                <Layers className="h-3.5 w-3.5" />
                Multi-Level Trigger Configuration
              </label>
              <div className="space-y-3">
                {formState.levels.map((level, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-lg border p-4 transition-colors",
                      level.color === "red"
                        ? "border-red-500/30 bg-red-500/5"
                        : level.color === "amber"
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-emerald-500/30 bg-emerald-500/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-3 w-3 rounded-full",
                            level.color === "red"
                              ? "bg-red-500"
                              : level.color === "amber"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          )}
                        />
                        <span className="text-sm font-semibold text-slate-200">
                          {level.color === "red" && (
                            <Zap className="h-3.5 w-3.5 inline mr-1 text-red-400" />
                          )}
                          {level.color === "amber" && (
                            <AlertTriangle className="h-3.5 w-3.5 inline mr-1 text-amber-400" />
                          )}
                          {level.color === "green" && (
                            <CheckCircle2 className="h-3.5 w-3.5 inline mr-1 text-emerald-400" />
                          )}
                          {level.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          Threshold:
                        </span>
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={level.threshold}
                          onChange={(e) =>
                            updateLevel(
                              idx,
                              "threshold",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 rounded-md border border-slate-600/50 bg-slate-800/80 px-2 py-1 text-sm text-slate-200 text-center tabular-nums focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                        Actions on trigger
                      </label>
                      <textarea
                        value={level.actions}
                        onChange={(e) =>
                          updateLevel(idx, "actions", e.target.value)
                        }
                        rows={2}
                        className="mt-1 w-full rounded-md border border-slate-600/40 bg-slate-800/60 px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none"
                        placeholder="Describe actions to take when this level is reached..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert recipients */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                <Bell className="h-3.5 w-3.5" />
                Alert Recipients
              </label>
              <div className="space-y-2">
                {formState.recipients.map((recipient, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                      <input
                        type="email"
                        value={recipient}
                        onChange={(e) =>
                          updateRecipient(idx, e.target.value)
                        }
                        placeholder="email@organization.org"
                        className="w-full rounded-lg border border-slate-600/50 bg-slate-800/80 pl-9 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors"
                      />
                    </div>
                    {formState.recipients.length > 1 && (
                      <button
                        onClick={() => removeRecipient(idx)}
                        className="rounded-md p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addRecipient}
                  className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-600/50 px-3 py-2 text-xs text-slate-400 hover:text-slate-300 hover:border-slate-500/50 hover:bg-slate-800/30 transition-colors w-full justify-center"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Recipient
                </button>
              </div>
            </div>
          </div>

          {/* Preview section */}
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-700/50 bg-slate-800/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Eye className="h-4 w-4 text-slate-400" />
                Preview
              </h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPreview ? "Hide" : "Show"}
              </button>
            </div>

            {showPreview && (
              <div className="space-y-4">
                {/* Preview card */}
                <div
                  className={cn(
                    "rounded-xl border bg-slate-800/50 p-4 transition-all",
                    previewStatus === "red"
                      ? "border-red-500/30"
                      : previewStatus === "amber"
                      ? "border-amber-500/30"
                      : "border-slate-700/50"
                  )}
                >
                  {/* Status dot + name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full",
                        previewStatus === "red"
                          ? "bg-red-500 animate-pulse-red"
                          : previewStatus === "amber"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      )}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {formState.organization && formState.metric
                          ? `${formState.organization} - ${formState.country || "..."}`
                          : "Your Trigger Name"}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {formState.metric || "Select a metric"}
                      </div>
                    </div>
                  </div>

                  {/* Preview value */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className={cn(
                        "text-xl font-bold tabular-nums",
                        previewStatus === "red"
                          ? "text-red-400"
                          : previewStatus === "amber"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      )}
                    >
                      {previewCurrentValue.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      / {formState.thresholdValue.toFixed(2)}
                    </span>
                  </div>

                  {/* Preview progress */}
                  <div
                    className={cn(
                      "h-1.5 rounded-full overflow-hidden mb-2",
                      previewStatus === "red"
                        ? "bg-red-500/10"
                        : previewStatus === "amber"
                        ? "bg-amber-500/10"
                        : "bg-emerald-500/10"
                    )}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full",
                        previewStatus === "red"
                          ? "bg-red-500"
                          : previewStatus === "amber"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      )}
                      style={{
                        width: `${Math.min(
                          (previewCurrentValue /
                            formState.thresholdValue) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  {/* Preview sparkline */}
                  <div className="h-10 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={previewData}>
                        <YAxis domain={[0, 1]} hide />
                        <ReferenceLine
                          y={formState.thresholdValue}
                          stroke="#64748b"
                          strokeDasharray="3 3"
                          strokeWidth={1}
                        />
                        {formState.levels[0] && (
                          <ReferenceLine
                            y={formState.levels[0].threshold}
                            stroke="#f59e0b"
                            strokeDasharray="2 4"
                            strokeWidth={0.5}
                          />
                        )}
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={
                            previewStatus === "red"
                              ? "#ef4444"
                              : previewStatus === "amber"
                              ? "#f59e0b"
                              : "#10b981"
                          }
                          strokeWidth={1.5}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Trigger levels preview */}
                <div>
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">
                    Trigger Levels
                  </h4>
                  <div className="space-y-1.5">
                    {formState.levels
                      .sort((a, b) => b.threshold - a.threshold)
                      .map((level, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-md border border-slate-700/30 bg-slate-800/40 px-3 py-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                level.color === "red"
                                  ? "bg-red-500"
                                  : level.color === "amber"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              )}
                            />
                            <span className="text-xs text-slate-300">
                              {level.name}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-400 tabular-nums">
                            {level.threshold.toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Configuration summary */}
                {formState.organization && (
                  <div>
                    <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-2">
                      Summary
                    </h4>
                    <div className="rounded-md border border-slate-700/30 bg-slate-800/40 px-3 py-2 text-xs text-slate-400 space-y-1">
                      <p>
                        <span className="text-slate-500">Org:</span>{" "}
                        <span className="text-slate-300">
                          {formState.organization}
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-500">Area:</span>{" "}
                        <span className="text-slate-300">
                          {formState.country || "--"}
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-500">Metric:</span>{" "}
                        <span className="text-slate-300">
                          {formState.metric || "--"}
                        </span>
                      </p>
                      <p>
                        <span className="text-slate-500">Recipients:</span>{" "}
                        <span className="text-slate-300">
                          {formState.recipients.filter((r) => r).length || 0}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 flex items-center justify-between border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-sm px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={cn(
                "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all",
                isValid
                  ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                  : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
              )}
            >
              <Save className="h-4 w-4" />
              Save Trigger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
