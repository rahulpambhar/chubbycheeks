import * as Yup from 'yup';
import { z } from "zod";

export const profileInitials = {
    name: '',
    email: '',
    gender: '',
    profile_pic: null,

    country_code: '+91',
    mobile: '',

    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',

    password: '',
    confirm_password: '',
}

const passwordRules = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
const FILE_SIZE = 15 * 1024 * 1024; // 15 MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
export const profileValidate = Yup.object().shape({
    name: Yup.string().required('Name is required').max(20, 'Name must be at most 20 characters'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    gender: Yup.string().required('Gender is required').oneOf(['male', 'female', 'other'], 'Invalid gender'),

    profile_pic: Yup.mixed().required('A file is required').test('fileSize', 'File too large', value => value && value.size <= FILE_SIZE).test('fileFormat', 'Unsupported Format', value => value && SUPPORTED_FORMATS?.includes(value.type)),

    country_code: Yup.string().required('Country code is required'),
    mobile: Yup.string()
        .matches(/^[0-9]+$/, 'Mobile number must be numbers only')
        .min(10, 'Mobile number must be at least 10 digits')
        .max(15, 'Mobile number must be at most 15 digits')
        .required('Mobile number is required'),

    address: Yup.string()
        .min(10, 'Address must be at least 10 character')
        .max(100, 'Address must be at most 100 characters')
        .required('Address is required'),
    city: Yup.string().required('City is required').max(15, "city must be at most 100 characters"),
    state: Yup.string().required('State is required').max(15, 'state must be at most 100 characters'),
    pincode: Yup.string().required('Pin code is required').max(6, 'Pin code must be at most 6 characters'),

    password: Yup.string()
        .matches(passwordRules, { message: 'Password must be 8-20 characters long and include at least one lowercase letter, one digit, and one special character.' })
        .required('Password is required'),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password is required'),
});


export const profileUpdateInitials = {
    name: '',
    email: '',
    gender: '',

    country_code: '',
    mobile: '',

    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
}

export const profileUpdateValidate = Yup.object().shape({
    name: Yup.string().required('Name is required').max(20, 'Name must be at most 20 characters'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    gender: Yup.string().required('Gender is required').oneOf(['male', 'female', 'other'], 'Invalid gender'),

    country_code: Yup.string().required('Country code is required'),
    mobile: Yup.string()
        .matches(/^[0-9]+$/, 'Mobile number must be numbers only')
        .min(10, 'Mobile number must be at least 10 digits')
        .max(15, 'Mobile number must be at most 15 digits')
        .required('Mobile number is required'),

    address: Yup.string()
        .min(10, 'Address must be at least 10 character')
        .max(100, 'Address must be at most 100 characters')
        .required('Address is required'),
    city: Yup.string().required('City is required').max(15, 'Address number must be at most 100 characters'),
    state: Yup.string().required('State is required').max(15, 'Address number must be at most 100 characters'),
    pincode: Yup.string().required('Zip code is required').max(6, 'Address number must be at most 100 characters'),
});

export const countryCodes =

    [
        {
            "value": "+93",
            "label": "Afghanistan"
        },
        {
            "value": "+355",
            "label": "Albania"
        },
        {
            "value": "+213",
            "label": "Algeria"
        },
        {
            "value": "+54",
            "label": "Argentina"
        },
        {
            "value": "+374",
            "label": "Armenia"
        },
        {
            "value": "+61",
            "label": "Australia"
        },
        {
            "value": "+43",
            "label": "Austria"
        },
        {
            "value": "+994",
            "label": "Azerbaijan"
        },
        {
            "value": "+973",
            "label": "Bahrain"
        },
        {
            "value": "+880",
            "label": "Bangladesh"
        },
        {
            "value": "+32",
            "label": "Belgium"
        },
        {
            "value": "+975",
            "label": "Bhutan"
        },
        {
            "value": "+591",
            "label": "Bolivia"
        },
        {
            "value": "+55",
            "label": "Brazil"
        },
        {
            "value": "+226",
            "label": "Burkina Faso"
        },
        {
            "value": "+855",
            "label": "Cambodia"
        },
        {
            "value": "+237",
            "label": "Cameroon"
        },
        {
            "value": "+1-613",
            "label": "Canada"
        },
        {
            "value": "+238",
            "label": "Cape Verde"
        },
        {
            "value": "+236",
            "label": "Central African Republic"
        },
        {
            "value": "+56",
            "label": "Chile"
        },
        {
            "value": "+86",
            "label": "China"
        },
        {
            "value": "+57",
            "label": "Colombia"
        },
        {
            "value": "+242",
            "label": "Congo"
        },
        {
            "value": "+682",
            "label": "Cook Islands"
        },
        {
            "value": "+420",
            "label": "Czech Republic"
        },
        {
            "value": "+45",
            "label": "Denmark"
        },
        {
            "value": "+593",
            "label": "Ecuador"
        },
        {
            "value": "+20",
            "label": "Egypt"
        },
        {
            "value": "+240",
            "label": "Equatorial Guinea"
        },
        {
            "value": "+251",
            "label": "Ethiopia"
        },
        {
            "value": "+679",
            "label": "Fiji"
        },
        {
            "value": "+358",
            "label": "Finland"
        },
        {
            "value": "+33",
            "label": "France"
        },
        {
            "value": "+241",
            "label": "Gabon"
        },
        {
            "value": "+220",
            "label": "Gambia"
        },
        {
            "value": "+49",
            "label": "Germany"
        },
        {
            "value": "+233",
            "label": "Ghana"
        },
        {
            "value": "+30",
            "label": "Greece"
        },
        {
            "value": "+36",
            "label": "Hungary"
        },
        {
            "value": "+91",
            "label": "India"
        },
        {
            "value": "+62",
            "label": "Indonesia"
        },
        {
            "value": "+39",
            "label": "Italy"
        },
        {
            "value": "+225",
            "label": "Ivory Coast"
        },
        {
            "value": "+81",
            "label": "Japan"
        },
        {
            "value": "+254",
            "label": "Kenya"
        },
        {
            "value": "+856",
            "label": "Laos"
        },
        {
            "value": "+60",
            "label": "Malaysia"
        },
        {
            "value": "+960",
            "label": "Maldives"
        },
        {
            "value": "+692",
            "label": "Marshall Islands"
        },
        {
            "value": "+52",
            "label": "Mexico"
        },
        {
            "value": "+691",
            "label": "Micronesia"
        },
        {
            "value": "+212",
            "label": "Morocco"
        },
        {
            "value": "+95",
            "label": "Myanmar"
        },
        {
            "value": "+977",
            "label": "Nepal"
        },
        {
            "value": "+31",
            "label": "Netherlands"
        },
        {
            "value": "+64",
            "label": "New Zealand"
        },
        {
            "value": "+234",
            "label": "Nigeria"
        },
        {
            "value": "+47",
            "label": "Norway"
        },
        {
            "value": "+",
            "label": "Other"
        },
        {
            "value": "+92",
            "label": "Pakistan"
        },
        {
            "value": "+507",
            "label": "Panama"
        },
        {
            "value": "+595",
            "label": "Paraguay"
        },
        {
            "value": "+51",
            "label": "Peru"
        },
        {
            "value": "+63",
            "label": "Philippines"
        },
        {
            "value": "+48",
            "label": "Poland"
        },
        {
            "value": "+351",
            "label": "Portugal"
        },
        {
            "value": "+40",
            "label": "Romania"
        },
        {
            "value": "+7",
            "label": "Russia"
        },
        {
            "value": "+250",
            "label": "Rwanda"
        },
        {
            "value": "+685",
            "label": "Samoa"
        },
        {
            "value": "+221",
            "label": "Senegal"
        },
        {
            "value": "+65",
            "label": "Singapore"
        },
        {
            "value": "+27",
            "label": "South Africa"
        },
        {
            "value": "+82",
            "label": "South Korea"
        },
        {
            "value": "+34",
            "label": "Spain"
        },
        {
            "value": "+94",
            "label": "Sri Lanka"
        },
        {
            "value": "+46",
            "label": "Sweden"
        },
        {
            "value": "+41",
            "label": "Switzerland"
        },
        {
            "value": "+255",
            "label": "Tanzania"
        },
        {
            "value": "+66",
            "label": "Thailand"
        },
        {
            "value": "+216",
            "label": "Tunisia"
        },
        {
            "value": "+90",
            "label": "Turkey"
        },
        {
            "value": "+256",
            "label": "Uganda"
        },
        {
            "value": "+44",
            "label": "United Kingdom"
        },
        {
            "value": "+1",
            "label": "United States"
        },
        {
            "value": "+598",
            "label": "Uruguay"
        },
        {
            "value": "+58",
            "label": "Venezuela"
        },
        {
            "value": "+84",
            "label": "Vietnam"
        },
        {
            "value": "+260",
            "label": "Zambia"
        },
        {
            "value": "+263",
            "label": "Zimbabwe"
        }
    ]

export const loginInitials = {
    isMobile: false,
    mobile: "",
    email: "",
    password: "",
};

export const loginValidationSchema = Yup.object().shape({
    isMobile: Yup.boolean(),
    mobile: Yup
        .string()
        .when("isMobile", (isMobile, schema) => {
            if (isMobile[0] === true)
                return schema.required("Must enter mobile")
                    .matches(/^[0-9]+$/, 'Mobile number must be only digits')
                    .min(10, 'Mobile number must be at least 10 digits')
                    .max(15, 'Mobile number must be at most 15 digits')
            return schema
        }),
    email: Yup
        .string()
        .when("isMobile", (isMobile, schema) => {
            if (isMobile[0] === false)
                return schema.required("Must enter email address")
                    .email('Invalid email format')
            return schema
        }),
    password: Yup.string()
        .matches(passwordRules, { message: 'Password must be 8-20 characters long and include at least one lowercase letter, one digit, and one special character.' })
        .required('Password is required'),
});


export const getInTouchSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(20, 'Name must be at most 20 characters'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    message: Yup.string().required('Message is required').max(500, 'Message must be at most 500 characters'),
});


export function getCurrentDateFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
}


