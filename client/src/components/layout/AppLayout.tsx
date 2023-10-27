import React from "react";
import Search from "../top-bar";

interface AppLayoutProps {
    children: React.ReactNode,
    isFullscreen?: boolean,
    isSearch?: boolean,
}

export default function AppLayout ({ children, isFullscreen, isSearch = true }: AppLayoutProps) {
    return(
        <div>
            <Search isFullscreen={isFullscreen} isSearch={isSearch} />
            {children}
        </div>
    )
}