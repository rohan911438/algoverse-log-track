import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Clock, ArrowLeft, Plus, CheckCircle, AlertCircle, XCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for previous submissions
const mockSubmissions = [
  {
    id: 1,
    eventName: "Beach Cleanup Drive",
    hoursWorked: 4,
    taskDescription: "Cleaned the local beach and collected plastic waste",
    dateSubmitted: "2025-09-15",
    status: "approved",
    txId: "ALG1726123456789abcdef"
  },
  {
    id: 2,
    eventName: "Food Bank Assistance",
    hoursWorked: 6,
    taskDescription: "Sorted and packaged food donations for families",
    dateSubmitted: "2025-09-14",
    status: "pending",
    txId: null
  },
  {
    id: 3,
    eventName: "Tree Plantation",
    hoursWorked: 3,
    taskDescription: "Planted trees in the community park",
    dateSubmitted: "2025-09-13",
    status: "rejected",
    txId: null,
    feedback: "Insufficient documentation provided"
  }
];

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    volunteerName: "",
    hoursWorked: "",
    eventName: "",
    taskDescription: "",
    organizationName: "",
    contactEmail: "",
    dateTime: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.volunteerName || !formData.hoursWorked || !formData.eventName || !formData.taskDescription || !formData.organizationName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Contribution Submitted! ✅",
      description: "Your contribution has been sent for approval. You'll be notified once reviewed.",
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
      organizationName: "",
      contactEmail: "",
      dateTime: new Date().toISOString().split('T')[0]
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-cyan-400" />
            <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
          </div>
        </div>

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="submit" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              <Plus className="w-4 h-4 mr-2" />
              Submit Contribution
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              My Submissions
            </TabsTrigger>
          </TabsList>

          {/* Submit Contribution Tab */}
          <TabsContent value="submit">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  Log New Contribution
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Submit your volunteer work for approval and blockchain verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Volunteer Name */}
                    <div className="space-y-2">
                      <Label htmlFor="volunteerName" className="text-white">Your Full Name *</Label>
                      <Input
                        id="volunteerName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.volunteerName}
                        onChange={(e) => handleInputChange("volunteerName", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    {/* Hours Worked */}
                    <div className="space-y-2">
                      <Label htmlFor="hoursWorked" className="text-white">Hours Worked *</Label>
                      <Input
                        id="hoursWorked"
                        type="number"
                        min="0.5"
                        step="0.5"
                        placeholder="e.g., 4.5"
                        value={formData.hoursWorked}
                        onChange={(e) => handleInputChange("hoursWorked", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    {/* Event Name */}
                    <div className="space-y-2">
                      <Label htmlFor="eventName" className="text-white">Event/Activity Name *</Label>
                      <Input
                        id="eventName"
                        type="text"
                        placeholder="e.g., Beach Cleanup Drive"
                        value={formData.eventName}
                        onChange={(e) => handleInputChange("eventName", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    {/* Organization Name */}
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="text-white">Organization Name *</Label>
                      <Input
                        id="organizationName"
                        type="text"
                        placeholder="e.g., Green Earth NGO"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange("organizationName", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label htmlFor="dateTime" className="text-white">Date of Activity</Label>
                      <Input
                        id="dateTime"
                        type="date"
                        value={formData.dateTime}
                        onChange={(e) => handleInputChange("dateTime", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    {/* Contact Email */}
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-white">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Task Description */}
                  <div className="space-y-2">
                    <Label htmlFor="taskDescription" className="text-white">Task Description *</Label>
                    <Textarea
                      id="taskDescription"
                      rows={4}
                      placeholder="Describe what you did during this volunteer activity..."
                      value={formData.taskDescription}
                      onChange={(e) => handleInputChange("taskDescription", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
                      required
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white flex-1"
                    >
                      Submit for Approval
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleReset}
                      className="border-white/30 text-white hover:bg-white hover:text-slate-900"
                    >
                      Reset Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions History Tab */}
          <TabsContent value="history">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Your Submission History</h3>
              
              {mockSubmissions.map((submission) => (
                <Card key={submission.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{submission.eventName}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {submission.hoursWorked} hours • Submitted on {submission.dateSubmitted}
                        </CardDescription>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-300 mb-3">{submission.taskDescription}</p>
                    
                    {submission.status === 'approved' && submission.txId && (
                      <div className="p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                        <p className="text-green-300 text-sm font-medium">✅ Verified on Blockchain</p>
                        <p className="text-green-200 text-xs font-mono mt-1">TX ID: {submission.txId}</p>
                      </div>
                    )}
                    
                    {submission.status === 'rejected' && submission.feedback && (
                      <div className="p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                        <p className="text-red-300 text-sm font-medium">❌ Feedback:</p>
                        <p className="text-red-200 text-sm mt-1">{submission.feedback}</p>
                      </div>
                    )}
                    
                    {submission.status === 'pending' && (
                      <div className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                        <p className="text-yellow-300 text-sm">⏳ Waiting for organizer approval</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VolunteerDashboard;