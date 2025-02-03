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
import { useCartStore } from "../zustand/useCartStore";
// import { shallow } from "zustand/shallow";

// TODO:
// good loader and skeleton

const Home = () => {
  const { data, isError, isLoading } = useGetLatestProd();
  const cartStore = useCartStore();
  const cartItems = useCartStore((state) => state.cartItems);

  const cardHandler = (id: number) => {
    console.log("this is product id: ", id);
  };

  const addToCartHandler = (id: number) => {
    const product = data?.data.filter((item) => Number(item.id) == id)[0];

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

  const toatText = () => {
    toast.error("cannot fetch products");
  };

  if (isError) {
    console.log("inside the toast3");
    toatText();
  }

  // useEffect(() => {
  //   console.log("-----------calculate price called-----------");
  //   cartStore.calculatePrice();
  // }, [cartItems, cartStore.calculatePrice]);

  return (
    <div className="custom-container  ">
      <section className="w-full py-6">
        <Carousel className="w-[90%] mx-auto h-52">
          <CarouselContent>
            <CarouselItem className="h-52 bg-green-400 ">
              {/* <FaUser className="w-[100%] h-52 mx-auto bg-green-300" /> */}
              <div className="w-full h-full bg-purple-500">
                <img
                  className="h-full w-full object-cover"
                  src="https://nnbwwoyabieqwquwxlts.supabase.co/storage/v1/object/public/Ecom-assets//camera_poster2.png"
                />
              </div>
            </CarouselItem>

            <CarouselItem className="h-52 bg-green-400 ">
              {/* <FaUser className="w-[100%] h-52 mx-auto bg-green-300" /> */}
              <div className="w-full h-full bg-purple-500">
                <img
                  className="h-full w-full object-cover"
                  src="https://nnbwwoyabieqwquwxlts.supabase.co/storage/v1/object/public/Ecom-assets//laptop_poster.png"
                />
              </div>
            </CarouselItem>

            <CarouselItem className="h-52 bg-green-400 ">
              {/* <FaUser className="w-[100%] h-52 mx-auto bg-green-300" /> */}
              <div className="w-full h-full bg-purple-500">
                <img
                  className="h-full w-full object-cover"
                  src="https://nnbwwoyabieqwquwxlts.supabase.co/storage/v1/object/public/Ecom-assets//mobile_poster1.png"
                />
              </div>
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
                  addToCartHandler={addToCartHandler}
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
