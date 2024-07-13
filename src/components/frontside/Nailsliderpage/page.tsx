import React from "react";
import NailsliderCard from "../Nailslider/page";

const Nailsliderarray = [
  {
    id: 1,
    image1: "/image/nailslider1.jpg",
    image2: "/image/pinknailpaint.jpg",
    label: "We don’t just care about Nail. we care about you.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Malesuada vel netus duis tincidunt. Ultrices pretium arcu, faucibus viverra enim massa ut egestas. Amet, congue etiam sed et amet, velit scelerisque. Pellentesque euismod gravida eu varius id tempus. Tempus tortor, eu eu habitasse massa facilisis. Viverra id morbi lacus varius eget. Sed ac cras ac dolor neque mus orci.",
  },
];
const Nailslider = () => {
  return (
    <div>
      {Nailsliderarray.map((item, index) => (
        <NailsliderCard
          key={item.id}
          image1={item.image1}
          image2={item.image2}
          label={item.label}
          discription={item.description}
        />
      ))}{" "}
    </div>
  );
};

export default Nailslider;
