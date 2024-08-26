'use client'

import React, { useReducer } from 'react';

import OrdersContext from './ordersContext';
import OrdersReducer from './ordersReducer';

import {
    SELECT_CLIENT,
    SELECT_PRODUCT,
    PRODUCT_QUANTITY,
    REFRESH_TOTAL
} from '../../types';

const OrderState = ({ children }) => {

    // Initial state for orders
    const initialState = {
        client: {},     // Selected client
        products: [],   // Selected products
        total: 0        // Total price of the order
    }

    // useReducer hook to manage the state using OrdersReducer
    const [state, dispatch] = useReducer(OrdersReducer, initialState);

    // Function to add or select a client
    const addClient = (client) => {
        dispatch({
            type: SELECT_CLIENT,
            payload: client
        });
    }

    // Function to add or select products
    const addProduct = (selectedProducts) => {
        let newState;

        if (state.products.length > 0) {
            // Merge the selected products with the existing ones in the state
            newState = selectedProducts.map(product => {
                const existingProduct = state.products.find(productState => productState.id === product.id);
                console.log('Existing Product: ', existingProduct);
                console.log('New Product: ', product);

                return {
                    ...product,
                    ...existingProduct // Preserve the existing state for matching products
                };
            });
        } else {
            newState = selectedProducts; // If no products exist in state, use the selected products directly
        }

        dispatch({
            type: SELECT_PRODUCT,
            payload: newState
        });
    }

    // Function to update the quantity of a specific product
    const productsQuantity = (newProduct) => {
        console.log('Updated Product Quantity: ', newProduct);

        dispatch({
            type: PRODUCT_QUANTITY,
            payload: newProduct
        });
    }

    // Function to recalculate the total price of the order
    const refreshTotal = () => {
        dispatch({
            type: REFRESH_TOTAL
        });
    }

    return (
        <OrdersContext.Provider value={{
            products: state.products,
            total: state.total,
            client: state.client,
            addClient,
            addProduct,
            productsQuantity,
            refreshTotal
        }}>
            {children}
        </OrdersContext.Provider>
    );

}

export default OrderState;
