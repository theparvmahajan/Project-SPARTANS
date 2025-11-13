const THINGSPEAK_CHANNEL_ID = "3159678"
const THINGSPEAK_READ_API_KEY = "WPVV0KMER5BVWIB4"
const THINGSPEAK_BASE_URL = "https://api.thingspeak.com"

export interface ThingSpeakFeed {
  created_at: string
  entry_id: number
  field1?: string // pulse (heart rate)
  field2?: string // tempC (temperature in Celsius)
  field3?: string // latitude
  field4?: string // longitude
  field5?: string // battery
  field6?: string // humidity
  field7?: string
  field8?: string
}

export interface ThingSpeakChannelData {
  channel: {
    id: number
    name: string
    description: string
    latitude: string
    longitude: string
    field1: string
    field2: string
    field3: string
    field4: string
    field5: string
    field6: string
    field7: string
    field8: string
    created_at: string
    updated_at: string
  }
  feeds: ThingSpeakFeed[]
}

/**
 * Fetch real-time data from ThingSpeak cloud platform
 * Field mapping for soldier_1:
 * - field1: pulse (heart rate in bpm)
 * - field2: tempC (body temperature in Celsius)
 * - field3: latitude (GPS latitude)
 * - field4: longitude (GPS longitude)
 * - field5: battery (battery level %)
 * - field6: humidity (environmental humidity %)
 */
export async function fetchThingSpeakData(results = 100) {
  try {
    const url = `${THINGSPEAK_BASE_URL}/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_READ_API_KEY}&results=${results}`

    const response = await fetch(url, {
      cache: "no-store", // Force fresh data fetch
      next: { revalidate: 0 }, // No caching
    })

    if (!response.ok) {
      throw new Error(`ThingSpeak API error: ${response.status}`)
    }

    const data = (await response.json()) as ThingSpeakChannelData

    return data
  } catch (error) {
    console.error("Error fetching ThingSpeak data:", error)
    throw error
  }
}

/**
 * Fetch the latest single reading from ThingSpeak
 */
export async function fetchLatestThingSpeakReading() {
  try {
    const url = `${THINGSPEAK_BASE_URL}/channels/${THINGSPEAK_CHANNEL_ID}/feeds/last.json?api_key=${THINGSPEAK_READ_API_KEY}`

    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error(`ThingSpeak API error: ${response.status}`)
    }

    const data = (await response.json()) as ThingSpeakFeed

    return data
  } catch (error) {
    console.error("Error fetching latest ThingSpeak reading:", error)
    throw error
  }
}

/**
 * Parse ThingSpeak feed data into soldier vitals format
 */
export function parseThingSpeakVitals(feed: ThingSpeakFeed, soldierId: string) {
  const pulse = Number.parseFloat(feed.field1 || "0") || 72
  const tempC = Number.parseFloat(feed.field2 || "0") || 36.8
  const latitude = Number.parseFloat(feed.field3 || "0") || 40.7128
  const longitude = Number.parseFloat(feed.field4 || "0") || -74.006
  const battery = Number.parseFloat(feed.field5 || "0") || 100
  const humidity = Number.parseFloat(feed.field6 || "0") || 50

  // Calculate blood oxygen as derived metric from humidity
  // In production, this should come from a dedicated SpO2 sensor
  const bloodOxygenSaturation = Math.max(92, Math.min(100, 100 - humidity * 0.08))

  console.log(`[v0] Parsed ThingSpeak data for ${soldierId}:`, {
    pulse,
    tempC,
    latitude,
    longitude,
    battery,
    humidity,
    bloodOxygenSaturation: Math.round(bloodOxygenSaturation),
    timestamp: feed.created_at,
  })

  return {
    soldierId,
    heartRate: pulse,
    temperature: tempC,
    bloodOxygenSaturation: Math.round(bloodOxygenSaturation),
    latitude,
    longitude,
    battery,
    humidity,
    timestamp: new Date(feed.created_at).toISOString(),
  }
}

/**
 * Determine soldier status based on vitals thresholds
 */
export function determineSoldierStatus(
  heartRate: number,
  temperature: number,
  bloodOxygen: number,
): "active" | "warning" | "critical" {
  // Temperature from DHT22 sensor is environmental, not body temp
  if (heartRate > 120 || temperature > 45 || bloodOxygen < 90) {
    return "critical"
  }
  if (heartRate > 100 || temperature > 40 || bloodOxygen < 94) {
    return "warning"
  }
  return "active"
}

/**
 * Generate alert based on vitals
 */
export function generateAlert(
  soldierId: string,
  soldierName: string,
  heartRate: number,
  temperature: number,
  bloodOxygen: number,
) {
  const alerts = []

  if (heartRate > 120) {
    alerts.push("Heart rate critically elevated")
  }
  if (temperature > 38.5) {
    alerts.push("High fever detected")
  }
  if (bloodOxygen < 94) {
    alerts.push("Blood oxygen dangerously low")
  }

  return {
    soldierId,
    soldierName,
    type: alerts.length > 0 ? "critical" : "normal",
    message: alerts.join(" + ") || "Vitals stable",
    timestamp: new Date().toISOString(),
  }
}
