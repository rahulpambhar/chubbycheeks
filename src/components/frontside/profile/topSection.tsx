import { ErrorMessage, Field, useFormikContext } from 'formik'
import React, { useEffect } from 'react'
import { profileInitials, profileValidate, countryCodes, profileUpdateInitials } from "@/app/utils";
import { useAppSelector } from '@/app/redux/hooks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const TopSection = () => {

    const { setFieldValue, errors, values }: any = useFormikContext();
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
                <Label htmlFor="name">Name <span className="text-red-600">*</span></Label>
                <Input id="name" value={values.name} placeholder="Enter your name" onChange={(e) => {
                    setFieldValue('name', e.target.value)
                }} />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
                <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
                <Input id="email" value={values.email} placeholder="john@example.com" onChange={(e) => {
                    setFieldValue('email', e.target.value)
                }} />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
        </div>
    )
}

export default TopSection