import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
    email: string;
    name: string;
    photoURL?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    isAllowed: boolean;
    allowedUsers: string[];
    addAllowedUser: (email: string) => void;
    removeAllowedUser: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "higorlemosramos@gmail.com";
const STORAGE_KEY_ALLOWED = "allowed_users";
const STORAGE_KEY_USER = "current_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allowedUsers, setAllowedUsers] = useState<string[]>([ADMIN_EMAIL]);

    useEffect(() => {
        // Load allowed users from storage
        const storedAllowed = localStorage.getItem(STORAGE_KEY_ALLOWED);
        if (storedAllowed) {
            setAllowedUsers(JSON.parse(storedAllowed));
        } else {
            localStorage.setItem(STORAGE_KEY_ALLOWED, JSON.stringify([ADMIN_EMAIL]));
        }

        // Check for existing session
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string) => {
        setIsLoading(true);

        if (!email) {
            setIsLoading(false);
            return;
        }

        const mockUser: User = {
            email: email,
            name: email.split('@')[0],
            photoURL: `https://ui-avatars.com/api/?name=${email}&background=random`
        };

        // Check if allowed
        const isUserAllowed = allowedUsers.includes(email) || email === ADMIN_EMAIL;

        if (!isUserAllowed) {
            toast.error("Acesso negado. Seu email não está na lista de permitidos.");
            setIsLoading(false);
            return;
        }

        setUser(mockUser);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
        toast.success(`Bem-vindo, ${mockUser.name}!`);
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY_USER);
        toast.info("Você saiu da conta.");
    };

    const addAllowedUser = (email: string) => {
        if (!allowedUsers.includes(email)) {
            const newAllowed = [...allowedUsers, email];
            setAllowedUsers(newAllowed);
            localStorage.setItem(STORAGE_KEY_ALLOWED, JSON.stringify(newAllowed));
            toast.success(`${email} adicionado à lista de permissões.`);
        }
    };

    const removeAllowedUser = (email: string) => {
        if (email === ADMIN_EMAIL) {
            toast.error("Não é possível remover o administrador.");
            return;
        }
        const newAllowed = allowedUsers.filter(e => e !== email);
        setAllowedUsers(newAllowed);
        localStorage.setItem(STORAGE_KEY_ALLOWED, JSON.stringify(newAllowed));
        toast.success(`${email} removido da lista.`);
    };

    const isAdmin = user?.email === ADMIN_EMAIL;
    const isAllowed = user ? allowedUsers.includes(user.email) : false;

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            isAdmin,
            isAllowed,
            allowedUsers,
            addAllowedUser,
            removeAllowedUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
