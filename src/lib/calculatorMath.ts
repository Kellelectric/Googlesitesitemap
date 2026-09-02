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

// Typical combined power factor for a mixed residential/commercial load
// (lighting, electronics, and some motor loads together) — generators are
// rated in kVA (apparent power), while connected load is normally
// expressed in kW (real power); the two are only equal at a power factor
// of 1.0, which real mixed loads rarely have.
export const DEFAULT_POWER_FACTOR = 0.8

export type MotorSurgeProfile = {
  key: string
  label: string
  // Typical ratio of starting (surge) current to running current for this
  // class of motor load — a widely-used planning range, applied only to
  // the single largest such load on the property (motors don't all start
  // simultaneously in a well-sequenced system).
  multiplier: number
}

export const motorSurgeProfiles: MotorSurgeProfile[] = [
  { key: 'none', label: 'No large motor load', multiplier: 1 },
  { key: 'small-pump-fan', label: 'Small pump or fan motor', multiplier: 3 },
  { key: 'ac-unit', label: 'Air conditioner compressor', multiplier: 4 },
  { key: 'borehole-pump', label: 'Borehole / submersible pump', multiplier: 5 },
  { key: 'large-motor', label: 'Large motor or industrial compressor', multiplier: 6 },
]

export type GeneratorSizingInput = {
  totalRunningKw: number
  // Running kW of the single largest motor load included in
  // totalRunningKw — must not exceed it. 0 if none selected.
  largestMotorKw: number
  surgeMultiplier: number
  powerFactor?: number
}

export type GeneratorSizingResult = {
  runningKva: number
  surgeKva: number
  recommendedKva: number
}

// Generator sizing needs two checks, not one: does it carry the running
// load, and does it clear the single largest starting surge on top of
// everything else already running. The larger of the two, converted from
// kW to kVA via power factor, sets the minimum size — see
// /resources/how-to-size-a-backup-generator for the full reasoning.
export function calculateGeneratorSizing({
  totalRunningKw,
  largestMotorKw,
  surgeMultiplier,
  powerFactor = DEFAULT_POWER_FACTOR,
}: GeneratorSizingInput): GeneratorSizingResult {
  const clampedMotorKw = Math.min(Math.max(largestMotorKw, 0), totalRunningKw)
  const surgeLoadKw = totalRunningKw - clampedMotorKw + clampedMotorKw * surgeMultiplier

  const runningKva = totalRunningKw / powerFactor
  const surgeKva = surgeLoadKw / powerFactor
  const recommendedKva = Math.ceil(Math.max(runningKva, surgeKva) * 2) / 2 // round up to nearest 0.5 kVA

  return {
    runningKva: Math.round(runningKva * 10) / 10,
    surgeKva: Math.round(surgeKva * 10) / 10,
    recommendedKva,
  }
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
