import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Clock, Calendar, Users, Shield, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <Link className="flex items-center justify-center gap-2 font-bold text-xl" href="#">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <span>DayFlow HRMS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#about">
            About
          </Link>
          <div className="flex gap-2 ml-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Every Workday, <br /> Perfectly Aligned.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Streamline attendance, manage leaves, and empower your workforce with the modern HRMS designed for efficiency.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dashboard Mockup Placeholder */}
            <div className="mt-16 rounded-xl border bg-card text-card-foreground shadow-2xl mx-auto max-w-5xl overflow-hidden">
              <div className="border-b bg-muted/40 p-2 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="p-8 md:p-12 min-h-[300px] flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
                <div className="text-center space-y-4">
                  <BarChart3 className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                  <p className="text-muted-foreground">Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need to manage your team</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  DayFlow replaces spreadsheet chaos with a unified, automated, and secure platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center space-y-4 border p-6 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Smart Attendance</h3>
                <p className="text-center text-muted-foreground">
                  One-click check-ins, geolocation tracking, and real-time status updates for remote and office teams.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col items-center space-y-4 border p-6 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Leave Management</h3>
                <p className="text-center text-muted-foreground">
                  Automated leave requests, approval workflows, and instant balance tracking for everyone.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col items-center space-y-4 border p-6 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Employee Profiles</h3>
                <p className="text-center text-muted-foreground">
                  Centralized documents, personal details, and role management in one secure digital vault.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 mx-auto">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to transform your workplace?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of forward-thinking companies using DayFlow to build better cultures.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Link href="/register">
                <Button className="w-full h-11 text-lg" size="lg">
                  Get Started for Free
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                No credit card required. 14-day free trial.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 DayFlow HRMS. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
