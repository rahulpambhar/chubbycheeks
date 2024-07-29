"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { fetchCategories, setProducts } from "../../../redux/slices/categorySlice";
import TopselectionCard from "@/components/frontside/TopselectionCard/page";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/frontside/sidebar/Sidebar";
import _ from "lodash";
// import { Categories, SubCategory } from "../../../../types/global";
import { Categories, SubCategory } from "../../../../../types/global";
import { useParams } from "next/navigation";
import Deals from "@/components/frontside/deals/Deals";
import Cart from "@/components/Cart";

export default function Component() {
  const [selectedSubcategories, setSelectedSubcategories] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOrder, setSortOrder] = useState("low");
  const wishList = useAppSelector((state): any[] => state?.wishListReducer?.wishList) || [];
  const products: any = useAppSelector((state): any[] => state?.categories?.products);
  const productsList: any = useAppSelector((state): any => state?.categories?.productsList);

  const dispatch = useAppDispatch();
  const params = useParams();

  const filteredProducts = useMemo(() => {
    return products
      .filter((product: any) => {
        const subcategoryMatch = selectedSubcategories.includes(product?.subCategoryId);
        const priceMatch = product?.price >= priceRange[0] && product?.price <= priceRange[1];
        return subcategoryMatch && priceMatch;
      })
      .sort((a: any, b: any) => (sortOrder === "high" ? b.price - a.price : a.price - b.price));
  }, [selectedSubcategories, priceRange, sortOrder]);

  const handleSubcategoryChange = (subcategory: any) => {
    setSelectedSubcategories((prevSubcategories) => {
      if (prevSubcategories.includes(subcategory)) {
        return prevSubcategories.filter((s) => s !== subcategory);
      } else {
        return [...prevSubcategories, subcategory];
      }
    });
  };

  const handlePriceRangeChange = useCallback(
    _.debounce((range) => {
      setPriceRange([range.min, range.max]);
    }, 300),
    []
  );

  const handleSortOrderChange = (order: any) => {
    setSortOrder(order);
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);



  const categories: Categories[] = useAppSelector((state): any => state?.categories?.categories);
  const subCategories = categories?.filter((item: any) => item?.name === params.sub).flatMap((category: any) => category.SubCategory);


  const filteredOptions = useMemo(() => {

    if (subCategories.length > 0) {
      let sub = []
      for (let x in subCategories) {
        if (subCategories[x].products.length > 0) {
          sub.push({ value: subCategories[x].id, label: subCategories[x].name })
        }
      }

      return sub;
    } else {
      return [];
    }
  }, [categories, products, params.sub]);

  useEffect(() => {
    dispatch(setProducts(productsList));
  }, [dispatch, productsList]);

  useEffect(() => {
    const allSubcategoryIds = subCategories.map(subCategory => subCategory.id);
    if (selectedSubcategories.length !== allSubcategoryIds.length) {
      setSelectedSubcategories(allSubcategoryIds);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 justify-between">
      <div className="grid md:grid-cols-[300px_1fr] gap-8 justify-between">
        <Sidebar
          priceRange={priceRange}
          selectedSubcategories={selectedSubcategories}
          handleSubcategoryChange={handleSubcategoryChange}
          handlePriceRangeChange={handlePriceRangeChange}
          handleSortOrderChange={handleSortOrderChange}
          sortOrder={sortOrder}
          filteredOptions={filteredOptions}
        />

        {filteredProducts?.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product: any) => {
              const wish = !!wishList?.find((wish) => wish?.productId === product?.id);

              return (
                <div key={product?.id} className={`p-2`}>
                  {product && <TopselectionCard item={product} wish={wish} />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-background rounded-lg shadow-md p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">No Products Found</h2>
              <p className="text-muted-foreground mb-6">
                Sorry, there are no products that match your current filters.
              </p>
              <Button onClick={() => {
                setSelectedSubcategories([]);
                setPriceRange([0, 3000]);
                setSortOrder("low");
              }}>Clear Filters</Button>
            </div>
          </div>
        )}
      </div>
      <Deals />
      <Cart />
    </div>
  );
}

