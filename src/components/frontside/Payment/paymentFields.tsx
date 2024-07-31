import React from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const PaymentFields = ({ form, returnOrder }: { form : any, returnOrder: boolean}) => {
    return (
        <div>
            <div className="grid grid-cols-3 gap">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="grid gap-2 m-2">
                            <FormLabel className="text-tiny">Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" /> {/* Add a fixed height here */}
                        </FormItem>
                    )}
                />
                {/* <div className=' grid-cols-2 '> */}

                <FormField
                    control={form.control}
                    name="country_code"
                    render={({ field }) => (
                        <FormItem className="grid gap-1   w-full m-2">
                            <FormControl className='w-[80px]'>
                                <Input readOnly type="text" className='mt-7' placeholder="+91" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" /> {/* Add a fixed height here */}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                        <FormItem className="grid gap-2   m-2">
                            <FormLabel className="text-tiny">Mobile</FormLabel>
                            <FormControl className=''>
                                <Input type="text" className='w-full' placeholder="Mobile" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" /> {/* Add a fixed height here */}
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid gap-2 m-2">
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-tiny">{returnOrder ? "Return Address" : "Address"}</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Address" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap">
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem className="grid gap-2 m-2">
                            <FormLabel className="text-tiny">City</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                        <FormItem className="grid gap-2 m-2">
                            <FormLabel className="text-tiny">Pincode</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Pincode" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

            </div>
            <div className="grid grid-cols-2 gap">
                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem className="grid gap-2 m-2" >
                            <FormLabel className="text-tiny">State</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem className="grid gap-2 m-2" >
                            <FormLabel className="text-tiny">Country</FormLabel>
                            <FormControl>
                                <Input readOnly type="text" placeholder="Country" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

export default PaymentFields