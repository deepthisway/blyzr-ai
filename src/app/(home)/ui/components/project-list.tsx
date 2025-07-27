'use client'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Sparkles, Calendar, ArrowRight, FolderOpen, Star, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { useUser } from '@clerk/nextjs'

interface Project {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
}

export const ProjectList = () => {
    const user = useUser();
    const trpc = useTRPC()
    const router = useRouter()

    const { data: projects, isLoading, error } = useQuery(
        trpc.projects.getProjects.queryOptions()
    )

    const handleProjectClick = (projectId: string) => {
        router.push(`/projects/${projectId}`)
    }

    const renderCardSkeleton = () => (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 rounded-xl animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                <div className="w-4 h-4 bg-white/10 rounded"></div>
            </div>
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-3 bg-white/5 rounded w-2/3"></div>
        </Card>
    )

    if (isLoading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Your Projects
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Recent Projects
                    </h2>
                    <p className="text-gray-400">
                        Loading your creations...
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i}>{renderCardSkeleton()}</div>
                    ))}
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-12 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-300 text-sm font-medium mb-6 backdrop-blur-sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Authentication Required
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Sign in to view your projects
                </h2>
                <p className="text-red-400">Please sign in to access your projects</p>
            </section>
        )
    }

    if (!projects || projects.length === 0) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-12 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-6 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ready to Create
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {user.user?.firstName}&apos;s Projects
                </h2>
                <div className="max-w-md mx-auto">
                    <div className="relative mb-6">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <FolderOpen className="w-8 h-8 text-violet-400" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-xl blur-xl animate-pulse"></div>
                    </div>
                    <p className="text-gray-400 mb-4">
                        No projects yet. Create your first AI-powered project and watch the magic happen!
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-4 backdrop-blur-sm">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    Your Projects
                    <Sparkles className="w-4 h-4 ml-2" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Recent Projects
                </h2>
                <p className="text-gray-400">
                    {projects?.length} project{projects?.length !== 1 ? '&apos;s' : ''}
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {projects?.slice(0, 12).map((project: Project) => (
                    <Card
                        key={project.id}
                        className="group relative bg-white/5 backdrop-blur-xl border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10"
                        onClick={() => handleProjectClick(project.id)}
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 h-6 w-6 rounded-md bg-white/10 hover:bg-white/20 border-0"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleProjectClick(project.id)
                                    }}
                                >
                                    <ArrowRight className="w-3 h-3 text-white" />
                                </Button>
                            </div>

                            <h3 className="font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors duration-300 line-clamp-2 text-sm">
                                {project.name}
                            </h3>

                            <div className="flex items-center text-xs text-gray-400 mb-3">
                                <Calendar className="w-3 h-3 mr-1 text-violet-400" />
                                <span className="truncate">
                                    {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <span className="text-xs text-gray-500 truncate">
                                    {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                                </span>
                                <div className="flex items-center space-x-1">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-400 font-medium">Active</span>
                                </div>
                            </div>

                            {/* Shimmer effect on hover */}
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Show more projects button */}
            {projects && projects.length > 12 && (
                <div className="text-center">
                    <p className="text-gray-500 text-sm mb-3">
                        Showing 12 of {projects.length} projects
                    </p>
                    {/* <Button
                        variant="ghost"
                        className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-sm"
                        onClick={() => router.push('/projects')}
                    >
                        View All Projects <ArrowRight className="w-4 h-4 ml-2" />
                    </Button> */}
                </div>
            )}
        </section>
    )
}