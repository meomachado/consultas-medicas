import React, { useEffect, useMemo, useState, forwardRef, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, NavLink, Navigate, Outlet } from "react-router-dom";
import { Toaster, toast } from 'sonner';

// Stores
import { useConsultasStore } from './store/consultasStore';
import { useAuthStore } from './store/authStore';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ConsultaForm } from './pages/consultas/ConsultaForm';
import { ConsultaDetailsPage } from './pages/consultas/ConsultaDetailsPage';

// UTILS
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ICONS (Lucide-React)
import { Plus, Stethoscope, LayoutDashboard, LogOut, Calendar, CheckCircle, Moon, Sun } from 'lucide-react';

// UI COMPONENTS (Reutilizáveis em toda a aplicação)
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props} />
));
Input.displayName = "Input";

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} ref={ref} {...props} />
));
Label.displayName = "Label";

export const Badge = ({ className, status }: { className?: string; status: "Agendada" | "Realizada" | "Cancelada" }) => {
  const variants = {
    Agendada: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Realizada: "bg-green-500/10 text-green-500 border-green-500/20",
    Cancelada: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  const dotVariants = {
    Agendada: "bg-blue-500",
    Realizada: "bg-green-500",
    Cancelada: "bg-red-500",
  }
  return (
    <span className={cn("inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border", variants[status], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotVariants[status])}></span>
      {status}
    </span>
  );
};

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
    <textarea
        className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        ref={ref}
        {...props}
    />
));
Textarea.displayName = "Textarea";

// THEME PROVIDER & TOGGLE
type Theme = "dark" | "light" | "system";
type ThemeProviderState = { theme: Theme; setTheme: (theme: Theme) => void };
const ThemeProviderContext = createContext<ThemeProviderState>({ theme: "system", setTheme: () => null });

function ThemeProvider({ children, defaultTheme = "system", storageKey = "clinicsys-theme" }: { children: React.ReactNode; defaultTheme?: Theme; storageKey?: string; }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  const value = { theme, setTheme: (theme: Theme) => { localStorage.setItem(storageKey, theme); setTheme(theme); }, };
  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}
const useTheme = () => useContext(ThemeProviderContext);

function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// LAYOUT COMPONENT
const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.info("Você foi desconectado.");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
                <Stethoscope className="h-6 w-6 text-primary" />
                <span>ClinicSys</span>
            </Link>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          <NavLink to="/" className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive && "bg-muted text-primary")}> <LayoutDashboard className="h-4 w-4" /> Dashboard </NavLink>
          <NavLink to="/consultas/nova" className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive && "bg-muted text-primary")}> <Plus className="h-4 w-4" /> Nova Consulta </NavLink>
        </nav>
      </aside>
      <div className="flex flex-col sm:pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-4 border-b bg-background px-6">
            <ThemeToggle />
            <div className="flex items-center gap-2">
                <div className="text-right">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  );
}

// ROUTE PROTECTION
const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Layout /> : <Navigate to="/login" replace />;
}

// PAGE: Dashboard
function DashboardPage() {
  const { consultas, loading, fetchConsultas } = useConsultasStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  
  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);

  const filteredConsultas = useMemo(() => {
    return consultas
      .filter(c => 
        (c.paciente.toLowerCase().includes(search.toLowerCase()) || c.medico.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "Todos" || c.status === statusFilter)
      )
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [consultas, search, statusFilter]);

  const stats = useMemo(() => {
      const hoje = new Date().setHours(0,0,0,0);
      return {
          total: consultas.length,
          agendadasHoje: consultas.filter(c => new Date(c.data).setHours(0,0,0,0) === hoje && c.status === 'Agendada').length,
          realizadas: consultas.filter(c => c.status === 'Realizada').length,
      }
  }, [consultas]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Consultas Totais</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.total}</div>
                <p className="text-xs text-muted-foreground">Registradas no sistema</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Agendadas para Hoje</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.agendadasHoje}</div>
                 <p className="text-xs text-muted-foreground">Consultas a serem realizadas hoje</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Consultas Concluídas</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.realizadas}</div>
                 <p className="text-xs text-muted-foreground">Total de consultas já realizadas</p>
            </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Consultas</CardTitle>
              <CardDescription>Gerencie todas as consultas agendadas.</CardDescription>
            </div>
            <Link to="/consultas/nova">
              <Button><Plus className="w-4 h-4 mr-2"/> Nova Consulta</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input placeholder="Buscar por paciente ou médico..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="Todos">Todos os Status</option>
              <option value="Agendada">Agendada</option>
              <option value="Realizada">Realizada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Paciente</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Especialidade</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Data</th>
                  <th className="p-4 text-left text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="p-4 text-right text-sm font-semibold text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? ( <tr><td colSpan={5} className="text-center p-6">Carregando...</td></tr> ) : 
                filteredConsultas.length > 0 ? (
                  filteredConsultas.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/50">
                      <td className="p-4"> <div className="font-medium">{c.paciente}</div> <div className="text-sm text-muted-foreground">{c.medico}</div> </td>
                      <td className="p-4 text-muted-foreground">{c.especialidade}</td>
                      <td className="p-4 text-muted-foreground">{new Date(c.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td className="p-4"><Badge status={c.status} /></td>
                      <td className="p-4 text-right"> <Link to={`/consultas/${c.id}`}> <Button variant="outline" size="sm">Detalhes</Button> </Link> </td>
                    </tr>
                  ))
                ) : ( <tr><td colSpan={5} className="text-center p-6 text-muted-foreground">Nenhuma consulta encontrada.</td></tr> )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// MAIN APP COMPONENT
function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<PrivateRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="consultas/nova" element={<ConsultaForm />} />
            <Route path="consultas/:id" element={<ConsultaDetailsPage />} />
            <Route path="consultas/:id/editar" element={<ConsultaForm isEdit />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;