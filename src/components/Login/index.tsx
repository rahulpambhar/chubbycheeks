"use client"
import LoaderComponents from "@/components/loader/loading";
import { useAppSelector, useAppDispatch } from '../../app/redux/hooks';
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter, usePathname, redirect } from "next/navigation";
import Image from "next/image";
// import imageLink from '@/public/google-signin-button.png'
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast"
import { isLoginModel } from '../../app/redux/slices/utilSlice';

const LoginComponents = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const [mobile, setMobile] = useState("8000555268")
    const [password, setPassword] = useState("123");
    const [error, setError] = useState("")
    const [loader, setLoader] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const { data: session, } = useSession();

    const loginSubmitForm = async (e:any) => {
        e.preventDefault();
        try {
            setLoader(true)
            const res = await signIn("credentials", {
                mobile,
                password,
                redirect: false,
            });

            if (res?.error) {
                toast.error(res.error);
                setError(res.error)
            } else {
                toast.success('login successful.');
                setError("")
                setPassword("");
                setMobile("");
                dispatch(isLoginModel(false))
                if (pathname ==="/register") {
                    router.push('/')
                }
            }
            setLoader(false)
        } catch (error) {
            console.log(error);
            setLoader(false)
        }
    }


    const handleClick = () => {
        dispatch(isLoginModel(false))
        router.push('/register');
    };

    return (
        <>
            <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-75">
                <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4 text-center">Login</h1>
                    <form className="flex flex-col gap-4" onSubmit={loginSubmitForm}>
                        <div className="mb-4">
                            <label htmlFor="mobile" className="block font-semibold">
                                Mobile No
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded mt-2 focus:outline-none focus:border-blue-500"
                                id="mobile"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block font-semibold">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded mt-2 focus:outline-none focus:border-blue-500"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            disabled={loader}
                            type="submit"
                            className={`bg-blue-500 text-white font-bold cursor-pointer px-6 py-3 rounded-lg w-full text-lg ${loader ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                        >
                            {loader ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    {error && (
                        <div className="bg-red-500 text-white text-sm py-2 rounded mt-4 text-center">
                            {error}
                        </div>
                    )}
                    <div className="text-center font-bold text-lg mt-6">OR</div>

                    <div className="text-center mt-4">
                        <button onClick={handleClick}>Go to Register Page</button>
                    </div>
                    <div className="flex justify-center mt-4 space-x-4">
                        {/* <Image
                            className="cursor-pointer"
                            onClick={() => signIn('google')}
                            src={imageLink}
                            width={150}
                            height={40}
                            alt="Google"
                        /> */}
                    </div>
                    <button onClick={() => {
                        setError("")
                        setPassword("");
                        setMobile("")
                        dispatch(isLoginModel(false))
                    }} className="mt-6 text-sm text-gray-600 underline self-center">Close</button>
                </div>
            </div>
        </>
    )
}

export default LoginComponents;