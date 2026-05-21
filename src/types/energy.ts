export type Timeframe = "today" | "week" | "month";

export interface UsageDataPoint {
  label: string;
  kwh: number;
  hour?: number;
}

export interface CostBreakdownItem {
  name: string;
  value: number;
  color: string;
}

export interface CostStats {
  estimated: number;
  savedThisMonth: number;
  potentialSavings: number;
}

export interface Recommendation {
  id: string;
  title: string;
  body: string;
}

export interface SourceCitation {
  label: string;
  citation: string;
  url: string;
}

export type AnalogyKey =
  | "openDoor"
  | "emptyRoad"
  | "rushHour"
  | "kettle"
  | "powerbar"
  | "cart"
  | "wind"
  | "sale";

export interface Analogy {
  key: AnalogyKey;
  title: string;
  body: string;
}

export interface AIResponse {
  text: string;
  highlightRange?: [number, number];
  analogy?: Analogy;
}

export interface SpikeDriver {
  icon: "washer" | "bulb" | "stove" | "car";
  label: string;
  share: string;
}

export interface HeatingUptimePoint {
  day: string;
  hours: number;
}

export interface RateSchedule {
  peakKRWPerKWh: number;
  offPeakKRWPerKWh: number;
  peakWindowLabel: string;
}

export interface AISummaryContent {
  shortSummary: string;
  longSummary: string;
  detailTitle: string;
  detailSubtitle: string;
  spikeDrivers: SpikeDriver[];
  tips: string[];
  dataNotes: string[];
  analogyKey: AnalogyKey;
  estimatedSaving: number;
  savingLabel: string;
}

export interface ChatSuggestion {
  id: string;
  text: string;
}

export type DashboardView = "dashboard" | "summary" | "recommendations";