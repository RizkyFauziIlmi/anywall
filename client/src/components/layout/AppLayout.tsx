import React from "react";
import Search from "../top-bar";
import { Separator } from "../ui/separator";

interface AppLayoutProps {
    children: React.ReactNode,
    isFullscreen?: boolean
}

export default function AppLayout ({ children, isFullscreen }: AppLayoutProps) {
    return(
        <div>
            <Search isFullscreen={isFullscreen} />
            <Separator />
            {children}
        </div>
    )
}