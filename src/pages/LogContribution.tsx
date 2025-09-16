import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LogContribution = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    volunteerName: "",
    hoursWorked: "",
    eventName: "",
    taskDescription: "",
    dateTime: new Date().toLocaleString()
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.volunteerName || !formData.hoursWorked || !formData.eventName || !formData.taskDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate blockchain submission
    const mockTxId = `ALG${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    toast({
      title: "Contribution Submitted! ✅",
      description: `Transaction ID: ${mockTxId}. Your contribution has been recorded on the blockchain.`,
    });

    // Reset form after successful submission
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      volunteerName: "",
      hoursWorked: "",
      eventName: "",
      taskDescription: "",
      dateTime: new Date().toLocaleString()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-accent/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Log Volunteer Contribution
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Record your volunteer work on the Algorand blockchain
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                Contribution Details
              </CardTitle>
              <CardDescription>
                Fill in the details of your volunteer contribution below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Volunteer Name */}
                <div className="space-y-2">
                  <Label htmlFor="volunteerName">Volunteer Name *</Label>
                  <Input
                    id="volunteerName"
                    type="text"
                    value={formData.volunteerName}
                    onChange={(e) => handleInputChange("volunteerName", e.target.value)}
                    placeholder="Enter volunteer name"
                    required
                  />
                </div>

                {/* Hours Worked */}
                <div className="space-y-2">
                  <Label htmlFor="hoursWorked">Hours Worked *</Label>
                  <Input
                    id="hoursWorked"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.hoursWorked}
                    onChange={(e) => handleInputChange("hoursWorked", e.target.value)}
                    placeholder="0.0"
                    required
                  />
                </div>

                {/* Event Name */}
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => handleInputChange("eventName", e.target.value)}
                    placeholder="Enter event name"
                    required
                  />
                </div>

                {/* Task Description */}
                <div className="space-y-2">
                  <Label htmlFor="taskDescription">Task Description *</Label>
                  <Textarea
                    id="taskDescription"
                    value={formData.taskDescription}
                    onChange={(e) => handleInputChange("taskDescription", e.target.value)}
                    placeholder="Describe the volunteer work performed"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                {/* Date & Time (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="dateTime">Date & Time</Label>
                  <Input
                    id="dateTime"
                    type="text"
                    value={formData.dateTime}
                    readOnly
                    className="bg-muted/50 cursor-not-allowed"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Submit Contribution
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleReset}
                    className="flex-1 border-primary/20 hover:bg-primary/5"
                  >
                    Reset Form
                  </Button>
                </div>

                {/* Blockchain Note */}
                <div className="text-center pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 inline-block mr-1" />
                    This contribution will be stored on the Algorand blockchain. A transaction ID (txid) will be generated as proof.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogContribution;