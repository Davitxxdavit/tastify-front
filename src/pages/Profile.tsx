import { useEffect, useState } from 'react';
import { userService, type UserProfile } from '../services/user.service';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { toast } from 'react-hot-toast';
import { Loader2, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone || '',
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
            toast.error('Could not load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updated = await userService.updateProfile(formData);
            setProfile(updated);
            setEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile', error);
            toast.error('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-muted-foreground">Could not load profile</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Manage your account information</p>
            </motion.div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle>{profile.firstName} {profile.lastName}</CardTitle>
                            <CardDescription>{profile.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {editing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name</label>
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name</label>
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">Save Changes</Button>
                                <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium">{profile.firstName} {profile.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{profile.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-medium">{profile.phone || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Role</p>
                                <p className="font-medium capitalize">{profile.role.toLowerCase()}</p>
                            </div>
                            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
