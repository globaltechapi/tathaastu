import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CreateRegistryPage from "./pages/CreateRegistryPage";
import RegistryDashboardPage from "./pages/RegistryDashboardPage";
import AddItemPage from "./pages/AddItemPage";
import ManualItemPage from "./pages/ManualItemPage";
import ViewRegistryPage from "./pages/ViewRegistryPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyRegistriesPage from "./pages/MyRegistriesPage";
import InviteGuestsPage from "./pages/InviteGuestsPage";
import ViewInvitationPage from "./pages/ViewInvitationPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import { AuthProvider } from "./lib/auth";
import AuthGuard from "./components/auth/AuthGuard";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/create-registry"
                element={
                  <AuthGuard>
                    <CreateRegistryPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/my-registries"
                element={
                  <AuthGuard>
                    <MyRegistriesPage />
                  </AuthGuard>
                }
              />
              <Route path="/registry/:id" element={<ViewRegistryPage />} />
              <Route
                path="/registry/:id/dashboard"
                element={
                  <AuthGuard>
                    <RegistryDashboardPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/registry/:id/add-item"
                element={
                  <AuthGuard>
                    <AddItemPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/registry/:id/add-manual-item"
                element={
                  <AuthGuard>
                    <ManualItemPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/registry/:id/invite"
                element={
                  <AuthGuard>
                    <InviteGuestsPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/invitation/:token"
                element={<ViewInvitationPage />}
              />
              <Route
                path="/account"
                element={
                  <AuthGuard>
                    <AccountSettingsPage />
                  </AuthGuard>
                }
              />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
            </Route>
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
