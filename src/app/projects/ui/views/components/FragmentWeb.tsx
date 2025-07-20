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
            <div className="border-b bg-muted/30 px-4 py-3 flex items-center gap-x-3 min-h-[52px]">
                <Hint text="Refresh preview" side="bottom" align="center">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={onRefresh}
                        className="h-8 px-3 hover:bg-accent transition-colors"
                    >
                        <RefreshCcwIcon className="h-4 w-4" />
                    </Button>
                </Hint>
                
                <Hint text={copied ? "Copied!" : "Copy URL"} side="bottom" align="center">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        disabled={!data.sandboxUrl || copied}
                        className="flex-1 justify-start text-left font-normal min-w-0 hover:bg-accent transition-colors" 
                        onClick={handelCopy}
                    >
                        <span className="truncate text-sm text-muted-foreground">
                            {data.sandboxUrl || "No URL available"}
                        </span>
                    </Button>
                </Hint>
                
                <Hint text="Open in new tab" side="bottom" align="center">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        disabled={!data.sandboxUrl}
                        onClick={() => {
                            if(!data.sandboxUrl) return;
                            window.open(data.sandboxUrl, '_blank');
                        }}
                        className="h-8 px-3 hover:bg-accent transition-colors"
                    >
                        <ExternalLinkIcon className="h-4 w-4" />
                    </Button>
                </Hint>
            </div>
            
            <div className="flex-1 relative">
                {data.sandboxUrl ? (
                    <iframe 
                        src={data.sandboxUrl} 
                        className="h-full w-full border-0" 
                        sandbox="allow-scripts allow-forms allow-popups allow-same-origin allow-modals" 
                        loading="lazy"
                        key={fragmentKey}
                        title="Preview"
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground h-full">
                        <div className="text-center">
                            <ExternalLinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">No preview available</p>
                            <p className="text-sm">The sandbox URL is not available for this fragment</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}