import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, CheckCircle, Users, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    navigate("/log-contribution");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Volunteer Contribution Tracker
            </h1>
            <div className="p-4 bg-accent/10 rounded-full border border-accent/20">
              <Zap className="h-10 w-10 text-accent" />
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Secure, transparent volunteer contribution tracking powered by Algorand blockchain technology
          </p>
          
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-card/50 backdrop-blur-sm border border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Globe className="h-5 w-5" />
                  About This Project
                </CardTitle>
              </CardHeader>
              <CardContent className="text-left space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our Volunteer Contribution Tracker revolutionizes how volunteer work is recorded and verified. 
                  By leveraging the Algorand blockchain, we create an immutable, transparent record of every 
                  volunteer contribution, ensuring that good deeds are permanently recognized and can never be lost or disputed.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Each contribution is cryptographically secured and timestamped, creating a verifiable history 
                  of volunteer service that organizations and volunteers can trust. The blockchain ensures data 
                  integrity while maintaining transparency for all stakeholders.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border border-primary/10">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Secure & Immutable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All contributions are permanently stored on the Algorand blockchain, creating an unalterable record
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border border-accent/10">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-accent mx-auto mb-2" />
                <CardTitle className="text-lg">Instantly Verifiable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate transaction IDs that anyone can use to verify the authenticity of volunteer work
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border border-primary/10">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built for volunteers, organizations, and communities to track and celebrate meaningful contributions
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <Button 
            size="lg" 
            onClick={handleConnectWallet}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Connect Wallet / Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;