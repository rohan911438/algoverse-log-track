import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft, CheckCircle, XCircle, AlertCircle, Users, Award, TrendingUp, Eye, Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock organizer profiles
const organizerProfiles = [
  {
    id: "org-1",
    name: "Dr. Sarah Wilson",
    organization: "Green Earth NGO",
    email: "sarah.wilson@greenearth.org",
    specialties: ["Environmental", "Community Service"]
  },
  {
    id: "org-2",
    name: "Mark Rodriguez",
    organization: "Hope Foundation",
    email: "mark.r@hopefoundation.org",
    specialties: ["Food Security", "Social Work"]
  },
  {
    id: "org-3",
    name: "Emily Chen",
    organization: "City Volunteer Council",
    email: "emily.chen@cityvolunteer.gov",
    specialties: ["Education", "Youth Programs"]
  },
  {
    id: "org-4",
    name: "James Thompson",
    organization: "Red Cross Local Chapter",
    email: "j.thompson@redcross.org",
    specialties: ["Emergency Response", "Health"]
  }
];

// Mock data for pending contributions - updated with organizer assignment and messages
const mockPendingContributions = [
  {
    id: 1,
    volunteerName: "John Doe",
    eventName: "Beach Cleanup Drive",
    organizationName: "Green Earth NGO",
    hoursWorked: 4,
    taskDescription: "Cleaned the local beach and collected plastic waste. Organized a team of 10 volunteers and coordinated with local authorities for proper waste disposal.",
    requestMessage: "Hi Dr. Wilson, I led this cleanup as part of our environmental club. We collected over 50 bags of waste and educated 20+ beachgoers about ocean conservation. I have photos and a waste collection report if needed for verification.",
    dateSubmitted: "2025-09-16",
    dateOfActivity: "2025-09-15",
    contactEmail: "john.doe@email.com",
    assignedOrganizerId: "org-1",
    assignedOrganizerName: "Dr. Sarah Wilson",
    status: "pending"
  },
  {
    id: 2,
    volunteerName: "Sarah Smith",
    eventName: "Food Bank Assistance",
    organizationName: "Hope Foundation",
    hoursWorked: 6,
    taskDescription: "Sorted and packaged food donations for families in need. Helped distribute meals to 50+ families.",
    requestMessage: "Hello Mark, I volunteered at your food bank last Saturday. The supervisor mentioned you handle volunteer verifications. I helped sort through 3 pallets of donations and assisted in the distribution line. Thank you for the great work you do!",
    dateSubmitted: "2025-09-16",
    dateOfActivity: "2025-09-14",
    contactEmail: "sarah.smith@email.com",
    assignedOrganizerId: "org-2",
    assignedOrganizerName: "Mark Rodriguez",
    status: "pending"
  },
  {
    id: 3,
    volunteerName: "Mike Johnson",
    eventName: "Tree Plantation",
    organizationName: "Green Earth NGO",
    hoursWorked: 5,
    taskDescription: "Planted 25 trees in the community park. Educated children about environmental conservation.",
    requestMessage: "Dr. Wilson, this was my first major environmental project. I'm passionate about reforestation and would love to get involved in more Green Earth activities. The park supervisor, Janet Miller, can vouch for my work if needed.",
    dateSubmitted: "2025-09-15",
    dateOfActivity: "2025-09-13",
    contactEmail: "mike.j@email.com",
    assignedOrganizerId: "org-1",
    assignedOrganizerName: "Dr. Sarah Wilson",
    status: "pending"
  }
];

