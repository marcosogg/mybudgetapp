
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Categories from "@/pages/Categories";
import Transactions from "@/pages/Transactions";
import TransactionImport from "@/pages/TransactionImport";
import Budget from "@/pages/Budget";
import Reminders from "@/pages/Reminders";
import Settings from "@/pages/Settings";
import SavingsGoals from "@/pages/SavingsGoals";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/categories",
    element: (
      <ProtectedRoute>
        <Categories />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions",
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions/import",
    element: (
      <ProtectedRoute>
        <TransactionImport />
      </ProtectedRoute>
    ),
  },
  {
    path: "/budget",
    element: (
      <ProtectedRoute>
        <Budget />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reminders",
    element: (
      <ProtectedRoute>
        <Reminders />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/savings-goals",
    element: (
      <ProtectedRoute>
        <SavingsGoals />
      </ProtectedRoute>
    ),
  },
];
