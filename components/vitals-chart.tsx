"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface VitalsChartProps {
  soldierName: string
}

export function VitalsChart({ soldierName }: VitalsChartProps) {
  const data = [
    { time: "00:00", heartRate: 72, temperature: 37.0, oxygenLevel: 98 },
    { time: "04:00", heartRate: 68, temperature: 36.8, oxygenLevel: 99 },
    { time: "08:00", heartRate: 78, temperature: 37.2, oxygenLevel: 98 },
    { time: "12:00", heartRate: 85, temperature: 37.5, oxygenLevel: 97 },
    { time: "16:00", heartRate: 92, temperature: 38.1, oxygenLevel: 96 },
    { time: "20:00", heartRate: 88, temperature: 37.8, oxygenLevel: 97 },
    { time: "24:00", heartRate: 75, temperature: 37.0, oxygenLevel: 98 },
  ]

  return (
    <div>
      <h2 className="text-xl font-black text-accent mb-4">24-Hour Vital Signs Trend</h2>
      <div className="bg-card border border-border rounded-xl p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(238, 82, 83, 0.1)" />
            <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.5)" />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "2px solid rgba(238, 82, 83, 0.5)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="rgba(239, 68, 68, 1)"
              name="Heart Rate (bpm)"
              dot={{ fill: "rgba(239, 68, 68, 1)", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="rgba(234, 179, 8, 1)"
              name="Temperature (°C)"
              dot={{ fill: "rgba(234, 179, 8, 1)", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="oxygenLevel"
              stroke="rgba(59, 130, 246, 1)"
              name="O₂ Level (%)"
              dot={{ fill: "rgba(59, 130, 246, 1)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
