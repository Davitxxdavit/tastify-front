import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormField } from '../components/ui/FormField';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { applyApiErrors } from '../lib/forms';
import { toApiError } from '../lib/http/api-error';
import { georgianMobileSchema } from '../lib/phone';
import { safeRedirect } from '../lib/redirect';

const registerSchema = z
    .object({
        name: z.string().trim().min(2, 'Enter your name'),
        email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email'),
        phone: z.union([z.literal(''), georgianMobileSchema]),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });
type RegisterInput = z.input<typeof registerSchema>;
type RegisterValues = z.output<typeof registerSchema>;

export default function Register() {
    const { register: registerAccount } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput, unknown, RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
    });

    const onSubmit = async ({ name, email, phone, password }: RegisterValues) => {
        try {
            const user = await registerAccount({ name, email, password, ...(phone && { phone }) });
            toast.success(`Welcome to Tastify, ${user.name}!`);
            navigate(safeRedirect(searchParams.get('redirect')), { replace: true });
        } catch (error) {
            const apiError = toApiError(error);
            // Duplicate accounts come back as 409 with a plain message
            if (apiError.status === 409 && /email/i.test(apiError.message)) {
                setError('email', { type: 'server', message: 'An account with this email already exists' }, { shouldFocus: true });
            } else if (apiError.status === 409 && /phone/i.test(apiError.message)) {
                setError('phone', { type: 'server', message: 'An account with this phone number already exists' }, { shouldFocus: true });
            } else {
                applyApiErrors(error, setError, { name: 'name', email: 'email', phone: 'phone', password: 'password' });
            }
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Join Tastify to order Georgian food in Batumi.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <CardContent className="space-y-4">
                            {errors.root?.server && (
                                <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                                    {errors.root.server.message}
                                </p>
                            )}
                            <FormField id="name" label="Full name" error={errors.name?.message}>
                                {(control) => <Input {...control} autoComplete="name" {...register('name')} />}
                            </FormField>
                            <FormField id="email" label="Email" error={errors.email?.message}>
                                {(control) => <Input {...control} type="email" autoComplete="email" {...register('email')} />}
                            </FormField>
                            <FormField id="phone" label="Mobile number (optional)" hint="Georgian mobile, e.g. 555 12 34 56" error={errors.phone?.message}>
                                {(control) => <Input {...control} type="tel" autoComplete="tel" inputMode="tel" {...register('phone')} />}
                            </FormField>
                            <FormField id="password" label="Password" error={errors.password?.message}>
                                {(control) => <Input {...control} type="password" autoComplete="new-password" {...register('password')} />}
                            </FormField>
                            <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
                                {(control) => <Input {...control} type="password" autoComplete="new-password" {...register('confirmPassword')} />}
                            </FormField>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating account...' : 'Create Account'}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link to={`/login${searchParams.size ? `?${searchParams}` : ''}`} className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
