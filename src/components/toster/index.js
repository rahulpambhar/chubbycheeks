import toast, { Toaster } from 'react-hot-toast';

export const successToast = (msg) => {
    toast.success(msg, {
        position: 'bottom-right',
        duration: 4000,
        style: {
            border: '1px solid #000000',
            padding: '16px',
            color: '#000000',
        }
    });
}

export const errorToast = (msg) => {
    toast.error(msg, {
        position: 'bottom-right',
        duration: 4000,
        style: {
            border: '1px solid #000000',
            padding: '16px',
            color: '#000000',
        }
    });
}