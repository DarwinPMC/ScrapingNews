import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ selectedPlan, closePaymentModal }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
        } else {
            alert(`Pago realizado con éxito para el plan: ${selectedPlan.nombre}`);
            closePaymentModal();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button
                type="submit"
                disabled={!stripe}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
            >
                Pagar ${selectedPlan.precio}
            </button>
        </form>
    );
};

export default CheckoutForm;
