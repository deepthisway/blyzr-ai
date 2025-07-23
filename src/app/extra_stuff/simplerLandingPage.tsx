'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Sparkles, Zap, ArrowRight, Code, Palette, Rocket } from 'lucide-react'

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
            {/* Background Pattern */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(rgba(147, 51, 234, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(147, 51, 234, 0.05) 1px, transparent 1px)
    `,
                    backgroundSize: '60px 60px, 60px 60px, 20px 20px, 20px 20px',
                    animation: 'gridMove 20s linear infinite'
                }}
            />
            <style jsx>{`
  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(60px, 60px); }
  }
`}</style>

            {/* Main Content Wrapper */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto px-4">
                    <div className="backdrop-blur-md bg-blue-50 border border-white/20 rounded-2xl shadow-lg shadow-black/5">
                        <div className="px-6 lg:px-8">
                            <div className="flex justify-between items-center h-14">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                        Blyzr AI
                                    </span>
                                </div>
                                <div className="hidden md:flex items-center space-x-8">
                                    <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                                        Features
                                    </a>
                                    <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                                        Pricing
                                    </a>
                                    <a href="#docs" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                                        Docs
                                    </a>
                                    <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/80 border-white/30 hover:bg-white/90">
                                        Sign In
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section - Flex grow to push footer down */}
                <section className="relative overflow-hidden flex-grow flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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

                            {/* CTA Input */}
                            <div className="max-w-2xl mx-auto mb-12">
                                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
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
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-gray-50/80 bg-transparent backdrop-blur border-t border-gray-200 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">Blyzr AI</span>
                            </div>
                            <div className="text-center text-sm text-gray-500">
                                © 2025 Blyzr AI. All rights reserved.
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-600 mt-4 md:mt-0">
                                <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                                <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                                <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Page
