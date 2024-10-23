const { default: mongoose } = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'stripe'], required: true },
    amount: { type: mongoose.Schema.Types.Decimal128, required: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);