"use client";
import About from "@/components/frontside/Careaboutpage/page";
import ImageSlider from "@/components/frontside/Imageslider/page";
import Nailslider from "@/components/frontside/Nailsliderpage/page";
import Recentviewed from "@/components/frontside/Recentviewed/page";
import Submitemail from "@/components/frontside/SubmitEmail/page";
import Topselectionpart from "@/components/frontside/Topselectionpage/page";
import Unitedfree from "@/components/frontside/Unitedfreepage/page";
import OfferPage from "@/components/frontside/offer/page";



export default function Home() {
  return (
    <div className="main-content ">
      <ImageSlider />
      <Topselectionpart />
      <OfferPage />
      <About />
      <Unitedfree />
      <Recentviewed />
      <Submitemail />
    </div>
  );
}
