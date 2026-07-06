import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ClaimedBatches from "./pages/ClaimedBatches";
import Transactions from "./pages/Transactions";
import Impact from "./pages/Impact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import PublicImpact from "./pages/PublicImpact";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "claimed-batches", element: <ClaimedBatches /> },
      { path: "transactions", element: <Transactions /> },
      { path: "impact", element: <Impact /> },
    ],
  },
  {
    path: "/about",
    element: <Layout />,
    children: [{ index: true, element: <About /> }],
  },
  {
    path: "/privacy",
    element: <Layout />,
    children: [{ index: true, element: <Privacy /> }],
  },
  {
    path: "/impact",
    element: <Layout />,
    children: [{ index: true, element: <PublicImpact /> }],
  },
  { path: "*", element: <NotFound /> },
]);