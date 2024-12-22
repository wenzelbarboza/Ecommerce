import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useUserStore } from "../../../zustand/userStore";
import {
  useDeleteProductMutation,
  useGetProductDetails,
  useUpdateProductMutation,
} from "../../../api/product.api";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CardSkeletonLoader } from "../../../components/CardSkeletonLoader";
import toast, { Toaster } from "react-hot-toast";

const Productmanagement = () => {
  const { id: productId } = useParams();

  const user = useUserStore((state) => state.user);
  const {
    data,
    isError: isDataError,
    isLoading,
  } = useGetProductDetails({
    id: productId as string,
  });
  const updateProductMutation = useUpdateProductMutation();
  const deleteProductMutation = useDeleteProductMutation();

  const navigate = useNavigate();

  const updateTimeOutRef: React.MutableRefObject<null | NodeJS.Timeout> =
    useRef(null);
  const deleteTimeOutRef: React.MutableRefObject<null | NodeJS.Timeout> =
    useRef(null);

  const { price, stock, name, photo, category } = data?.data || {
    price: 0,
    stock: 0,
    name: "",
    photo: "",
    category: "",
  };

  console.log("fetched data: ", data);

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);
  const [photoFile, setPhotoFile] = useState<File>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData();

    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate) formData.set("stock", stockUpdate.toString());
    if (photoFile) formData.set("photo", photoFile);
    if (categoryUpdate) formData.set("category", categoryUpdate);

    try {
      const res = await updateProductMutation.mutateAsync({
        userId: user?.id as string,
        productId: productId as string,
        formData,
      });
      toast.success(`Product ${res.data.id} updated successfully`);

      updateTimeOutRef.current = setTimeout(() => {
        navigate("/admin/product");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("error in updating form");
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteProductMutation.mutateAsync({
        userId: user?.id as string,
        productId: productId as string,
      });

      console.log("deleted product: ", res.data);
      toast.success(`deleted product ${res.data.id} successfully`);

      deleteTimeOutRef.current = setTimeout(() => {
        navigate("/admin/product");
      }, 1000);
    } catch (error) {
      console.error("error while deleting product");
    }
  };

  useEffect(() => {
    if (data) {
      const { category, name, photo, price, stock } = data.data;
      setCategoryUpdate(category);
      setNameUpdate(name);
      setPhotoUpdate(photo);
      setPriceUpdate(price);
      setStockUpdate(stock);
    }
  }, [data]);

  // Handle update timeout cleanUp on component unmount
  useEffect(() => {
    return () => {
      if (updateTimeOutRef.current) {
        console.log("component cleaned up");
        clearTimeout(updateTimeOutRef.current);
      }
    };
  }, []);

  // Handle delete timeout cleanUp on component unmount
  useEffect(() => {
    return () => {
      if (deleteTimeOutRef.current) {
        console.log("component cleaned up");
        clearTimeout(deleteTimeOutRef.current);
      }
    };
  }, []);

  // TODO make this error beautiful
  if (isDataError) return <Navigate to="/404" />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <CardSkeletonLoader />
        ) : (
          <>
            <section>
              <strong>ID - {productId}</strong>
              <img src={photo} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button
                onClick={() => deleteHandler()}
                className="product-delete-btn"
              >
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>

                {photoUpdate && (
                  <img
                    src={`${
                      import.meta.env.VITE_SERVER_BASE_URL
                    }/${photoUpdate}`}
                    alt="New Image"
                  />
                )}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default Productmanagement;
