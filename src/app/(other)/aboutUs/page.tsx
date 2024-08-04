
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BabyIcon, FacebookIcon, InstagramIcon, MenuIcon, ShoppingCartIcon } from '@/components'
import Cart from "@/components/Cart";
import Image from "next/image";


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
                <p className="text-lg md:text-sm lg:text-xl">
                  At ChubbyCheeks, we pour our hearts into every stitch, creating high-quality baby clothes that are both comfortable and stylish. Our unisex garments are designed to ensure that every baby, regardless of gender, feels snug and looks adorable. We use the softest fabrics, perfect for delicate skin, and prioritize sustainability in our materials and processes. With ChubbyCheeks, your little ones are always wrapped in love and care.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button size="lg">
                    <Link href="/" className="text-sm font-medium hover:underline" prefetch={false}>
                      Shop Now
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="image/chubbyCheeks/little-1.jpg"
                  alt="ChubbyCheeks"
                  width={500}
                  height={500}
                  className="w-full max-w-[400px] max-h-[500px] object-cover object-center rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <div className="flex justify-center">
                <Image
                  src="/image/chubbyCheeks/ethical-1.jpg"
                  alt="Ethically Made"
                  width={500}
                  height={500}
                  className="w-full max-w-[400px] max-h-[500px] object-cover object-center rounded-lg shadow-lg"
                />
              </div>
              <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Ethically Made with Love</h2>
                <p className="text-lg md:text-xl lg:text-xl">
                  We're committed to ethical and sustainable practices, ensuring that every piece is crafted with care and attention to detail. At ChubbyCheeks, our dedication to the planet and its people means we use eco-friendly materials and fair labor practices. Our goal is to create beautiful, durable clothing that you can feel good about, knowing it was made with love and respect for the environment and the artisans who bring our designs to life. Every garment is a testament to our passion for making a positive impact on the world.
                </p>

              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Timeless Designs, Lasting Comfort</h2>
                <p className="text-lg md:text-xl lg:text-xl">
                Our team of dedicated designers create timeless pieces that will keep your little ones cozy and confident. At ChubbyCheeks, we believe in blending classic styles with modern functionality to ensure your children look great and feel even better. Each garment is meticulously crafted to provide lasting comfort through every adventure, from playtime to bedtime. Our focus on quality and durability means our clothes grow with your child, offering enduring style and ease for any occasion.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

                  <Button size="lg" variant="outline" >
                    <Link href="/categories/clothes" className="text-sm font-medium hover:underline" prefetch={false}>
                      Explore Collection
                    </Link>
                  </Button>
                  {/* <Button size="lg"></Button> */}
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/image/chubbyCheeks/little-2.jpg"
                  alt="Timeless Designs"
                  width={500}
                  height={500}
                  className="w-full max-w-[400px] max-h-[500px] object-cover object-center rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <div className="flex justify-center">
                <Image
                  src="/image/chubbyCheeks/family-1.jpg"
                  alt="Family-Owned"
                  width={700}
                  height={700}
                  className="w-full max-w-[700px] max-h-[700px] object-cover object-center rounded-lg shadow-lg"
                />
              </div>
              <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">A Family-Owned Legacy</h2>
                <p className="text-lg md:text-xl lg:text-xl">
                ChubbyCheeks was founded by the Sharma family, who have been crafting high-quality baby clothes for over 6 years. We're proud to continue this legacy of exceptional craftsmanship. Our family's dedication to excellence is woven into every piece we create, ensuring each garment meets the highest standards of quality and comfort. With a passion for creating beautiful and functional baby clothes, we have built a reputation for delivering timeless designs that parents trust and children love. Our legacy is not just in our clothes, but in the smiles and comfort of the little ones who wear them.
                </p>
                {/* <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button variant="outline" size="lg">
                    Meet the Team
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Cart />
    </div>
  )
}

