"use client"

import { Button } from "@/components/ui/button"
import { Shield, MapPin, Activity, AlertCircle } from 'lucide-react'

interface HomePageProps {
  onLoginClick: () => void
  onSignupClick: () => void
}

export function HomePage({ onLoginClick, onSignupClick }: HomePageProps) {
  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features-section')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with logo */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold tracking-wider text-accent">SPARTANS</h1>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onLoginClick}
              variant="outline"
              className="border-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              LOGIN
            </Button>
            <Button onClick={onSignupClick} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              SIGN UP
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-20 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 text-balance leading-tight">
                Real-Time Soldier <span className="text-accent">Health Monitoring</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Advanced IoT-enabled system for tracking vital signs, GPS positioning, and operational status of
                deployed soldiers in real-time.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={onSignupClick}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  GET STARTED
                </Button>
                <Button
                  onClick={handleLearnMore}
                  size="lg"
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent/10 bg-transparent"
                >
                  LEARN MORE
                </Button>
              </div>
            </div>
            <div id="features-section" className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <Activity className="w-8 h-8 text-accent" />
                <h3 className="font-semibold">Vital Signs</h3>
                <p className="text-sm text-muted-foreground">Real-time pulse, blood pressure, and oxygen monitoring</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <MapPin className="w-8 h-8 text-accent" />
                <h3 className="font-semibold">GPS Tracking</h3>
                <p className="text-sm text-muted-foreground">Live position tracking of all deployed units</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <AlertCircle className="w-8 h-8 text-accent" />
                <h3 className="font-semibold">Critical Alerts</h3>
                <p className="text-sm text-muted-foreground">Instant notifications for anomalies</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <Shield className="w-8 h-8 text-accent" />
                <h3 className="font-semibold">Secure Data</h3>
                <p className="text-sm text-muted-foreground">Military-grade encryption for all data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Advanced Monitoring Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Health Analytics</h3>
              <p className="text-muted-foreground">
                Comprehensive vital sign tracking with historical data analysis and trend detection.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Operational Awareness</h3>
              <p className="text-muted-foreground">
                Real-time unit positioning and deployment status across all operational theaters.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Incident Response</h3>
              <p className="text-muted-foreground">
                Automated alert system for critical events requiring immediate command attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-6 border-t border-border bg-card/30">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to Deploy SPARTANS?</h2>
          <p className="text-lg text-muted-foreground">
            Join military units worldwide using SPARTANS for advanced soldier health monitoring and operational
            management.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={onSignupClick}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
            >
              CREATE ACCOUNT
            </Button>
            <Button
              onClick={onLoginClick}
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10 px-8 bg-transparent"
            >
              SIGN IN
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
