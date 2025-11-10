import { apis } from "../Services/commonServices";

//We are dynamically making the script
const loadRazorpayScript = () =>
    new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

export const handlePayment = async (orderData,handleClose) => {
    const res = await loadRazorpayScript();
    if (!res) {
        alert("Razorpay SDK failed to load");
        return;
    }

    const options = {
        key: "rzp_test_lKQ3vrhY8obEr3", // from Razorpay dashboard
        amount: orderData.amount,
        currency: orderData.currency,
        name: "દક્ષ",
        description: "Medisoft Bill Payment",
        order_id: orderData.id, // Order ID from backend
        handler: async function (response) {
            // verify on backend
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
            await apis.noTokenPostRequest('/bill/verify-Payment',{ razorpay_payment_id, razorpay_order_id, razorpay_signature });
            handleClose();
        },
        prefill: {
            name: "Daksh Patel",
            email: "dakshjpatel007@example.com",
            contact: "9510899999"
        },
        theme: {
            color: "#3399cc"
        }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
};
