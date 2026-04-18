import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { useAuth } from "./context/AuthContext";

import { HomePage } from "./pages/home/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { PetsListPage } from "./pages/pets/PetsListPage";
import { AddPetPage } from "./pages/pets/AddPetPage";
import { EditPetPage } from "./pages/pets/EditPetPage";
import { PetDetailPage } from "./pages/pets/PetDetailPage";
import { ExpensesListPage } from "./pages/expenses/ExpensesListPage";
import { AddExpensePage } from "./pages/expenses/AddExpensePage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { PageSpinner } from "./components/ui/Spinner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000 },
  },
});

function AppPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout appShell>{children}</Layout>
    </ProtectedRoute>
  );
}

function PublicOnlyPage({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <PageSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnlyPage><HomePage /></PublicOnlyPage>} />
      <Route path="/login" element={<PublicOnlyPage><LoginPage /></PublicOnlyPage>} />
      <Route path="/dashboard" element={<AppPage><DashboardPage /></AppPage>} />
      <Route path="/pets" element={<AppPage><PetsListPage /></AppPage>} />
      <Route path="/pets/add" element={<AppPage><AddPetPage /></AppPage>} />
      <Route path="/pets/:id" element={<AppPage><PetDetailPage /></AppPage>} />
      <Route path="/pets/:id/edit" element={<AppPage><EditPetPage /></AppPage>} />
      <Route path="/expenses" element={<AppPage><ExpensesListPage /></AppPage>} />
      <Route path="/expenses/add" element={<AppPage><AddExpensePage /></AppPage>} />
      <Route path="/profile" element={<AppPage><ProfilePage /></AppPage>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
