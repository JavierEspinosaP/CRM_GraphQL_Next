'use client'

import React, {useReducer} from 'react';

import OrdersContext from './ordersContext';
import OrdersReducer from './ordersReducer';

import {
    SELECT_CLIENT,
    SELECT_PRODUCT,
    PRODUCT_QUANTITY
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

    const addProduct = products => {
        dispatch({
            type: SELECT_PRODUCT,
            payload: products
        });
        
    }

    return (
        <OrdersContext.Provider value={{
            addClient,
            addProduct
            }}>
            {children}
        </OrdersContext.Provider>
    );
    
}

export default OrderState;