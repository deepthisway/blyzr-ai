import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { TreeItem } from "@/lib/types";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";

interface TreeViewProps {
    data: TreeItem[];
    value?: string | null;
    onSelect: (value: string) => void;
}

export const TreeView = ({data, value, onSelect}: TreeViewProps ) => {
    return (
        <SidebarProvider>
            <Sidebar collapsible="none" className="w-full">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {data.map((item, index) => (
                                    <Tree
                                        key={index}
                                        item={item}
                                        onSelect={onSelect}
                                        selectedValue={value}
                                        parentPath=""
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail/>
            </Sidebar>
        </SidebarProvider>
    )
}

interface TreeProps {
    item: TreeItem;
    onSelect: (value: string) => void;
    selectedValue?: string | null;
    parentPath: string
}

const Tree = ({item, onSelect, selectedValue, parentPath}: TreeProps) => {
    const [name, ...items] = Array.isArray(item) ? item : [item];
    const currentPath = parentPath ? `${parentPath}/${name}` : name;
    
    if(!items.length) {
        const isSelected = selectedValue === currentPath;
        return (
            <SidebarMenuItem>
                <SidebarMenuButton 
                    isActive={isSelected}
                    onClick={() => onSelect(currentPath)}
                    className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground hover:bg-accent/50 transition-colors"
                >
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="ml-2 truncate text-sm">{name}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }
    
    // its a folder
    return (
        <SidebarMenuItem>
            <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-accent/50 transition-colors">
                        <ChevronRightIcon className="h-4 w-4 text-muted-foreground transition-transform" />
                        <FolderIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="ml-2 truncate text-sm font-medium">
                            {name}
                        </span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub className="ml-4 border-l border-border/50">
                        {items.map((item, index) => (
                            <Tree
                                key={index}
                                item={item}
                                onSelect={onSelect}
                                selectedValue={selectedValue}
                                parentPath={currentPath}
                            />
                        ))} 
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}