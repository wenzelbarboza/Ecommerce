import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import ProductCard from "../components/ProductCard";

const Home = () => {
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
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
        <ProductCard photo="https://m.media-amazon.com/images/I/61Qe0euJJZL._SX679_.jpg" />
      </main>
    </div>
  );
};

export default Home;
