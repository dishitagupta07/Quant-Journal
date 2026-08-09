const mongoose = require("mongoose");


const tradeSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    stockName: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: ["BUY", "SELL"],
        required: true,
    },

    entryPrice: {
        type: Number,
        required: true,
    },
    stopLoss: {
    type: Number,
    required: true
},

    exitPrice: {
        type: Number,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    strategy: {
        type: String,
        default: "",
    },
    
    holdingTime: {
    type: String,
    enum: ["<30m", "30m-1h", "1h-2h", "2h-4h", "4h+"],
    default: "<30m",
},

    tradeDate: {
        type: Date,
        required: true,
    },

    profitLoss: {
        type: Number,
        default: 0,
    },
    rr: {
    type: Number,
    default: 0
},

},
{
    timestamps:true,
}
);


module.exports = mongoose.model("Trade", tradeSchema);