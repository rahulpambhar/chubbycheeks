import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import Link from 'next/link'
import { useAppDispatch } from '@/app/redux/hooks'
import { updateOrdersFunc } from '@/app/redux/slices/orderSlices'
import { errorToast, successToast } from '@/components/toster'
import { useSession } from "next-auth/react";
import { updateReturnOrdersFunc } from '@/app/redux/slices/returnOrderSlice';

const page = ({ item, getOrders }: any) => {
    const { data: session, status }: any = useSession();

    const dispatch = useAppDispatch();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    <Link href={`/checkout/estimation/?returnOrderID=${item?.id}`} className='text-gray-500'>
                        View Return Order
                    </Link>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                    <Link href={`/checkout/estimation/?returnOrderID=${item?.id}`} className='text-green-500'>
                        Repeat Order
                    </Link>
                </DropdownMenuItem>

                {item?.orderStatus === "PROCESSING" || item?.orderStatus === "ACCEPTED" ?
                    <DropdownMenuItem>
                        <Link href={`/checkout/estimation/update/?returnOrderID=${item?.id}`} legacyBehavior>
                            <a target="_blank" className='text-blue-500'>
                                Update
                            </a>
                        </Link>
                    </DropdownMenuItem>
                    : ""
                }
                {item?.orderStatus !== "CANCELLED" && item?.orderStatus !== "COMPLETE" && item?.orderStatus !== "RETURNED" && item?.orderStatus !== "SHIPPED"&&(
                    <DropdownMenuItem className='text-red-500' onClick={async () => {
                        const res: any = await dispatch(updateReturnOrdersFunc({ id: item?.id, data: {}, orderStatus: "CANCELLED" }))

                        if (res?.payload?.st === true) {
                            successToast(res?.payload?.msg)
                            session && getOrders()
                        } else {
                            errorToast(res?.payload?.msg)
                        }

                    }}>Cancel</DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default page