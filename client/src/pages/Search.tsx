import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { useGetCatagories, useSearchProducts } from "../api/product.api";
import useDebounce from "../lib/useDebounce";
import { CardSkeletonLoader } from "../components/CardSkeletonLoader";
import toast, { Toaster } from "react-hot-toast";
import { useCartStore } from "../zustand/useCartStore";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  // const [isPrevPage, setIsprevPage] = useState(false);
  // const [isNextPage, setIsNextpage] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedMaxPrice] = useDebounce(maxPrice, 500);

  const {
    data: categoryData,
    isError: isCategoryError,
    error: categoryError,
  } = useGetCatagories();
  const {
    data: searchData,
    isLoading: searchLoading,
    isError: isSearchError,
    error: searchError,
  } = useSearchProducts({
    search: debouncedSearch,
    sort,
    category,
    page,
    price: debouncedMaxPrice,
  });

  const cartStore = useCartStore();

  const cardClickHandler = () => {
    console.log("clicked on the card");
  };

  const addToCartHandler = (id: number) => {
    const product = searchData?.data.filter((item) => Number(item.id) == id)[0];

    if (product && product.stock >= 1) {
      cartStore.setCartItems({
        name: product.name,
        photo: product.photo,
        price: product.price,
        productId: product.id,
        quantity: 1,
        stock: product.stock,
      });
    }
  };

  console.log(searchData?.data);

  if (isCategoryError) {
    toast.error(categoryError.message);
  }

  if (isSearchError) {
    toast.error(searchError.message);
  }

  return (
    <div className="h-full flex relative custom-container ">
      <aside className=" h-full w-60 p-2 border-r-[.5px] border-gray-400 flex flex-col gap-2 items-stretch pr-4">
        <h2>Filters</h2>
        <div className="flex flex-col">
          <h4>Sort</h4>
          <select
            className="p-1 border-[1px] border-gray-400 rounded-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="desc">Price (High to Low)</option>
          </select>
        </div>

        <div className="flex flex-col">
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            // className="p-1 border-[1px] border-gray-400 rounded-sm"
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col">
          <h4>Category</h4>
          <select
            className="p-1 border-[1px] border-gray-400 rounded-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">ALL</option>
            {categoryData?.data.map((item) => {
              return <option value={item}>{item}</option>;
            })}
          </select>
        </div>
      </aside>
      <div className=" flex-1 pl-4 pt-2">
        <h1>PRODUCTS</h1>
        <input
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          required
        />
        <main className="grid grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 gap-4 lg:gap-4 mt-4">
          {searchLoading ? (
            <CardSkeletonLoader />
          ) : (
            searchData?.data.map((item) => {
              return (
                <ProductCard
                  photo={item.photo}
                  id={Number(item.id)}
                  name={item.name}
                  price={item.price}
                  key={item.id}
                  stock={item.stock}
                  handler={cardClickHandler}
                  addToCartHandler={addToCartHandler}
                />
              );
            })
          )}
        </main>
        <article className=" flex justify-center items-center gap-2 py-4">
          <Button
            variant={"outline"}
            disabled={!(page > 1)}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </Button>
          <span>
            {page} of {searchData?.totalPages ? searchData.totalPages : 1}
          </span>
          <Button
            variant={"outline"}
            disabled={!(page < (searchData?.totalPages || 1))}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </article>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Search;
