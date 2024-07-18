
import Link from "next/link"

export default function Component() {
    return (
        <div className="bg-background text-foreground">
            <div className="container mx-auto max-w-4xl px-4 py-12">
                {/* <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1> */}
                <div className="space-y-8">
                    <section>
                        <h2 className="mb-4 text-2xl font-bold">Delivery Policy</h2>
                        <p>We guarantee delivery of all orders within India within 7 days of placing the confirm order.</p>
                    </section>
                    <section>
                        <h2 className="mb-4 text-2xl font-bold">Return Policy</h2>
                        <p>
                            Customers can return items within 7 days of delivery for a full refund. Items must be unworn, unwashed,
                            and in their original packaging.
                        </p>
                    </section>
                    <section>
                        <h2 className="mb-4 text-2xl font-bold">Refund Policy</h2>
                        <p>
                            Refunds will be processed within 2-5 business days of receiving the returned item. Refunds will be issued
                            to the original payment method.
                        </p>
                    </section>
                    <section>
                        <h2 className="mb-4 text-2xl font-bold">Shipping Information</h2>
                        <ul className="space-y-2">
                            <li>Free shipping on all orders above ₹499. Standard delivery time is 5-7 business days.</li>
                            <li>Express delivery available for an additional fee.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="mb-4 text-2xl font-bold">Payment Methods</h2>
                        <p>
                            We accept major credit/debit cards, net banking, and popular Indian digital wallet providers such as Razorpay
                            {/* like Google Pay,
                            PhonePe, and Paytm. */}
                        </p>
                    </section>
                    <section>
                        <h2 className="mb-4 text-2xl font-bold">Customer Support</h2>
                        <p>
                            For any inquiries or assistance, please  {" "}
                            <Link href="/contactUs" className="text-blue-500">
                                Contact Us
                                {/* support@babygarments.com */}
                            </Link>
                            {" "}   or call us at +91-800-055-5268.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}