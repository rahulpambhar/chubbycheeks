"use client"
import { useEffect, useRef, useState } from 'react';
import { isLoginModel, setOpenCart } from '@/app/redux/slices/utilSlice';
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { profileInitials, profileValidate, countryCodes } from "@/app/utils";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { errorToast, successToast } from '@/components/toster';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const PasswordField = ({ field, form, ...props }: any) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Field
                {...field}
                {...props}
                type={showPassword ? 'text' : 'password'}
                className="w-full registration px-2 py-2 border rounded-sm border-gray-300  mt-2"
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

const RegisterComponents = () => {
    const dispatch = useAppDispatch();
    const isLoginModelOpen = useAppSelector((state) => state.utilReducer.isLoginModelOpen);

    return (
        <>
            <div className="flex w-full min-h-[calc(100vh-80px)]">
                <div className="hidden lg:flex w-1/2 bg-[url('/image/chubbycheeks/signup-1.jpg')] bg-cover bg-center object-cover object-center" />
                <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
                    <div className="max-w-[450px] w-full space-y-6 mt-10">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold">Create an account</h1>
                            <p className="text-muted-foreground">
                                Already have an account?{" "}
                                <button onClick={() => dispatch(isLoginModel(!isLoginModelOpen))} className="underline" >
                                    Login
                                </button>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Formik
                                initialValues={profileInitials}
                                validationSchema={profileValidate}
                                onSubmit={async (values: any, { resetForm }) => {
                                    try {

                                        let formData = new FormData();
                                        formData.append("name", values.name);
                                        formData.append("email", values.email);
                                        formData.append("gender", values.gender);
                                        formData.append("profile_pic", values.profile_pic);

                                        formData.append("country_code", values.country_code);
                                        formData.append("mobile", values.mobile);

                                        formData.append("address", values.address);
                                        formData.append("city", values.city);
                                        formData.append("state", values.state);
                                        formData.append("country", values.country);
                                        formData.append("pincode", values.pincode);


                                        formData.append("password", values.password);
                                        formData.append("type", "add");
                                        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/slug/signup`, formData);
                                        if (res?.data?.st) {

                                            successToast(res?.data?.msg);
                                            resetForm();
                                        } else {

                                            errorToast(res?.data?.msg);
                                        }

                                    } catch (e) {
                                        errorToast("Something went wrong");
                                    }
                                }}
                            >
                                {({ errors, values, setFieldValue, isSubmitting }: any) => (
                                    <Form >
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" value={values.name} onChange={(e) => setFieldValue("name", e.target.value)} />
                                            <ErrorMessage name="name" component="div" className="text-red-500 text-tiny" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" value={values.email} placeholder="m@example.com" onChange={(e) => setFieldValue("email", e.target.value)} />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-tiny" />
                                        </div>

                                        <div className="space-y-2  mt-2 ">
                                            <Label htmlFor="gender">Gender</Label>
                                            <RadioGroup className="flex items-center gap-2" >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem id="gender-male" value="male" onClick={(e) => setFieldValue("gender", "male")} />
                                                    <Label htmlFor="gender-male" className="cursor-pointer">
                                                        Male
                                                    </Label>

                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem id="gender-female" value="female" onClick={(e) => setFieldValue("gender", "female")} />
                                                    <Label htmlFor="gender-female" className="cursor-pointer">
                                                        Female
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem id="gender-other" value="other" onClick={(e) => setFieldValue("gender", "other")} />
                                                    <Label htmlFor="gender-other" className="cursor-pointer">
                                                        Other
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                            <ErrorMessage name="gender" component="div" className="text-red-500 text-tiny" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="profile_pic">Profile Picture</Label>
                                            <Input id="profile_pic" type="file" onChange={(e) => {
                                                if (e.target.files) {
                                                    setFieldValue("profile_pic", e.target.files[0]);
                                                }
                                            }}
                                            />
                                            <ErrorMessage name="profile_pic" component="div" className="text-red-500 text-tiny" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="country_code">Country Code</Label>
                                                <Input id="country_code" type="tel" readOnly value="+91" placeholder="+91" />
                                                <ErrorMessage name="country_code" component="div" className="text-red-500 text-tiny" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="mobile">Mobile</Label>
                                                <Input id="mobile" type="tel" value={values.mobile} onChange={(e) => setFieldValue("mobile", e.target.value)} placeholder="800-055-5268" />
                                                <ErrorMessage name="mobile" component="div" className="text-red-500 text-tiny" />
                                            </div>
                                        </div>


                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Textarea id="address" value={values.address} onChange={(e) => setFieldValue("address", e.target.value)} placeholder="123 Main St" />
                                            <ErrorMessage name="address" component="div" className="text-red-500 text-tiny" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input id="city" value={values.city} onChange={(e) => setFieldValue("city", e.target.value)} placeholder="Surat" />
                                                <ErrorMessage name="city" component="div" className="text-red-500 text-tiny" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">State</Label>
                                                <Input id="state" value={values.state} onChange={(e) => setFieldValue("state", e.target.value)} placeholder="Gujarat" />
                                                <ErrorMessage name="state" component="div" className="text-red-500 text-tiny" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="country">Country</Label>
                                                <Input readOnly name="country" id="country" value={values.country} onChange={(e) => setFieldValue("country", e.target.value)} placeholder="United States" />
                                                <ErrorMessage name="country" component="div" className="text-red-500 text-tiny" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pincode">Pincode</Label>
                                                <Input id="pincode" value={values.pincode} onChange={(e) => setFieldValue("pincode", e.target.value)} placeholder="394101" />
                                                <ErrorMessage name="pincode" component="div" className="text-red-500 text-tiny" />
                                            </div>
                                        </div>

                                        <div className="space-y-0">
                                            <Label htmlFor="password">Password</Label>
                                            <Field id="password" type="password" name="password" component={PasswordField} className="w-full  border rounded" />
                                            <ErrorMessage name="password" component="div" className="text-red-500 text-tiny" />
                                        </div>
                                        <div className="space-y-0">
                                            <Label htmlFor="confirm_password">Confirm Password</Label>
                                            <Field id="confirm_password" type="password" name="confirm_password" component={PasswordField} className="w-full  border rounded" />
                                            <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-tiny" />
                                        </div>
                                        <Button disabled={isSubmitting} type="submit" className="w-full mt-10">
                                            Sign up
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterComponents;