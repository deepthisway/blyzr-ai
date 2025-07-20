import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useState } from "react";

type FileCollection = {
    [path : string] : string
};

function getLanguagefromExtension(filename: string) {
    const extension = filename.split('.').pop();
    return extension || "text";
}

interface FileExplorerProps {
    files : FileCollection
}

export const FileExplorer = ({files} : FileExplorerProps) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(()=>    {
        const fileKeys = Object.keys(files);
        return fileKeys[0] || null;
    });

    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={10}>
                <p>Todo: File tree</p>
            </ResizablePanel>
            <ResizablePanel defaultSize={80} minSize={10}>
                {selectedFile ?  (
                    <div>TODO: Code view</div>
                )
                    : <div>Select a file to view</div>
                }
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}