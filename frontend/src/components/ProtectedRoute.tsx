
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireProfile = true }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Simple loading spinner using FontAwesome
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <i className="fas fa-circle-notch fa-spin text-4xl text-brand-primary"></i>
            </div>
        );
    }

    if (!user) {
        // Redirect to login (or welcome page which is at / currently)
        // If we want to redirect to /login specifically:
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requireProfile && !user.profile) {
        // User is logged in but hasn't completed onboarding
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
