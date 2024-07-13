import React from "react";
import Style from "./progressbar.module.css";
import { motion, useScroll } from "framer-motion";

const Progressbar = () => {
  const { scrollYProgress } = useScroll();
  return (
    <div>
      <motion.div
        className={Style.progressbar}
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
};

export default Progressbar;
