import { Button } from "@/components/ui/button";
import { FileText, Search, List } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <Button
        variant={activeTab === "log" ? "default" : "outline"}
        onClick={() => setActiveTab("log")}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Log Contribution
      </Button>
      <Button
        variant={activeTab === "verify" ? "default" : "outline"}
        onClick={() => setActiveTab("verify")}
        className="flex items-center gap-2"
      >
        <Search className="h-4 w-4" />
        Verify Contribution
      </Button>
      <Button
        variant={activeTab === "dashboard" ? "default" : "outline"}
        onClick={() => setActiveTab("dashboard")}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        Dashboard
      </Button>
    </div>
  );
};

export default Navigation;