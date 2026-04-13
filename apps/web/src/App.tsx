import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { PetsListPage } from "./pages/pets/PetsListPage";
import { AddPetPage } from "./pages/pets/AddPetPage";
import { EditPetPage } from "./pages/pets/EditPetPage";
import { PetDetailPage } from "./pages/pets/PetDetailPage";
import { ExpensesListPage } from "./pages/expenses/ExpensesListPage";
import { AddExpensePage } from "./pages/expenses/AddExpensePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout appShell={false}>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout appShell={false}>
                  <LoginPage />
                </Layout>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout appShell>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pets"
              element={
                <ProtectedRoute>
                  <Layout appShell>
                    <PetsListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pets/add"
              element={
                <ProtectedRoute>
                  <Layout appShell>
                    <AddPetPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pets/:id"
              element={
                <ProtectedRoute>
                  <Layout appShell>
                    <PetDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pets/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout appShell>
                    <EditPetPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <Layout appShell>
                    <ExpensesListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses/add"
              element={
                <ProtectedRoute>
                  <Layout appShell>
                    <AddExpensePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}