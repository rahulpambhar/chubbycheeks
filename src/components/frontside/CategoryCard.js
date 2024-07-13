import Image from "next/image";
import Images from "/public/48550-2-chair-download-free-hq-image 1.png";
function PopularCard({ name }) {
    return (
        <>
            <div className="bg-[#CAF3E5] w-[237px] h-[340px] rounded-xl flex justify-center items-center gap-4 flex-col text-start z-30  shrink-0">
                <Image src={Images} width={89} height={116} alt="" className="" />
                <p className="text-[#70908B] font-[600]">{name}</p>
            </div>
        </>
    );
}

export default PopularCard;
