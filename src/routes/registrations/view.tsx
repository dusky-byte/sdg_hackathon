import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Users, Activity, ExternalLink, Hash, Edit2, Trash2, Check, X, CalendarDays, DollarSign, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#ffe4e6'];
const PAY_COLORS = ['#10b981', '#f43f5e'];

export const Route = createFileRoute("/registrations/view")({
  component: DashboardAuthGuard,
});

function DashboardAuthGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env["VITE_ADMIN_PASSWORD"] || "admin123";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="film-grain min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background/95 backdrop-blur-md border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Admin Access</CardTitle>
            <CardDescription>Enter the dashboard password to view registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/50"
                  autoFocus
                />
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              </div>
              <Button type="submit" className="w-full">
                Unlock Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <RegistrationsDashboard />;
}

function normalizeCollegeName(rawName?: string | null): string {
  if (!rawName) return "Unspecified";
  const name = rawName.toLowerCase().trim().replace(/[.,]/g, "");

  if (name.includes("srm") || name.includes("srmist")) return "SRM Institute of Science & Technology";
  if (name.includes("sairam")) return "Sri Sairam Engineering College";
  if (name.includes("karpaga vinayaga") || name === "kvcet" || name.includes("kvcet")) return "Karpaga Vinayaga College";
  if (name.includes("prince shri bhavani")) return "Prince Shri Bhavani";
  if (name.includes("hyabama") || name.includes("sathyabama")) return "Sathyabama University";
  if (name.includes("mma")) return "MMA College of Engineering";

  return name.replace(/\b\w/g, (char) => char.toUpperCase());
}

