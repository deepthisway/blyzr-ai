import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'
import MessageCard from './MessageCard';

interface Props {
    projectId: string;
}

const MessageContainer = ({projectId} : Props) => {
    const trpc = useTRPC();
    const {data: messages} = useSuspenseQuery(trpc.messages.getMessages.queryOptions({
        projectId,
    }))
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div>
          {messages.map((m) => {
            return (
              <MessageCard
                key={m.id}
                content={m.content}
                role={m.role}
                fragment={m.fragment}
                createdAt={m.createdAt}
                isActiveFragment={false}
                onFragmentClick={() => {}}
                type={m.type}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MessageContainer