export const orderStatus = ["ALL", "PROCESSING", "ACCEPTED", "SHIPPED", "CANCELLED", "COMPLETE", "RETURNED"]


export const shipped = z.object({
    length: z
        .string()
        .min(1, "Length is required")
        .refine(value => !isNaN(Number(value)), "Length must be a number")
        .transform(Number)
        .refine(value => value > 0, "Length must be a positive number"),
    breadth: z
        .string()
        .min(1, "Breadth is required")
        .refine(value => !isNaN(Number(value)), "Breadth must be a number")
        .transform(Number)
        .refine(value => value > 0, "Breadth must be a positive number"),
    height: z
        .string()
        .min(1, "Height is required")
        .refine(value => !isNaN(Number(value)), "Height must be a number")
        .transform(Number)
        .refine(value => value > 0, "Height must be a positive number"),
    weight: z
        .string()
        .min(1, "Weight is required")
        .refine(value => !isNaN(Number(value)), "Weight must be a number")
        .transform(Number)
        .refine(value => value > 0, "Weight must be a positive number"),
})

export const paymentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    country_code: z.string().min(1, "Country code is required"),
    mobile: z.string()
        .min(10, "Mobile number must be at least 10 digits")
        .max(10, "Mobile number must be at most 10 digits")
        .regex(/^[0-9]+$/, "Mobile number must contain only numbers"),
    address: z.string().min(1, "Address is required").max(100, "Address must be at most 100 characters"),
    city: z.string().min(1, "City is required").max(15, "City must be at most 15 characters"),
    state: z.string().min(1, "State is required"),
    pincode: z.string()
        .min(6, "PIN code must be at least 6 digits")
        .max(6, "PIN code must be at most 6 digits")
        .regex(/^[0-9]+$/, "PIN code must contain only numbers"),
    country: z.string().min(1, "Country is required").max(15, "Country must be at most 15 characters"),
    paymentMethod: z.string().min(1, "Payment method is required"),
})

