
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function Component() {
  return (
    <>
      <Card className="w-full ml-14  max-w-md p-8 bg-[url('/placeholder.svg')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center border border-green-800   text-center gap-6">
        <div className="animate-float">
          <LeafIcon className="w-12 h-12 text-green-700" />
        </div>
        <h2 className="text-3xl text-green-500 font-bold">Thank You</h2>
        <p className="text-muted-foreground">
          Thank you so much for your purchase! We're thrilled to have you as a customer and hope you absolutely love your new items. Your order is on its way, and we can't wait for you to receive it. If you have any questions or need assistance, feel free to reach out. Happy shopping and thanks again for choosing us!
        </p>
        <Link href="/">
          <Button >Home</Button>
        </Link>
      </Card>

      <Card className="w-full  max-w-md p-8 bg-[url('/placeholder.svg')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center border border-green-800   text-center gap-6">
        <div className="animate-float">
          {/* <LeafIcon className="w-12 h-12 text-green-700" /> */}
        </div>
        <h2 className="text-3xl text-green-500 font-bold">Bill</h2>
        <p className="text-muted-foreground">
          Bill section
        </p>
        <Link href="/">
          <Button >Download</Button>
        </Link>
      </Card>
    </>

  )
}

function LeafIcon(props: any) {
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
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}
