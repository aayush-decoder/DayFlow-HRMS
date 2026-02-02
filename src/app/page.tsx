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

            {/* Dashboard Mockup */}
            <div className="mt-16 rounded-xl border bg-card text-card-foreground shadow-2xl mx-auto max-w-5xl overflow-hidden">
              <div className="border-b bg-muted/40 p-2 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              
              {/* Dashboard Header */}
              <div className="border-b bg-background p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary text-primary-foreground rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">DayFlow Dashboard</h3>
                    <p className="text-xs text-muted-foreground">Welcome back, Sarah Johnson</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                    ● Online
                  </div>
                  <div className="text-xs text-muted-foreground">09:15 AM</div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-gradient-to-br from-background to-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Quick Stats */}
                  <div className="bg-card rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Today's Attendance</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">94.2%</p>
                      </div>
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Leaves</p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">7</p>
                      </div>
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Employees</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">142</p>
                      </div>
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-lg border shadow-sm">
                    <div className="p-4 border-b">
                      <h4 className="font-semibold text-sm">Recent Check-ins</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">AP</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Aayush Prasad</p>
                          <p className="text-xs text-muted-foreground">Full Stack developer • 09:12 AM</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">MD</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Manav Dhamecha</p>
                          <p className="text-xs text-muted-foreground">DB Administrator • 09:08 AM</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">AK</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Arshad Khatib</p>
                          <p className="text-xs text-muted-foreground">ML Engineer • 09:05 AM</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border shadow-sm">
                    <div className="p-4 border-b">
                      <h4 className="font-semibold text-sm">Leave Requests</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">VJ</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Vishal Joshi</p>
                            <p className="text-xs text-muted-foreground">Sick Leave • 2 days</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">Approve</button>
                          <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">Reject</button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">PS</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Poorva Shah</p>
                            <p className="text-xs text-muted-foreground">Vacation • 5 days</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">Approve</button>
                          <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs">Reject</button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">GM</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Gaurav Mehta</p>
                            <p className="text-xs text-muted-foreground">Personal • 1 day</p>
                          </div>
                        </div>
                        <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">Approved</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Check In
                  </button>
                  <button className="px-3 py-2 bg-card border rounded-lg text-xs font-medium hover:bg-muted/50 transition-colors">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Request Leave
                  </button>
                  <button className="px-3 py-2 bg-card border rounded-lg text-xs font-medium hover:bg-muted/50 transition-colors">
                    <BarChart3 className="w-3 h-3 inline mr-1" />
                    View Reports
                  </button>
                  <button className="px-3 py-2 bg-card border rounded-lg text-xs font-medium hover:bg-muted/50 transition-colors">
                    <Users className="w-3 h-3 inline mr-1" />
                    Team Directory
                  </button>
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
                No credit card required. Hackathon Prototype
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
