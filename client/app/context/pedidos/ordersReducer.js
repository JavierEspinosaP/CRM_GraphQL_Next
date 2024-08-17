import {
    SELECT_CLIENT,
    SELECT_PRODUCT,
    PRODUCT_QUANTITY,
    REFRESH_TOTAL
} from '../../types';


export default (state, action) => {
    switch(action.type) {
        case SELECT_CLIENT:
            return {
                ...state,
                client: action.payload
            }
            case SELECT_PRODUCT:
                return {
                    ...state,
                    products: action.payload
                }
            case PRODUCT_QUANTITY:
                return {
                    ...state,
                    products: state.products.map(product => product.id === action.payload.id ? product = action.payload : product)
                }
            case REFRESH_TOTAL:
                return {
                    ...state,
                    total: state.products.reduce((newTotal, product) => newTotal += product.precio * product.quantity, 0)
                }
        default:
            return state
    }
}