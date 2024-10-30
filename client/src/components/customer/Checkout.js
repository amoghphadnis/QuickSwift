import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = ({ cart, totalPrice }) => {
    const [address, setAddress] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleApprove = (orderId) => {
        // Update order status on the server, mark as paid
        setIsPaid(true);
    };

    const handleError = (err) => {
        console.error("PayPal checkout error:", err);
        setError("An error occurred during the payment process. Please try again.");
    };

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            <div className="cart">
                <div className="cart-item">
                    <h3>itemname</h3>
                    <span>$itemprice</span>
                </div>
            </div>
            <input
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            
            {isPaid ? (
                <h3>Payment Successful! Your order is being processed.</h3>
            ) : error ? (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            ) : (
                <PayPalScriptProvider
                    options={{
                        "client-id": "AdlzNpRDeAbLXy2DesLwU5G7TvIZJVAuXUQdIhqOzjMK7RsFgYTj3Fq7Ega5XhOYv3jw6Lwa3eFdrZxr"
                    }}
                >
                    {loading && <p>Loading payment options...</p>}
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => {
                            setLoading(false);
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value: totalPrice
                                    }
                                }]
                            }).catch(err => handleError(err));
                        }}
                        onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                                handleApprove(details.id);
                            }).catch(err => handleError(err));
                        }}
                        onError={(err) => handleError(err)}
                    />
                </PayPalScriptProvider>
            )}
        </div>
    );
};

export default Checkout;
