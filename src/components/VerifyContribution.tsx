import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search } from "lucide-react";

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

const VerifyContribution = () => {
  const [txid, setTxid] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    found: boolean;
    contribution?: ContributionRecord;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    if (!txid.trim()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate verification delay
    setTimeout(() => {
      const contributions = JSON.parse(localStorage.getItem("contributions") || "[]");
      const found = contributions.find((c: ContributionRecord) => c.txid === txid.trim());
      
      setVerificationResult({
        found: !!found,
        contribution: found || undefined
      });
      setIsLoading(false);
    }, 1000);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Verify Contribution</CardTitle>
        <CardDescription>
          Verify volunteer contributions using transaction ID from the Algorand blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="txid">Transaction ID (txid)</Label>
            <Input
              id="txid"
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
              placeholder="Enter transaction ID (e.g., ALG_1699123456789_abc123xyz)"
              className="font-mono text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleVerify} disabled={!txid.trim() || isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
          </div>
        </div>

        {verificationResult && (
          <Card className={`border-2 ${verificationResult.found ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'}`}>
            <CardContent className="pt-6">
              {verificationResult.found ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-success font-semibold text-lg">
                    <CheckCircle className="h-5 w-5" />
                    Contribution verified ✅
                  </div>
                  
                  {verificationResult.contribution && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Volunteer Name</Label>
                          <p className="text-base font-medium">{verificationResult.contribution.volunteerName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Task Description</Label>
                          <p className="text-base">{verificationResult.contribution.taskDescription}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Hours Worked</Label>
                          <p className="text-base font-medium">{verificationResult.contribution.hoursWorked} hours</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Event Name</Label>
                          <p className="text-base font-medium">{verificationResult.contribution.eventName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Timestamp</Label>
                          <p className="text-base">{formatDateTime(verificationResult.contribution.timestamp)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Issuer Wallet</Label>
                          <p className="text-base font-mono text-sm bg-muted px-2 py-1 rounded">
                            {verificationResult.contribution.issuerWallet}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    Verified on Algorand Blockchain
                  </Badge>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-destructive font-semibold text-lg">
                    <XCircle className="h-5 w-5" />
                    No record found ❌
                  </div>
                  <p className="text-muted-foreground">
                    The provided transaction ID could not be found on the blockchain.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyContribution;