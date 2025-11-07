"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-red-950 to-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(238, 82, 83, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(238, 82, 83, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* SPARTANS Logo with animation */}
      <div
        className={`relative z-10 transition-all duration-1000 ${
          animationComplete ? "scale-50 -translate-y-32" : "scale-100"
        }`}
      >
        <div className="animate-pulse-glow">
          <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-500 drop-shadow-2xl text-balance">
            SPARTANS
          </div>
        </div>
        <p className="text-center text-accent text-lg font-bold mt-4 tracking-widest">
          SOLDIER HEALTH MONITORING SYSTEM
        </p>
      </div>

      {/* Home content - slides in after logo animation */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
          animationComplete ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-center space-y-8 px-4">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-accent drop-shadow-lg">SPARTANS</h1>
            <p className="text-xl text-muted-foreground">Advanced Soldier Health & Position Monitoring</p>
          </div>

          <div className="max-w-2xl mx-auto bg-card/50 border border-border rounded-lg p-8 backdrop-blur">
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-accent text-lg">Real-Time Monitoring</h3>
                  <p className="text-muted-foreground">
                    Track vital signs and GPS positions of deployed soldiers in real-time
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-accent text-lg">Critical Alerts</h3>
                  <p className="text-muted-foreground">
                    Instant notifications when soldier vitals exceed safe thresholds
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-bold text-accent text-lg">Tactical Intelligence</h3>
                  <p className="text-muted-foreground">Comprehensive data visualization for command-level decisions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-8">
            <Link
              href="/#login"
              className="px-8 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/#signup"
              className="px-8 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {animationComplete && (
        <div className="absolute bottom-8 z-10 animate-bounce">
          <ChevronDown className="text-accent" size={32} />
        </div>
      )}
    </div>
  )
}
