import { useState } from "react";
import LogContribution from "@/components/LogContribution";
import VerifyContribution from "@/components/VerifyContribution";
import Dashboard from "@/components/Dashboard";
import Navigation from "@/components/Navigation";
import { Shield, Zap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("log");

  const renderContent = () => {
    switch (activeTab) {
      case "log":
        return <LogContribution />;
      case "verify":
        return <VerifyContribution />;
      case "dashboard":
        return <Dashboard />;
      default:
        return <LogContribution />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Volunteer Contribution Tracker
            </h1>
            <div className="p-3 bg-accent/10 rounded-full border border-accent/20">
              <Zap className="h-8 w-8 text-accent" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure, transparent volunteer contribution tracking powered by Algorand blockchain technology
          </p>
        </div>

        {/* Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className="flex justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
