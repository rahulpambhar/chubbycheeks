import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { profileInitials, profileValidate, countryCodes } from "@/app/utils";
import { errorToast, successToast } from '@/components/toster';
import axios from 'axios';
import { getUser } from '@/app/redux/slices/userSlice';
import { useSession } from 'next-auth/react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';

const ProfilePic = () => {
    const dispatch = useAppDispatch();
    const { data: session, status }: any = useSession();

    const userProfile = useAppSelector((state) => state?.userReducer?.user);
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const getProfile = async () => await dispatch(getUser(session?.user?.id))

    const updateProfilePic = async () => {

        try {
            if (!file) { errorToast('Please select profile picture'); return; };

            const formData = new FormData();
            formData.append("profile_pic", file);
            formData.append("type", "updateProfilePic");

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/slug/signup`, formData);

            if (res?.data?.st) {
                successToast(res?.data?.msg)
                getProfile();
            } else {
                errorToast(res?.data?.msg)
            }
        } catch (error) {
            errorToast(error)
        }
    }


    const validateFile = (file: File) => {
        const validFormats = ['image/jpeg', "image/jpg", 'image/png', 'image/gif'];
        if (!validFormats?.includes(file.type)) {
            return 'Invalid file format. Only JPEG, JPG, PNG, and GIF are allowed.';
        }
        if (file.size > 15 * 1024 * 1024) { // 15 MB
            return 'File size exceeds 15 MB.';
        }
        return null;
    };

    return (
        <div className="flex items-center shadow-xl space-x-4 mb-6">
            <Image
                src={`/users/${userProfile?.profile_pic}`}
                height={160}
                width={100}
                alt="user image"
                className="h-40 w-40 overflow-hidden rounded-sm  shadow-xl border border-blue-500 object-cover"
            />
            <div className="mb-4">

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="picture">Picture</Label>
                    <Input id="picture" type="file" onChange={(e:any) => {
                        if (e.target.files && e.target.files[0]) {
                            const selectedFile = e.target.files[0];
                            const error = validateFile(selectedFile);
                            if (error) {
                                setFileError(error);
                                setFile(null);
                            } else {
                                setFileError(null);
                                setFile(selectedFile);
                            }
                        }
                    }}
                    />
                    {fileError && <div className="text-red-500 text-sm">{fileError}</div>}
                </div>
            </div>

            <Button onClick={updateProfilePic}>
                Save Changes
            </Button>

        </div>
    )
}

export default ProfilePic