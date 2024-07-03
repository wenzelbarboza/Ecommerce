import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { FaShoppingBag } from "react-icons/fa";

type props = {
  id: number;
  name: string;
  price: number;
  photo: string;
  stock: number;
  handler: () => void;
};

const ProductCard = ({ handler, id, name, photo, price, stock }: props) => {
  console.log(photo);
  return (
    <div className="flex justify-center ">
      <Card
        className="cursor-pointer"
        onClick={() => console.log("clicked the card")}
      >
        <CardHeader>
          {/* <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription> */}
          <AspectRatio ratio={1 / 1}>
            <img src={photo} alt="Image" className="rounded-md object-cover" />
          </AspectRatio>
        </CardHeader>
        <CardContent>
          <p>this is details about product</p>
        </CardContent>
        <CardContent>
          <Button className="w-full">
            add to cart <FaShoppingBag className="ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;
