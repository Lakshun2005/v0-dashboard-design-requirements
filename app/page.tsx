"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Bell,
  Home,
  Users,
  BarChart3,
  Settings,
  AlertTriangle,
  ArrowRight,
  Heart,
  Calendar,
  FileText,
  Activity,
  Clock,
  Filter,
  Eye,
  MoreHorizontal,
  ChevronDown,
  UserPlus,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  Brain,
  MessageSquare,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const metricsData = [
  { label: "Total Patients", value: "1,247", change: "+23", trend: "up", icon: Users },
  { label: "Today's Appointments", value: "18", change: "+3", trend: "up", icon: Calendar },
  { label: "Critical Alerts", value: "5", change: "-2", trend: "up", icon: AlertTriangle },
  { label: "Active Providers", value: "12", change: "+1", trend: "up", icon: Stethoscope },
]

const recentPatients = [
  {
    id: "1",
    mrn: "MRN001234",
    name: "John Smith",
    age: 38,
    lastVisit: "2025-01-20",
    condition: "Hypertension",
    status: "stable",
    riskLevel: "medium",
  },
  {
    id: "2",
    mrn: "MRN001235",
    name: "Sarah Johnson",
    age: 32,
    lastVisit: "2025-01-19",
    condition: "Asthma",
    status: "stable",
    riskLevel: "low",
  },
  {
    id: "3",
    mrn: "MRN001236",
    name: "Robert Davis",
    age: 46,
    lastVisit: "2025-01-18",
    condition: "Hyperlipidemia",
    status: "monitoring",
    riskLevel: "medium",
  },
  {
    id: "4",
    mrn: "MRN001237",
    name: "Emily Wilson",
    age: 29,
    lastVisit: "2025-01-17",
    condition: "Anxiety Disorder",
    status: "improving",
    riskLevel: "low",
  },
  {
    id: "5",
    mrn: "MRN001238",
    name: "Michael Brown",
    age: 64,
    lastVisit: "2025-01-16",
    condition: "Coronary Artery Disease",
    status: "critical",
    riskLevel: "high",
  },
]

const patientVitalsData = [
  { month: "Jul", patients: 1180, appointments: 890, alerts: 12 },
  { month: "Aug", patients: 1205, appointments: 920, alerts: 8 },
  { month: "Sep", patients: 1220, appointments: 945, alerts: 15 },
  { month: "Oct", patients: 1235, appointments: 980, alerts: 6 },
  { month: "Nov", patients: 1240, appointments: 1020, alerts: 9 },
  { month: "Dec", patients: 1247, appointments: 1050, alerts: 5 },
]

const recentAlerts = [
  { patient: "Michael Brown", alert: "Critical BP Reading", time: "5 minutes ago", priority: "high" },
  { patient: "John Smith", alert: "Medication Due", time: "15 minutes ago", priority: "medium" },
  { patient: "Sarah Johnson", alert: "Lab Results Ready", time: "1 hour ago", priority: "low" },
  { patient: "Robert Davis", alert: "Follow-up Needed", time: "2 hours ago", priority: "medium" },
  { patient: "Emily Wilson", alert: "Appointment Reminder", time: "3 hours ago", priority: "low" },
]

