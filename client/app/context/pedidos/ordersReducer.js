import {
    SELECT_CLIENT,
    SELECT_PRODUCT,
    PRODUCT_QUANTITY,
    REFRESH_TOTAL
} from '../../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    switch(action.type) {
        case SELECT_CLIENT:
            return {
                ...state,
                client: action.payload, // Set the selected client in the state
            };
        
        case SELECT_PRODUCT:
            return {
                ...state,
                products: action.payload, // Set the selected products in the state
            };
        
        case PRODUCT_QUANTITY:
            console.log('Updated Products in PRODUCT_QUANTITY case: ', 
                        state.products.map(product => 
                            product.id === action.payload.id 
                                ? product = action.payload // Update the product with the new quantity
                                : product
                        )
            );
            return {
                ...state,
                products: state.products.map(product => 
                    product.id === action.payload.id 
                        ? product = action.payload // Update the product with the new quantity
                        : product
                ),
            };

        case REFRESH_TOTAL:
            return {
                ...state,
                // Calculate the total based on the product prices and quantities
                total: state.products.reduce(
                    (newTotal, product) => newTotal += product.precio * product.quantity, 
                    0
                ),
            };
        
        default:
            return state; // Return the current state if no action matches
    }
};
