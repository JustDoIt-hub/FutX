import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Spin from "@/pages/Spin";
import TeamBattle from "@/pages/TeamBattle";
import Collection from "@/pages/Collection";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Create placeholder page for Shop
const Shop = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-white mb-6">FUT Shop</h1>
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6">
      <p className="text-white text-lg">Shop items will be displayed here.</p>
    </div>
  </div>
);

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/spin" component={Spin} />
          <Route path="/team-battle" component={TeamBattle} />
          <Route path="/collection" component={Collection} />
          <Route path="/shop" component={Shop} />
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
