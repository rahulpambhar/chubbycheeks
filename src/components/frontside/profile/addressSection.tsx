import React from 'react'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const AddressSection = () => {

    const { setFieldValue, values, isSubmitting }: any = useFormikContext();

    return (

        <div className="mt-8">
            <h4 className="font-semibold mb-4 text-xl text-gray-800">Billing Address</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                <div className="mb-4">
                    <Label htmlFor="address">Address <span className="text-red-600">*</span></Label>
                    <Input id="address" value={values.address} placeholder="123 Main St" onChange={(e) => {
                        setFieldValue('address', e.target.value)
                    }} />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="mb-4">
                    <Label htmlFor="city">City <span className="text-red-600">*</span></Label>
                    <Input id="city" value={values.city} placeholder="Bengaluru" onChange={(e) => {
                        setFieldValue('city', e.target.value)
                    }} />
                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="state">State <span className="text-red-600">*</span></Label>
                    <Input id="state" value={values.state} placeholder="Karnataka" onChange={(e) => {
                        setFieldValue('state', e.target.value)
                    }} />
                    <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="mb-4">
                    <Label htmlFor="pincode">Pincode <span className="text-red-600">*</span></Label>
                    <Input id="pincode" value={values.pincode} placeholder="560001" onChange={(e) => {
                        setFieldValue('pincode', e.target.value)
                    }} />
                    <ErrorMessage name="pincode" component="div" className="text-red-500 text-sm" />
                </div>
            </div>

            <div className="mt-4">
                <Label htmlFor="country">Country <span className="text-red-600">*</span></Label>
                <Input readOnly id="country" value={values.country} placeholder="India" onChange={(e) => {
                    setFieldValue('country', e.target.value)
                }} />
                <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mt-6">
                <Button>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </div>

    )
}

export default AddressSection