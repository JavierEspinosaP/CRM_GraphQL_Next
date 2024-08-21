'use client'

import React, {useReducer} from 'react';

import OrdersContext from './ordersContext';
import OrdersReducer from './ordersReducer';

import {
    SELECT_CLIENT,
    SELECT_PRODUCT,
    PRODUCT_QUANTITY,
    REFRESH_TOTAL
} from '../../types';

const OrderState = ({children}) => {

    //Order state

    const initialState = {
        client: {},
        products: [],
        total: 0
    }

    const [ state, dispatch ] = useReducer(OrdersReducer, initialState)


    //Modify client

    const addClient = (client) => {
        dispatch({
           type: SELECT_CLIENT,
           payload: client
        })
    }

    //Modify Products

    const addProduct = selectedProducts => {

        let newState;

        if (state.products.length > 0) {
            //Get of second array, a copy to assign of the first one
            newState = selectedProducts.map(product => {
                const newObj = state.products.find(productState => productState.id === product.id)
                console.log('NEWOBJ: ',newObj);
                console.log('PRODUCT: ',product);
                
                return {
                    ...product,
                    ...newObj
                }
            })
        } 
        else {
            newState = selectedProducts
        }
        
        dispatch({
            type: SELECT_PRODUCT,
            payload: newState
        });
        
    }

    //Modify quantity

    const productsQuantity = newProduct => {
        console.log('PRODUCTSQUANTITY (NEWPRODUCT): ',newProduct);
        
        
        dispatch({
            type: PRODUCT_QUANTITY,
            payload: newProduct
        })        
    }


    const refreshTotal = () => {
        dispatch({
            type: REFRESH_TOTAL
        })    
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