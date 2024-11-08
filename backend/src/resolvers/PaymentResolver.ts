import Stripe from "stripe";
import { Arg, Mutation, Resolver } from "type-graphql";
import {PaymentIntentResponse} from "../types/PaymentIntentResponse";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

@Resolver()
class PaymentResolver {

    @Mutation(() => PaymentIntentResponse)
    async createPaymentIntent(
        @Arg("amount") amount:number,
    ):Promise <PaymentIntentResponse> {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount, // The amount in the smallest currency unit, e.g., cents for USD
                currency: 'eur',
                payment_method_types: ['card'],
            });
            return { clientSecret: paymentIntent.client_secret || "" };
        } catch (error) {
            throw new Error(error.message || "Failed to create payment intent");
        }
    }
}

export default PaymentResolver;
