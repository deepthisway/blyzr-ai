"use client"

import { useTheme } from "@/components/ThemeProvider"
import { PricingTable } from "@clerk/nextjs"
import Image from "next/image"
import { Navbar } from "@/components/Navbar"
import { useState, useEffect } from "react"
import { Star, Sparkles } from "lucide-react"

export default function PricingPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* CSS Animations */}
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
                .float-animation {
                    animation: float 20s ease-in-out infinite;
                }
            `}</style>

            {/* Animated Background Layers */}
            <div className="absolute inset-0">
                {/* Primary gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-blue-900/30" />

                {/* Animated mesh gradient */}
                <div
                    className="absolute inset-0 opacity-30 transition-all duration-100 ease-out"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
                    }}
                />

                {/* Geometric pattern */}
                <div
                    className="absolute inset-0 opacity-40 float-animation"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' stroke='%236366f1' stroke-width='0.5'%3e%3cpath d='M30 0v60M0 30h60M15 15l30 30M45 15l-30 30' opacity='0.1'/%3e%3ccircle cx='30' cy='30' r='2' fill='%238b5cf6' opacity='0.2'/%3e%3c/g%3e%3c/svg%3e")`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Floating orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
                <div
                    className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: '2s' }}
                />
                <div
                    className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: '4s' }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Navigation */}
                <Navbar showFeatures={false} />

                <div className="container mx-auto px-4 py-8 flex-grow">
                    <div className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto">
                        <section className="space-y-8 pt-[8vh] 2xl:pt-16 w-full">
                            {/* Header Section */}
                            <div className="flex flex-col items-center space-y-6">
                                {/* <div className="relative">
                                    <Image
                                        src="/logo.png"
                                        alt="Blyzr AI Logo"
                                        width={180}
                                        height={180}
                                        className="transition-transform hover:scale-105"
                                        priority
                                    />
                                </div> */}
                                <div className="text-center space-y-4">
                                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                                        <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
                                            Pricing
                                        </span>
                                    </h1>
                                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                        Choose the perfect plan to unlock the full potential of AI-powered development
                                    </p>
                                </div>
                            </div>

                            {/* Pricing Table Section */}
                            <div className="w-full flex justify-center">
                                <div className="w-full max-w-5xl">
                                    <PricingTable
                                        appearance={{
                                            elements: {
                                                pricingTableCard: "bg-gray-900/50 backdrop-blur-xl border border-violet-500/30 hover:border-violet-400/50 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-violet-500/20",
                                                pricingTableCardHeader: "text-center pb-6",
                                                pricingTableCardTitle: "text-2xl font-bold text-white",
                                                pricingTableCardPrice: "text-4xl font-bold text-violet-400",
                                                pricingTableCardDescription: "text-gray-300",
                                                pricingTableCardFeature: "text-gray-200 flex items-center gap-2",
                                                pricingTableCardButton: "w-full mt-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-violet-500/25"
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="text-center pt-8">
                                <p className="text-sm text-gray-400">
                                    All plans include 24/7 support and a 30-day money-back guarantee.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}