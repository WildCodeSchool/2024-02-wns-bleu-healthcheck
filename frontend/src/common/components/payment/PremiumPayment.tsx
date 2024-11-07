import {useState, FormEvent, useEffect} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements, useStripe, useElements, PaymentElement} from "@stripe/react-stripe-js";
import { useMutation } from "@apollo/client";
import {ADD_PREMIUM_ROLE, CREATE_PAYMENT_INTENT} from "@/common/graphql/queries.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import useAuth from "@/common/hooks/useAuth.tsx";
import {CircularProgress} from "@mui/material";
import Button from "@mui/material/Button";
import "./PremiumPayment.scss"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripePaymentForm: React.FC<{clientSecret: string}> = ({clientSecret}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);

    const [addPremiumRole] = useMutation(ADD_PREMIUM_ROLE, {
        fetchPolicy: 'no-cache',
        onCompleted: async () => {
            toast.success("Vous êtes désormais membre premium !");
            refetch();
            navigate("/dashboard");
        }
    });

    const navigate = useNavigate();
    const { refetch } = useAuth();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: "pm_card_visa",
        });

        if (error) {
            setError(error.message || "An error occurred");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            setError(null);
            await addPremiumRole();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Abonnement Premium</h1>
            <PaymentElement />
            <div className="payment__confirm_button">
                <Button type="submit" disabled={!stripe} variant="contained" color="secondary">
                    S'abonner
                </Button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

const PremiumPayment: React.FC = () => {

    const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
    const [clientSecret, setClientSecret] = useState<string|null>(null);

    useEffect(() => {
        createPaymentIntent({variables: {amount: 1000}})
            .then((response) => {
                setClientSecret(response.data.createPaymentIntent.clientSecret);
            })
            .catch((error) => {
                console.error("Failed to initialize payment:", error);
            });
    }, [createPaymentIntent]);

    return(
        <div className="payment__modal">
            {clientSecret ?
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm clientSecret={clientSecret} />
                </Elements>
                :
                <div className="payment__loading">
                    <CircularProgress />
                </div>
            }
        </div>
    )};

export default PremiumPayment;
