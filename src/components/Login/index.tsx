"use client"
import LoaderComponents from "@/components/loader/loading";
import { useAppSelector, useAppDispatch } from '../../app/redux/hooks';
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter, usePathname, redirect } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast"
import { isLoginModel } from '../../app/redux/slices/utilSlice';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { errorToast, successToast } from "../toster";
import { loginInitials, loginValidationSchema, countryCodes } from "@/app/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

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

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleClick = () => {
        dispatch(isLoginModel(false))
        router.push('/register');
    };

    return (
        <>
            <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-75">
                <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>
                    <Formik
                        initialValues={loginInitials}
                        validationSchema={loginValidationSchema}
                        onSubmit={async (values: any, { resetForm }) => {

                            try {
                                const { mobile, email, password } = values;
                                const res = await signIn("credentials", {
                                    mobile,
                                    email,
                                    password,
                                    redirect: false,
                                });

                                if (res?.error) {
                                    errorToast("Something Went wrong try again !! ");
                                } else {
                                    successToast("login successful.");
                                    dispatch(isLoginModel(false))
                                    resetForm()
                                    if (pathname === "/register") {
                                        router.push('/')
                                    }
                                }
                            } catch (error) {
                                errorToast("Something Went wrong!!");
                            }
                        }}
                    >
                        {({ values, errors, setFieldValue, isSubmitting }) => (

                            <Form className="flex flex-col gap-4" >
                                <div className="mb-4 flex items-center">
                                    <label htmlFor="loginMethod" className="block font-semibold mr-4">
                                        Login using:
                                    </label>
                                    <div>
                                        <div>
                                            <button
                                                type="button"
                                                name="isMobile"
                                                className={`mr-4 px-4 py-2 rounded ${values?.isMobile ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                                                onClick={() => {
                                                    setFieldValue("isMobile", !values?.isMobile);
                                                }}
                                            >
                                                {values?.isMobile ? "Mobile" : "Email"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {values?.isMobile ? (
                                    <div className="mb-4 ">
                                        <label htmlFor="mobile" className="block font-semibold">
                                            Mobile No
                                        </label>
                                        <Field
                                            type="text"
                                            className="w-full px-4 py-2 border rounded mt-2 focus:outline-none focus:border-blue-500"
                                            id="mobile"
                                            name="mobile"
                                        />
                                        <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm" />
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block font-semibold">
                                            Email
                                        </label>
                                        <Field
                                            type="email"
                                            className="w-full px-4 py-2 border rounded mt-2 focus:outline-none focus:border-blue-500"
                                            id="email"
                                            name="email"
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label htmlFor="password" className="block font-semibold">
                                        Password
                                    </label>
                                    <Field
                                        type="password"
                                        className="w-full px-4 py-2 border rounded mt-2 focus:outline-none focus:border-blue-500"
                                        id="password"
                                        name="password"
                                        component={PasswordField}
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    className={`bg-blue-500 text-white font-bold cursor-pointer px-6 py-3 rounded-lg w-full text-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                                >
                                    {isSubmitting ? 'Loading' : 'Login'}
                                </button>
                            </Form>


                        )}
                    </Formik>

                    <div className="text-center font-bold text-lg mt-6">OR</div>

                    <div className="text-center mt-4">
                        <button onClick={handleClick}>Go to Register Page</button>
                    </div>
                    <div className="flex justify-center mt-4 space-x-4">
                        {/* <Image
                            className="cursor-pointer"
                            onClick={() => signIn('google')}
                            src={imageLink}
                            width={150}
                            height={40}
                            alt="Google"
                        /> */}
                    </div>
                    <button onClick={() => {
                        dispatch(isLoginModel(false))
                    }} className="mt-6 text-sm text-gray-600 underline self-center">Close</button>
                </div>
            </div>
        </>
    )
}

export default LoginComponents;