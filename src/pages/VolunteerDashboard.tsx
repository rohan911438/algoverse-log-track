import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Clock, ArrowLeft, Plus, CheckCircle, AlertCircle, XCircle, User, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock organizer data
const mockOrganizers = [
  {
    id: "org-1",
    name: "Dr. Sarah Wilson",
    organization: "Green Earth NGO",
    email: "sarah.wilson@greenearth.org",
    phone: "+1 (555) 123-4567",
    specialties: ["Environmental", "Community Service"],
    verified: true
  },
  {
    id: "org-2",
    name: "Mark Rodriguez",
    organization: "Hope Foundation",
    email: "mark.r@hopefoundation.org",
    phone: "+1 (555) 234-5678",
    specialties: ["Food Security", "Social Work"],
    verified: true
  },
  {
    id: "org-3",
    name: "Emily Chen",
    organization: "City Volunteer Council",
    email: "emily.chen@cityvolunteer.gov",
    phone: "+1 (555) 345-6789",
    specialties: ["Education", "Youth Programs"],
    verified: true
  },
  {
    id: "org-4",
    name: "James Thompson",
    organization: "Red Cross Local Chapter",
    email: "j.thompson@redcross.org",
    phone: "+1 (555) 456-7890",
    specialties: ["Emergency Response", "Health"],
    verified: true
  }
];

