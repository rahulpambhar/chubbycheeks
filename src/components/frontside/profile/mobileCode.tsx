import React from 'react'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import { countryCodes, } from "@/app/utils";
const MobileCode = () => {

    const { setFieldValue, errors }: any = useFormikContext();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="mb-4">
                <label htmlFor="country_code" className="block font-medium text-gray-700">
                    Select Country Code<span className='text-red-600'>*</span>
                </label>
                <Field as="select" name="country_code" onChange={(e: any) => {
                    const country = countryCodes.find((country: any) => country.value === e.target.value);
                    country && setFieldValue("country", country.label);
                    setFieldValue("country_code", e.target.value);
                }} className="form-input mt-1 block w-full">
                    <option value="" disabled hidden>Select Country Code</option>
                    {countryCodes.map(country => (
                        <option key={country.value} value={country.value}>{country.label} ({country.value})</option>
                    ))}
                </Field>
                <ErrorMessage name="country_code" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
                <label htmlFor="mobile" className="block font-medium text-gray-700">
                    Mobile<span className='text-red-600'>*</span>
                </label>
                <Field
                    type="number"
                    name="mobile"
                    className="form-input mt-1 block w-full"
                    placeholder="1234567890"
                />
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
                <label htmlFor="gender" className="block font-medium text-gray-700">
                    Gender<span className='text-red-600'>*</span>
                </label>
                <Field as="select" name="gender" className="form-input mt-1 block w-full" >
                    <option value="" disabled hidden>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </Field>

                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
            </div>
        </div>
    )
}

export default MobileCode