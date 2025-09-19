import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

// CORREÇÃO: Os caminhos agora voltam duas pastas (../../) para chegar na pasta 'src'
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(3, "A senha deve ter pelo menos 3 caracteres."),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const user = await authService.login(data);
      if (user) {
        toast.success(`Bem-vindo(a), ${user.name}!`);
        setUser(user);
        navigate("/");
      } else {
        toast.error("E-mail ou senha inválidos.");
      }
    } catch {
      toast.error("Ocorreu um erro no servidor. Tente novamente mais tarde.");
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">ClinicSys</h1>
            <p className="text-gray-500">Faça login para continuar</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="seuemail@exemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-blue-600 py-3 px-4 text-white font-semibold shadow-md transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}