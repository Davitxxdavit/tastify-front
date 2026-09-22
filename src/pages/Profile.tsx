import { motion } from 'framer-motion';
import { MapPin, User as UserIcon } from 'lucide-react';
import { useProfile } from '../features/account/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';

export default function Profile() {
    const { data: profile, isPending, isError, error, refetch, isRefetching } = useProfile();

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Your account and saved delivery addresses</p>
            </motion.div>

            {isPending ? (
                <Skeleton className="h-72 w-full rounded-lg" />
            ) : isError ? (
                <ErrorState title="Couldn't load your profile" error={error} onRetry={() => refetch()} isRetrying={isRefetching} />
            ) : (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserIcon className="h-8 w-8 text-primary-bright" aria-hidden />
                            </div>
                            <div>
                                <CardTitle>{profile.name}</CardTitle>
                                <CardDescription>{profile.email}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm text-muted-foreground">Name</dt>
                                <dd className="font-medium">{profile.name}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Email</dt>
                                <dd className="font-medium">{profile.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Phone</dt>
                                <dd className="font-medium">{profile.phone || 'Not set'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">Member since</dt>
                                <dd className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</dd>
                            </div>
                        </dl>

                        <section aria-labelledby="addresses-heading">
                            <h2 id="addresses-heading" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                                Saved addresses
                            </h2>
                            {profile.addresses.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No saved addresses yet. Addresses you use at checkout are saved here.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {profile.addresses.map((address) => (
                                        <li key={address.id} className="flex items-start gap-3 rounded border border-surface-border p-3">
                                            <MapPin className="h-4 w-4 mt-0.5 text-primary-bright" aria-hidden />
                                            <div className="text-sm">
                                                <p className="font-medium">{address.street}</p>
                                                <p className="text-muted-foreground">
                                                    {address.city}, {address.country}
                                                </p>
                                            </div>
                                            {address.isDefault && (
                                                <span className="ml-auto text-[10px] uppercase tracking-wider text-primary-bright">Default</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
