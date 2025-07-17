'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTRPC } from '@/trpc/client'
import { caller } from '@/trpc/server'
import { useMutation} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => { 
  const trpc = useTRPC();
  const router = useRouter();

  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      console.error("Error creating project:", error);
    },
    onSuccess: (data)=> {
      router.push('/projects/' + data.id);
      console.log("Project created successfully:", data);
    }
  }))
  const createMessage = useMutation(trpc.messages.create.mutationOptions({}))
  const [value, setValue] = useState<string>('');

  const handelSubmit = async ()=>{
    createProject.mutate({ value: value });
  }

  return (
    <div className='flex flex-col justify-center h-screen gap-4 max-w-1/4 items-center mx-auto'>
      <Input
      type='text'
      placeholder='Enter your prompt'
      value = {value}
      onChange={(e)=> setValue(e.target.value)}
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