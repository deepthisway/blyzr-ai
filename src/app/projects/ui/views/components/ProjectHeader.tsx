import React from 'react'
import ChatHeader from '@/components/ChatHeader'

interface Props {
    projectId: string
}

const ProjectHeader = ({projectId}: Props) => {
  return (
    <ChatHeader 
      projectId={projectId}
      showBackButton={true}
      showProjectInfo={true}
    />
  )
}

export default ProjectHeader