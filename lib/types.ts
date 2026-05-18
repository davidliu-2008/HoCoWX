export type HcpssStatus = {
  heading: string;
  updateDate: string | null;
  operationStatus: string;
  message: string;
  sourceUrl: string;
  fetchedAt: string;
};

export type WeatherAlert = {
  event: string;
  severity: string;
  headline: string;
  description: string;
};

export type WeatherSummary = {
  location: string;
  currentTemperatureF: number | null;
  precipitationChance: number | null;
  expectedSnowfallInches: number | null;
  windSpeed: string | null;
  windGust: string | null;
  alerts: WeatherAlert[];
  overnightForecast: string | null;
  morningForecast: string | null;
  shortForecast: string | null;
  detailedForecast: string | null;
  forecastDiscussion: string | null;
  hourlyForecast: HourlyForecastPoint[];
  fetchedAt: string;
};

export type HourlyForecastPoint = {
  time: string;
  temperatureF: number;
  precipitationChance: number | null;
  windSpeed: string;
  windGust: string | null;
  shortForecast: string;
};

export type PredictionInput = {
  weather: WeatherSummary;
  now?: Date;
};

export type PredictionFactor = {
  label: string;
  points: number;
};

export type PredictionResult = {
  label:
    | "Normal Operations Likely"
    | "Delay Possible"
    | "Closure Possible"
    | "Early Dismissal Possible"
    | "Monitor Conditions";
  confidence: number;
  riskLevel: "Low" | "Medium" | "High";
  topFactors: string[];
  scoreBreakdown: PredictionFactor[];
  morningCommuteRisk: {
    label: "Low" | "Medium" | "High";
    score: number;
    factors: string[];
    explanation: string;
  };
  explanation: string;
  disclaimer: string;
  generatedAt: string;
};