function RegistrationsDashboard() {
  const { data: registrations, isLoading } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const [expanded, setExpanded] = useState(false);

  // Compute charts data
  const chartsData = useMemo(() => {
    if (!registrations) return { byCollege: [], bySize: [], timeline: [], paymentStatus: [] };

    const collegeCounts: Record<string, number> = {};
    const sizeCounts: Record<number, number> = {};
    const dateCounts: Record<string, number> = {};
    let paidCount = 0;
    let unpaidCount = 0;

    registrations.forEach((reg) => {
      const c = normalizeCollegeName(reg.college);
      collegeCounts[c] = (collegeCounts[c] || 0) + 1;

      const s = reg.team_size || 2;
      sizeCounts[s] = (sizeCounts[s] || 0) + 1;

      if (reg.created_at) {
        const dateObj = new Date(reg.created_at);
        const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`; 
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
      }
      
      if (reg.transaction_id) {
        paidCount++;
      } else {
        unpaidCount++;
      }
    });

    const byCollege = Object.entries(collegeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([college, count]) => ({
        name: college.length > 20 ? college.substring(0, 20) + "..." : college,
        value: count,
      }));

    const bySize = Object.entries(sizeCounts).map(([size, count]) => ({
      size: `${size} Members`,
      count,
    }));
    
    const timeline = Object.entries(dateCounts)
      .map(([date, count]) => {
         const parts = date.split('/');
         return { date, count, sortVal: parseInt(parts[1] || "0") * 100 + parseInt(parts[0] || "0") };
      })
      .sort((a, b) => a.sortVal - b.sortVal)
      .map(({ date, count }) => ({ date, count }));

    const paymentStatus = [
      { name: "Verified Payments", value: paidCount },
      { name: "Pending", value: unpaidCount }
    ];

    return { byCollege, bySize, timeline, paymentStatus };
  }, [registrations]);


  const exportToExcel = async () => {
    if (!registrations || registrations.length === 0) return;
    try {
      // Load xlsx-js-style dynamically to support cell formatting
      const xlsx = await new Promise<any>((resolve, reject) => {
        if ((window as any).XLSX) return resolve((window as any).XLSX);
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js";
        script.onload = () => resolve((window as any).XLSX);
        script.onerror = reject;
        document.head.appendChild(script);
      });
      
      const exportData = registrations.map(reg => ({
        "Team Name": reg.team_name,
        "College": reg.college,
        "Size": reg.team_size,
        "M1 Name": reg.member1_name,
        "M1 Email": reg.member1_email,
        "M1 Phone": reg.member1_phone,
        "M2 Name": reg.member2_name,
        "M2 Email": reg.member2_email || "-",
        "M2 Phone": reg.member2_phone,
        "M3 Name": reg.member3_name || "-",
        "M3 Email": reg.member3_email || "-",
        "M3 Phone": reg.member3_phone || "-",
        "Txn ID": reg.transaction_id || "-",
        "Date": new Date(reg.created_at).toLocaleString()
      }));

      const worksheet = xlsx.utils.json_to_sheet(exportData);
      
      // Auto-size columns to fit content
      const numCols = Object.keys(exportData[0]).length;
      const colWidths = Object.keys(exportData[0]).map(key => {
        const maxLen = Math.max(
          key.length + 4, // Add padding for bold header
          ...exportData.map(d => String(d[key as keyof typeof exportData[0]]).length)
        );
        return { wch: maxLen + 2 };
      });
      worksheet["!cols"] = colWidths;

      // Apply bold font, size 12, and borders to the header row
      for (let i = 0; i < numCols; i++) {
        const cellAddress = xlsx.utils.encode_cell({ c: i, r: 0 }); // A1, B1, etc.
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: true, sz: 12 },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" }
            }
          };
        }
      }

      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Registrations");
      
      xlsx.writeFile(workbook, "HackToHustle_Registrations.xlsx");
    } catch (error) {
      console.error("Failed to export Excel", error);
      alert("Failed to export. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="film-grain min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading registrations...</p>
        </div>
      </div>
    );
  }

  const visibleRegistrations = expanded ? registrations : registrations?.slice(0, 5);

  const collegeChartConfig = {
    count: { label: "Teams", color: "hsl(var(--primary))" },
  };

  const sizeChartConfig = {
    count: { label: "Teams", color: "hsl(var(--primary))" },
  };

  return (
    <div className="film-grain min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Hack to Hustle Registration Overview</p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="px-4 py-2 flex items-center gap-3 bg-background/50 backdrop-blur-sm border-primary/20">
              <div className="bg-primary/20 p-2 rounded-md">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Teams</p>
                <p className="text-xl font-bold leading-none">{registrations?.length || 0}</p>
              </div>
            </Card>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-background/80 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Registrations Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={collegeChartConfig} className="h-[250px] w-full">
                <LineChart data={chartsData.timeline} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--color-muted)' }} />
                  <Line type="monotone" dataKey="count" stroke="#e11d48" strokeWidth={3} dot={{ r: 4, fill: "#e11d48" }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Team Size Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={sizeChartConfig} className="h-[250px] w-full">
                <BarChart data={chartsData.bySize} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="size" tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--color-muted)' }} />
                  <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Registrations by College
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={collegeChartConfig} className="h-[250px] w-full">
                <PieChart>
                  <Pie
                    data={chartsData.byCollege}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                  >
                    {chartsData.byCollege.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} className="flex-wrap" />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={collegeChartConfig} className="h-[250px] w-full">
                <PieChart>
                  <Pie
                    data={chartsData.paymentStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                  >
                    {chartsData.paymentStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PAY_COLORS[index % PAY_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-background/90 backdrop-blur-md border-border/50 overflow-hidden">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Recent Registrations</CardTitle>
                <CardDescription>Click a row to view complete team details.</CardDescription>
              </div>
              <Button onClick={exportToExcel} variant="outline" className="shrink-0 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export to Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRegistrations?.map((reg) => (
                  <RegistrationRow key={reg.id} reg={reg} />
                ))}
                {(!visibleRegistrations || visibleRegistrations.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No registrations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {registrations && registrations.length > 5 && (
              <div className="p-4 border-t flex justify-center bg-muted/20">
                <Button
                  variant="outline"
                  onClick={() => setExpanded(!expanded)}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  {expanded ? "Show Less" : `View All ${registrations.length} Registrations`}
                  {!expanded && <ExternalLink className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RegistrationRow({ reg }: { reg: any }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(reg.team_name);

  const updateMutation = useMutation({
    mutationFn: async (newName: string) => {
      const { error } = await supabase.from("registrations").update({ team_name: newName }).eq("id", reg.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      setIsEditing(false);
    },
    onError: (error) => {
      alert("Failed to update: " + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("registrations").delete().eq("id", reg.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      setIsOpen(false);
    },
    onError: (error) => {
      alert("Failed to delete: " + error.message);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
          <TableCell className="font-medium">{reg.team_name}</TableCell>
          <TableCell className="max-w-[200px] truncate" title={reg.college}>
            {reg.college}
          </TableCell>
          <TableCell className="font-mono text-xs text-muted-foreground">
            {reg.transaction_id || "N/A"}
          </TableCell>
          <TableCell className="text-right">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {reg.team_size}
            </span>
          </TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-start justify-between gap-2 pr-6">
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="h-8"
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={() => updateMutation.mutate(editName)} disabled={updateMutation.isPending}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => { setIsEditing(false); setEditName(reg.team_name); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span>{reg.team_name}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6 ml-1" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </>
              )}
            </div>
            
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-8 w-8 shrink-0" 
              onClick={() => {
                if(confirm(`Are you sure you want to delete ${reg.team_name}?`)) {
                  deleteMutation.mutate();
                }
              }}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">College / Institution</p>
              <p className="text-sm">{reg.college}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Registration Date</p>
              <p className="text-sm">
                {new Date(reg.created_at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Team Members</h3>
            
            {/* Member 1 */}
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded">Leader</span>
                <p className="font-semibold">{reg.member1_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <p>📧 {reg.member1_email}</p>
                <p>📱 {reg.member1_phone}</p>
              </div>
            </div>

            {/* Member 2 */}
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
              <p className="font-semibold mb-2">{reg.member2_name}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <p>📧 {reg.member2_email}</p>
                <p>📱 {reg.member2_phone}</p>
              </div>
            </div>

            {/* Member 3 */}
            {reg.member3_name && (
              <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                <p className="font-semibold mb-2">{reg.member3_name}</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <p>📧 {reg.member3_email}</p>
                  <p>📱 {reg.member3_phone}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Payment Details</h3>
            <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground font-medium mb-1">Transaction ID</p>
              <p className="font-mono text-sm mb-4">{reg.transaction_id || "N/A"}</p>
              
              <p className="text-sm text-muted-foreground font-medium mb-2">Screenshot</p>
              {reg.payment_screenshot_url ? (
                <a href={reg.payment_screenshot_url} target="_blank" rel="noopener noreferrer" className="block max-w-sm rounded-md overflow-hidden border border-border/50 hover:opacity-90 transition-opacity">
                  <img src={reg.payment_screenshot_url} alt="Payment Screenshot" className="w-full h-auto object-contain bg-muted" />
                </a>
              ) : (
                <p className="text-sm italic text-muted-foreground">No screenshot uploaded</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