const healthcareTeam = [
  {
    name: "Dr. Sarah Chen",
    role: "Cardiologist",
    status: "online",
    avatar: "/placeholder.svg?height=32&width=32",
    availability: "Available",
    patients: 45,
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "Emergency Medicine",
    status: "online",
    avatar: "/placeholder.svg?height=32&width=32",
    availability: "In Surgery",
    patients: 32,
  },
  {
    name: "Nurse Lisa Thompson",
    role: "ICU Nurse",
    status: "away",
    avatar: "/placeholder.svg?height=32&width=32",
    availability: "On Break",
    patients: 8,
  },
  {
    name: "Dr. James Wilson",
    role: "Internal Medicine",
    status: "online",
    avatar: "/placeholder.svg?height=32&width=32",
    availability: "With Patient",
    patients: 38,
  },
]

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days")
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("patients")
          .select(`
            id,
            medical_record_number,
            first_name,
            last_name,
            date_of_birth,
            phone,
            email,
            created_at
          `)
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) {
          console.error("Error loading patients:", error)
          // Use sample data as fallback
          setPatients(recentPatients)
        } else {
          // Transform Supabase data to match our component structure
          const transformedPatients = data.map((patient) => ({
            id: patient.id,
            mrn: patient.medical_record_number,
            name: `${patient.first_name} ${patient.last_name}`,
            age: new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear(),
            lastVisit: new Date(patient.created_at).toISOString().split("T")[0],
            condition: "General Care", // Would come from medical_history table
            status: "stable",
            riskLevel: "low",
          }))
          setPatients(transformedPatients.length > 0 ? transformedPatients : recentPatients)
        }
      } catch (error) {
        console.error("Error:", error)
        setPatients(recentPatients)
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">HealthCare EHR</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <span>Dashboard</span> <span className="mx-1">/</span> <span>Patient Management</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search patients, records..."
              className="pl-10 w-80 bg-input border-border focus:bg-card"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Dr. Alex Evans</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 border-r border-border bg-card h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search anything..." className="pl-10 bg-input border-border text-sm" />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6"
              >
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>

            <nav className="space-y-1">
              <Link
                href="/"
                className="flex items-center w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Home className="w-4 h-4 mr-3" />
                Dashboard
              </Link>
              <Link
                href="/patients"
                className="flex items-center w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Users className="w-4 h-4 mr-3" />
                Patients
              </Link>
              <Link
                href="/clinical-ai"
                className="flex items-center w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Brain className="w-4 h-4 mr-3" />
                Clinical AI
              </Link>
              <Link
                href="/documentation"
                className="flex items-center w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <FileText className="w-4 h-4 mr-3" />
                Smart Documentation
              </Link>
              <Link
                href="/communication"
                className="flex items-center w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <MessageSquare className="w-4 h-4 mr-3" />
                Communication
              </Link>
              <Link
                href="/appointments"
                className="flex items-center w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Calendar className="w-4 h-4 mr-3" />
                Appointments
              </Link>
              <Link
                href="/records"
                className="flex items-center w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <FileText className="w-4 h-4 mr-3" />
                Medical Records
              </Link>
              <Link
                href="/analytics"
                className="flex items-center w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Analytics
              </Link>
              <Link
                href="/settings"
                className="flex items-center w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-background">
          {/* Quick Actions Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Patient Management Dashboard</h1>
                <p className="text-muted-foreground mt-1">Monitor patient care and clinical workflows</p>
              </div>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      {selectedPeriod} <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedPeriod("Last 7 days")}>Last 7 days</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPeriod("Last 30 days")}>Last 30 days</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPeriod("Last 90 days")}>Last 90 days</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="bg-primary hover:bg-primary/90">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">New Patient</h3>
                    <p className="text-sm text-muted-foreground">Register new patient</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-chart-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Critical Alerts</h3>
                    <p className="text-sm text-muted-foreground">Review urgent cases</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-chart-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Schedule Appointment</h3>
                    <p className="text-sm text-muted-foreground">Book patient visit</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <metric.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${metric.trend === "up" ? "text-chart-2" : "text-chart-4"}`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-foreground mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="col-span-2 space-y-8">
              {/* Charts Section */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Patient Care Analytics</CardTitle>
                      <CardDescription>Patient volume, appointments, and alert trends</CardDescription>
                    </div>
                    <Tabs defaultValue="patients" className="w-auto">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="patients">Patients</TabsTrigger>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="alerts">Alerts</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={patientVitalsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="patients"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="appointments"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--chart-2))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Table */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Recent Patients</CardTitle>
                      <CardDescription>Monitor patient status and care progress</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-medium text-foreground">MRN</TableHead>
                        <TableHead className="font-medium text-foreground">Patient Name</TableHead>
                        <TableHead className="font-medium text-foreground">Age</TableHead>
                        <TableHead className="font-medium text-foreground">Last Visit</TableHead>
                        <TableHead className="font-medium text-foreground">Condition</TableHead>
                        <TableHead className="font-medium text-foreground">Status</TableHead>
                        <TableHead className="font-medium text-foreground">Risk Level</TableHead>
                        <TableHead className="font-medium text-foreground w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            Loading patients...
                          </TableCell>
                        </TableRow>
                      ) : (
                        patients.map((patient) => (
                          <TableRow key={patient.id} className="hover:bg-muted/50">
                            <TableCell className="font-mono text-sm">{patient.mrn}</TableCell>
                            <TableCell className="font-medium">{patient.name}</TableCell>
                            <TableCell className="text-muted-foreground">{patient.age}</TableCell>
                            <TableCell className="text-muted-foreground">{patient.lastVisit}</TableCell>
                            <TableCell className="text-muted-foreground">{patient.condition}</TableCell>
                            <TableCell>
                              {patient.status === "stable" && (
                                <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                                  <Activity className="w-3 h-3 mr-1" />
                                  Stable
                                </Badge>
                              )}
                              {patient.status === "critical" && (
                                <Badge variant="secondary" className="bg-chart-4/10 text-chart-4">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Critical
                                </Badge>
                              )}
                              {patient.status === "monitoring" && (
                                <Badge variant="secondary" className="bg-chart-3/10 text-chart-3">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Monitoring
                                </Badge>
                              )}
                              {patient.status === "improving" && (
                                <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Improving
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  patient.riskLevel === "high"
                                    ? "border-chart-4 text-chart-4"
                                    : patient.riskLevel === "medium"
                                      ? "border-chart-3 text-chart-3"
                                      : "border-chart-2 text-chart-2"
                                }
                              >
                                {patient.riskLevel}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="w-8 h-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Record</DropdownMenuItem>
                                  <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View History</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Department Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Bed Occupancy</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Staff Availability</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Equipment Status</span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {recentAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 hover:bg-muted/50 border-b border-border last:border-b-0"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            alert.priority === "high"
                              ? "bg-chart-4"
                              : alert.priority === "medium"
                                ? "bg-chart-3"
                                : "bg-chart-2"
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground truncate">{alert.alert}</div>
                          <div className="text-xs text-muted-foreground">
                            {alert.patient} • {alert.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Healthcare Team Status */}
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Healthcare Team</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {healthcareTeam.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 hover:bg-muted/50 border-b border-border last:border-b-0"
                      >
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                              member.status === "online" ? "bg-chart-2" : "bg-muted-foreground"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground">{member.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {member.role} • {member.availability} • {member.patients} patients
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