// Mock data for previous submissions - updated with organizer info
const mockSubmissions = [
  {
    id: 1,
    eventName: "Beach Cleanup Drive",
    hoursWorked: 4,
    taskDescription: "Cleaned the local beach and collected plastic waste",
    dateSubmitted: "2025-09-15",
    status: "approved",
    txId: "ALG1726123456789abcdef",
    assignedOrganizer: "Dr. Sarah Wilson",
    organizerEmail: "sarah.wilson@greenearth.org",
    organizationName: "Green Earth NGO"
  },
  {
    id: 2,
    eventName: "Food Bank Assistance",
    hoursWorked: 6,
    taskDescription: "Sorted and packaged food donations for families",
    dateSubmitted: "2025-09-14",
    status: "pending",
    txId: null,
    assignedOrganizer: "Mark Rodriguez",
    organizerEmail: "mark.r@hopefoundation.org",
    organizationName: "Hope Foundation"
  },
  {
    id: 3,
    eventName: "Tree Plantation",
    hoursWorked: 3,
    taskDescription: "Planted trees in the community park",
    dateSubmitted: "2025-09-13",
    status: "rejected",
    txId: null,
    feedback: "Insufficient documentation provided",
    assignedOrganizer: "Dr. Sarah Wilson",
    organizerEmail: "sarah.wilson@greenearth.org",
    organizationName: "Green Earth NGO"
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
    dateTime: new Date().toISOString().split('T')[0],
    selectedOrganizer: "",
    requestMessage: ""
  });

  const [selectedOrganizerDetails, setSelectedOrganizerDetails] = useState(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update selected organizer details when organizer is selected
    if (field === 'selectedOrganizer') {
      const organizer = mockOrganizers.find(org => org.id === value);
      setSelectedOrganizerDetails(organizer || null);
      if (organizer) {
        setFormData(prev => ({ ...prev, organizationName: organizer.organization }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.volunteerName || !formData.hoursWorked || !formData.eventName || !formData.taskDescription || !formData.selectedOrganizer) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including selecting an organizer.",
        variant: "destructive"
      });
      return;
    }

    const selectedOrganizer = mockOrganizers.find(org => org.id === formData.selectedOrganizer);
    
    toast({
      title: "Request Sent Successfully! ✅",
      description: `Your contribution request has been sent to ${selectedOrganizer?.name} for approval. You'll be notified once reviewed.`,
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
      dateTime: new Date().toISOString().split('T')[0],
      selectedOrganizer: "",
      requestMessage: ""
    });
    setSelectedOrganizerDetails(null);
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

                    {/* Select Organizer */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="selectedOrganizer" className="text-white">Select Reviewing Organizer *</Label>
                      <Select value={formData.selectedOrganizer} onValueChange={(value) => handleInputChange("selectedOrganizer", value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Choose an organizer to review your contribution" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/20">
                          {mockOrganizers.map((organizer) => (
                            <SelectItem key={organizer.id} value={organizer.id} className="text-white hover:bg-white/10">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-400" />
                                <div>
                                  <div className="font-medium">{organizer.name}</div>
                                  <div className="text-sm text-gray-400">{organizer.organization}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Selected Organizer Details */}
                    {selectedOrganizerDetails && (
                      <div className="md:col-span-2 p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-cyan-400" />
                          Organizer Contact Information
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Mail className="h-4 w-4 text-cyan-400" />
                            {selectedOrganizerDetails.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone className="h-4 w-4 text-cyan-400" />
                            {selectedOrganizerDetails.phone}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-gray-400">Specialties:</div>
                          <div className="flex gap-1 mt-1">
                            {selectedOrganizerDetails.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-cyan-400/30 text-cyan-300">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Auto-filled Organization Name */}
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="text-white">Organization Name</Label>
                      <Input
                        id="organizationName"
                        type="text"
                        value={formData.organizationName}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        disabled
                        placeholder="Will be filled automatically when you select an organizer"
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

                  {/* Request Message to Organizer */}
                  <div className="space-y-2">
                    <Label htmlFor="requestMessage" className="text-white">Message to Organizer (Optional)</Label>
                    <Textarea
                      id="requestMessage"
                      rows={3}
                      placeholder="Add a personal message or any additional context for the organizer reviewing your contribution..."
                      value={formData.requestMessage}
                      onChange={(e) => handleInputChange("requestMessage", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
                    />
                    <div className="text-xs text-gray-400">
                      This message will be sent directly to {selectedOrganizerDetails ? selectedOrganizerDetails.name : 'the selected organizer'} along with your contribution details.
                    </div>
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
                        <CardDescription className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                          <User className="h-3 w-3" />
                          Assigned to: {submission.assignedOrganizer} ({submission.organizationName})
                        </CardDescription>
                      </div>
                      {getStatusBadge(submission.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-300 mb-3">{submission.taskDescription}</p>
                    
                    {submission.status === 'approved' && submission.txId && (
                      <div className="space-y-3">
                        <div className="p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                          <p className="text-green-300 text-sm font-medium">✅ Approved by {submission.assignedOrganizer}</p>
                          <p className="text-green-300 text-sm font-medium">✅ Verified on Blockchain</p>
                          <p className="text-green-200 text-xs font-mono mt-1">TX ID: {submission.txId}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded text-xs text-gray-400">
                          Contact organizer: <a href={`mailto:${submission.organizerEmail}`} className="text-cyan-400 hover:underline">{submission.organizerEmail}</a>
                        </div>
                      </div>
                    )}
                    
                    {submission.status === 'rejected' && submission.feedback && (
                      <div className="space-y-3">
                        <div className="p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                          <p className="text-red-300 text-sm font-medium">❌ Rejected by {submission.assignedOrganizer}</p>
                          <p className="text-red-300 text-sm font-medium">Feedback:</p>
                          <p className="text-red-200 text-sm mt-1">{submission.feedback}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded text-xs text-gray-400">
                          Contact organizer: <a href={`mailto:${submission.organizerEmail}`} className="text-cyan-400 hover:underline">{submission.organizerEmail}</a>
                        </div>
                      </div>
                    )}
                    
                    {submission.status === 'pending' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
                          <p className="text-yellow-300 text-sm">⏳ Waiting for approval from {submission.assignedOrganizer}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded text-xs text-gray-400">
                          You can contact them directly: <a href={`mailto:${submission.organizerEmail}`} className="text-cyan-400 hover:underline">{submission.organizerEmail}</a>
                        </div>
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