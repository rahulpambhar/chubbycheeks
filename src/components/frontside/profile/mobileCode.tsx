import React from 'react'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import { countryCodes, } from "@/app/utils";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"



const MobileCode = () => {

    const { setFieldValue, values }: any = useFormikContext();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="mb-4">
                <Label htmlFor="country_code">Select Country Code <span className="text-red-600">*</span></Label>
                <Select value={values.country_code}
                    onValueChange={(e: any) => {
                        const country = countryCodes.find((country: any) => country.value === e);
                        country && setFieldValue("country", country.label);
                        setFieldValue("country_code", e);
                    }} >
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="India (+91)" />
                    </SelectTrigger>
                    <SelectContent  >
                        <SelectGroup>
                            {countryCodes.map(country => (
                                <SelectItem key={country.value} value={country.value}>{country.label} ({country.value})</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <ErrorMessage name="country_code" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
                <Label htmlFor="mobile">Mobile <span className="text-red-600">*</span></Label>
                <Input id="mobile" value={values.mobile} placeholder="8000555268" onChange={(e) => {
                    setFieldValue('mobile', e.target.value)
                }} />
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
                <Label htmlFor="mobile">Gender <span className="text-red-600">*</span></Label>
                <Select value={values?.gender} onValueChange={(e: any) => {
                    setFieldValue("gender", e);
                }} >
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="India (+91)" />
                    </SelectTrigger>
                    <SelectContent  >
                        <SelectGroup>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />
            </div>
        </div>
    )
}

export default MobileCode