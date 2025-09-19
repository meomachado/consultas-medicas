import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Providers e Layout
import { ThemeProvider } from "./providers/ThemeProvider";
import { Layout } from "./components/Layout";

// Pages
import { DashboardPage } from "./pages/DashboardPage";
import { ConsultaFormPage } from "./pages/consultas/ConsultaFormPage"; // Import corrigido para o nome de arquivo correto
import { ConsultaDetailsPage } from "./pages/consultas/ConsultaDetailsPage";
// import { LoginPage } from "./pages/auth/LoginPage"; // Futuramente, você pode descomentar esta linha

function App() {
  return (
    // O ThemeProvider envolve toda a aplicação para gerenciar o tema claro/escuro
    <ThemeProvider defaultTheme="light" storageKey="clinicsys-theme">
      <BrowserRouter>
        {/* O Toaster permite exibir notificações bonitas em qualquer lugar */}
        <Toaster richColors position="top-right" />
        
        <Routes>
          {/* Aqui ficaria a rota para a página de login */}
          {/* <Route path="/login" element={<LoginPage />} /> */}

          {/* Todas as rotas principais ficam dentro do componente Layout */}
          <Route path="/" element={<Layout />}>
            {/* A rota inicial (/) renderiza o Dashboard */}
            <Route index element={<DashboardPage />} />
            
            <Route path="consultas">
              <Route path="nova" element={<ConsultaFormPage />} />
              <Route path=":id" element={<ConsultaDetailsPage />} />
              <Route path=":id/editar" element={<ConsultaFormPage />} />
            </Route>

            {/* Uma rota "catch-all" para páginas não encontradas */}
            <Route path="*" element={
              <div className="text-center py-10">
                <h1 className="text-3xl font-bold">Erro 404</h1>
                <p className="text-muted-foreground">Página não encontrada.</p>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;