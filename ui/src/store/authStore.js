import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null, // { id, username, email, roles }
    isAuthenticated: false,

    // вход в систему
    login: (userData) =>
        set({
            user: userData,
            isAuthenticated: true,
        }),

    // выход из системы
    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}));

export default useAuthStore;