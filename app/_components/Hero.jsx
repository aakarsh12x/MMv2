import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContainerScroll } from "../../components/ui/container-scroll-animation";
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  Zap, 
  BarChart3,
  ArrowRight,
  Star,
  Users,
  CheckCircle,
  Play,
  Sparkles,
  Target,
  PiggyBank,
  CreditCard,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs';

function Hero() {
  const { user } = useUser();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Brain className="text-blue-600" size={24} />,
      title: "AI-Powered Insights",
      description: "Get personalized financial advice using advanced AI"
    },
    {
      icon: <TrendingUp className="text-green-600" size={24} />,
      title: "Smart Analytics",
      description: "Track spending patterns and optimize your budget"
    },
    {
      icon: <PiggyBank className="text-yellow-600" size={24} />,
      title: "Goal Tracking",
      description: "Set and achieve your financial goals with AI guidance"
    },
    {
      icon: <Shield className="text-red-600" size={24} />,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      content: "MoneyMap's AI helped me save ₹50,000 in just 3 months. The insights are incredibly accurate!",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner", 
      content: "The predictive analytics feature is game-changing. I can now plan my expenses months ahead.",
      rating: 5
    },
    {
      name: "Anita Desai",
      role: "Teacher",
      content: "Simple, smart, and effective. Finally achieved my emergency fund goal thanks to MoneyMap's guidance.",
      rating: 5
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="mr-2" size={16} />
            AI-Powered Financial Management
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Take Control of Your
            <span className="text-blue-600 block mt-2">Financial Future</span>
              </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            MoneyMap uses advanced AI to help you budget smarter, save more, and achieve your financial goals faster than ever before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            )}
            <Button variant="outline" className="px-8 py-3 text-lg border-gray-300">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See MoneyMap in Action
            </h2>
            <p className="text-gray-600">
              Get a glimpse of your future financial dashboard powered by AI insights
            </p>
          </div>
          
          <div className="relative rounded-lg overflow-hidden shadow-xl">
          <Image
              src="/dashboard.png"
              alt="MoneyMap Dashboard"
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of users who have already improved their financial health with MoneyMap
          </p>
          
          {!user && (
            <Link href="/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Start Your Financial Journey
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
