'use client'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Sparkles, Calendar, ArrowRight, FolderOpen, Star, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

interface Project {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
}

export const ProjectList = () => {
    const trpc = useTRPC()
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)

    const { data: projects, isLoading, error } = useQuery(
        trpc.projects.getProjects.queryOptions()
    )

    // Get top 5 most recently updated projects
    const topProjects = projects?.slice().sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ).slice(0, 5)

    const handleProjectClick = (projectId: string) => {
        router.push(`/projects/${projectId}`)
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % (topProjects?.length || 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + (topProjects?.length || 1)) % (topProjects?.length || 1))
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const renderCardSkeleton = () => (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 rounded-2xl animate-pulse min-w-[320px]">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
            </div>
            <div className="h-6 bg-white/10 rounded mb-3"></div>
            <div className="h-4 bg-white/5 rounded mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-2/3"></div>
        </Card>
    )

    if (isLoading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-8 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Your AI Creations
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Your Top Projects
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Loading your amazing creations...
                    </p>
                </div>

                <div className="flex gap-6 overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <div key={i}>{renderCardSkeleton()}</div>
                    ))}
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-300 text-sm font-semibold mb-8 backdrop-blur-sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Connection Error
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                    Something went wrong
                </h2>
                <p className="text-xl text-red-400">Failed to load projects. Please refresh and try again.</p>
            </section>
        )
    }

    if (!projects || projects.length === 0) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-8 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ready to Create
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                    Your Projects
                </h2>
                <div className="max-w-md mx-auto">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <FolderOpen className="w-12 h-12 text-violet-400" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-2xl blur-xl animate-pulse"></div>
                    </div>
                    <p className="text-xl text-gray-400 mb-6">
                        No projects yet. Create your first AI-powered website above and watch the magic happen!
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-8 backdrop-blur-sm">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    Your AI Creations
                    <Sparkles className="w-4 h-4 ml-2" />
                </div>
            </div>

            {/* Carousel Container */}
            <div className="relative">
                {/* Navigation Buttons */}
                {topProjects && topProjects.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
                            onClick={prevSlide}
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
                            onClick={nextSlide}
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </Button>
                    </>
                )}

                {/* Carousel Content */}
                <div className="overflow-hidden mx-12">
                    <div
                        className="flex transition-transform duration-500 ease-in-out gap-6"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / Math.min(topProjects?.length || 1, 3))}%)`,
                            width: `${Math.max((topProjects?.length || 1) * (100 / Math.min(topProjects?.length || 1, 3)), 100)}%`
                        }}
                    >
                        {topProjects?.map((project: Project) => (
                            <div
                                key={project.id}
                                className="group relative flex-shrink-0"
                                style={{ width: `${100 / Math.min(topProjects.length, 3)}%` }}
                            >
                                {/* Glow effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                <Card
                                    className="relative bg-white/5 backdrop-blur-xl border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl group mx-3"
                                    onClick={() => handleProjectClick(project.id)}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 border-0"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleProjectClick(project.id)
                                            }}
                                        >
                                            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                                        </Button>
                                    </div>

                                    <h3 className="font-bold text-xl text-white mb-4 group-hover:text-violet-300 transition-colors duration-300 line-clamp-2">
                                        {project.name}
                                    </h3>

                                    <div className="flex items-center text-sm text-gray-400 mb-4">
                                        <Calendar className="w-4 h-4 mr-2 text-violet-400" />
                                        <span>
                                            Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <span className="text-xs text-gray-500">
                                            Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-400 font-medium">Active</span>
                                        </div>
                                    </div>

                                    {/* Shimmer effect on hover */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Carousel Indicators */}
                {topProjects && topProjects.length > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                        {topProjects.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-violet-500 shadow-lg shadow-violet-500/50'
                                        : 'bg-white/20 hover:bg-white/40'
                                    }`}
                                onClick={() => goToSlide(index)}
                            />
                        ))}
                    </div>
                )}

                {/* Project Count */}
                {projects && projects.length > 5 && (
                    <div className="text-center mt-8">
                        <p className="text-gray-500 text-sm">
                            Showing 5 of {projects.length} projects
                        </p>
                        {/* <Button
                            variant="ghost"
                            className="mt-2 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                            onClick={() => router.push('/projects/all')}
                        >
                            View All Projects <ArrowRight className="w-4 h-4 ml-2" />
                        </Button> */}
                    </div>
                )}
            </div>
        </section>
    )
}