import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FormField } from '../../../components/ui/FormField';
import { toDateTimeLocal } from '../../../lib/format';
import { MAX_SCHEDULE_DAYS, MIN_SCHEDULE_LEAD_MINUTES, type CheckoutInput, type CheckoutValues } from '../checkout-schema';
import { inputClass, labelClass, optionCardClass } from './styles';

interface DeliveryTimeFieldsProps {
    form: UseFormReturn<CheckoutInput, unknown, CheckoutValues>;
}

export function DeliveryTimeFields({ form }: DeliveryTimeFieldsProps) {
    const {
        register,
        watch,
        formState: { errors },
    } = form;
    const timing = watch('timing');
    // Bounds for the picker; the schema re-checks against the time of submit
    const [now] = useState(() => Date.now());

    return (
        <div className="space-y-6">
            <fieldset>
                <legend className="sr-only">When should we deliver?</legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className={optionCardClass}>
                        <input type="radio" value="INSTANT" className="sr-only" {...register('timing')} />
                        <span className="flex flex-col">
                            <span className="text-sm font-medium text-white">As soon as possible</span>
                            <span className="mt-1 text-xs text-text-muted">Usually 30–45 minutes</span>
                        </span>
                    </label>
                    <label className={optionCardClass}>
                        <input type="radio" value="SCHEDULED" className="sr-only" {...register('timing')} />
                        <span className="flex flex-col">
                            <span className="text-sm font-medium text-white">Schedule for later</span>
                            <span className="mt-1 text-xs text-text-muted">Up to {MAX_SCHEDULE_DAYS} days ahead</span>
                        </span>
                    </label>
                </div>
            </fieldset>

            {timing === 'SCHEDULED' && (
                <FormField
                    id="scheduledFor"
                    label="Delivery date and time"
                    labelClassName={labelClass}
                    hint={`At least ${MIN_SCHEDULE_LEAD_MINUTES} minutes from now.`}
                    error={errors.scheduledFor?.message}
                >
                    {(control) => (
                        <input
                            {...control}
                            type="datetime-local"
                            min={toDateTimeLocal(new Date(now + MIN_SCHEDULE_LEAD_MINUTES * 60_000))}
                            max={toDateTimeLocal(new Date(now + MAX_SCHEDULE_DAYS * 24 * 60 * 60_000))}
                            className={`${inputClass} [color-scheme:dark]`}
                            {...register('scheduledFor')}
                        />
                    )}
                </FormField>
            )}
        </div>
    );
}
