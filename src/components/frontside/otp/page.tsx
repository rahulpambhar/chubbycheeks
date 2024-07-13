import React, { useEffect, useState } from "react";
import Styles from './output.module.css';
import { useAppSelector, useAppDispatch } from '../../../app/redux/hooks';
import { createTempOrderFunc, createOrderFunc, getOrdersFunc } from '../../../app/redux/slices/orderSlices';
import { errorToast, successToast } from '@/components/toster';
import axios from "axios";
import { apiUrl } from "../../../../env";

const OTPInputGroup = ({ setInputValues, inputValues, orderID, setOTP, timer, setMsg, Msg }:any) => {


    const dispatch = useAppDispatch();

    const handleInputChange = (inputId:any, value:any) => {
        timer && setInputValues((prevInputValues:any) => ({
            ...prevInputValues,
            [inputId]: value,
        }));
        !timer && setMsg("Generate new OTP!!")
    };

    const handleSubmit = async () => {
        const typedOTP = parseInt(Object.values(inputValues).filter(val => val !== '').join(''));
        try {

            if (!timer || typedOTP.toString().length !== 6) {
                return
            }

            const res = await axios.get(`${apiUrl}/getOTP/otp?typedOTP=${typedOTP}`)
            if (res?.data?.st) {
                setMsg(res.data.msg)
                const tempData = await dispatch(createTempOrderFunc(orderID ? orderID : ""))

                if (tempData?.payload.st) {
                    successToast("Temp order done!")
                    const data: any = await dispatch(createOrderFunc(tempData?.payload.temOrdrId))
                    data?.payload.st ? successToast(data?.payload.msg) : errorToast(data?.payload.msg)

                } else {
                    errorToast(tempData.payload.msg)
                }
                setOTP(false)
            } else {
                setMsg(res.data.msg)
            }
        } catch (error) {
            console.log('error::: ', error);
            errorToast("Something went wrong!!")
        }
    };



    return (
        <>
            <div id='OTPInputGroup' className={Styles.digitGroup} data-autosubmit="true">
                <OTPInput
                    id="input1"
                    value={inputValues.input1}
                    onValueChange={handleInputChange}
                    previousId={null}
                    handleSubmit={handleSubmit}
                    nextId="input2"
                />
                <OTPInput
                    id="input2"
                    value={inputValues.input2}
                    onValueChange={handleInputChange}
                    previousId="input1"
                    handleSubmit={handleSubmit}
                    nextId="input3"
                />
                <OTPInput
                    id="input3"
                    value={inputValues.input3}
                    onValueChange={handleInputChange}
                    previousId="input2"
                    handleSubmit={handleSubmit}
                    nextId="input4"
                />
                {/* Seperator */}
                <span className={Styles.splitter}>&ndash;</span>
                <OTPInput
                    id="input4"
                    value={inputValues.input4}
                    onValueChange={handleInputChange}
                    previousId="input3"
                    handleSubmit={handleSubmit}
                    nextId="input5"
                />
                <OTPInput
                    id="input5"
                    value={inputValues.input5}
                    onValueChange={handleInputChange}
                    previousId="input4"
                    handleSubmit={handleSubmit}
                    nextId="input6"
                />
                <OTPInput
                    id="input6"
                    value={inputValues.input6}
                    onValueChange={handleInputChange}
                    previousId="input5"
                    handleSubmit={handleSubmit}
                />
            </div>
            <div >
                {Msg && Msg === "OTP verified" ? <span className="text-green-600">{Msg}</span> : <span className="text-red-600 text-center">{Msg}</span>}
            </div>
        </>
    );
}

const OTPInput = ({ id, previousId, nextId, value, onValueChange, handleSubmit }:any) => {
    const handleKeyUp = (e:any) => {
        if (e.keyCode === 8 || e.keyCode === 37) {
            const prev :any= document.getElementById(previousId);
            if (prev) {
                prev.select();
            }
        } else if (
            (e.keyCode >= 48 && e.keyCode <= 57) ||
            (e.keyCode >= 65 && e.keyCode <= 90) ||
            (e.keyCode >= 96 && e.keyCode <= 105) ||
            e.keyCode === 39
        ) {
            const next :any= document.getElementById(nextId);
            if (next) {
                next.select();
                const inputGroup = document.getElementById('OTPInputGroup');
                if (inputGroup && inputGroup.dataset['autosubmit']) {
                    handleSubmit();
                }
            } else {
                const inputGroup = document.getElementById('OTPInputGroup');
                if (inputGroup && inputGroup.dataset['autosubmit']) {
                    handleSubmit();
                }
            }
        }
    }
    return (
        <input
            id={id}
            name={id}
            type="text"
            className={Styles.DigitInput}
            value={value}
            maxLength={1}
            onChange={(e) => onValueChange(id, e.target.value)}
            onKeyUp={handleKeyUp}
        />
    );
};

export default OTPInputGroup;