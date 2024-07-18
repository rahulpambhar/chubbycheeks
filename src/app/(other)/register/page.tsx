"use client"
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
// import LoaderComponents from "@/components/Loader";
import { useRouter } from "next/navigation";
import { isLoginModel, setOpenCart } from '@/app/redux/slices/utilSlice';
import { apiUrl } from "../../../../env"
import * as Yup from 'yup'
import twilio from 'twilio';
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { profileInitials, profileValidate, countryCodes } from "@/app/utils";
import Loader from "../../../components/loader/loading";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { errorToast, successToast } from '@/components/toster';


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

const RegisterComponents = () => {
    const dispatch = useAppDispatch();


    const [loader, setLoader] = useState(false);

    const isLoginModelOpen = useAppSelector((state) => state.utilReducer.isLoginModelOpen);


    const FileInput = ({ field, form }: any) => {
        const handleChange = (event: any) => {
            const file = event.currentTarget.files[0];
            form.setFieldValue(field.name, file);
        };

        return <input type="file" onChange={handleChange} />;
    };


    return (
        <>
            {/* {
                loader && <LoaderComponents />
            } */}
            <div className="max-w-screen-xl mx-auto mt-7 border-black rounded-lg border-t-2 border-b-2 hover:shadow-2xl  border-l-2 border-r-2 ">
                <div className="sm:w-10/12 md:w-8/12 lg:w-6/12  xl:w-5/12 mx-auto shadow-lg p-5 hover:shadow-2xl rounded-lg ">
                    <Formik
                        initialValues={profileInitials}
                        validationSchema={profileValidate}
                        onSubmit={async (values: any, { resetForm }) => {
                            try {
                                setLoader(true);

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
                                const res = await axios.post(`${apiUrl}/slug/signup`, formData);
                                if (res?.data?.st) {

                                    successToast(res?.data?.msg);
                                    resetForm();
                                } else {

                                    errorToast(res?.data?.msg);
                                }
                                setLoader(false);

                            } catch (e) {
                                errorToast("Something went wrong");
                                setLoader(false);
                            }
                        }}
                    >
                        {({ errors, setFieldValue }: any) => (
                            <Form className="flex flex-col gap-3 bg-gray-250  p-4 rounded-lg hover:shadow-2xl shadow-md">


                                <div className="mb-4">
                                    <label htmlFor="name" className="bloc font-semibold">
                                        User Name<span className='text-red-600'>*</span>
                                    </label>
                                    <Field type="text" name="name" className="w-full px-2 registration border-black py-1 bg-gray-300 border  rounded mt-2" />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block font-semibold">Email ID<span className='text-red-600'>*</span></label>
                                    <Field type="text" name="email" className={`w-full px-2 registration py-1 bg-gray-300 border rounded mt-2 ${errors.email && 'border-red-500'}`} id="email" />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="gender" className="block font-semibold">Gender<span className='text-red-600'>*</span></label>
                                    <Field as="select" name="gender" className="w-full registration px-2 border-black py-1 bg-gray-300 border rounded mt-2">
                                        <option value="" disabled hidden>Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </Field>
                                    <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="country_code" className="block font-semibold">Country Code<span className='text-red-600'>*</span></label>
                                    <Field as="select" name="country_code" onChange={(e: any) => {
                                        const country = countryCodes.find((country: any) => country.value === e.target.value);
                                        country && setFieldValue("country", country.label);
                                        setFieldValue("country_code", e.target.value);
                                    }} className="w-full px-2 border-black py-1 bg-gray-300 border rounded mt-2 appearance-none">
                                        <option value="" disabled hidden>Select Country Code</option>
                                        {countryCodes.map(country => (
                                            <option key={country.value} value={country.value}>{country.label} ({country.value})</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="country_code" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="address" className="bloc font-semibold">
                                        Mobile<span className='text-red-600'>*</span>
                                    </label>
                                    <Field type="text" name="mobile" className="w-full registration px-2 border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="address" className="bloc font-semibold">
                                        Address<span className='text-red-600'>*</span>
                                    </label>
                                    <Field type="text" name="address" className="w-full  px-2  registration border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="city" className="bloc font-semibold">
                                        City<span className='text-red-600'>*</span>
                                    </label>
                                    <Field type="text" name="city" className="w-full  px-2  registration border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="state" className="bloc font-semibold">
                                        State<span className='text-red-600'>*</span>
                                    </label>
                                    <Field type="text" name="state" className="w-full  px-2  registration border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="country" className="bloc font-semibold">
                                        Country<span className='text-red-600'>*</span>
                                    </label>
                                    <Field type="text" name="country" readOnly className="w-full  px-2  registration border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="pincode" className="bloc font-semibold">
                                        Pincode<span className='text-red-600'>*</span>
                                    </label>
                                    <Field type="text" name="pincode" className="w-full  px-2  registration border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="pincode" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="profile_pic" className="bloc font-semibold">
                                        Upload Profile Picture <span>(Optional)</span>
                                    </label>
                                    <Field name="profile_pic" type="file" component={FileInput} />
                                    <ErrorMessage name="profile_pic" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="bloc font-semibold">
                                        Passwrod<span className='text-red-600'>*</span>
                                    </label>
                                    <Field name="password" component={PasswordField} className="w-full registration px-2 py-1 border px-2 border-black bg-gray-300 rounded mt-2" />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="Confirm_password" className="bloc font-semibold">
                                        Confirm Passwrod
                                    </label>
                                    <Field name="Confirm_password" component={PasswordField} className="w-full registration px-2 py-1 border px-2 border-black bg-gray-300 rounded mt-2" />
                                    <ErrorMessage name="Confirm_password" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="">
                                    <button className="bg-black text-white font-bold cursor-pointer px-6 py-4 hover:shadow-2xl w-full text-2xl" type="submit">
                                        {loader ? <Loader minHeight={'50px'} /> : "Register"}
                                    </button>
                                </div>
                            </Form>
                        )}

                    </Formik>

                    <div className="text-center mt-3">
                        <button onClick={() => dispatch(isLoginModel(!isLoginModelOpen))} className="fontFamily">
                            Already have an account? <span className="underline">Login</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterComponents;