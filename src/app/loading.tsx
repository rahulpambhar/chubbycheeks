import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image";

interface Props {
    minHeight?: string | null
}


export default function Loading({ minHeight }: Props) {
    // Or a custom loading skeleton component
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4">
                <Image src="/image/chubbyCheeks/logo.png" alt="Logo" width={200} height={200} className="size-12 text-black" />
                <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-lg font-medium text-muted-foreground">Loading...</p>
                </div>
            </div>
        </div>
    );
}