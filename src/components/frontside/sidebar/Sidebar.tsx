"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import MultiRangeSlider from "../progressbarr/progressbar";
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useAppSelector, useAppDispatch } from '../../../app/redux/hooks';
import { fetchCategories, setProducts } from "@/app/redux/slices/categorySlice";
import { useParams, useRouter } from "next/navigation";
import Select from 'react-select'

interface SidebarProps {
  priceRange: any;
  filteredOptions: any[];
  selectedSubcategories: string[];
  handleSubcategoryChange: (value: string) => void;
  handlePriceRangeChange: (range: any) => void;
  handleSortOrderChange: (order: string) => void;
  sortOrder: string;
}
const Sidebar = ({ priceRange,filteredOptions, selectedSubcategories, handleSubcategoryChange, handlePriceRangeChange, handleSortOrderChange, sortOrder }: SidebarProps) => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 100 }));
  }, [dispatch]);
  return (
    <div className="bg-background rounded-lg shadow-lg p-6">

      <div className="mb-6">
        <h3 className="text-base font-medium mb-2">Subcategories</h3>
        <div className="grid gap-2">
          {
            filteredOptions.length > 0 && filteredOptions.map((item: any) => {
              return (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedSubcategories.includes(item.value)}
                    onCheckedChange={() => handleSubcategoryChange(item.value)}
                  />
                  <span>{item.label}</span>
                </div>
              )
            })}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-base font-medium mb-2">Price Range</h3>
        <div className="pt-6">
          <MultiRangeSlider
            min={0}
            max={3000}
            onChange={handlePriceRangeChange}
          />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-base font-medium mb-2">Sort By</h3>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <RadioGroup value={sortOrder} onValueChange={handleSortOrderChange}>
              <RadioGroupItem value="low" id="sort-low-to-high" />
              <Label htmlFor="sort-low-to-high" className="font-normal">
                Price: Low to High
              </Label>
            </RadioGroup>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroup value={sortOrder} onValueChange={handleSortOrderChange}>
              <RadioGroupItem value="high" id="sort-high-to-low" />
              <Label htmlFor="sort-high-to-low" className="font-normal">
                Price: High to Low
              </Label>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
