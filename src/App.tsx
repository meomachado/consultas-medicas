import React, { useEffect, useMemo, useState, forwardRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, NavLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { create } from "zustand";
import axios from "axios";
import { Toaster, toast } from 'sonner';

// UTILS
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority"; // Importando CVA

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TYPES
interface Consulta {
  id: number;
  paciente: string;
  medico: string;
  especialidade: string;
  data: string;
  status: "Agendada" | "Realizada" | "Cancelada";
  notas?: string;
}

// ZOD SCHEMA
const consultaSchema = z.object({
  paciente: z.string().min(3, "O nome do paciente deve ter no mínimo 3 caracteres."),
  medico: z.string().min(3, "O nome do médico deve ter no mínimo 3 caracteres."),
  especialidade: z.string().min(3, "A especialidade deve ter no mínimo 3 caracteres."),
  data: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "Data e hora são obrigatórios.",
  }),
  status: z.enum(["Agendada", "Realizada", "Cancelada"]),
  notas: z.string().optional(),
});
type ConsultaFormData = z.infer<typeof consultaSchema>;

// SERVICES
const api = axios.create({ baseURL: "http://localhost:3001" });

const consultasService = {
  list: async (): Promise<Consulta[]> => (await api.get("/consultas")).data,
  getById: async (id: number): Promise<Consulta> => (await api.get(`/consultas/${id}`)).data,
  create: async (data: Omit<Consulta, "id">): Promise<Consulta> => (await api.post("/consultas", data)).data,
  update: async (id: number, data: ConsultaFormData): Promise<Consulta> => (await api.put(`/consultas/${id}`, data)).data,
  remove: async (id: number): Promise<void> => await api.delete(`/consultas/${id}`),
};

// ZUSTAND STORE
interface ConsultasState {
  consultas: Consulta[];
  loading: boolean;
  fetchConsultas: () => Promise<void>;
  deleteConsulta: (id: number) => Promise<void>;
}

const useConsultasStore = create<ConsultasState>((set) => ({
  consultas: [],
  loading: true,
  fetchConsultas: async () => {
    set({ loading: true });
    try {
      const data = await consultasService.list();
      set({ consultas: data, loading: false });
    } catch (error) {
      toast.error("Erro ao buscar as consultas.");
      set({ loading: false });
    }
  },
  deleteConsulta: async (id: number) => {
    try {
      await consultasService.remove(id);
      set((state) => ({ consultas: state.consultas.filter((c) => c.id !== id) }));
      toast.success("Consulta excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir a consulta.");
    }
  },
}));

// ICONS
const Icon = ({ path, className = "w-6 h-6" }: { path: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={path} />
  </svg>
);
const PlusIcon = (props: { className?: string }) => <Icon path="M12 5v14m-7-7h14" {...props} />;
const StethoscopeIcon = (props: { className?: string }) => <Icon path="M8.5 19.5a2.5 2.5 0 0 1-3.24-2.22c-.17-.83.39-1.63 1.24-1.78a2.5 2.5 0 0 1 2.22 3.24c.17.83-.39 1.63-1.22 1.76zM4 10V2c0-1.1.9-2 2-2h1m0 0v6c0 1.1.9 2 2 2h2m0 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" {...props} />;
const LayoutDashboardIcon = (props: { className?: string }) => <Icon path="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" {...props} />;
const ChevronDownIcon = (props: { className?: string }) => <Icon path="m6 9 6 6 6-6" {...props} />;

// UI COMPONENTS

// FIX 1: Componente Button corrigido para aceitar 'size' e usar CVA
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);


