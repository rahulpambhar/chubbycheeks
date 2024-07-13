"use client";
// import { useState } from "react";

// function PriceFilter() {
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(100);

//   function handleMinPriceChange(event) {
//     setMinPrice(parseInt(event.target.value));
//   }

//   function handleMaxPriceChange(event) {
//     setMaxPrice(parseInt(event.target.value));
//   }

//   return (
//     <div className="flex items-center space-x-4">
//       <input
//         type="range"
//         min="0"
//         max="100"
//         value={minPrice}
//         onChange={handleMinPriceChange}
//         className="w-1/2"
//       />
//       <input
//         type="range"
//         min="0"
//         max="100"
//         value={maxPrice}
//         onChange={handleMaxPriceChange}
//         className="w-1/2"
//       />
//     </div>
//   );
// }

// export default PriceFilter;import React, { useCallback, useEffect, useState, useRef } from "react";

import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  ChangeEvent,
} from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import "./progressbar.css";

interface MultiRangeSliderProps {
  min: number;
  max: number;
  onChange: ({ min, max }: { min: number; max: number }) => void;
}

const MultiRangeSlider: React.FC<MultiRangeSliderProps> = ({
  min,
  max,
  onChange,
}) => {
  const [minVal, setMinVal] = useState<number>(min);
  const [maxVal, setMaxVal] = useState<number>(max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={classnames("thumb thumb--zindex-3", {
          "thumb--zindex-5": minVal > max - 100,
        })}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="thumb thumb--zindex-4"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
      </div>
      <div className="flex gap-1 pt-7 justify-start items-center poppins font-medium text-xs">
        <p className="pl-14">RS.{minVal}</p>
        <p className="">-</p>
        <p className="">RS.{maxVal}</p>
      </div>
    </div>
  );
};

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;
