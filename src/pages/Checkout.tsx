import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../features/auth/useAuth";
import { useCart } from "../features/cart/useCart";
import { useMenuCategories } from "../features/menu/hooks";
import { useAddresses, useCreateAddress } from "../features/account/hooks";
import { useCreateOrder } from "../features/orders/hooks";
import {
    CHECKOUT_FIELD_MAP,
    NEW_ADDRESS,
    createCheckoutSchema,
    toAddressRequest,
    toOrderRequest,
    type CheckoutInput,
    type CheckoutValues,
} from "../features/checkout/checkout-schema";
import { reconcileCart } from "../features/checkout/reconcile";
import { CheckoutSection } from "../features/checkout/components/CheckoutSection";
import { DeliveryDetailsFields } from "../features/checkout/components/DeliveryDetailsFields";
import { DeliveryTimeFields } from "../features/checkout/components/DeliveryTimeFields";
import { PaymentMethodFields } from "../features/checkout/components/PaymentMethodFields";
import { OrderSummary } from "../features/checkout/components/OrderSummary";
import { applyApiErrors } from "../lib/forms";

export default function Checkout() {
    const { user } = useAuth();
    const { lines, clearCart, removeLine } = useCart();
    const navigate = useNavigate();
    const menu = useMenuCategories();
    const addresses = useAddresses();
    const createAddress = useCreateAddress();
    const createOrder = useCreateOrder();
    const submittingRef = useRef(false);

    const schema = useMemo(() => createCheckoutSchema(), []);
    const form = useForm<CheckoutInput, unknown, CheckoutValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            addressChoice: "",
            street: "",
            building: "",
            apartment: "",
            city: "Batumi",
            phone: user?.phone?.replace(/^\+995/, "") ?? "",
            instructions: "",
            timing: "INSTANT",
            scheduledFor: "",
            paymentMethod: "CASH",
        },
    });
    const { setValue, getValues } = form;

    // Preselect the default saved address, or the new-address form when there are none
    useEffect(() => {
        if (!addresses.data || getValues("addressChoice")) return;
        const preferred = addresses.data.find((a) => a.isDefault) ?? addresses.data[0];
        setValue("addressChoice", preferred?.id ?? NEW_ADDRESS);
    }, [addresses.data, getValues, setValue]);
    // Can't load saved addresses: fall back to entering one
    useEffect(() => {
        if (addresses.isError && !getValues("addressChoice")) setValue("addressChoice", NEW_ADDRESS);
    }, [addresses.isError, getValues, setValue]);

    const reconciled = useMemo(() => (menu.data ? reconcileCart(lines, menu.data) : null), [lines, menu.data]);
    const canSubmit = !!reconciled && reconciled.available.length > 0 && reconciled.unavailable.length === 0;

    const onSubmit = async (values: CheckoutValues) => {
        // Guard against a second submit while the first is in flight (e.g. double click, Enter + click)
        if (submittingRef.current || !reconciled || !canSubmit) return;
        submittingRef.current = true;
        try {
            let addressId = values.addressChoice;
            if (addressId === NEW_ADDRESS) {
                const address = await createAddress.mutateAsync(toAddressRequest(values, (addresses.data?.length ?? 0) === 0));
                addressId = address.id;
                // If the order request fails, a retry reuses this address instead of saving a duplicate
                setValue("addressChoice", address.id);
            }

            const order = await createOrder.mutateAsync(toOrderRequest(values, addressId, reconciled.available));
            clearCart();
            toast.success("Order placed! The kitchen has it.");
            navigate(`/orders`, { replace: true, state: { placedOrderId: order.id } });
        } catch (error) {
            applyApiErrors(error, form.setError, CHECKOUT_FIELD_MAP);
        } finally {
            submittingRef.current = false;
        }
    };

    const removeUnavailable = () => reconciled?.unavailable.forEach((line) => removeLine(line.key));

    return (
        <div className="bg-background-dark text-white font-display antialiased min-h-screen flex flex-col selection:bg-primary selection:text-white">
            <main className="flex-1 py-10 lg:py-14">
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        {/* Form Section */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-10">
                            <div className="space-y-2 border-l-2 border-primary pl-6">
                                <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl">Checkout</h1>
                                <p className="text-text-muted font-light">Complete your details to finalize the delivery.</p>
                            </div>

                            <CheckoutSection id="delivery-heading" icon="local_shipping" title="Delivery Details">
                                <DeliveryDetailsFields form={form} addresses={addresses.data} addressesLoading={addresses.isPending && !addresses.isError} />
                            </CheckoutSection>

                            <CheckoutSection id="time-heading" icon="schedule" title="Delivery Time">
                                <DeliveryTimeFields form={form} />
                            </CheckoutSection>

                            <CheckoutSection id="payment-heading" icon="credit_card" title="Payment Method">
                                <PaymentMethodFields form={form} />
                            </CheckoutSection>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-5 xl:col-span-4">
                            <OrderSummary
                                lines={lines}
                                reconciled={reconciled}
                                onRemove={removeLine}
                                onRemoveUnavailable={removeUnavailable}
                                rootError={form.formState.errors.root?.server?.message}
                                isSubmitting={form.formState.isSubmitting}
                                canSubmit={canSubmit}
                            />
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
