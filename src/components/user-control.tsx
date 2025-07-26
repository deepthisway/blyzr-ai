import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "./ThemeProvider";
interface Props{
    showName?: boolean;
}


export const UserControl = ({showName}: Props) => {
    const {theme} = useTheme();
    const getClerkTheme = () => {
        if (theme === 'dark') {
            return dark;
        }
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            return systemTheme === 'dark' ? dark : undefined;
        }
        return undefined;
    };
    
    return (
        <UserButton 
            showName={showName}
            appearance={{
                baseTheme: getClerkTheme()
            }}
        />
    )
} 