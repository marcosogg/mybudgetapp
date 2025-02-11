
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ROUTES } from "./routeConstants";
import { lazy } from "react";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Categories from "@/pages/Categories";
import Transactions from "@/pages/Transactions";
import TransactionImport from "@/pages/TransactionImport";
import Budget from "@/pages/Budget";
import Reminders from "@/pages/Reminders";
import Settings from "@/pages/Settings";
import SavingsGoals from "@/pages/SavingsGoals";
import NotFound from "@/pages/NotFound";

export const routes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.AUTH,
    element: <Auth />,
  },
  {
    path: ROUTES.CATEGORIES,
    element: (
      <ProtectedRoute>
        <Categories />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.TRANSACTIONS,
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.TRANSACTION_IMPORT,
    element: (
      <ProtectedRoute>
        <TransactionImport />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.BUDGET,
    element: (
      <ProtectedRoute>
        <Budget />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.REMINDERS,
    element: (
      <ProtectedRoute>
        <Reminders />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SAVINGS_GOALS,
    element: (
      <ProtectedRoute>
        <SavingsGoals />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
