
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BabyIcon, FacebookIcon, InstagramIcon, MenuIcon, ShoppingCartIcon } from '@/components'
import Cart from "@/components/Cart";


export default function Component() {
  return (
    <div className="bg-background text-foreground">
      <main>
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Crafting Comfort and Style for Your Little Ones
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl">
                  At ChubbyCheeks, we pour our hearts into every stitch, creating high-quality baby clothes that are both
                  comfortable and stylish.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button size="lg">Shop Now</Button>
                  <Link href="#" className="text-sm font-medium hover:underline" prefetch={false}>
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg"
                  alt="ChubbyCheeks"
                  width={500}
                  height={500}
                  className="w-full max-w-[400px] rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg"
                  alt="Ethically Made"
                  width={500}
                  height={500}
                  className="w-full max-w-[400px] rounded-lg shadow-lg"
                />
              </div>
              <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Ethically Made with Love</h2>
                <p className="text-lg md:text-xl lg:text-2xl">
                  We're committed to ethical and sustainable practices, ensuring that every piece is crafted with care
                  and attention to detail.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Timeless Designs, Lasting Comfort</h2>
                <p className="text-lg md:text-xl lg:text-2xl">
                  Our team of dedicated designers create timeless pieces that will keep your little ones cozy and
                  confident.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button size="lg">Explore Collection</Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg"
                  alt="Timeless Designs"
                  width={500}
                  height={500}
                  className="w-full max-w-[400px] rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg"
                  alt="Family-Owned"
                  width={500}
                  height={500}
                  className="w-full max-w-[400px] rounded-lg shadow-lg"
                />
              </div>
              <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">A Family-Owned Legacy</h2>
                <p className="text-lg md:text-xl lg:text-2xl">
                  Chubby Cheekswas founded by the Sharma family, who have been crafting high-quality baby clothes for over
                  6 years. We're proud to continue this legacy of exceptional craftsmanship.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button variant="outline" size="lg">
                    Meet the Team
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Cart/>
    </div>
  )
}

