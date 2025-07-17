import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'
import { ProjectView } from '../ui/views/project-view';

interface Props {
    params: Promise<{
        projectId: string;
    }>
}
const page = async ({params}: Props) => {
    const {projectId} = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.messages.getMessages.queryOptions({
        projectId
    }))
    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
       id: projectId
    }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default page;
 