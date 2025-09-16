import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const LogContribution = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    volunteerName: "",
    taskDescription: "",
    hoursWorked: "",
    eventName: "",
    dateTime: new Date().toISOString().slice(0, 16),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.volunteerName || !formData.taskDescription || !formData.hoursWorked || !formData.eventName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Generate mock transaction ID
    const txid = `ALG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store in localStorage for demo purposes
    const contributions = JSON.parse(localStorage.getItem("contributions") || "[]");
    const newContribution = {
      ...formData,
      txid,
      timestamp: new Date().toISOString(),
      issuerWallet: "DEMO_WALLET_" + Math.random().toString(36).substr(2, 8)
    };
    
    contributions.push(newContribution);
    localStorage.setItem("contributions", JSON.stringify(contributions));

    toast({
      title: "Contribution Logged Successfully! ✅",
      description: `Transaction ID: ${txid}`,
      variant: "default",
    });

    // Reset form
    setFormData({
      volunteerName: "",
      taskDescription: "",
      hoursWorked: "",
      eventName: "",
      dateTime: new Date().toISOString().slice(0, 16),
    });
  };

  const handleReset = () => {
    setFormData({
      volunteerName: "",
      taskDescription: "",
      hoursWorked: "",
      eventName: "",
      dateTime: new Date().toISOString().slice(0, 16),
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Log Volunteer Contribution</CardTitle>
        <CardDescription>
          Record your volunteer work on the Algorand blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volunteerName">Volunteer Name *</Label>
              <Input
                id="volunteerName"
                name="volunteerName"
                value={formData.volunteerName}
                onChange={handleInputChange}
                placeholder="Enter volunteer name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursWorked">Hours Worked *</Label>
              <Input
                id="hoursWorked"
                name="hoursWorked"
                type="number"
                min="0"
                step="0.5"
                value={formData.hoursWorked}
                onChange={handleInputChange}
                placeholder="0.0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name *</Label>
            <Input
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              placeholder="Enter event name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskDescription">Task Description *</Label>
            <Textarea
              id="taskDescription"
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleInputChange}
              placeholder="Describe the volunteer work performed"
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTime">Date & Time</Label>
            <Input
              id="dateTime"
              name="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={handleInputChange}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="flex-1">
              Submit Contribution
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} className="flex-1 sm:flex-initial">
              Reset Form
            </Button>
          </div>

          <div className="text-sm text-muted-foreground bg-accent/20 p-3 rounded-md border-l-4 border-accent">
            <strong>Note:</strong> This contribution will be stored on the Algorand blockchain. A transaction ID (txid) will be generated as proof.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LogContribution;