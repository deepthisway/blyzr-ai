'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Sparkles, Zap, ArrowRight, Code, Palette, Rocket, Star, Globe, Cpu, Shield, CloudLightningIcon, } from 'lucide-react'
import { ProjectList } from './(home)/ui/components/project-list'
import { SignInButton, SignUpButton } from '@clerk/nextjs'

const Page = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [value, setValue] = useState<string>('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      console.error("Error creating project:", error);
    },
    onSuccess: (data) => {
      router.push('/projects/' + data.id);
      console.log("Project created successfully:", data);
    }
  }))

  const handleSubmit = async () => {
    if (!value.trim()) return;
    createProject.mutate({ value: value });
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  const features = [
    {
      icon: <CloudLightningIcon className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate complete websites in seconds"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Design Excellence",
      description: "Premium designs that convert"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Ready",
      description: "Secure, scalable, and reliable"
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {/* Primary gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-blue-900/30" />

        {/* Animated mesh gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
            transition: 'background 0.1s ease-out'
          }}
        />

        {/* Geometric pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' stroke='%236366f1' stroke-width='0.5'%3e%3cpath d='M30 0v60M0 30h60M15 15l30 30M45 15l-30 30' opacity='0.1'/%3e%3ccircle cx='30' cy='30' r='2' fill='%238b5cf6' opacity='0.2'/%3e%3c/g%3e%3c/svg%3e")`,
            backgroundSize: '60px 60px',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Premium Navigation */}
        <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl mx-auto px-4">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full shadow-2xl">
            <div className="px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Blyzr AI
                  </span>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 font-medium">
                    Features
                  </a>
                  <a href="#pricing" className="text-gray-300 hover:text-white transition-all duration-300 font-medium">
                    Pricing
                  </a>
                  <SignInButton>
                    <Button className=" from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white border-0 rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign In
                  </Button>
                  </SignInButton>
                  <SignUpButton>
                  <Button  className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white border-0 rounded-full px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign Up
                  </Button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative flex-grow flex items-center pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              {/* Premium Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-8 backdrop-blur-sm">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                Trusted by 50,000+ creators worldwide
                <Sparkles className="w-4 h-4 ml-2" />
              </div>

              {/* Main Headline */}
              <div className="space-y-6 mb-12">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    The Future of
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 via-blue-300 via-purple-300 to-violet-300 bg-clip-text text-transparent bg-[length:200%_100%] animate-pulse">
                    Web Creation
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Transform your ideas into stunning websites with our revolutionary AI.
                  No coding required, unlimited possibilities.
                </p>
              </div>

              {/* Premium CTA */}
              <div className="max-w-3xl mx-auto mb-16">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-violet-500 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative flex flex-col sm:flex-row gap-4 p-3 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                    <Input
                      type="text"
                      placeholder="Describe your website... e.g., 'A website for a restaurant'"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-lg px-6 py-4 rounded-2xl focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={createProject.isPending || !value.trim()}
                      size="lg"
                      className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl group disabled:opacity-50"
                    >
                      {createProject.isPending ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Creating Magic...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Rocket className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                          Generate Website
                          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-500 group">
                    <div className="text-violet-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </Card>
                ))}
              </div>

              {/* Social Proof */}
              <div className="mt-20 flex flex-col items-center space-y-6">
                <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">
                  Powering websites for
                </p>
                <div className="flex items-center space-x-12 opacity-50">
                  <Globe className="w-8 h-8 text-gray-400" />
                  <Cpu className="w-8 h-8 text-gray-400" />
                  <Code className="w-8 h-8 text-gray-400" />
                  <Zap className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <ProjectList />

        {/* Premium Footer */}
        <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-6 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Blyzr AI</span>
              </div>

              <div className="text-center text-gray-400 mb-6 md:mb-0">
                <p>© 2025 Blyzr AI. Crafted with ❤️ for creators worldwide.</p>
              </div>

              <div className="flex items-center space-x-8 text-gray-400">
                <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
                <a href="#" className="hover:text-white transition-colors duration-300">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Page