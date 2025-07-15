'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTRPC } from '@/trpc/client'
import { caller } from '@/trpc/server'
import { useMutation} from '@tanstack/react-query'
import React, { useState } from 'react'

const Page = () => { 
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}))
  const [text, setText] = useState("");
  const handelSubmit = async ()=>{
    invoke.mutate({text});
  }

  return (
    <div className='flex flex-col justify-center h-screen gap-4 max-w-1/4 items-center mx-auto'>
      <h1 className='text-2xl font-bold'>Invoke TRPC</h1>
      <Input
      type='text'
      placeholder='Enter your prompt'
      value = {text}
      onChange={(e)=> setText(e.target.value)}
      />
      <Button
        onClick={handelSubmit}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Invoke TRPC
      </Button>
    </div>
  )
}

export default Page