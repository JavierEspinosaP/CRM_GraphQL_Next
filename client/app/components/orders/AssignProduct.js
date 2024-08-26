import { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import OrderContext from "@/app/context/pedidos/ordersContext";

// GraphQL query to fetch the products from the database
const OBTENER_PRODUCTOS = gql`
  query getProducts {
    getProducts {
      id
      nombre
      precio
      stock
    }
  }
`;

const AssignProduct = () => {
  // Local state to store selected products
  const [products, setProducts] = useState([]);

  // Access the order context to add the selected products to the order
  const orderContext = useContext(OrderContext);
  const { addProduct } = orderContext;

  // Query to fetch products from the database
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  // Update the context with the selected products whenever they change
  useEffect(() => {
    addProduct(products);
  }, [products]); 

  // Handler to update the selected products state
  const selectProduct = (product) => {
    setProducts(product);
  };

  // Handle loading state, return null if the query is still loading
  if (loading) return null;

  // Destructure the result to get the list of products
  const { getProducts } = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.- Select or search for a product
      </p>
      <Select
        className="mt-3"
        options={getProducts} 
        isMulti={true} 
        onChange={(option) => selectProduct(option)}
        getOptionValue={(options) => options.id} 
        getOptionLabel={(options) =>
          `${options.nombre} - ${options.stock} units available`
        } 
        placeholder="Search or select a product"
        noOptionsMessage={() => "No results found"} 
      />
    </>
  );
};

export default AssignProduct;