// Mock approved contributions
const mockApprovedContributions = [
  {
    id: 4,
    volunteerName: "Alice Brown",
    eventName: "Blood Donation Camp",
    organizationName: "Red Cross",
    hoursWorked: 8,
    taskDescription: "Organized and managed blood donation camp, registered 200+ donors",
    dateSubmitted: "2025-09-14",
    dateOfActivity: "2025-09-12",
    status: "approved",
    txId: "ALG1726234567890abcdef",
    approvedBy: "Dr. Wilson",
    approvedDate: "2025-09-14"
  }
];

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [currentOrganizerId, setCurrentOrganizerId] = useState("org-1"); // Default to first organizer
  
  // Filter contributions assigned to current organizer
  const assignedPendingContributions = mockPendingContributions.filter(
    contribution => contribution.assignedOrganizerId === currentOrganizerId
  );
  
  const currentOrganizer = organizerProfiles.find(org => org.id === currentOrganizerId);

  const handleApprove = (contribution: any) => {
    setSelectedContribution(contribution);
    setActionType('approve');
    setIsDialogOpen(true);
  };

  const handleReject = (contribution: any) => {
    setSelectedContribution(contribution);
    setActionType('reject');
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedContribution) return;

    const action = actionType === 'approve' ? 'approved' : 'rejected';
    const mockTxId = actionType === 'approve' ? `ALG${Date.now()}${Math.random().toString(36).substr(2, 9)}` : null;

    toast({
      title: actionType === 'approve' ? "Contribution Approved! ✅" : "Contribution Rejected",
      description: actionType === 'approve' 
        ? `Transaction ID: ${mockTxId}. The contribution has been verified on the blockchain.`
        : "The volunteer has been notified about the rejection.",
      variant: actionType === 'approve' ? "default" : "destructive"
    });

    setIsDialogOpen(false);
    setSelectedContribution(null);
    setFeedback("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const stats = [
    { icon: AlertCircle, label: "Pending Reviews", value: assignedPendingContributions.length, color: "text-yellow-400" },
    { icon: CheckCircle, label: "Approved Today", value: 1, color: "text-green-400" },
    { icon: Users, label: "Active Volunteers", value: assignedPendingContributions.length + 5, color: "text-blue-400" },
    { icon: TrendingUp, label: "Hours This Week", value: "45", color: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
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
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-purple-400" />
              <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
            </div>
            
            {/* Organizer Profile Selector */}
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-400">Signed in as:</div>
              <Select value={currentOrganizerId} onValueChange={setCurrentOrganizerId}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white min-w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {organizerProfiles.map((organizer) => (
                    <SelectItem key={organizer.id} value={organizer.id} className="text-white hover:bg-white/10">
                      <div>
                        <div className="font-medium">{organizer.name}</div>
                        <div className="text-sm text-gray-400">{organizer.organization}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="pending" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <AlertCircle className="w-4 h-4 mr-2" />
              Pending Reviews ({assignedPendingContributions.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Approved Contributions
            </TabsTrigger>
          </TabsList>

          {/* Pending Contributions Tab */}
          <TabsContent value="pending">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Contributions Assigned to You</h3>
                {currentOrganizer && (
                  <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                    {currentOrganizer.organization}
                  </Badge>
                )}
              </div>
              
              {assignedPendingContributions.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
                    <p className="text-gray-300">No pending contributions assigned to you at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                assignedPendingContributions.map((contribution) => (
                  <Card key={contribution.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-lg">{contribution.eventName}</CardTitle>
                          <CardDescription className="text-gray-300">
                            By {contribution.volunteerName} • {contribution.hoursWorked} hours • {contribution.organizationName}
                          </CardDescription>
                          <CardDescription className="text-gray-400 text-sm">
                            Activity Date: {contribution.dateOfActivity} • Submitted: {contribution.dateSubmitted}
                          </CardDescription>
                        </div>
                        {getStatusBadge(contribution.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="text-sm font-semibold text-white mb-2">Description:</h5>
                        <p className="text-gray-300 text-sm">{contribution.taskDescription}</p>
                      </div>
                      
                      {contribution.requestMessage && (
                        <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                          <h5 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Message from Volunteer
                          </h5>
                          <p className="text-blue-200 text-sm">{contribution.requestMessage}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="h-4 w-4" />
                        Contact: <a href={`mailto:${contribution.contactEmail}`} className="text-cyan-400 hover:underline">{contribution.contactEmail}</a>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button 
                          onClick={() => handleApprove(contribution)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Verify
                        </Button>
                        <Button 
                          onClick={() => handleReject(contribution)}
                          variant="destructive"
                          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Approved Contributions Tab */}
          <TabsContent value="approved">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Verified Contributions</h3>
              
              {mockApprovedContributions.map((contribution) => (
                <Card key={contribution.id} className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{contribution.eventName}</CardTitle>
                        <CardDescription className="text-gray-300">
                          By {contribution.volunteerName} • {contribution.hoursWorked} hours • {contribution.organizationName}
                        </CardDescription>
                        <CardDescription className="text-gray-400 text-sm">
                          Approved by {contribution.approvedBy} on {contribution.approvedDate}
                        </CardDescription>
                      </div>
                      {getStatusBadge(contribution.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4">{contribution.taskDescription}</p>
                    
                    <div className="p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                      <p className="text-green-300 text-sm font-medium">✅ Verified on Algorand Blockchain</p>
                      <p className="text-green-200 text-xs font-mono mt-1">TX ID: {contribution.txId}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Approval/Rejection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'approve' ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Approve Contribution
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-400" />
                  Reject Contribution
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {selectedContribution && (
                <>
                  {actionType === 'approve' 
                    ? `Approve "${selectedContribution.eventName}" by ${selectedContribution.volunteerName}? This will create a permanent blockchain record.`
                    : `Reject "${selectedContribution.eventName}" by ${selectedContribution.volunteerName}? Please provide feedback below.`
                  }
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {actionType === 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-white">Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                rows={3}
                placeholder="Explain why this contribution is being rejected..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/30 text-white hover:bg-white hover:text-slate-900">
              Cancel
            </Button>
            <Button 
              onClick={confirmAction}
              className={actionType === 'approve' 
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                : "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              }
            >
              {actionType === 'approve' ? 'Approve & Verify' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerDashboard;