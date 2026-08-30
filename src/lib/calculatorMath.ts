// Pure sizing math for the load and solar calculators. Every constant
// below is a widely-used engineering planning assumption (cited in the
// comment beside it), not a Kell Electricals-specific fact or promise.
// All outputs are indicative estimates for planning purposes only.

// Standard safety margin applied on top of connected load when sizing an
// inverter/generator, to cover starting/surge current on motors and
// compressors — a common rule of thumb in electrical load planning.
export const INVERTER_SAFETY_MARGIN = 1.25

// Typical usable depth-of-discharge for a modern lithium battery bank.
// Lead-acid systems are commonly derated further (~50%) — this default
// assumes lithium, the more common choice in current hybrid inverter
// systems.
export const BATTERY_DEPTH_OF_DISCHARGE = 0.8

// Round-trip efficiency of a typical hybrid inverter/battery system
// (charge + discharge losses).
export const BATTERY_ROUND_TRIP_EFFICIENCY = 0.9

// Combined system losses applied when sizing the panel array against a
// theoretical peak-sun-hour figure: inverter conversion loss, wiring
// loss, temperature derating, dust/soiling. A commonly used rule-of-thumb
// range is 75-80% effective yield; this uses the more conservative end.
export const SOLAR_SYSTEM_EFFICIENCY = 0.75

// Average daily peak sun hours for Abuja, Nigeria — a widely cited
// approximate figure for the region (solar irradiance resources
// typically place North-Central Nigeria around 5-5.5 kWh/m²/day). This
// is a planning average, not a guarantee for any specific day or season.
export const ABUJA_AVERAGE_PEAK_SUN_HOURS = 5

export function totalConnectedWatts(items: { watts: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.watts * item.quantity, 0)
}

export function recommendedInverterWatts(connectedWatts: number): number {
  return Math.ceil((connectedWatts * INVERTER_SAFETY_MARGIN) / 100) * 100
}

export type SolarSizingInput = {
  criticalLoadWatts: number
  backupHours: number
  peakSunHours?: number
}

export type SolarSizingResult = {
  batteryCapacityKwh: number
  panelArrayKw: number
  recommendedInverterWatts: number
}

export function calculateSolarSizing({
  criticalLoadWatts,
  backupHours,
  peakSunHours = ABUJA_AVERAGE_PEAK_SUN_HOURS,
}: SolarSizingInput): SolarSizingResult {
  const energyNeededWh = criticalLoadWatts * backupHours
  const batteryCapacityWh = energyNeededWh / BATTERY_DEPTH_OF_DISCHARGE / BATTERY_ROUND_TRIP_EFFICIENCY
  const dailyEnergyWh = criticalLoadWatts * 24
  const panelArrayW = dailyEnergyWh / peakSunHours / SOLAR_SYSTEM_EFFICIENCY

  return {
    batteryCapacityKwh: Math.round((batteryCapacityWh / 1000) * 10) / 10,
    panelArrayKw: Math.round((panelArrayW / 1000) * 10) / 10,
    recommendedInverterWatts: recommendedInverterWatts(criticalLoadWatts),
  }
}
