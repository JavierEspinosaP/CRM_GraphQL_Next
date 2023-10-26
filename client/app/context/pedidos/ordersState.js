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
        client: [],
        products: [],
        total: 0
    }

    const [ state, dispatch ] = useReducer(OrdersReducer, initialState)

    const helloWorldInUseReducer = () => {
        console.log('hello world');
    }

    return (
        <OrdersContext.Provider value={{ helloWorldInUseReducer }}>
            {children}
        </OrdersContext.Provider>
    );
    
}

export default OrderState;