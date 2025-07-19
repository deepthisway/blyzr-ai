'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Sparkles, Zap, Globe, ArrowRight, Code, Palette, Rocket } from 'lucide-react'

const Page = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [value, setValue] = useState<string>('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200/50 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Blyzr AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                Docs
              </a>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Website Generation
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Build websites with
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                AI magic
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into stunning websites in seconds. Just describe what you want, 
              and our AI will generate beautiful, responsive websites tailored to your vision.
            </p>

            {/* CTA Input */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-xl border border-gray-200">
                <Input
                  type="text"
                  placeholder="Describe your website... e.g., 'A modern portfolio for a photographer'"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-0 text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={createProject.isPending || !value.trim()}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {createProject.isPending ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Generate Website
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                ✨ No coding required • 🚀 Deploy instantly • 💎 Professional results
              </p>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white" />
                  ))}
                </div>
                <span>Trusted by 10,000+ creators</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                <span>50,000+ websites generated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to build amazing websites
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI understands design principles, user experience, and modern web standards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Clean Code</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate semantic HTML, modern CSS, and optimized JavaScript that follows best practices and web standards.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Beautiful Design</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-crafted designs that are visually stunning, user-friendly, and perfectly aligned with your brand and vision.
              </p>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Deploy</h3>
              <p className="text-gray-600 leading-relaxed">
                Your website goes live instantly with global CDN, SSL certificates, and lightning-fast performance out of the box.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Blyzr AI</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2024 Blyzr AI. All rights reserved. Built with ❤️ and AI.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Page