import mongoose from 'mongoose';

const roles = ['user', 'admin'];

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    rol: { type: String, enumr: roles, default: "user" },
    provider: String,

}, { timestamps: true });

userSchema.pre('find', function () {
    this.populate('cart.products.productId')
}).pre('findOne', function () {
    this.populate('cart.products.productId')
});

export default mongoose.model('User', userSchema);
