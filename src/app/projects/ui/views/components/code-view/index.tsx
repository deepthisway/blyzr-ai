import Prism  from "prismjs";
import "./code-theme.css"
import { useEffect } from "react";

export const CodeView = ({code, lang}: {code: string, lang: string}) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [code]);
    return (
        <div>
           <pre
           className="p-2 bg-transparent border-none rounded-none m-0 text-xs"><code className={`language-${lang}`}>{code}</code></pre>
        </div>
    )
}