import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import OTPInputGroup from '@/components/frontside/changePasswordOtp/page';
import axios from 'axios';
import { apiUrl } from '../../../../env';
import { errorToast, successToast } from '@/components/toster';
import * as Yup from 'yup';
const passwordRules = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;


const PasswordField = ({ field, form, ...props }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <Field
                {...field}
                {...props}
                type={showPassword ? 'text' : 'password'}
                className="w-full registration px-2 py-1 border border-black bg-gray-300 rounded mt-2"
            />
            <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
        </div>
    );
};
const ChangePassword = () => {

    let [OTP, setOTP] = useState(false)
    let [timer, setTimer] = useState(false)
    const [timeInSeconds, setTimeInSeconds] = useState(60);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [isVerifyOTP, setVerifyOTP] = useState({ st: false, msg: "" });

    const [inputValues, setInputValues] = useState({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        input6: '',
    });


    const generateOTP = async () => {
        try {
            const response = await axios.post(`${apiUrl}/sendOTP/otp`);
            if (response.data.st) {
                setOTP(true);
                const id = setInterval(() => {

                    setTimeInSeconds(prevTime => {
                        if (prevTime - 1 <= 0) {
                            setVerifyOTP({ st: false, msg: "", })
                        }
                        return prevTime - 1
                    });
                    
                }, 1000);
                setTimer(true)
                setIntervalId(Number(id));

                setVerifyOTP({ st: false, msg: response.data.msg, })
            } else {
                errorToast(response.data.msg);
            }

        } catch (error) {
            console.log('error::: ', error);
            errorToast("Something went wrong!!")
        }
    }

    const destroyOtp = async () => {
        try {

            const res = await axios.put(`${apiUrl}/destroyOtp/otp`);

        } catch (error) {
            console.log('error::: ', error);
        }
    }

    useEffect(() => {
        if (timeInSeconds <= 0) {
            clearInterval(intervalId as number);
            setTimeInSeconds(60)
            setTimer(false)
            destroyOtp()
            setOTP(false)

        } else if (!OTP) {
            clearInterval(intervalId as number);
            setTimeInSeconds(60)
            setTimer(false)
            destroyOtp()
        }
    }, [timeInSeconds]);

    useEffect(() => {
        if (!timer) {
            setInputValues({
                input1: '',
                input2: '',
                input3: '',
                input4: '',
                input5: '',
                input6: '',
            });
        }
    }, [timer])

    useEffect(() => {
        window.addEventListener('beforeunload', destroyOtp);
        return () => {
            window.removeEventListener('beforeunload', destroyOtp);
        };
    }, []);

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <>
            {isVerifyOTP.st === false ?
                <>

                    <OTPInputGroup timer={timer} setOTP={setOTP} setVerifyOTP={setVerifyOTP} isVerifyOTP={isVerifyOTP} setTimer={setTimer} setInputValues={setInputValues} inputValues={inputValues} intervalId={intervalId} setTimeInSeconds={setTimeInSeconds} />
                    {
                        !timer ?
                            <div className="text-center">
                                <button className='bg-green-500 text-white font-bold py-2 px-4 rounded' onClick={() => {
                                    setTimeInSeconds(60);
                                    generateOTP();
                                }} >
                                    Generate OTP To Change Password
                                </button>
                            </div> :
                            <> <span className='' >OTP Expires In : {timerDisplay}</span></>
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
                            const res = await axios.post(`${apiUrl}/slug/signup`, formData);
                            if (res?.data?.st) {
                                successToast(res?.data?.msg);
                                resetForm();
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
                    {({ errors, setFieldValue, isSubmitting }: any) => (
                        <>
                            <Form>
                                <div className="mb-4">
                                    <label htmlFor="password" className="bloc font-semibold">
                                        Passwrod<span className='text-red-600'>*</span>
                                    </label>
                                    <Field name="password" component={PasswordField} className="w-full registration px-2 py-1 border px-2 border-black bg-gray-300 rounded mt-2" />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="Confirm_password" className="bloc font-semibold">
                                        Confirm Passwrod
                                    </label>
                                    <Field name="Confirm_password" component={PasswordField} className="w-full registration px-2 py-1 border px-2 border-black bg-gray-300 rounded mt-2" />
                                    <ErrorMessage name="Confirm_password" component="div" className="text-red-500 text-sm" />
                                </div>

                                <div className="">
                                    <button className="bg-black text-white font-bold cursor-pointer px-6 py-4 hover:shadow-2xl w-full text-2xl" type="submit">
                                        {isSubmitting ? "Loading" : "Update Password"}
                                    </button>
                                </div>

                            </Form>

                        </>
                    )}

                </Formik>}
        </ >
    )
}

export default ChangePassword
