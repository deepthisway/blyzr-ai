import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const ShimmerMessages= ()=> {
    const messages = [
        "Thinking...",
        "Loading...",
        "Generating...",
        "Crafting components..."
    ]
    
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    
    useEffect(()=>  {
        const interval = setInterval(()=>   {
            setCurrentMessageIndex((prev)=> (prev+1)% messages.length)
        }, 2000);

        return ()=> clearInterval(interval);
    }, [messages.length]);

    return (
      <div className="flex items-center gap-2">
        <span className="text-base text-muted-foreground animate-pulse">
          {messages[currentMessageIndex]}
        </span>
      </div>
    );
}
    

const MessageLoading = () => {
  return (
    <div className='flex flex-col group px-2 pb-4'>
        <div className="flex items-center gap-2 pl-2 mb-2">
            <Image
            src="/logo.svg"
            alt="blyzr"
            width={18}
            height={18}
            className='shrink-0'
            />
        </div>
        <div className='pl-8.5 flex flex-col gap-y-4'>
            <ShimmerMessages/>
        </div>
    </div>
  )
}

export default MessageLoading