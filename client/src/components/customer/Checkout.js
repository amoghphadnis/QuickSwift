import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = ({ cart, totalPrice }) => {
    const [address, setAddress] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Handle successful payment approval
    const handleApprove = async (orderId) => {
        const token = localStorage.getItem('token');
            
        if (!token) {
          throw new Error('No token found. Please log in.');
            return;
          }
          
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Pass the token in the header
                },
                body: JSON.stringify({
                    query: `
                        mutation CapturePayment($orderId: String!) {
                            capturePayment(orderId: $orderId) {
                                id
                                status
                            }
                        }
                    `,
                    variables: {
                        orderId
                    }
                })
            });

            const result = await response.json();
            if (result.data.capturePayment.status === "COMPLETED") {
                setIsPaid(true);
            } else {
                setError("Payment could not be completed. Please try again.");
            }
        } catch (err) {
            console.error("Error capturing payment:", err);
            setError("An error occurred while capturing payment.");
        }
    };

    // Handle any error during the checkout process
    const handleError = (err) => {
        console.error("PayPal checkout error:", err);
        setError("An error occurred during the payment process. Please try again.");
    };

    // Create an order using GraphQL
    const createOrder = async () => {
        console.log('heloo createOrder...!!')
        const token = localStorage.getItem('token');
            
        if (!token) {
          throw new Error('No token found. Please log in.');
            return;
          }
          
        try {
            const response = await fetch('http://localhost:5000/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Pass the token in the header
                },
                body: JSON.stringify({
                    query: `
                        mutation CreatePaymentIntent($description: String!, $amount: Float!) {
                            createPaymentIntent(description: $description, amount: $amount) {
                                id
                                clientSecret
                            }
                        }
                    `,
                    variables: {
                        description: 'cake',
                        amount: 20.00
                    }
                })
            });

            const result = await response.json();
            return result.data.createPaymentIntent.id;
        } catch (err) {
            console.error("Error creating payment intent:", err);
            setError("An error occurred while creating the order. Please try again.");
        }
    };

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            <div className="cart">
                <div className="cart-item">
                    <h3>Item Name</h3>
                    <span>$Item Price</span>
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
                        "client-id": "AeWUtxTl7UAIu5jiqfYMdE6Q-2l61BvaSQ2YWUI6__ecNT9BrCrcFQ0k7tn2cWr09P0R2Hfd_r0_flfx"
                    }}
                >
                    {loading && <p>Loading payment options...</p>}
                    <PayPalButtons
                        style={{ shape: "pill", layout: "horizontal" }}
                        createOrder={(data, actions) => createOrder()}
                        onApprove={(data, actions) => handleApprove(data.orderID)}
                        onError={handleError}
                    />
                </PayPalScriptProvider>
            )}
        </div>
    );
};

export default Checkout;
