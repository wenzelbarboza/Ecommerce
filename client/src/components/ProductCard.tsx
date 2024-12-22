import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { FaShoppingBag } from "react-icons/fa";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

type props = {
  id: number;
  name: string;
  price: number;
  photo: string;
  stock?: number;
  handler: (id: number) => void;
  addToCartHandler: (id: number) => void;
};

const ProductCard = ({
  handler,
  id,
  name,
  photo,
  price,
  stock,
  addToCartHandler,
}: props) => {
  console.log(photo);

  return (
    // <div className="flex justify-center ">
    <div>
      <Card className="cursor-pointer" onClick={() => handler(id)}>
        <CardHeader>
          {/* <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription> */}
          <AspectRatio ratio={1 / 1}>
            <img src={photo} alt="Image" className="rounded-md object-cover" />
          </AspectRatio>
        </CardHeader>
        <CardContent>
          <p>{name}</p>
          <p>₹: {price}</p>
        </CardContent>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => addToCartHandler(id)}
            disabled={stock == 0 ? true : false}
          >
            add to cart <FaShoppingBag className="ml-1" />
          </Button>
          {stock == 0 && (
            <p className="text-red-600 text-sm">product out of stock</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;
