"use client"
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
// import LoaderComponents from "@/components/Loader";
import { useRouter } from "next/navigation";
import { setOpenCart } from '@/app/redux/slices/utilSlice';
import { apiUrl } from "../../../../env"
import * as Yup from 'yup'
import twilio from 'twilio';
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    userName: Yup.string().required('Required'),
    country_code: Yup.string().required('Required'),
    mobile: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
    password: Yup.string()
        .required('Required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
});

const RegisterComponents = () => {
    const dispatch = useAppDispatch();


    const [loader, setLoader] = useState(false);

    const isLoginModelOpen = useAppSelector((state) => state.utilReducer.isLoginModelOpen);


    const countryCodes = [
        { value: '+1', label: '+1 (United States)' },
        { value: '+44', label: '+44 (United Kingdom)' },
        { value: '+91', label: '+91 (India)' },
    ];

    return (
        <>
            {
                // loader && <LoaderComponents />
            }
            <div className="max-w-screen-xl mx-auto mt-7 border-black rounded-lg border-t-2 border-b-2 hover:shadow-2xl  border-l-2 border-r-2 ">
                <div className="sm:w-10/12 md:w-8/12 lg:w-6/12  xl:w-5/12 mx-auto shadow-lg p-5 hover:shadow-2xl rounded-lg ">
                    <Formik
                        initialValues={{
                            email: '', userName: '', country_code: '', mobile: '', address: '', gender: '', password: ''
                        }}
                        // validationSchema={validationSchema}
                        onSubmit={async (values: any, { setSubmitting }) => {
                            try {
                                setLoader(true);

                                let formData = new FormData();
                                formData.append("name", values.name);
                                formData.append("email", values.email);
                                formData.append("country_code", values.country_code);
                                formData.append("mobile", values.mobile);
                                formData.append("gender", values.gender);
                                formData.append("password", values.password);
                                formData.append("profile_pic", values.profile_pic);
                                formData.append("type", "add");
                                setLoader(false);
                                const res = await axios.post(`http://localhost:3000/api/slug/signup`);
                            } catch (e) {
                                console.log('e::: ', e);
                                setLoader(false);
                            }
                        }}
                    >
                        {({ errors }: any) => (
                            <Form className="flex flex-col gap-3 bg-gray-250  p-4 rounded-lg hover:shadow-2xl shadow-md">

                                <div className="mb-4">
                                    <label htmlFor="email" className="block font-semibold">Email ID</label>
                                    <Field type="text" name="email" className={`w-full px-2 registration py-1 bg-gray-300 border rounded mt-2 ${errors.email && 'border-red-500'}`} id="email" />
                                    <ErrorMessage name="email" component="div" className="bg-red-100 text-red-700 rounded-md p-2 mt-2" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="userName" className="bloc font-semibold">
                                        User Name
                                    </label>
                                    <Field type="text" name="userName" className="w-full px-2 registration border-black py-1 bg-gray-300 border  rounded mt-2" />
                                    <ErrorMessage name="userName" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="country_code" className="block font-semibold">Country Code</label>
                                    <Field as="select" name="country_code" className="w-full px-2 border-black py-1 bg-gray-300 border rounded mt-2 appearance-none">
                                        <option value="" disabled hidden>Select Country Code</option>
                                        {countryCodes.map(country => (
                                            <option key={country.value} value={country.value}>{country.label}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="country_code" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="address" className="bloc font-semibold">
                                        Mobile
                                    </label>
                                    <Field type="text" name="mobile" className="w-full registration px-2 border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="street" className="bloc font-semibold">
                                        Street
                                    </label>
                                    <Field type="text" name="street" className="w-full  px-2  registration border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="street" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="city" className="bloc font-semibold">
                                        City
                                    </label>
                                    <Field type="text" name="city" className="w-full  px-2  registration border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="state" className="bloc font-semibold">
                                        State
                                    </label>
                                    <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="address" className="bloc font-semibold">
                                        Address
                                    </label>
                                    <Field type="text" name="address" className="w-full  px-2  registration border-black py-1 bg-gray-300 border rounded mt-2" />
                                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="gender" className="block font-semibold">Gender</label>
                                    <Field as="select" name="gender" className="w-full registration px-2 border-black py-1 bg-gray-300 border rounded mt-2">
                                        <option value="" disabled hidden>Select Country Code</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </Field>
                                    <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="bloc font-semibold">
                                        Passwrod
                                    </label>
                                    <Field type="password" name="password" className="w-full registration px-2 py-1 border px-2 border-black bg-gray-300 rounded mt-2" />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="">
                                    <button className="bg-black text-white font-bold cursor-pointer px-6 py-4 hover:shadow-2xl w-full text-2xl" type="submit">
                                        {/* {loader ? <Loader type="spinner-default" bgColor="white" color="white" size={50} /> : "Register"} */}
                                    </button>
                                </div>
                            </Form>
                        )}

                    </Formik>

                    <div className="text-center mt-3">
                        {/* <button onClick={() => dispatch(isLoginModel(!isLoginModelOpen))} className="fontFamily">
                            Already have an account? <span className="underline">Login</span>
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterComponents;