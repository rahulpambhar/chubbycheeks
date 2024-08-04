'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage, Field, Form, Formik } from "formik"
import { getInTouchSchema } from "@/app/utils";
import { errorToast, successToast } from '@/components/toster';
import axios from "axios";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { MailIcon, ChevronDownIcon, PhoneIcon } from '@/components'
import Cart from '@/components/Cart';

export default function Component() {
    return (
        <div className="flex flex-col min-h-screen">

            <main className="flex-1 py-12 px-6 md:px-8">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                    {/* <div>
                        <h1 className="text-3xl font-bold mb-4">Customer Care</h1>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <MailIcon className="h-5 w-5 text-muted-foreground" />
                                        <a href="#" className="text-blue-600 hover:underline">
                                            rahulpambhar@yahoo.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                                        <a href="#" className="text-blue-600 hover:underline">
                                            +91 8000 555 268
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                                        <a href="#" className="text-blue-600 hover:underline">
                                            +91 8469 533 472
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                                <p>Monday - Saturday: 9am - 5pm (IST)</p>
                                <p>Sunday         : Closed</p>
                            </div>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Get in Touch</CardTitle>
                            <CardDescription>
                                Have a question or need assistance? Fill out the form below and we'll get back to you as soon as
                                possible.
                            </CardDescription>
                        </CardHeader>

                        <Formik
                            initialValues={{ name: '', email: '', message: '' }}
                            validationSchema={getInTouchSchema}
                            onSubmit={async (values, { resetForm }) => {
                                try {
                                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/slug/getInTouch`, values);
                                    if (res?.data?.st) {

                                        successToast(res?.data?.msg);
                                        // resetForm();
                                    } else {
                                        errorToast(res?.data?.msg);
                                    }

                                } catch (error) {
                                    errorToast("Something went wrong!!")
                                }
                            }}
                        >
                            {
                                ({ errors, values, setFieldValue }) =>
                                    <Form>
                                        <CardContent>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Name <span className="text-red-600">*</span></Label>
                                                    <Input id="name" value={values.name} placeholder="Enter your name" onChange={(e: any) => {
                                                        setFieldValue('name', e.target.value)
                                                    }} />
                                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />

                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
                                                    <Input id="email" type="email" value={values.email} placeholder="Enter your email" onChange={(e: any) => {
                                                        setFieldValue('email', e.target.value)
                                                    }} />
                                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message <span className="text-red-600">*</span></Label>
                                                <Textarea id="message" value={values.message} placeholder="Enter your message" className="min-h-[50px]" onChange={(e) => {
                                                    setFieldValue('message', e.target.value)
                                                }} />
                                                <ErrorMessage name="message" component="div" className="text-red-500 text-sm" />

                                            </div>

                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                            <Button type="submit">Submit</Button>
                                        </CardFooter>
                                    </Form>
                            }
                        </Formik>
                    </Card> */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2 mt-5">Terms and Conditions</h2>
                        <div className="grid gap-4 text-muted-foreground">

                            {/* <div>
                                <h3 className="text-lg font-medium mb-1">Store Location</h3>
                                <p>
                                    12 Nilkanth Avenue, sarjan road, abc circle,
                                </p>
                                <p>
                                    sudama chowk, motavarachha
                                </p>
                                <p>
                                    surat, gujarat
                                </p>
                                <p>
                                    INDIA
                                </p>

                            </div> */}
                            <div>
                                <h3 className="text-lg font-medium mb-1">Shipping and Delivery</h3>
                                <p>
                                    We offer free standard shipping on all orders within India in 7 days. Expedited shipping and international delivery options are available for an additional fee.


                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-1">Return and Exchange Policy</h3>
                                <p>
                                    We accept returns and exchanges within 7 days of delivery. Items must be unworn, unwashed, and in their original condition. Please contact our customer support team for more information.


                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto grid gap-12 mt-10">
                    <div>
                        <div className="grid gap-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
                                <Collapsible className="space-y-4">
                                    <div>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                                            <h3 className="text-lg font-medium">What is your return and exchange policy?</h3>
                                            <ChevronDownIcon className="h-5 w-5 transition-transform group-[data-state=open]:rotate-180" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <p className="text-muted-foreground">
                                                We offer a 7-day return and exchange policy for all our products. If you're not satisfied with
                                                your purchase, you can return the item for a full refund or exchange it for a different size or
                                                color. Please contact our customer support team for more information.
                                            </p>
                                        </CollapsibleContent>
                                    </div>
                                    <div>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                                            <h3 className="text-lg font-medium">How much do you charge for shipping?</h3>
                                            <ChevronDownIcon className="h-5 w-5 transition-transform group-[data-state=open]:rotate-180" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <p className="text-muted-foreground">
                                                We offer free standard shipping on all orders within the continental India. For
                                                expedited shipping or international orders, additional charges may apply. Please check our
                                                shipping and delivery page for more details.
                                            </p>
                                        </CollapsibleContent>
                                    </div>
                                    <div>
                                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                                            <h3 className="text-lg font-medium">What materials are your baby clothes made of?</h3>
                                            <ChevronDownIcon className="h-5 w-5 transition-transform group-[data-state=open]:rotate-180" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <p className="text-muted-foreground">
                                                Our baby clothes are made from high-quality, organic cotton that is soft, breathable, and gentle
                                                on your little one's skin. We prioritize using sustainable and eco-friendly materials in all our
                                                products.
                                            </p>
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            </div>


                        </div>
                    </div>
                </div>
            </main>
            <Cart />
        </div>
    )
}


