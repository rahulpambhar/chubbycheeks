import { ErrorMessage, Field, useFormikContext } from 'formik'
import React, { useEffect } from 'react'
import { profileInitials, profileValidate, countryCodes, profileUpdateInitials } from "@/app/utils";
import { useAppSelector } from '@/app/redux/hooks';

const TopSection = () => {

    const { setFieldValue,errors }: any = useFormikContext();
    const userProfile = useAppSelector((state) => state?.userReducer?.user);

    useEffect(() => {
        if (userProfile) {
          for (const [key, value] of Object.entries(profileInitials)) {
            if (userProfile[key] !== undefined) {
              setFieldValue(key, userProfile[key]);
            }
          }
        }
      }, [userProfile, setFieldValue]);
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="mb-4">
                <label htmlFor="name" className="block font-medium text-gray-700">
                    Name <span className='text-red-600'>*</span>
                </label>
                <Field
                    type="text"
                    name="name"
                    className="form-input mt-1 block w-full"
                    placeholder="John Doe"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block font-medium text-gray-700">
                    Email Address<span className='text-red-600'>*</span>
                </label>
                <Field
                    type="email"
                    name="email"
                    className="form-input mt-1 block w-full"
                    placeholder="john@example.com"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
        </div>
    )
}

export default TopSection