import { Card } from '@/components/ui/card'
import { Fragment, MessageRole, MessageType } from '@/generated/prisma'
import React from 'react'

interface MessageCardProps {
    content: string,
    role: MessageRole,
    fragment: Fragment | null,
    createdAt: Date,
    isActiveFragment: boolean,
    onFragmentClick: (fragment : Fragment) => void,
    type: MessageType
}
interface UserMessageProps {
  content: string
}



const UserMessage = ({content} : UserMessageProps)=>  {
  return (
    <div>
      <Card className="flex justify-end pb-4 pr-2 pl-10">
        {content}
      </Card>
    </div>
  )
}

const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) => {
  if(role === "ASSISTANT")  {
    return(
      <AssistantMessage/>
    )
  }
  return (
    <UserMessage content={content} />
  )
}

export default MessageCard;