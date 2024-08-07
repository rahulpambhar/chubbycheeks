"use client"
import LoaderComponents from "@/components/loader/loading";
import { useAppSelector, useAppDispatch } from '../../app/redux/hooks';
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter, usePathname, redirect } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { isLoginModel } from '../../app/redux/slices/utilSlice';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { errorToast, successToast } from "../toster";
import { loginInitials, loginValidationSchema, countryCodes } from "@/app/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import ChangePassword from './changePasword';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"



const PasswordField = ({ field, form, ...props }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <Field
                {...field}
                {...props}
                type={showPassword ? 'text' : 'password'}
                className="w-full registration px-2 py-1 border border-black bg-gray-300 rounded mt-2"
            />
            <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
        </div>
    );
};




const LoginComponents = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [forgotPassword, setForgotPassword] = useState(false);
    const searchParams = useSearchParams();
    const handleClick = () => {
        dispatch(isLoginModel(false))
        router.push('/register');
    };

    return (
        <>
            {!forgotPassword ?
                <Dialog defaultOpen onOpenChange={(open) => !open && dispatch(isLoginModel(false))} >
                    <DialogContent className="sm:max-w-[425px]">
                        <Formik
                            initialValues={loginInitials}
                            validationSchema={loginValidationSchema}
                            onSubmit={async (values: any, { resetForm }) => {

                                try {
                                    let { mobile, email, password, isMobile } = values;

                                    isMobile ? email = "" : mobile = ""

                                    const res = await signIn("credentials", { mobile, email, password, redirect: false, });

                                    if (res?.ok) {
                                        successToast("login success...");
                                        dispatch(isLoginModel(false))
                                        resetForm()
                                        if (pathname === "/register") {
                                            router.push('/')
                                        }
                                    } else {
                                        errorToast(res?.error || "Something went wrong try. again !!");
                                    }
                                } catch (error) {
                                    errorToast("Something Went wrong!!");
                                }
                            }}
                        >
                            {({ values, errors, setFieldValue, isSubmitting }) => (
                                <Form className="flex flex-col gap-4">
                                    <DialogHeader>
                                        <DialogTitle>Log In</DialogTitle>
                                        <DialogDescription>Enter your credentials to access your account.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Tabs defaultValue="email">
                                            <TabsList>
                                                <TabsTrigger onClick={() => { setFieldValue("isMobile", false); }} value="email">Email </TabsTrigger>
                                                <TabsTrigger onClick={() => { setFieldValue("isMobile", true); }} value="mobile">Mobile</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="email">
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Field type="email" className="w-full px-4 py-2 border rounded mt-2 focus:outline-none focus:border-blue-500" id="email" name="email" placeholder="pambharrahul@gmail.com" />
                                                    <ErrorMessage name="email" component="div" className="text-red-500 text-tiny" />
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="mobile">
                                                <div className="space-y-2">
                                                    <Label htmlFor="mobile">Mobile</Label>
                                                    <Field type="text" className="w-full px-4 py-2 border rounded mt-2 focus:outline-none focus:border-blue-500" id="mobile" name="mobile" placeholder="8000555268" />
                                                    <ErrorMessage name="mobile" component="div" className="text-red-500 text-tiny" />
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Password</Label>
                                                <button onClick={() => setForgotPassword(true)} className="text-sm underline" >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                            <Field type="password" className="w-full px-4 py-2 border rounded mt-2 focus:outline-none focus:border-blue-500" id="password" name="password" component={PasswordField} />
                                            <ErrorMessage name="password" component="div" className="text-red-500 text-tiny" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button disabled={isSubmitting} type="submit" className="w-full">
                                            {isSubmitting ? 'Loading...' : 'Login'}
                                        </Button>
                                    </DialogFooter>
                                </Form>
                            )}
                        </Formik>

                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <button type="button" onClick={handleClick} className="underline" >
                                Sign up
                            </button>
                        </div>

                    </DialogContent>
                </Dialog>
                :
                <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-75">

                    <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg relative">
                        <ChangePassword />
                    </div>
                </div>
            }
        </>
    )
}

export default LoginComponents;
