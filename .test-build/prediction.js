"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrediction = createPrediction;
const DISCLAIMER = "This is an unofficial weather-based prediction. It does not represent or know the actual HCPSS decision.";
function includesAny(text, terms) {
    const normalized = text.toLowerCase();
    return terms.some((term) => normalized.includes(term));
}
function parseHighestWindGust(...values) {
    return values.reduce((highest, value) => {
        const matches = value?.match(/\d+/g) ?? [];
        const localHighest = Math.max(0, ...matches.map(Number));
        return Math.max(highest, localHighest);
    }, 0);
}
function capScore(score) {
    return Math.max(0, Math.min(100, Math.round(score)));
}
function createPrediction({ weather, now = new Date() }) {
    let score = 12;
    const factors = [];
    const alertText = weather.alerts.map((alert) => `${alert.event} ${alert.headline}`).join(" ");
    const forecastText = [
        weather.shortForecast,
        weather.detailedForecast,
        weather.overnightForecast,
        weather.morningForecast,
        alertText
    ]
        .filter(Boolean)
        .join(" ");
    if (includesAny(alertText, ["winter storm warning", "ice storm warning"])) {
        score += 45;
        factors.push({ label: "A winter storm or ice storm warning is active.", weight: 45 });
    }
    else if (includesAny(alertText, ["winter weather advisory", "winter storm watch"])) {
        score += 24;
        factors.push({ label: "A winter weather advisory or watch is active.", weight: 24 });
    }
    if (includesAny(forecastText, ["freezing rain", "ice", "sleet", "wintry mix"])) {
        score += 34;
        factors.push({ label: "Forecast wording mentions freezing rain, ice, sleet, or a wintry mix.", weight: 34 });
    }
    const snowfall = weather.expectedSnowfallInches ?? 0;
    if (snowfall >= 4) {
        score += 38;
        factors.push({ label: `${snowfall} inches of snow are expected before the morning window.`, weight: 38 });
    }
    else if (snowfall >= 2) {
        score += 24;
        factors.push({ label: `${snowfall} inches of snow are expected before the morning window.`, weight: 24 });
    }
    else if (snowfall > 0) {
        score += 8;
        factors.push({ label: "Light snow is possible before the morning window.", weight: 8 });
    }
    const gust = parseHighestWindGust(weather.windGust, weather.windSpeed);
    if (gust >= 35 && includesAny(forecastText, ["snow", "ice", "sleet", "freezing rain"])) {
        score += 18;
        factors.push({ label: "Strong wind gusts could worsen snow or ice impacts.", weight: 18 });
    }
    else if (gust >= 40) {
        score += 10;
        factors.push({ label: "Strong wind gusts may affect travel or outdoor operations.", weight: 10 });
    }
    if (weather.currentTemperatureF !== null && weather.currentTemperatureF <= 12) {
        score += 14;
        factors.push({ label: "Very cold temperatures can increase delay risk.", weight: 14 });
    }
    const hour = now.getHours();
    if (hour >= 13 && includesAny(forecastText, ["snow", "ice", "freezing rain", "sleet"])) {
        score -= 12;
        factors.push({ label: "Wintry impacts appear more relevant after the morning commute.", weight: 12 });
    }
    const precipitationChance = weather.precipitationChance ?? 0;
    if (precipitationChance >= 70) {
        score += 8;
        factors.push({ label: "Precipitation chances are high in the near-term forecast.", weight: 8 });
    }
    const cappedScore = capScore(score);
    const riskLevel = cappedScore >= 68 ? "High" : cappedScore >= 38 ? "Medium" : "Low";
    let label = "Normal Operations Likely";
    if (cappedScore >= 72) {
        label = "Closure Possible";
    }
    else if (cappedScore >= 52) {
        label = "Delay Possible";
    }
    else if (cappedScore >= 38) {
        label = hour >= 10 && includesAny(forecastText, ["afternoon", "evening", "thunderstorm", "wind"])
            ? "Early Dismissal Possible"
            : "Monitor Conditions";
    }
    const topFactors = factors
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3)
        .map((factor) => factor.label);
    if (topFactors.length === 0) {
        topFactors.push("No major winter weather signal is present in the current NWS data.");
    }
    return {
        label,
        confidence: cappedScore,
        riskLevel,
        topFactors,
        explanation: cappedScore >= 68
            ? "Current weather signals suggest meaningful disruption risk, especially if timing overlaps the morning commute."
            : cappedScore >= 38
                ? "Some weather factors deserve attention, but the available data does not clearly point to a closure-level event."
                : "Current weather factors point toward routine operations, while conditions should still be monitored through official channels.",
        disclaimer: DISCLAIMER,
        generatedAt: new Date().toISOString()
    };
}
