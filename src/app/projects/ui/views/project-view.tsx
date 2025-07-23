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
import { CrownIcon, EyeIcon, CodeIcon, Link } from "lucide-react";
import { CodeView } from "./components/code-view";
import { FileExplorer } from "./components/file-explorer";
interface Props {
    projectId : string
}

export const ProjectView = ({projectId} : Props)   =>   {
    const trpc = useTRPC();
    const [activeFragment, setActiveFragment] = useState<Fragment | null> (null)
    const {data : project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id : projectId
    }))
    const [tabState, setTabState] = useState<'web' | 'code'>('web')
    console.log('project', project)

    const {data : messages} = useSuspenseQuery(trpc.messages.getMessages.queryOptions({
        projectId
    }))

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">
                    <Suspense fallback={<p>Loading.....</p>}>  
                        <ProjectHeader projectId={projectId}/>
                    </Suspense>
                    <Suspense fallback={<p>Loading....</p>}>
                        <MessageContainer projectId={projectId}
                        activeFragment={activeFragment}
                        setActiveFragment={setActiveFragment}
                        />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle className="hover: bg:primary transition-colors"/>
                <ResizablePanel defaultSize={65} minSize={20} className="flex flex-col min-h-0">
                    <Tabs className="h-full gap-y-0"
                    defaultValue="web"
                    value={tabState}
                    onValueChange={(value) => setTabState(value as "web" | "code")}>
                        <TabsList className="h-8 p-0 border rounded-md">
                            <TabsTrigger value="web">
                                <EyeIcon className="w-4 h-4"/>
                                Web
                            </TabsTrigger>
                            <TabsTrigger value="code">
                                <CodeIcon className="w-4 h-4"/>
                                Code
                            </TabsTrigger>
                        </TabsList>
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button asChild size='sm' variant='default'>
                                <Link href={`/pricing`}>
                                    <CrownIcon className="w-4 h-4"/> Upgrade 
                                </Link>
                            </Button>
                        </div>   
                        <TabsContent value="web">
                            {!!activeFragment && (
                                <Suspense fallback={<p>Loading....</p>}>
                                    <FragmentWeb data = {activeFragment}/>
                                </Suspense>
                            )}
                        </TabsContent>
                        <TabsContent value="code" className="min-h-0">
                            {!!activeFragment && (
                                <Suspense fallback={<p>Loading....</p>}>
                                    <FileExplorer files={activeFragment.files as {[path: string]: string}}/>
                                </Suspense>
                            )}
                        </TabsContent>
                </Tabs>
                </ResizablePanel>

            </ResizablePanelGroup> 
            </div>
    )
}