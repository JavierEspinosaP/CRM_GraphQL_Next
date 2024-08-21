import { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import OrderContext from "@/app/context/pedidos/ordersContext";

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
  // State local del componente

  const [products, setProducts] = useState([]);

  // Orders context

  const orderContext = useContext(OrderContext);
  const { addProduct } = orderContext;

  //Query database

  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    addProduct(products);
  }, [products]);

  const selectProduct = (product) => {
    setProducts(product);
  };

  if (loading) return null;

  const { getProducts } = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.- Selecciona o busca un producto
      </p>
      <Select
        className="mt-3"
        options={getProducts}
        isMulti={true}
        onChange={(option) => selectProduct(option)}
        getOptionValue={(options) => options.id}
        getOptionLabel={(options) =>
          `${options.nombre} - ${options.stock} uds available`
        }
        placeholder="Busque o seleccione el producto"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
};

export default AssignProduct;
