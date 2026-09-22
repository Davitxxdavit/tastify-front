import type { UseFormReturn } from 'react-hook-form';
import type { CheckoutInput, CheckoutValues } from '../checkout-schema';
import { optionCardClass } from './styles';

interface PaymentMethodFieldsProps {
    form: UseFormReturn<CheckoutInput, unknown, CheckoutValues>;
}

/**
 * The backend's Stripe/Adyen endpoints are placeholders, so card payment is
 * shown but disabled. Only cash on delivery can be submitted.
 */
export function PaymentMethodFields({ form }: PaymentMethodFieldsProps) {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <fieldset aria-describedby={errors.paymentMethod ? 'paymentMethod-error' : 'card-coming-soon'}>
            <legend className="sr-only">Payment method</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={optionCardClass}>
                    <input type="radio" value="CASH" className="sr-only" {...register('paymentMethod')} />
                    <span className="flex flex-1 flex-col">
                        <span className="block text-sm font-medium text-white">Cash on Delivery</span>
                        <span className="mt-1 text-xs text-text-muted">Pay the courier directly</span>
                    </span>
                    <span className="material-symbols-outlined text-zinc-600 group-has-[:checked]:text-white" aria-hidden>
                        payments
                    </span>
                </label>
                <label className={`${optionCardClass} cursor-not-allowed opacity-60 hover:border-surface-border`}>
                    <input type="radio" value="CARD" disabled className="sr-only" {...register('paymentMethod')} />
                    <span className="flex flex-1 flex-col">
                        <span className="flex items-center gap-2 text-sm font-medium text-white">
                            Credit / Debit Card
                            <span className="rounded-full border border-gold/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold">
                                Coming soon
                            </span>
                        </span>
                        <span id="card-coming-soon" className="mt-1 text-xs text-text-muted">
                            Card payments coming soon
                        </span>
                    </span>
                    <span className="material-symbols-outlined text-zinc-700" aria-hidden>
                        credit_card
                    </span>
                </label>
            </div>
            {errors.paymentMethod && (
                <p id="paymentMethod-error" role="alert" className="mt-2 text-xs font-medium text-red-400">
                    {errors.paymentMethod.message}
                </p>
            )}
        </fieldset>
    );
}
