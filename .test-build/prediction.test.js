"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert/strict");
const node_test_1 = require("node:test");
const prediction_1 = require("./prediction");
const baseWeather = {
    location: "Ellicott City, Howard County, MD",
    currentTemperatureF: 42,
    precipitationChance: 10,
    expectedSnowfallInches: 0,
    windSpeed: "5 mph",
    windGust: null,
    alerts: [],
    overnightForecast: "Mostly clear.",
    morningForecast: "Sunny.",
    shortForecast: "Mostly Clear",
    detailedForecast: "Mostly clear with light winds.",
    forecastDiscussion: null,
    fetchedAt: "2026-05-17T12:00:00.000Z"
};
(0, node_test_1.describe)("createPrediction", () => {
    (0, node_test_1.it)("keeps normal operations likely when weather signals are quiet", () => {
        const result = (0, prediction_1.createPrediction)({
            weather: baseWeather,
            now: new Date("2026-05-17T08:00:00-04:00")
        });
        assert.equal(result.label, "Normal Operations Likely");
        assert.equal(result.riskLevel, "Low");
        assert.match(result.topFactors[0], /No major winter weather signal/);
    });
    (0, node_test_1.it)("raises closure risk for winter storm warnings and significant snow", () => {
        const result = (0, prediction_1.createPrediction)({
            weather: {
                ...baseWeather,
                currentTemperatureF: 25,
                precipitationChance: 90,
                expectedSnowfallInches: 5.2,
                windSpeed: "18 mph",
                windGust: "40 mph",
                alerts: [
                    {
                        event: "Winter Storm Warning",
                        severity: "Severe",
                        headline: "Heavy snow expected",
                        description: "Travel could be very difficult."
                    }
                ],
                morningForecast: "Snow before 10am with gusty winds."
            },
            now: new Date("2026-01-08T05:00:00-05:00")
        });
        assert.equal(result.label, "Closure Possible");
        assert.equal(result.riskLevel, "High");
        assert.ok(result.confidence >= 90);
    });
    (0, node_test_1.it)("treats freezing rain as a strong disruption factor", () => {
        const result = (0, prediction_1.createPrediction)({
            weather: {
                ...baseWeather,
                currentTemperatureF: 29,
                precipitationChance: 80,
                expectedSnowfallInches: 0,
                shortForecast: "Freezing Rain",
                morningForecast: "Freezing rain likely before 9am."
            },
            now: new Date("2026-02-12T04:00:00-05:00")
        });
        assert.equal(result.riskLevel, "Medium");
        assert.match(result.topFactors[0], /freezing rain/);
    });
});
