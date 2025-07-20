import { Button } from "@/components/ui/button"
import { Fragment } from "@/generated/prisma"
import { ExternalLinkIcon, RefreshCcw, RefreshCcwIcon } from "lucide-react"
import { useState } from "react";
import { Hint } from "./Hint";

export const FragmentWeb = ({data}: {data: Fragment}) => {
    const [copied, setCopied] = useState(false);
    const [fragmentKey, setFragmentKey] = useState(0);
    
    const onRefresh = () => {
        setFragmentKey((prev) => prev + 1);
    }
    
    const handelCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="bg-sidebar flex items-center p-2 gap-x-2">
                <Hint text="Refresh" side="right" align="center">
                <Button size="sm" variant="outline" onClick={onRefresh}>
                    <RefreshCcwIcon/>
                </Button>
                </Hint>
                <Hint text="Copy URL" side="bottom" align="center">
                <Button size="sm" variant="outline" disabled={!data.sandboxUrl || copied}
                className="flex-1 justify-start text-start font-normal" onClick={handelCopy}>
                    <span className="truncate">
                        {data.sandboxUrl}   
                    </span>
                </Button>
                </Hint>
                <Hint text="Open in new tab" side="right" align="center">
                <Button size="sm" variant="outline" disabled={!data.sandboxUrl}
                onClick={() => {
                    if(!data.sandboxUrl) return;
                    window.open(data.sandboxUrl, '_blank');
                }}
                >
                    <ExternalLinkIcon/>
                </Button>
                </Hint>

            </div>
            <iframe src={data.sandboxUrl} className="h-full w-full" sandbox="allow-scripts allow-forms allow-popups allow-same-origin" 
            loading="lazy"
            key={fragmentKey}/>
        </div>
    )
}