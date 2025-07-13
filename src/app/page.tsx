
import { caller } from '@/trpc/server'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const Page = async () => {
  const data = await caller.hello({text: "QTTTTT"})
  return (
    <div>{JSON.stringify(data)}</div>
  )
}

export default Page