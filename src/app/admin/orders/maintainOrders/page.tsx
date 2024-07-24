"use client";
// import { dataNotFound } from "@/assets";
import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/admin/breadcrumb";
import { FaCopy } from 'react-icons/fa';
import { dataNotFound, } from "../../../../../public/assets";
import moment from "moment";
import { successToast, errorToast } from "../../../../components/toster/index";
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { createTempOrderFunc, updateOrdersFunc, getOrdersFunc } from '../../../redux/slices/orderSlices';
import { useSession } from "next-auth/react";
import Pagination from "react-js-pagination";
import { orderStatus, shipped } from "../../../utils"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { addYears, setHours, setMinutes, setSeconds, setMilliseconds, addDays, format } from "date-fns";
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { FaEdit } from 'react-icons/fa';
import { Select as Select_, SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel } from '@radix-ui/react-select';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer"
import Link from "next/link";

export const getStatusClass = (status: any) => {
    switch (status) {
        case "ALL":
            return 'border border-gray-500 text-black-500';
        case "PROCESSING":
            return 'border border-yellow-500 text-black-500';
        case "ACCEPTED":
            return 'border border-blue-500 text-black-500';
        case "SHIPPED":
            return 'border border-indigo-500 text-black-500';
        case "CANCELLED":
            return 'border border-red-500 text-red-500';
        case "COMPLETE":
            return 'border border-green-500 text-green-500';
        default:
            return 'bg-gray-500 text-white';
    }
};

function Page({ className, ...props }: any) {
    const { data: session, status }: any = useSession();

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const [searchOrder, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [SHIPPEDid, setSHIPPEDid] = useState("")
    const [perPage, setperPage] = useState(25)
    const [date, setDate] = useState<DateRange | undefined>({ from: oneMonthAgo, to: today, })
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("ALL");
    const [isDrawerOpen, setDrawerOpen] = useState(false);


    const handleSelect = (id: any) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((item) => item !== id)
                : [...prevSelected, id]
        );
    };
    const preserveTime = (date: any, referenceDate: any) => {
        return setMilliseconds(setSeconds(setMinutes(setHours(date, referenceDate.getHours()), referenceDate.getMinutes()), referenceDate.getSeconds()), referenceDate.getMilliseconds());
    };

    const handleDateChange = (range: any) => {
        if (range) {
            const { from, to } = range;
            const updatedFrom = from ? preserveTime(from, new Date()) : undefined;
            const updatedTo = to ? preserveTime(to, new Date()) : undefined;
            setDate({ from: updatedFrom, to: updatedTo });
        }
    };
    const dispatch = useAppDispatch();


    const getOrders = async () => await dispatch(getOrdersFunc({ page: page, limit: perPage, search: "", from: date?.from?.toString(), to: date?.to?.toString(), slug: "getPaginated", }))
    const data: any = useAppSelector((state) => state?.orderReducer?.orders);
    const total_pages = data?.total_pages;

    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            successToast('Address copied to clipboard');
        }).catch((err) => {
            errorToast('Failed to copy address');
        });
    };

    const getOrderSearch = async (search: string) => await dispatch(getOrdersFunc({ page: page, limit: perPage, search: search, from: date?.from?.toString(), to: date?.to?.toString(), slug: "getPaginated", }))




    const getActionButton = (status: any) => {
        switch (status) {
            case "ALL":
                return 'bg-gray-500 text-white';
            case "PROCESSING":
                return <Button className="mt-[1px] h-[35px] bg-blue-600" onClick={async () => {

                    if (selectedItems?.length === 0) {
                        errorToast("Please select at least one order");
                        return
                    }

                    const res = await dispatch(updateOrdersFunc({ id: selectedItems, data: {}, orderStatus: "ACCEPTED", }));
                    if (res?.payload?.st === true) {
                        successToast(res?.payload?.msg);
                        getOrderSearch(status)
                        setSelectedItems([]);

                    } else {
                        errorToast(res?.payload?.msg);
                    }
                }}>
                    Accept Orders
                </Button>

            case "SHIPPED":
                return <>
                    <Button className="mt-[1px] h-[35px] bg-red-600" onClick={async () => {

                        if (selectedItems?.length === 0) {
                            errorToast("Please select at least one order");
                            return
                        }

                        const res = await dispatch(updateOrdersFunc({ id: selectedItems, data: {}, orderStatus: "CANCELLED", }));
                        if (res?.payload?.st === true) {
                            successToast(res?.payload?.msg);
                            getOrderSearch(status)
                            setSelectedItems([]);

                        } else {
                            errorToast(res?.payload?.msg);
                        }
                    }}>
                        Cancel Orders
                    </Button>
                    <Button className="mt-[1px] h-[35px] ml-2 bg-green-600">
                        complete Orders
                    </Button>
                </>
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const openDrawer = (id: any, status: any) => {
        setDrawerOpen(true);
        setSHIPPEDid(id);
    };
    const form = useForm({
        resolver: zodResolver(shipped),
        defaultValues: {
            length: 0, breadth: 0, height: 0, weight: 0,
        },
    });


    const onSubmit = async (data: any) => {

        const res = await dispatch(updateOrdersFunc({ id: SHIPPEDid, data, orderStatus: "SHIPPED" }));
        if (res?.payload?.st === true) {

            successToast(res?.payload?.msg);
            getOrders()
            setSHIPPEDid("");
            setDrawerOpen(false);
            form.reset();
        } else {
            errorToast(res?.payload?.msg);
        }
    };

    useEffect(() => {
        session && selectedOption === "ALL" && getOrders()
    }, [session, page, perPage])





    return (
        <>
            <Drawer open={isDrawerOpen} onClose={() => setSHIPPEDid("")} onOpenChange={setDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Dimensions for Shipment</DrawerTitle>
                    </DrawerHeader>
                    <DrawerFooter className="justify-center items-center  ">
                        <Form {...form} >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 h-[500px] w-[500px] p-2 rounded rounded-sm border border-black mb-10">
                                <FormField
                                    control={form.control}
                                    name="length"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Length</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Length" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="breadth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Breadth</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Breadth" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="height"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Height</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Height" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Weight</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Weight" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className=" justify-center mb-4">Submit</Button>
                                <DrawerClose >
                                    <Button variant="outline" type="button" className="ml-3 border border-black" onClick={() => { setSHIPPEDid(""); setDrawerOpen(false); form.reset(); }} >Close</Button>
                                </DrawerClose>
                            </form>
                        </Form>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <div className="container">
                <div className="filter-section position flex justify-between items-center py-5 ">
                    <select
                        value={perPage}
                        onChange={(e) => setperPage(Number(e.target.value))}
                        className="  block w-32 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>

                <div className=" mt-4 relative overflow-x-auto shadow-md sm:rounded-lg ">
                    <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-gray-200 dark:bg-gray-900">
                        <div className={cn("grid gap-2", className)}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-[300px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(date.from, "LLL dd, y")} -{" "}
                                                    {format(date.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(date.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={handleDateChange}
                                        numberOfMonths={2}

                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="mx-6 my-3">
                            <Select_ value={selectedOption} onValueChange={(e) => {
                                e === "ALL" ? getOrders() : getOrderSearch(e)
                                setSelectedOption(e)
                            }}>
                                <SelectTrigger className={`font-normal ${getStatusClass(selectedOption)} rounded px-2 py-1`} >
                                    <span>{selectedOption}</span>
                                </SelectTrigger>
                                <SelectContent className="border mt-1 rounded bg-white shadow-lg">

                                    <SelectGroup>
                                        {/* <SelectItem className="p-2 hover:bg-gray-200 cursor-pointer " value="All">All</SelectItem> */}
                                        {orderStatus.map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={option}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select_>
                        </div>

                        <div className="mx-6 my-3">
                            {selectedOption === "PROCESSING" && getActionButton(selectedOption)}
                            {selectedOption === "SHIPPED" && getActionButton(selectedOption)}

                        </div>

                        <div className="relative ml-auto">

                            <button onClick={(e: any) => {
                                getOrderSearch(searchOrder)
                            }} type="button" className="absolute  inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 ">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                onChange={(e: any) => {
                                    setSearch(e.target.value)
                                }}
                                value={searchOrder}
                                id="table-search-users"
                                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Invoice No, Email, Mobile"
                            />
                            {searchOrder !== "" && <button onClick={() => { setSearch(""); getOrders() }} type="button" className="absolute inset-y-0 end-0 flex items-center pe-3">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>}


                        </div>

                    </div>

                    <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {
                                    selectedOption !== "ALL" && <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                }

                                <th scope="col" className="px-6 py-3">
                                    Order Id
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Manage
                                </th>
                            </tr>
                        </thead>

                        <tbody >
                            {
                                data && data?.data?.length > 0 ? data?.data?.map((item: any, index: number) => (
                                    <tr key={item.id} className="bg-gray-200  h-[20px] border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">


                                        {selectedOption !== "ALL" && <td className="px-6 ">
                                            <input
                                                type="checkbox"
                                                id={`checkbox-${item.id}`}
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelect(item.id)}
                                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                            />
                                        </td>
                                        }

                                        <td scope="row" className="flex items-center px-6  text-gray-900 whitespace-nowrap dark:text-white">
                                            <h6 className="font-normal text-gray-500">{`${item?.id?.slice(0, 3)}...${item?.id.slice(-4)}`}</h6>
                                            <FaCopy
                                                className="ml-2 cursor-pointer text-blue-500"
                                                onClick={() => handleCopy(item.id)}
                                                title="Copy to clipboard"
                                            />
                                        </td>
                                        <td className="px-6 ">
                                            <div className="font-normal text-gray-500">{moment(item?.createdAt).format("DD-MM-YYYY")}</div>
                                            <div className="font-normal text-gray-500">{moment(item?.createdAt).format("HH:mm:ss")}</div>
                                        </td>

                                        <td className="px-6 py-3">
                                            <div className="font-normal text-gray-500">{item?.user?.name}</div>
                                        </td>

                                        <td className="">
                                            <Select_ value={item?.orderStatus} onValueChange={async (e) => {
                                                const ids = [item?.id]
                                                if (e === "SHIPPED") {
                                                    openDrawer(item?.id, "SHIPPED")
                                                    return
                                                }

                                                const res = await dispatch(updateOrdersFunc({ id: ids?.length > 0 ? ids : item?.id, data: {}, orderStatus: e, }));
                                                if (res?.payload?.st === true) {

                                                    successToast(res?.payload?.msg);
                                                    item?.orderStatus === selectedOption ? getOrderSearch(selectedOption) : getOrders()

                                                } else {
                                                    errorToast(res?.payload?.msg);
                                                }
                                            }} >
                                                <SelectTrigger className={`font-normal ${getStatusClass(item?.orderStatus)} rounded px-2 py-1`} >
                                                    <span>{item?.orderStatus}</span>
                                                </SelectTrigger>
                                                <SelectContent className="border mt-1 rounded bg-white shadow-lg">
                                                    <SelectGroup>
                                                        {orderStatus.map((option) => (
                                                            <SelectItem
                                                                key={option}
                                                                value={option}
                                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                            >
                                                                {option}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select_>
                                        </td>

                                        <td className=" px-6 ">
                                        <h6 className="font-normal text-gray-500">{`${item?.updatedBy?.slice(0, 3)}...${item?.updatedBy?.slice(-4)}`}</h6>

                                            <h6 className="font-normal  text-gray-500">{item?.netAmount}</h6>
                                        </td>
                                        <td className=" px-6 ">
                                            <h6 className="font-normal  text-gray-500">{item?.netAmount}</h6>
                                        </td>

                                        <td className="px-6 ">

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline">
                                                        <FaEdit className="text-gray-500 hover:text-gray-700" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <Link href={`/admin/orders/order?orderID=${item?.id}`}>
                                                        <DropdownMenuCheckboxItem>
                                                            View
                                                        </DropdownMenuCheckboxItem>
                                                    </Link>
                                                    <DropdownMenuCheckboxItem >
                                                        Download
                                                    </DropdownMenuCheckboxItem>

                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                                    :
                                    <tr className="justify-auto h-full">
                                        <td colSpan={6} className="text-center">
                                            <div className="flex justify-center items-center">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={dataNotFound}
                                                    alt="Data not found"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>

                <Pagination
                    activePage={page}
                    itemsCountPerPage={perPage}
                    totalItemsCount={total_pages * perPage} // Total items count is total pages * items per page
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                />
            </div >
        </>

    );
}

export default Page;


