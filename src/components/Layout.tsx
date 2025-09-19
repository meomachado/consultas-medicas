import { NavLink, Link, Outlet } from "react-router-dom"; // useNavigate foi removido
import { Stethoscope, LayoutDashboard, Plus, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "../providers/ThemeProvider"; // O caminho do import foi corrigido aqui
import { cn } from "@/lib/utils";

export function Layout() {
  // Lógica de exemplo para o usuário - substitua pelo seu authStore quando implementar
  const user = {
    name: "Dr. João",
    email: "joao@exemplo.com",
  };

  const handleLogout = () => {
    console.log("Logout clicado");
    // Futuramente, você adicionaria:
    // logout();
    // navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Barra Lateral (Sidebar) */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span>ClinicSys</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <NavLink
            to="/"
            end // 'end' garante que o link só fica ativo na página exata
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </NavLink>
          <NavLink
            to="/consultas/nova"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
              )
            }
          >
            <Plus className="h-4 w-4" /> Nova Consulta
          </NavLink>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex flex-col sm:pl-60">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-end gap-4 border-b bg-background px-6">
          <ThemeToggle />
          <div className="flex items-center gap-3">
             <div className="text-right">
               <p className="text-sm font-medium">{user.name}</p>
               <p className="text-xs text-muted-foreground">{user.email}</p>
             </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet /> {/* As páginas da rota serão renderizadas aqui */}
        </main>
      </div>
    </div>
  );
}

// Componente para alternar o tema, pode ficar neste arquivo ou em seu próprio.
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