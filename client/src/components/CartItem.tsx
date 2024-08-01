import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";

type Item = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

type CartItemType = {
  item: Item;
  incrementHandler: (item: Item) => void;
  decrementHandler: (item: Item) => void;
  deletehandler: (item: Item) => void;
};
const CartItem = ({
  decrementHandler,
  deletehandler,
  incrementHandler,
  item,
}: CartItemType) => {
  const { name, photo, price, productId, quantity } = item;

  return (
    <div className="flex items-center px-4 ">
      <div className="flex items-center">
        <div className="w-24">
          <img
            className="max-h-full max-w-full"
            src={`${import.meta.env.VITE_SERVER_BASE_URL}/${photo}`}
            alt={name}
          />
        </div>
        <article className="text-sm flex flex-col ml-1">
          <Link to={`/product/${productId}`}>{name}</Link>
          <span>₹{price}</span>
        </article>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex gap-2 items-center">
          <Button onClick={() => decrementHandler(item)} className="max-h-7">
            -
          </Button>
          <p className="">{quantity}</p>
          <Button onClick={() => incrementHandler(item)} className="max-h-7">
            +
          </Button>
        </div>

        <button
          className={buttonVariants({
            variant: "outline",
            className: "max-h-7",
          })}
          onClick={() => deletehandler(item)}
        >
          <FaTrash className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
