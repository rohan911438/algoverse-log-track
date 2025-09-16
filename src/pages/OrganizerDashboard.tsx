import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, CheckCircle, XCircle, AlertCircle, Users, Award, TrendingUp, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for pending contributions
const mockPendingContributions = [
  {
    id: 1,
    volunteerName: "John Doe",
    eventName: "Beach Cleanup Drive",
    organizationName: "Green Earth NGO",
    hoursWorked: 4,
    taskDescription: "Cleaned the local beach and collected plastic waste. Organized a team of 10 volunteers and coordinated with local authorities for proper waste disposal.",
    dateSubmitted: "2025-09-16",
    dateOfActivity: "2025-09-15",
    contactEmail: "john.doe@email.com",
    status: "pending"
  },
  {
    id: 2,
    volunteerName: "Sarah Smith",
    eventName: "Food Bank Assistance",
    organizationName: "Hope Foundation",
    hoursWorked: 6,
    taskDescription: "Sorted and packaged food donations for families in need. Helped distribute meals to 50+ families.",
    dateSubmitted: "2025-09-16",
    dateOfActivity: "2025-09-14",
    contactEmail: "sarah.smith@email.com",
    status: "pending"
  },
  {
    id: 3,
    volunteerName: "Mike Johnson",
    eventName: "Tree Plantation",
    organizationName: "Green City Initiative",
    hoursWorked: 5,
    taskDescription: "Planted 25 trees in the community park. Educated children about environmental conservation.",
    dateSubmitted: "2025-09-15",
    dateOfActivity: "2025-09-13",
    contactEmail: "mike.j@email.com",
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
    { icon: AlertCircle, label: "Pending Reviews", value: mockPendingContributions.length, color: "text-yellow-400" },
    { icon: CheckCircle, label: "Approved Today", value: 1, color: "text-green-400" },
    { icon: Users, label: "Total Volunteers", value: "15", color: "text-blue-400" },
    { icon: TrendingUp, label: "Hours Verified", value: "120", color: "text-purple-400" }
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
          
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
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
              Pending Reviews ({mockPendingContributions.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Approved Contributions
            </TabsTrigger>
          </TabsList>

          {/* Pending Contributions Tab */}
          <TabsContent value="pending">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">Contributions Awaiting Your Approval</h3>
              
              {mockPendingContributions.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
                    <p className="text-gray-300">No pending contributions to review at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                mockPendingContributions.map((contribution) => (
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
                      
                      {contribution.contactEmail && (
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-1">Contact:</h5>
                          <p className="text-gray-300 text-sm">{contribution.contactEmail}</p>
                        </div>
                      )}

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