const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("rounded-lg border bg-white text-gray-900 shadow-sm", className)} {...props} />
);
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
);
const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-sm text-gray-500", className)} {...props} />
);
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("p-6 pt-0", className)} {...props} />
);
const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
    <input className={cn("flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", className)} ref={ref} {...props} />
));
const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
    <label className={cn("text-sm font-medium leading-none text-gray-700", className)} ref={ref} {...props} />
));
const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    className={cn("flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", className)}
    ref={ref}
    {...props}
  />
));
const Select = ({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select
      className={cn("h-10 w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", className)}
      {...props}
    >
      {children}
    </select>
    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
  </div>
);
const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
));
const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100", className)} {...props} />
));
const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-bold text-gray-600 [&:has([role=checkbox])]:pr-0", className)} {...props} />
));
const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle text-gray-800", className)} {...props} />
));
const Badge = ({ className, status }: { className?: string; status: "Agendada" | "Realizada" | "Cancelada" }) => {
  const variants = {
    Agendada: "bg-blue-100 text-blue-800 border-blue-200",
    Realizada: "bg-green-100 text-green-800 border-green-200",
    Cancelada: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", variants[status], className)}>
      <span className={cn("w-2 h-2 mr-2 rounded-full", {
        'bg-blue-500': status === 'Agendada', 'bg-green-500': status === 'Realizada', 'bg-red-500': status === 'Cancelada',
      })}></span>
      {status}
    </span>
  );
};

// LAYOUT COMPONENT
const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen w-full bg-gray-100">
      <aside className="hidden w-64 flex-col border-r bg-white p-4 sm:flex">
        <div className="mb-8 flex items-center gap-2">
          <StethoscopeIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">ClinicSys</h1>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/" className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900", isActive && "bg-gray-100 text-gray-900 font-semibold")}>
            <LayoutDashboardIcon className="h-5 w-5" /> Dashboard
          </NavLink>
          <NavLink to="/consultas/nova" className={({ isActive }) => cn("flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900", isActive && "bg-gray-100 text-gray-900 font-semibold")}>
            <PlusIcon className="h-5 w-5" /> Nova Consulta
          </NavLink>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
          <h2 className="text-lg font-semibold">Gestão de Consultas Médicas</h2>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
);

// PAGE: Dashboard
function DashboardPage() {
  // FIX 3: Removido 'deleteConsulta' que não era usado aqui
  const { consultas, loading, fetchConsultas } = useConsultasStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  
  // FIX 2: Adicionada a dependência 'fetchConsultas'
  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);

  const filteredConsultas = useMemo(() => {
    return consultas
      .filter(c => 
        (c.paciente.toLowerCase().includes(search.toLowerCase()) || 
         c.medico.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "Todos" || c.status === statusFilter)
      )
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [consultas, search, statusFilter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Busque por consultas ou adicione uma nova.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Buscar por paciente ou médico..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Todos">Todos os Status</option>
              <option value="Agendada">Agendada</option>
              <option value="Realizada">Realizada</option>
              <option value="Cancelada">Cancelada</option>
            </Select>
            <Link to="/consultas/nova" className="md:ml-auto">
                <Button className="w-full md:w-auto">
                    <PlusIcon className="mr-2 h-4 w-4" /> Nova Consulta
                </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <Card>
         <CardHeader>
          <CardTitle>Lista de Consultas</CardTitle>
          <CardDescription>Total de {filteredConsultas.length} consultas encontradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center">Carregando...</TableCell></TableRow>
              ) : filteredConsultas.length > 0 ? (
                filteredConsultas.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{c.paciente}</div>
                      <div className="text-sm text-gray-500">{c.medico}</div>
                    </TableCell>
                    <TableCell>{c.especialidade}</TableCell>
                    <TableCell>{new Date(c.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                    <TableCell><Badge status={c.status} /></TableCell>
                    <TableCell className="text-right">
                       <Link to={`/consultas/${c.id}`}>
                         {/* FIX 1 (consequência): Usando o botão com a propriedade 'size' correta */}
                         <Button variant="outline" size="sm">Detalhes</Button>
                       </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Nenhuma consulta encontrada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// PAGE: Form (Create/Edit)
function ConsultaForm({ isEdit = false }: { isEdit?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchConsultas = useConsultasStore(state => state.fetchConsultas);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<ConsultaFormData>({
    resolver: zodResolver(consultaSchema),
    defaultValues: { status: 'Agendada' }
  });

  useEffect(() => {
    if (isEdit && id) {
      consultasService.getById(Number(id)).then(data => {
        const localDate = new Date(data.data).toISOString().slice(0, 16);
        reset({ ...data, data: localDate });
      });
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ConsultaFormData) => {
    try {
      let savedConsulta;
      if (isEdit && id) {
        savedConsulta = await consultasService.update(Number(id), data);
        toast.success("Consulta atualizada com sucesso!");
      } else {
        savedConsulta = await consultasService.create(data);
        toast.success("Consulta criada com sucesso!");
      }
      await fetchConsultas();
      navigate(`/consultas/${savedConsulta.id}`);
    } catch (error) {
      toast.error(`Erro ao ${isEdit ? 'atualizar' : 'criar'} a consulta.`);
    }
  };

  return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEdit ? 'Editar Consulta' : 'Nova Consulta'}</CardTitle>
          <CardDescription>Preencha os dados abaixo para {isEdit ? 'atualizar' : 'agendar'} a consulta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paciente">Paciente</Label>
                <Input id="paciente" {...register("paciente")} placeholder="Nome do Paciente" />
                {errors.paciente && <p className="text-red-500 text-sm">{errors.paciente.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="medico">Médico</Label>
                <Input id="medico" {...register("medico")} placeholder="Nome do Médico" />
                {errors.medico && <p className="text-red-500 text-sm">{errors.medico.message}</p>}
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input id="especialidade" {...register("especialidade")} placeholder="Ex: Cardiologia" />
                {errors.especialidade && <p className="text-red-500 text-sm">{errors.especialidade.message}</p>}
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data e Hora</Label>
                <Input id="data" type="datetime-local" {...register("data")} />
                {errors.data && <p className="text-red-500 text-sm">{errors.data.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="Agendada">Agendada</option>
                      <option value="Realizada">Realizada</option>
                      <option value="Cancelada">Cancelada</option>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notas">Notas Adicionais</Label>
              <Textarea id="notas" {...register("notas")} placeholder="Observações..." />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
  );
}

// PAGE: Details
function ConsultaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const deleteConsulta = useConsultasStore(state => state.deleteConsulta);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      consultasService.getById(Number(id))
        .then(setConsulta)
        .catch(() => {
            toast.error("Consulta não encontrada.");
            navigate('/');
        });
    }
  }, [id, navigate]);
  
  const handleDelete = async () => {
      if (consulta) {
          await deleteConsulta(consulta.id);
          navigate('/');
      }
  };

  if (!consulta) return <div>Carregando...</div>;

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Detalhes da Consulta</CardTitle>
              <CardDescription>
                Agendada para {new Date(consulta.data).toLocaleDateString('pt-BR')} às {new Date(consulta.data).toLocaleTimeString('pt-BR', {timeStyle: 'short'})}
              </CardDescription>
            </div>
             <Badge status={consulta.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1"><p className="text-sm font-medium text-gray-500">Paciente</p><p className="text-lg font-semibold">{consulta.paciente}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium text-gray-500">Médico</p><p className="text-lg font-semibold">{consulta.medico}</p></div>
                <div className="space-y-1"><p className="text-sm font-medium text-gray-500">Especialidade</p><p className="text-lg font-semibold">{consulta.especialidade}</p></div>
            </div>
             <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Notas</p>
                <p className="text-gray-700 whitespace-pre-wrap">{consulta.notas || 'Nenhuma nota adicional.'}</p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate('/')}>Voltar</Button>
              <Button variant="outline" onClick={() => navigate(`/consultas/${consulta.id}/editar`)}>Editar</Button>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>Excluir</Button>
            </div>
        </CardContent>
      </Card>
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <Card className="w-full max-w-md">
                 <CardHeader>
                    <CardTitle>Confirmar Exclusão</CardTitle>
                    <CardDescription>
                        Tem certeza que deseja excluir a consulta do paciente <strong>{consulta.paciente}</strong>? Esta ação não pode ser desfeita.
                    </CardDescription>
                 </CardHeader>
                 <CardContent className="flex justify-end gap-2">
                     <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                     <Button variant="destructive" onClick={handleDelete}>Confirmar</Button>
                 </CardContent>
            </Card>
        </div>
      )}
    </>
  );
}

// MAIN APP COMPONENT
function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Router>
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/consultas/nova" element={<ConsultaForm />} />
                <Route path="/consultas/:id" element={<ConsultaDetailsPage />} />
                <Route path="/consultas/:id/editar" element={<ConsultaForm isEdit />} />
            </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;