import React from 'react'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import { countryCodes, } from "@/app/utils";
const AddressSection = () => {

    const { setFieldValue, errors, isSubmitting }: any = useFormikContext();

    return (

        <div className="mt-8">
            <h4 className="font-semibold mb-4 text-xl text-gray-800">Billing Address</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                <div className="mb-4">
                    <label htmlFor="street" className="block font-medium text-gray-700">
                        Address<span className='text-red-600'>*</span>
                    </label>
                    <Field
                        type="text"
                        name="address"
                        className="form-input mt-1 block w-full"
                        placeholder="123 Main St"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="mb-4">
                    <label htmlFor="city" className="block font-medium text-gray-700">
                        City<span className='text-red-600'>*</span>
                    </label>
                    <Field
                        type="text"
                        name="city"
                        className="form-input mt-1 block w-full"
                        placeholder="New York"
                    />
                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                    <label htmlFor="state" className="block font-medium text-gray-700">
                        State<span className='text-red-600'>*</span>
                    </label>
                    <Field
                        type="text"
                        name="state"
                        className="form-input mt-1 block w-full"
                        placeholder="NY"
                    />
                    <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                    <label htmlFor="zip" className="block font-medium text-gray-700">
                        Zip Code<span className='text-red-600'>*</span>
                    </label>
                    <Field
                        type="text"
                        name="pincode"
                        className="form-input mt-1 block w-full"
                        placeholder="10001"
                    />
                    <ErrorMessage name="pincode" component="div" className="text-red-500 text-sm" />
                </div>
            </div>

            <div className="mt-4">
                <label htmlFor="country" className="block font-medium text-gray-700">
                    Country<span className='text-red-600'>*</span>
                </label>
                <Field type="text" name="country" readOnly className="w-full  px-2  registration border-black py-1 bg-gray-300 border rounded mt-2" />

                <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mt-6">
                <button
                    type="submit"
                    className="btn btn-primary bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>

    )
}

export default AddressSection