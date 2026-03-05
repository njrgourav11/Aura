import Razorpay from "razorpay";

let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
    if (!_razorpay) {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            throw new Error("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing from environment variables.");
        }

        _razorpay = new Razorpay({ key_id, key_secret });
    }
    return _razorpay;
}

// Keep backward compat: lazily resolved proxy-like singleton
export const razorpay = new Proxy({} as Razorpay, {
    get(_target, prop) {
        return (getRazorpay() as any)[prop];
    }
});
