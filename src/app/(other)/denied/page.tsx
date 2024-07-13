import Image from "next/image"
import Link from "next/link"
import { denied } from "../../../../public/assets"


export default function Component() {
    return (
        <div className="w-full min-h-screen flex items-center">
            <div className="container space-y-8 px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex flex-col items-center space-y-2">
                        <Image
                            alt="Image"
                            className="aspect-square overflow-hidden rounded-full object-cover"
                            height="120"
                            src={denied}
                            width="120"
                        />
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold">Access Denied</h1>
                            <p className="max-w-[500px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                                You do not have permission to access this resource. Please contact the administrator if you believe this
                                is an error.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Link
                            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                            href="/"
                        >
                            Go Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

