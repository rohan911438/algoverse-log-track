import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, CheckCircle, Users, Globe, Award, TrendingUp, Clock, Star, ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleVolunteerLogin = () => {
    navigate("/volunteer-dashboard");
  };

  const handleOrganizerLogin = () => {
    navigate("/organizer-dashboard");
  };

  const stats = [
    { icon: Users, label: "Active Volunteers", value: "2,500+" },
    { icon: Award, label: "Contributions Logged", value: "15,000+" },
    { icon: TrendingUp, label: "Hours Tracked", value: "50,000+" },
    { icon: Shield, label: "Blockchain Security", value: "100%" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Every contribution is cryptographically secured on the Algorand blockchain, ensuring permanent and tamper-proof records.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: CheckCircle,
      title: "Instant Verification",
      description: "Generate unique transaction IDs that can be verified by anyone, anywhere, providing instant proof of volunteer work.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Award,
      title: "Digital Recognition",
      description: "Build a permanent portfolio of your volunteer contributions that can be shared with employers, universities, and organizations.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Global Transparency",
      description: "Public ledger ensures transparency while protecting privacy, building trust between volunteers and organizations.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Log contributions instantly with automatic timestamping, creating an accurate and detailed history of your impact.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: Star,
      title: "Community Impact",
      description: "Connect with other volunteers, organizations, and track collective community impact through verified data.",
      gradient: "from-teal-500 to-green-500"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Connect Your Wallet",
      description: "Sign up and connect your Algorand wallet to begin tracking your volunteer contributions."
    },
    {
      step: "02",
      title: "Log Your Work",
      description: "Record your volunteer activities with details about time, location, and organization."
    },
    {
      step: "03",
      title: "Get Verified",
      description: "Your contribution is recorded on the blockchain and given a unique verification ID."
    },
    {
      step: "04",
      title: "Share & Showcase",
      description: "Use your verified contributions for job applications, university admissions, or personal records."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            {/* Badge */}
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 text-sm font-semibold">
              🚀 Powered by Algorand Blockchain
            </Badge>

            {/* Hero Title */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-xl animate-pulse">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                AlgoVerse
              </h1>
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-xl animate-pulse">
                <Zap className="h-12 w-12 text-white" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-300">
              Volunteer Contribution Tracker
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Transform your volunteer work into <span className="text-cyan-400 font-semibold">verifiable digital assets</span> with blockchain-powered security and transparency
            </p>

            {/* Role Selection Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-3">I am a Volunteer</h3>
                <Button 
                  size="lg" 
                  onClick={handleVolunteerLogin}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Volunteer Login
                </Button>
                <p className="text-gray-400 text-sm mt-2">Log and track your contributions</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-3">I am an Organizer</h3>
                <Button 
                  size="lg" 
                  onClick={handleOrganizerLogin}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Organizer Login
                </Button>
                <p className="text-gray-400 text-sm mt-2">Review and approve contributions</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* About Project Section */}
          <div className="max-w-6xl mx-auto mb-20">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3 text-3xl text-white">
                  <Globe className="h-8 w-8 text-cyan-400" />
                  Revolutionizing Volunteer Recognition
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6 p-8">
                <p className="text-lg text-gray-300 leading-relaxed">
                  <strong className="text-white">AlgoVerse</strong> is the world's first blockchain-based volunteer contribution tracker that creates <strong className="text-cyan-400">permanent, verifiable records</strong> of your community service. Built on the Algorand blockchain, every volunteer hour is cryptographically secured and instantly verifiable.
                </p>
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Lock className="h-6 w-6 text-purple-400" />
                      Why Blockchain?
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        Immutable records that can never be altered or lost
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        Instant global verification without intermediaries
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        Transparent and trustless system for all parties
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Award className="h-6 w-6 text-yellow-400" />
                      Perfect For
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <Star className="h-5 w-5 text-yellow-400 mt-0.5" />
                        Students building portfolios for college applications
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-5 w-5 text-yellow-400 mt-0.5" />
                        Professionals showcasing community involvement
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-5 w-5 text-yellow-400 mt-0.5" />
                        Organizations tracking volunteer impact
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-white mb-4">
                Why Choose AlgoVerse?
              </h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the future of volunteer tracking with cutting-edge blockchain technology
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group">
                  <CardHeader className="text-center">
                    <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white mb-3">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-white mb-4">
                How It Works
              </h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get started in minutes with our simple, secure process
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                    {index < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-30"></div>
                    )}
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">{step.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-3xl p-12 backdrop-blur-sm border border-white/20">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Make Your Impact Count?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of volunteers who are building verifiable portfolios of their community contributions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleVolunteerLogin}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Join as Volunteer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                onClick={handleOrganizerLogin}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Manage as Organizer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Blockchain Secured
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Instantly Verifiable
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Community Driven
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;