export const size = [
    { key: "Y_0_1", label: "0-1" },
    { key: "Y_1_2", label: "1-2" },
    { key: "Y_2_3", label: "2-3" },
    { key: "Y_3_4", label: "3-4" },
    { key: "Y_4_5", label: "4-5" },
    { key: "Y_5_6", label: "5-6" },
    { key: "Y_6_7", label: "6-7" },
    { key: "Y_7_8", label: "7-8" },
    { key: "Y_8_9", label: "8-9" },
    { key: "Y_9_10", label: "9-10" },
    { key: "Y_10_11", label: "10-11" },
    { key: "Y_11_12", label: "11-12" },
    { key: "S", label: "S" },
    { key: "M", label: "M" },
    { key: "L", label: "L" },
    { key: "XL", label: "XL" },
    { key: "XXL", label: "2X" },
    { key: "XXXL", label: "3X" },
];

export const validSizes = [
    "Y_0_1",
    "Y_1_2",
    "Y_2_3",
    "Y_3_4",
    "Y_4_5",
    "Y_5_6",
    "Y_6_7",
    "Y_7_8",
    "Y_8_9",
    "Y_9_10",
    "Y_10_11",
    "Y_11_12",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "NONE",
];

export const checkSizes = (selectedItems) => {

    for (let item of selectedItems) {

        if (item?.checked === true && item?.size === "NONE") {
            return { st: false, msg: `Please select size of ${item?.product?.name ? item?.product?.name : ""} Product`, }
        }
    }
    return { st: true, msg: "", }
}

export const getStatusClass = (status) => {
    switch (status) {
        case "ALL":
            return 'border border-gray-500 text-black-500';
        case "PROCESSING":
            return 'border border-yellow-500 text-black-500';
        case "ACCEPTED":
            return 'border border-blue-500 text-black-500';
        case "SHIPPED":
            return 'border border-indigo-500 text-black-500';
        case "CANCELLED":
            return 'border border-red-500 text-red-500';
        case "COMPLETE":
            return 'border border-green-500 text-green-500';
        case "RETURNED":
            return 'border border-orange-500 text-orange-500';
        default:
            return 'bg-gray-500 text-white';
    }
};