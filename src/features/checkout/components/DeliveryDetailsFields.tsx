import type { UseFormReturn } from 'react-hook-form';
import { FormField } from '../../../components/ui/FormField';
import { Skeleton } from '../../../components/ui/Skeleton';
import type { Address } from '../../account/types';
import { NEW_ADDRESS, type CheckoutInput, type CheckoutValues } from '../checkout-schema';
import { inputClass, labelClass, optionCardClass } from './styles';

interface DeliveryDetailsFieldsProps {
    form: UseFormReturn<CheckoutInput, unknown, CheckoutValues>;
    addresses: Address[] | undefined;
    addressesLoading: boolean;
}

export function DeliveryDetailsFields({ form, addresses, addressesLoading }: DeliveryDetailsFieldsProps) {
    const {
        register,
        watch,
        formState: { errors },
    } = form;
    const addressChoice = watch('addressChoice');
    const hasSaved = (addresses?.length ?? 0) > 0;

    return (
        <div className="space-y-6">
            {addressesLoading ? (
                <Skeleton className="h-20 w-full" />
            ) : (
                hasSaved && (
                    <fieldset aria-describedby={errors.addressChoice ? 'addressChoice-error' : undefined}>
                        <legend className={`${labelClass} mb-3`}>Deliver to</legend>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {addresses!.map((address) => (
                                <label key={address.id} className={optionCardClass}>
                                    <input type="radio" value={address.id} className="sr-only" {...register('addressChoice')} />
                                    <span className="flex flex-col">
                                        <span className="text-sm font-medium text-white">{address.street}</span>
                                        <span className="mt-1 text-xs text-text-muted">
                                            {address.city}
                                            {address.isDefault && ' · Default'}
                                        </span>
                                    </span>
                                </label>
                            ))}
                            <label className={optionCardClass}>
                                <input type="radio" value={NEW_ADDRESS} className="sr-only" {...register('addressChoice')} />
                                <span className="flex items-center gap-2 text-sm font-medium text-white">
                                    <span className="material-symbols-outlined text-base" aria-hidden>
                                        add_location_alt
                                    </span>
                                    Use a new address
                                </span>
                            </label>
                        </div>
                        {errors.addressChoice && (
                            <p id="addressChoice-error" role="alert" className="mt-2 text-xs font-medium text-red-400">
                                {errors.addressChoice.message}
                            </p>
                        )}
                    </fieldset>
                )
            )}

            {!addressesLoading && addressChoice === NEW_ADDRESS && (
                <div className="space-y-6">
                    <FormField id="street" label="Street address" labelClassName={labelClass} error={errors.street?.message}>
                        {(control) => (
                            <input {...control} type="text" autoComplete="street-address" placeholder="e.g. 12 Rustaveli Avenue" className={inputClass} {...register('street')} />
                        )}
                    </FormField>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <FormField id="building" label="Building / Entrance" labelClassName={labelClass} error={errors.building?.message}>
                            {(control) => <input {...control} type="text" placeholder="Bldg 5, Ent 2" className={inputClass} {...register('building')} />}
                        </FormField>
                        <FormField id="apartment" label="Apartment / Floor" labelClassName={labelClass} error={errors.apartment?.message}>
                            {(control) => <input {...control} type="text" placeholder="Apt 42, Floor 7" className={inputClass} {...register('apartment')} />}
                        </FormField>
                        <FormField id="city" label="City" labelClassName={labelClass} error={errors.city?.message}>
                            {(control) => <input {...control} type="text" autoComplete="address-level2" className={inputClass} {...register('city')} />}
                        </FormField>
                    </div>
                    <p className="text-xs text-text-muted">This address will be saved to your profile for next time.</p>
                </div>
            )}

            <FormField
                id="phone"
                label="Mobile number"
                labelClassName={labelClass}
                hint="The courier calls this number on arrival."
                error={errors.phone?.message}
            >
                {(control) => (
                    <div className="relative rounded shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">+995</span>
                        </div>
                        <input
                            {...control}
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel-national"
                            placeholder="555 00 00 00"
                            className={`${inputClass} pl-14`}
                            {...register('phone')}
                        />
                    </div>
                )}
            </FormField>

            <FormField id="instructions" label="Delivery instructions (optional)" labelClassName={labelClass} error={errors.instructions?.message}>
                {(control) => (
                    <textarea
                        {...control}
                        rows={3}
                        placeholder="Gate code, landmark, etc."
                        className={`${inputClass} h-auto resize-none`}
                        {...register('instructions')}
                    />
                )}
            </FormField>
        </div>
    );
}
