
import { User } from '../types';

const USERS_KEY = 'convoverse_users';
const SESSION_KEY = 'convoverse_session';

export const authService = {
    getUsers: (): User[] => {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    },

    register: (email: string, password: string, name: string): User => {
        const users = authService.getUsers();
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            email,
            password, // In a real app, this should be hashed. Mock only!
            name,
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // No auto-login, require manual sign in
        // authService.login(email, password);

        return newUser;
    },

    login: (email: string, password: string): User => {
        const users = authService.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    getCurrentUser: (): User | null => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    updateUser: (updatedUser: User) => {
        const users = authService.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);

        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser)); // Update session too
        }
    }
};
