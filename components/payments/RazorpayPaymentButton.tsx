"use client";

import { useState } from "react";
import Script from "next/script";
import { Loader2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface RazorpayButtonProps {
    invoice: any;
    businessDetails: any;
    onSuccess?: () => void;
}

export default function RazorpayPaymentButton({ invoice, businessDetails, onSuccess }: RazorpayButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create order on server
            const orderRes = await fetch("/api/payments/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invoiceId: invoice._id }),
            });

            const order = await orderRes.json();
            if (order.error) throw new Error(order.error);

            // 2. Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: businessDetails.businessName || "Aura Freelancer",
                description: `Invoice ${invoice.invoiceNumber}`,
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify payment on server
                    const verifyRes = await fetch("/api/payments/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            invoiceId: invoice._id
                        }),
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.message) {
                        alert("Payment successful!");
                        if (onSuccess) onSuccess();
                        router.refresh();
                    } else {
                        alert("Payment verification failed: " + verifyData.error);
                    }
                },
                prefill: {
                    name: invoice.clientId?.name,
                    email: invoice.clientId?.email,
                    contact: invoice.clientId?.phone,
                },
                theme: {
                    color: "#6366f1", // Indigo-500
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            console.error("Payment Error:", error);
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Script
                id="razorpay-checkout"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <button
                onClick={handlePayment}
                disabled={loading || invoice.status === 'Paid'}
                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        <CreditCard className="w-5 h-5" />
                        {invoice.status === 'Paid' ? 'Successfully Paid' : 'Pay Now with Razorpay'}
                    </>
                )}
            </button>
        </>
    );
}
