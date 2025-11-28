import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Login = () => {
    const { login, user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            await login(email);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-purple p-4">
            <Card className="w-full max-w-md shadow-2xl border-none">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto mb-4">
                        {/* Logo Text Simulation based on image */}
                        <h1 className="text-4xl font-bold text-brand-purple tracking-tight leading-none">
                            Augusto
                            <br />
                            <span className="text-5xl">Velloso</span>
                        </h1>
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-800">Bem-vindo</CardTitle>
                    <CardDescription>
                        Faça login para acessar o sistema de Acabamento de Parede
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Input
                                type="email"
                                placeholder="Digite seu email do Google"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 text-base"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white h-12 text-lg font-medium transition-all"
                        >
                            {isLoading ? "Carregando..." : "Entrar com Google"}
                        </Button>
                    </form>
                    <p className="text-xs text-center text-gray-500 mt-4">
                        Apenas usuários autorizados podem acessar este sistema.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
