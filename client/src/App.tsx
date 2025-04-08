import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import TelegramAuth from "@/pages/TelegramAuth";
import Spin from "@/pages/Spin";
import TeamBattle from "@/pages/TeamBattle";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  // Debug current auth state
  useEffect(() => {
    console.log("Auth state:", { isAuthenticated, isLoading, user });
  }, [isAuthenticated, isLoading, user]);

  // Only show loading spinner when we're intentionally waiting for a login/logout process
  // Not during initial app load
  const showLoader = isLoading;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={isAuthenticated ? Home : TelegramAuth} />
          <Route path="/auth" component={TelegramAuth} />
          <Route path="/spin">
            {isAuthenticated ? <Spin /> : <TelegramAuth />}
          </Route>
          <Route path="/team-battle">
            {isAuthenticated ? <TeamBattle /> : <TelegramAuth />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;
