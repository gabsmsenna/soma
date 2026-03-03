import { Calendar, Download, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const kpis = [
  {
    label: "Total Revenue",
    value: "$842,500.00",
    change: "+12.4%",
    changeColor:
      "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    sub: "Vs $749,200 last period",
  },
  {
    label: "Net Profit",
    value: "$312,420.00",
    change: "+8.2%",
    changeColor:
      "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    sub: "37% Margin average",
  },
  {
    label: "Ad Spend (ROAS)",
    value: "$201,150.00",
    change: "4.2x",
    changeColor:
      "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
    sub: "Total across 14 campaigns",
  },
  {
    label: "CAC Average",
    value: "$14.20",
    change: "+3.1%",
    changeColor: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
    sub: "Customer acquisition cost",
  },
];

const transactions = [
  {
    id: "#345345",
    category: "Marketing Tooling",
    date: "Nov 11, 2023",
    price: "$440.44",
    status: "COMPLETE",
    statusColor:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    id: "#345389",
    category: "Cloud Hosting",
    date: "Nov 10, 2023",
    price: "$1,200.00",
    status: "ON DELIVERY",
    statusColor:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "#345412",
    category: "SaaS Subscription",
    date: "Nov 09, 2023",
    price: "$89.00",
    status: "CANCELED",
    statusColor: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    id: "#345431",
    category: "Social Ads",
    date: "Nov 09, 2023",
    price: "$2,450.00",
    status: "COMPLETE",
    statusColor:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
];

const barData = [
  { month: "Feb", income: 60, expense: 40 },
  { month: "Mar", income: 75, expense: 35 },
  { month: "Apr", income: 90, expense: 50 },
  { month: "May", income: 100, expense: 30 },
  { month: "Jun", income: 85, expense: 45 },
  { month: "Jul", income: 95, expense: 55 },
  { month: "Aug", income: 100, expense: 40 },
  { month: "Sep", income: 60, expense: 20 },
];

export default function RelatoriosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-6 border-b">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-2xl font-bold">Reporting & Analytics</h1>
            <p className="text-muted-foreground text-sm">
              Real-time financial performance across all channels
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-card border rounded-xl px-3 py-2 shadow-sm">
            <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
            <select className="bg-transparent border-none focus:ring-0 text-sm font-medium py-0">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-card border rounded-xl font-medium text-sm shadow-sm hover:bg-muted transition-colors"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-orange-500/20 hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((k) => (
            <Card key={k.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground text-sm font-medium">
                    {k.label}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-xs font-bold ${k.changeColor}`}
                  >
                    {k.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold tracking-tight">
                  {k.value}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {k.sub}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Allocation */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-bold text-lg">Revenue Allocation</h3>
                  <p className="text-sm text-muted-foreground">
                    Monthly breakdown of income vs expenses
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-xs font-medium">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-muted" />
                    <span className="text-xs font-medium">Expense</span>
                  </div>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2 px-2">
                {barData.map((b) => (
                  <div
                    key={b.month}
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >
                    <div className="w-full flex justify-center items-end gap-1 h-full">
                      <div
                        className="w-4 bg-muted rounded-t-sm"
                        style={{ height: `${b.expense}%` }}
                      />
                      <div
                        className="w-4 bg-orange-500 rounded-t-sm opacity-80"
                        style={{ height: `${b.income}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {b.month}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Sales Summary</h3>
              </div>
              <div className="text-2xl font-bold mb-6">
                $1,200 <span className="text-xs text-green-500">+12%</span>
              </div>
              <div className="relative h-48 w-full">
                <svg
                  className="w-full h-full "
                  viewBox="0 0 100 40"
                  role="img"
                  aria-label="Sales trend over the last week"
                >
                  <defs>
                    <linearGradient
                      id="salGrad"
                      x1="0%"
                      x2="0%"
                      y1="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: "rgba(249, 115, 22, 0.3)",
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: "rgba(249, 115, 22, 0)",
                          stopOpacity: 1,
                        }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,40 Q15,35 25,30 T45,15 T70,25 T100,5 L100,40 L0,40 Z"
                    fill="url(#salGrad)"
                  />
                  <path
                    d="M0,40 Q15,35 25,30 T45,15 T70,25 T100,5"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="1.5"
                  />
                  <circle cx="45" cy="15" fill="#F97316" r="2" />
                  <circle cx="100" cy="5" fill="#F97316" r="2" />
                </svg>
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions + Customer Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">Top Transactions</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3 w-3" />
                <Input
                  className="pl-8 pr-4 py-1.5 text-xs w-48 h-8 rounded-lg"
                  placeholder="Search transactions..."
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <TableHead className="px-6">Customer ID</TableHead>
                  <TableHead className="px-6">Category</TableHead>
                  <TableHead className="px-6">Date</TableHead>
                  <TableHead className="px-6">Price</TableHead>
                  <TableHead className="px-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow
                    key={t.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="px-6 py-4 text-sm font-medium">
                      {t.id}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {t.category}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {t.date}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-bold">
                      {t.price}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-bold ${t.statusColor}`}
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Customer Growth</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New Customers</span>
                  <span className="text-sm font-bold">+2,431</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
