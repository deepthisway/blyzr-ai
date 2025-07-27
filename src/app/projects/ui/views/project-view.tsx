'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageContainer from "./components/project-msg-container";
import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma";
import ProjectHeader from "./components/ProjectHeader";
import { FragmentWeb } from "./components/FragmentWeb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CrownIcon, EyeIcon, CodeIcon, Sparkles, Globe, FileText } from "lucide-react";
import { FileExplorer } from "./components/file-explorer";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
    projectId: string
}

const LoadingSkeleton = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse", className)}>
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
)

const EmptyState = ({ icon: Icon, title, description }: { 
    icon: React.ComponentType<{ className?: string }>, 
    title: string, 
    description: string 
}) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
        <div className="p-4 rounded-full bg-muted/50">
            <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        </div>
    </div>
)

export const ProjectView = ({ projectId }: Props) => {
    const trpc = useTRPC();
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId
    }))
    const [tabState, setTabState] = useState<'web' | 'code'>('web')

    return (
        <div className="h-screen bg-background">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Chat */}
                <ResizablePanel 
                    defaultSize={35} 
                    minSize={25} 
                    maxSize={50}
                    className="flex flex-col min-h-0 border-r bg-card"
                >
                    <Suspense fallback={<LoadingSkeleton className="p-4" />}>  
                        <ProjectHeader projectId={projectId} />
                    </Suspense>
                    <div className="flex-1 min-h-0">
                        <Suspense fallback={<LoadingSkeleton className="p-4" />}>
                            <MessageContainer 
                                projectId={projectId}
                                activeFragment={activeFragment}
                                setActiveFragment={setActiveFragment}
                            />
                        </Suspense>
                    </div>
                </ResizablePanel>
                
                <ResizableHandle className="w-1 hover:w-2 hover:bg-primary/20 transition-all duration-200 bg-border" />
                
                {/* Right Panel - Preview */}
                <ResizablePanel 
                    defaultSize={65} 
                    minSize={50} 
                    className="flex flex-col min-h-0 bg-background"
                >
                    <div className="border-b bg-card/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between p-4">
                            <Tabs 
                                className="flex-1"
                                defaultValue="web"
                                value={tabState}
                                onValueChange={(value) => setTabState(value as "web" | "code")}
                            >
                                <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
                                    <TabsTrigger value="web" className="flex items-center gap-2 data-[state=active]:bg-background">
                                        <Globe className="w-4 h-4" />
                                        Preview
                                    </TabsTrigger>
                                    <TabsTrigger value="code" className="flex items-center gap-2 data-[state=active]:bg-background">
                                        <FileText className="w-4 h-4" />
                                        Files
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                            
                            <Button asChild size="sm" variant="default" className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                <Link href="/pricing" className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> 
                                    Upgrade
                                </Link>
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex-1 min-h-0">
                        <Tabs value={tabState} className="h-full">
                            <TabsContent value="web" className="h-full m-0 p-0">
                                {activeFragment ? (
                                    <Suspense fallback={<LoadingSkeleton className="p-8" />}>
                                        <FragmentWeb data={activeFragment} />
                                    </Suspense>
                                ) : (
                                    <EmptyState 
                                        icon={Globe}
                                        title="No Preview Available"
                                        description="Start a conversation to generate and preview your project. Your web preview will appear here."
                                    />
                                )}
                            </TabsContent>
                            
                            <TabsContent value="code" className="h-full m-0 p-0">
                                {activeFragment ? (
                                    <Suspense fallback={<LoadingSkeleton className="p-8" />}>
                                        <FileExplorer files={activeFragment.files as {[path: string]: string}} />
                                    </Suspense>
                                ) : (
                                    <EmptyState 
                                        icon={FileText}
                                        title="No Files Available"
                                        description="Start a conversation to generate project files. Your code files will appear here for exploration."
                                    />
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup> 
        </div>
    )
}