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
import { safeRedirect } from '../lib/redirect';

const loginSchema = z.object({
    email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (values: LoginValues) => {
        try {
            const user = await login(values);
            toast.success(`Welcome back, ${user.name}!`);
            navigate(safeRedirect(searchParams.get('redirect')), { replace: true });
        } catch (error) {
            applyApiErrors(error, setError, { email: 'email', password: 'password' });
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Enter your email and password to access your account.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <CardContent className="space-y-4">
                            {errors.root?.server && (
                                <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                                    {errors.root.server.message}
                                </p>
                            )}
                            <FormField id="email" label="Email" error={errors.email?.message}>
                                {(control) => (
                                    <Input {...control} type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} />
                                )}
                            </FormField>
                            <FormField id="password" label="Password" error={errors.password?.message}>
                                {(control) => (
                                    <Input {...control} type="password" autoComplete="current-password" {...register('password')} />
                                )}
                            </FormField>
                            <p className="text-xs text-muted-foreground">
                                Demo account: <span className="font-mono">demo@tastify.ge</span> / <span className="font-mono">demo1234</span>
                            </p>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link to={`/register${searchParams.size ? `?${searchParams}` : ''}`} className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
