import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CheckIcon, CopyIcon, FileIcon } from "lucide-react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Hint } from "./Hint";
import { CodeView } from "./code-view";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./TreeView";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";


type FileCollection = {
    [path: string]: string
};

function getLanguagefromExtension(filename: string) {
    const extension = filename.split('.').pop();
    return extension || "text";
}

interface FileBreadCrumpProps {
    filePath: string
}

const FileBreadcrumb = ({filePath}: FileBreadCrumpProps) => {
    const pathSegments = filePath.split('/').filter(segment => segment.length > 0);
    const maxSegment = 4;
    
    const renderBreadcrumb = () => {
        if(pathSegments.length <= maxSegment){
            return pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {isLast ? (
                                <BreadcrumbPage className="font-medium text-foreground">
                                    {segment}
                                </BreadcrumbPage>
                            ) : (
                                <span className="text-muted-foreground text-sm">
                                    {segment}
                                </span>
                            )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator className="text-muted-foreground" />}
                    </Fragment>
                )
            })
        }
        else{
            const firstSegment = pathSegments[0];
            const lastSegments = pathSegments.slice(-2);

            return (
                <>
                    <BreadcrumbItem>
                        <span className="text-muted-foreground text-sm">
                            {firstSegment}
                        </span>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-muted-foreground" />
                    <BreadcrumbItem>
                        <span className="text-muted-foreground text-sm">...</span>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-muted-foreground" />
                    {lastSegments.map((segment, index) => {
                        const isLast = index === lastSegments.length - 1;
                        return (
                            <Fragment key={`last-${index}`}>
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage className="font-medium text-foreground">
                                            {segment}
                                        </BreadcrumbPage>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">
                                            {segment}
                                        </span>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && <BreadcrumbSeparator className="text-muted-foreground" />}
                            </Fragment>
                        )
                    })}
                </>
            )
        }
    }
    
    return (
        <Breadcrumb className="flex-1">
            <BreadcrumbList className="flex-wrap">
                {renderBreadcrumb()}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

interface FileExplorerProps {
    files: FileCollection
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);
        return fileKeys[0] || null;
    });
    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files)
    }, [files]);
    const handelFileSelect = useCallback((filePath: string) => {
        if (files[filePath]) {
            setSelectedFile(filePath)
        }
    }, [files])
    const [copied, setCopied] = useState(false);
    const handelCopyCode = () => {
        if (!selectedFile) return;
        navigator.clipboard.writeText(files[selectedFile]);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={10}>
                <TreeView data={treeData}
                    value={selectedFile}
                    onSelect={handelFileSelect}
                />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80} minSize={10}>
                {selectedFile ? (
                    <div
                        className="h-full w-full flex flex-col">
                        <div className="border-b bg-muted/30 px-4 py-3 flex items-center justify-between gap-x-3 min-h-[52px]">
                            <FileBreadcrumb filePath={selectedFile}/>
                            <div className="flex items-center gap-x-2">
                                <Hint text={copied ? "Copied!" : "Copy code"} side="bottom" align="center">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0 hover:bg-accent transition-colors" 
                                        onClick={handelCopyCode}
                                    >
                                        {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                                    </Button>
                                </Hint>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <CodeView code={files[selectedFile] || ""} lang={getLanguagefromExtension(selectedFile || "")} />
                        </div>
                    </div>
                )
                    : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <FileIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">No file selected</p>
                                <p className="text-sm">Choose a file from the explorer to view its contents</p>
                            </div>
                        </div>
                    )
                }
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}