"use client";
import About from "@/components/frontside/Careaboutpage/page";
import Howitwork from "@/components/frontside/HowItWork/page";
import ImageSlider from "@/components/frontside/Imageslider/page";
import Nailslider from "@/components/frontside/Nailsliderpage/page";
import Recentviewed from "@/components/frontside/Recentviewed/page";
import Submitemail from "@/components/frontside/SubmitEmail/page";
import Topselectionpart from "@/components/frontside/Topselectionpage/page";
import Unitedfree from "@/components/frontside/Unitedfreepage/page";
import OfferPage from "@/components/frontside/offer/page";
import Singlenailpaint from "@/components/frontside/singlenailpaint/page";



export default function Home() {
  return (
    <main>
      <ImageSlider />
      <Topselectionpart />
      <About />
      <OfferPage />
      <Singlenailpaint />
      <Nailslider />
      <Unitedfree />
      <Howitwork />
      <Recentviewed />
      <Submitemail />
    </main>
  );
}
