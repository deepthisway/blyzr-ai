import { Button } from "@/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CheckIcon, CopyIcon } from "lucide-react";
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
    const pathSegments = filePath.split('/');
    const maxSegment = 4;
    
    const renderBreadCrump = () => {
        if(pathSegments.length <= maxSegment){
            return pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                        {isLast ? <BreadcrumbPage className="font-medium">
                        {segment}
                        </BreadcrumbPage> : 
                        <span>
                            {segment}
                        </span>
                        }
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator/>
                        }
                    </Fragment>
                )
            })
        }
        else{
            const firstSegment = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length - 1];

            return (
                <>
                    <BreadcrumbItem>
                    <span className="text-muted-foreground">
                        {firstSegment}
                    </span>
                    <BreadcrumbSeparator/>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">
                        {lastSegment}
                    </BreadcrumbPage>
                    </BreadcrumbItem>
                </>
            )
        }
    }
    return (
        <Breadcrumb>
        <BreadcrumbList>
        {renderBreadCrump()}
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
            <ResizablePanel defaultSize={80} minSize={10}>
                {selectedFile ? (
                    <div
                        className="h-full w-full flex flex-col">
                        <div className="p-2 border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                            {/* TOdo file breadcrumb */}
                            <FileBreadcrumb filePath={selectedFile}/>
                            <Hint text={copied ? "Copied" : "Copy code"} side="right" align="center">
                                <Button variant="ghost" size="icon" className="ml-auto" onClick={handelCopyCode}>
                                    {copied ? <CheckIcon /> : <CopyIcon />}
                                </Button>
                            </Hint>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <CodeView code={files[selectedFile] || ""} lang={getLanguagefromExtension(selectedFile || "")} />
                        </div>
                    </div>
                )
                    : <div>Select a file to view</div>
                }
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}