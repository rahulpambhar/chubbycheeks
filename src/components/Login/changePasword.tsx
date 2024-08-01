import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import OTPInputGroup from './changePasswordOtp/page';
import axios from 'axios';
import { errorToast, successToast } from '@/components/toster';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAppSelector, useAppDispatch } from '../../app/redux/hooks';
import { isLoginModel } from '../../app/redux/slices/utilSlice';

const passwordRules = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useAppDispatch();
    let [OTP, setOTP] = useState(false)
    let [timer, setTimer] = useState(false)
    const [timeInSeconds, setTimeInSeconds] = useState(60);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [isVerifyOTP, setVerifyOTP] = useState({ st: false, msg: "" });
    const [email, setEmail] = useState('');

    const handleChange = (e: any) => {
        setEmail(e.target.value);
    };

    const [inputValues, setInputValues] = useState({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        input6: '',
    });
    const conevrtInputvalues = parseInt(Object.values(inputValues).filter(val => val !== '').join(''))


    const destroyOtp = async () => {
        try {
            const email = localStorage.getItem('email');
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/otp/forgotPassOtp`, { email });
            if (res?.data?.st) {
                localStorage.removeItem('email');
            }

        } catch (error) {
            console.log('error::: ', error);
        }
    }

    const generateOTP = async () => {
        try {

            if (!email.trim()) {
                errorToast('Email is required');
                return;
            } else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
                errorToast('Please enter a valid email address');
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/otp/forgotPassOtp`, { email });
            if (response.data.st) {
                setOTP(true);
                const id = setInterval(() => {

                    setTimeInSeconds(prevTime => {
                        if (prevTime - 1 <= 0) {
                            setVerifyOTP({ st: false, msg: "", })
                            destroyOtp()
                        }
                        return prevTime - 1
                    });

                }, 1000);
                setTimer(true)
                setIntervalId(Number(id));

                setVerifyOTP({ st: false, msg: response.data.msg, })
                localStorage.setItem('email', email);
            } else {
                errorToast(response.data.msg);
            }

        } catch (error) {
            console.log('error::: ', error);
            errorToast("Something went wrong!!")
        }
    }



    useEffect(() => {
        if (timeInSeconds <= 0) {
            clearInterval(intervalId as number);
            setTimeInSeconds(60)
            setTimer(false)
            // destroyOtp()
            setOTP(false)

        } else if (!OTP) {
            clearInterval(intervalId as number);
            setTimeInSeconds(60)
            setTimer(false)
            // destroyOtp()
        }
    }, [timeInSeconds]);

    // useEffect(() => {
    //     if (!timer) {
    //         setInputValues({
    //             input1: '',
    //             input2: '',
    //             input3: '',
    //             input4: '',
    //             input5: '',
    //             input6: '',
    //         });
    //     }
    // }, [timer])

    // useEffect(() => {
    //     window.addEventListener('beforeunload', destroyOtp);
    //     return () => {
    //         window.removeEventListener('beforeunload', destroyOtp);
    //     };
    // }, []);

    useEffect(() => {
        window.addEventListener('beforeunload', destroyOtp);
        window.addEventListener('unload', destroyOtp);

        return () => {
            window.removeEventListener('beforeunload', destroyOtp);
            window.removeEventListener('unload', destroyOtp);
        };
    }, []);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <>
            <XIcon onClick={() => {
                dispatch(isLoginModel(false)); destroyOtp()
                setInputValues({ input1: '', input2: '', input3: '', input4: '', input5: '', input6: '', });
            }} className="cursor-pointer absolute top-2 right-2 text-red-800 w-6 h-6" />

            {isVerifyOTP.st === false ?
                <>

                    {
                        !timer ?
                            <div className="text-center">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="ENTER YOUR EMAIL"
                                        value={email}
                                        onChange={handleChange}
                                        className="bg-white font-bold py-2 px-4 border-2  w-[400px] border-black"
                                    />
                                </div>
                                <Button className='mt-2' onClick={() => {
                                    setTimeInSeconds(60);
                                    generateOTP();
                                }} >
                                    Generate OTP To Change Password
                                </Button>
                            </div>
                            :
                            <div>
                                <OTPInputGroup timer={timer} setOTP={setOTP} setVerifyOTP={setVerifyOTP} isVerifyOTP={isVerifyOTP} setTimer={setTimer} setInputValues={setInputValues} inputValues={inputValues} intervalId={intervalId} setTimeInSeconds={setTimeInSeconds} email={email} />
                                <> <span className='' >Time Left to Use OTP : {timerDisplay}</span></>
                            </div>
                    }
                </>

                : <Formik
                    initialValues={{ password: '', Confirm_password: '', }}
                    validationSchema={
                        Yup.object().shape({
                            password: Yup.string()
                                .matches(passwordRules, { message: 'Password must be 8-20 characters long and include at least one lowercase letter, one digit, and one special character.' })
                                .required('Password is required'),
                            Confirm_password: Yup.string()
                                .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
                                .required('Confirm Password is required'),
                        })
                    }
                    onSubmit={async (values: any, { resetForm }) => {
                        try {
                            let formData = new FormData();
                            formData.append("password", values.password);
                            formData.append("type", "updatePassword");
                            formData.append("email", email)
                            formData.append("otp", conevrtInputvalues.toString())
                            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/slug/signup`, formData);
                            if (res?.data?.st) {
                                successToast(res?.data?.msg);
                                resetForm();
                                setTimer(false)
                                setVerifyOTP({ st: false, msg: "" })
                            } else {
                                errorToast(res?.data?.msg);
                            }

                        } catch (error) {
                            console.log('error::: ', error);
                            errorToast("Something went wrong!!")
                        }
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }: any) => (
                        <>
                            <Form>
                                <div className="mb-4 flex">
                                    <div className="grid w-full max-w-sm gap-1.5">
                                        <Label htmlFor="password">Passwrod <span className="text-red-600">*</span></Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                className="pr-10"
                                                value={values.password}
                                                onChange={(e: any) => {
                                                    setFieldValue('password', e.target.value)
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                type='button'
                                                className="absolute top-1/2 right-2 -translate-y-1/2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                                <span className="sr-only">Toggle password visibility</span>
                                            </Button>
                                        </div>
                                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    <div className="grid ml-10 w-full max-w-sm gap-1.5">
                                        <Label htmlFor="Confirm_password">  Confirm Passwrod <span className="text-red-600">*</span></Label>
                                        <div className="relative">
                                            <Input
                                                id="Confirm_password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter confirm password"
                                                className="pr-10"
                                                value={values.Confirm_password}
                                                onChange={(e: any) => {
                                                    setFieldValue('Confirm_password', e.target.value)
                                                }}
                                            />
                                            <Button
                                                type='button'
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-1/2 right-2 -translate-y-1/2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                                <span className="sr-only">Toggle password visibility</span>
                                            </Button>
                                        </div>
                                        <ErrorMessage name="Confirm_password" component="div" className="text-red-500 text-sm" />
                                    </div>
                                </div>
                                <div className="">
                                    <Button className="" type="submit">
                                        {isSubmitting ? "Loading" : "Update Password"}
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}

                </Formik>}
        </ >
    )
}

export default ChangePassword


function EyeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}


function XIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}