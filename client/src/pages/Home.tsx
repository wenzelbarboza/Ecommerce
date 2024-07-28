import toast, { Toaster } from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetLatestProd } from "../api/product.api";
import { CardSkeletonLoader } from "../components/CardSkeletonLoader";
import ProductCard from "../components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";

// TODO:
// good loader and skeleton

const Home = () => {
  const cardHandler = (id: number) => {
    console.log("this is product id: ", id);
  };

  const { data, isError, isLoading } = useGetLatestProd();

  console.log("product data is :", data);

  const toatText = () => {
    toast.error("cannot fetch products");
  };

  if (isError) {
    console.log("inside the toast3");
    toatText();
  }
  return (
    <div className="custom-container  ">
      <section className="w-full py-6">
        <Carousel className="w-[90%] mx-auto">
          <CarouselContent>
            <CarouselItem>
              <FaUser className="w-[100%] h-52 mx-auto bg-green-300" />
            </CarouselItem>
            <CarouselItem>
              <FaUser className="w-[100%] h-52 mx-auto bg-green-300" />
            </CarouselItem>
            <CarouselItem>
              <FaUser className="w-[100%] h-52 mx-auto bg-green-300" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
      <h1 className="text-lg flex items-end mb-6">
        <span>Latest Products</span>
        <Link to="/search" className="ml-auto text-sm text-gray-600">
          More
        </Link>
      </h1>
      <main className="grid grid-cols-4 gap-1 lg:gap-8">
        {isLoading
          ? new Array(5).fill(5).map(() => <CardSkeletonLoader />)
          : data?.data.map((item) => {
              return (
                <ProductCard
                  key={item.id}
                  id={Number(item.id)}
                  handler={cardHandler}
                  name={item.name}
                  price={item.price}
                  photo={item.photo}
                />
              );
            })}
        {/* <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" /> */}
      </main>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Home;
