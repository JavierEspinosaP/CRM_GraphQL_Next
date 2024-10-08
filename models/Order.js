const mongoose = require('mongoose');

const OrdersSchema = mongoose.Schema({
    pedido: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cliente'
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario'
    },
    estado: {
        type: String,
        default: "PENDING"
    },
    creado: {
        type: Date,
        default: Date.now()
    }

    });


module.exports = mongoose.model('Pedido', OrdersSchema);