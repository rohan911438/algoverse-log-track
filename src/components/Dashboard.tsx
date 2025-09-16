import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Filter, Award, ExternalLink } from "lucide-react";

interface ContributionRecord {
  volunteerName: string;
  taskDescription: string;
  hoursWorked: string;
  eventName: string;
  dateTime: string;
  txid: string;
  timestamp: string;
  issuerWallet: string;
}

const Dashboard = () => {
  const [contributions, setContributions] = useState<ContributionRecord[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<ContributionRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedContributions = JSON.parse(localStorage.getItem("contributions") || "[]");
    setContributions(storedContributions);
    setFilteredContributions(storedContributions);
  }, []);

  useEffect(() => {
    const filtered = contributions.filter(contrib =>
      contrib.volunteerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrib.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrib.taskDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContributions(filtered);
  }, [searchTerm, contributions]);

  const totalHours = contributions.reduce((sum, contrib) => sum + parseFloat(contrib.hoursWorked), 0);

  const handleIssueNFTBadge = (contribution: ContributionRecord) => {
    // Mock NFT generation
    alert(`NFT Badge issued for ${contribution.volunteerName}!\nTransaction: NFT_${Date.now()}`);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" />
            Volunteer Dashboard
          </CardTitle>
          <CardDescription>
            Track and manage volunteer contributions on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">{contributions.length}</div>
              <div className="text-sm text-muted-foreground">Total Contributions</div>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="text-2xl font-bold text-accent">{totalHours.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="text-2xl font-bold text-success">{new Set(contributions.map(c => c.volunteerName)).size}</div>
              <div className="text-sm text-muted-foreground">Unique Volunteers</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by volunteer name, event, or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="space-y-4">
            {filteredContributions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {contributions.length === 0 ? (
                  <div>
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No contributions logged yet. Start by logging your first contribution!</p>
                  </div>
                ) : (
                  <p>No contributions match your search criteria.</p>
                )}
              </div>
            ) : (
              filteredContributions.map((contribution, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div>
                          <div className="font-semibold text-primary">{contribution.volunteerName}</div>
                          <Badge variant="secondary" className="mt-1">{contribution.eventName}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contribution.taskDescription}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{contribution.hoursWorked} hours</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(contribution.timestamp)}
                        </div>
                        <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {contribution.txid}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleIssueNFTBadge(contribution)}
                          className="flex items-center gap-2"
                        >
                          <Award className="h-4 w-4" />
                          Issue NFT Badge
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigator.clipboard.writeText(contribution.txid)}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Copy TxID
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;