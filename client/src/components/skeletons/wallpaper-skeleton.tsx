import Breadcrumb from "../breadcrumb";
import AppLayout from "../layout/AppLayout";
import { Skeleton } from "../ui/skeleton";

export default function WallpaperSkeleton() {
    return(
        <AppLayout>
            <div className="flex h-screen w-screen flex-col justify-center items-center py-2 min-h-screen px-5">
                <Breadcrumb />
                <Skeleton className="h-80 w-9/12"/>
                <div className="flex flex-col gap-1.5 mt-1 justify-center items-center">
                    <Skeleton className="h-4 w-[500px] " />
                    <Skeleton className="h-4 w-[250px]" />
                </div>
                <div className="flex w-full gap-2 justify-center items-center pt-4">
                    <Skeleton className="h-6 w-[30px]" />
                    <Skeleton className="h-6 w-[50px]" />
                    <Skeleton className="h-6 w-[50px]" />
                    <Skeleton className="h-6 w-[50px]" />
                </div>
            </div>
        </AppLayout>
    )
} 