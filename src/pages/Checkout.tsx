import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { userService, type Address } from '../services/user.service';
import { ordersService } from '../services/orders.service';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { toast } from 'react-hot-toast';
import { Loader2, MapPin, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkout() {
    const { items, totalPrice, clearCart } = useCart();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (items.length === 0) {
            toast.error('Your cart is empty');
            navigate('/menu');
            return;
        }
        fetchAddresses();
    }, [items, navigate]);

    const fetchAddresses = async () => {
        try {
            const data = await userService.getAddresses();
            setAddresses(data);
            const defaultAddress = data.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress.id);
            }
        } catch (error) {
            console.error('Failed to fetch addresses', error);
            toast.error('Could not load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        try {
            setSubmitting(true);
            const orderData = {
                items: items.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                deliveryAddressId: selectedAddress,
                notes: notes || undefined,
            };

            await ordersService.createOrder(orderData);
            toast.success('Order placed successfully!');
            clearCart();
            navigate('/orders');
        } catch (error) {
            console.error('Failed to place order', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold">Checkout</h1>
                <p className="text-muted-foreground">Review your order and complete checkout</p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Order Summary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Delivery Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Address</CardTitle>
                            <CardDescription>Select where you want your order delivered</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {addresses.length === 0 ? (
                                <div className="text-center py-8">
                                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground mb-4">No addresses saved</p>
                                    <Button variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Address
                                    </Button>
                                </div>
                            ) : (
                                addresses.map(address => (
                                    <div
                                        key={address.id}
                                        onClick={() => setSelectedAddress(address.id)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedAddress === address.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 h-4 w-4 rounded-full border-2 ${selectedAddress === address.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                                                }`} />
                                            <div className="flex-1">
                                                <p className="font-medium">{address.street}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {address.city}, {address.state} {address.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Notes</CardTitle>
                            <CardDescription>Any special instructions?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input
                                placeholder="e.g., Extra napkins, ring doorbell..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary Sidebar */}
                <div>
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t pt-4">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handlePlaceOrder}
                                disabled={submitting || !selectedAddress}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
