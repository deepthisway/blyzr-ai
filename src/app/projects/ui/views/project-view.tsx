'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import MessageContainer from "./components/project-msg-container";
import { Suspense } from "react";

interface Props {
    projectId : string
}

export const ProjectView = ({projectId} : Props)   =>   {
    const trpc = useTRPC();
    const {data : project} = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id : projectId
    }))
    console.log('project', project)

    const {data : messages} = useSuspenseQuery(trpc.messages.getMessages.queryOptions({
        projectId
    }))

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">
                    <Suspense fallback={<p>Loading....</p>}>
                        <MessageContainer projectId={projectId}/>
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={65} minSize={20} className="flex flex-col min
                -h-0">
                    Todo: Preview
                </ResizablePanel>
            </ResizablePanelGroup> 
            </div>
    )
}