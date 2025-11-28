import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const { allowedUsers, addAllowedUser, removeAllowedUser, isAdmin } = useAuth();
    const [newUserEmail, setNewUserEmail] = useState("");
    const navigate = useNavigate();

    if (!isAdmin) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
                <p>Você não tem permissão para ver esta página.</p>
                <Button onClick={() => navigate("/")} className="mt-4">Voltar</Button>
            </div>
        );
    }

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUserEmail && newUserEmail.includes("@")) {
            addAllowedUser(newUserEmail);
            setNewUserEmail("");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate("/")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                    <h1 className="text-3xl font-bold text-brand-purple">Gerenciamento de Usuários</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Adicionar Novo Usuário</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAdd} className="flex gap-4">
                            <Input
                                placeholder="email@exemplo.com"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" className="bg-brand-purple hover:bg-brand-purple/90">
                                <Plus className="mr-2 h-4 w-4" /> Adicionar
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Usuários Permitidos ({allowedUsers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {allowedUsers.map((email) => (
                                <div key={email} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                                    <span className="font-medium">{email}</span>
                                    {email !== "higorlemosramos@gmail.com" && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => removeAllowedUser(email)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {email === "higorlemosramos@gmail.com" && (
                                        <span className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-1 rounded-full">Admin</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Admin;
