import { Button } from "@/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { CopyIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Hint } from "./Hint";
import { CodeView } from "./code-view";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./TreeView";


type FileCollection = {
    [path: string]: string
};

function getLanguagefromExtension(filename: string) {
    const extension = filename.split('.').pop();
    return extension || "text";
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
                            <Hint text="Copy code" side="right" align="center">
                                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => { }}>
                                    <CopyIcon />
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