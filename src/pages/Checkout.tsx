
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Checkout() {
    const { items: cart, totalPrice, removeItem } = useCart();

    return (
        <div className="bg-background-dark text-white font-display antialiased min-h-screen flex flex-col selection:bg-primary selection:text-white">
            <main className="flex-1 py-10 lg:py-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* Form Section */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-10">
                            <div className="space-y-2 border-l-2 border-primary pl-6">
                                <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl">Checkout</h1>
                                <p className="text-text-muted font-light">Complete your details to finalize the delivery.</p>
                            </div>

                            <section aria-labelledby="delivery-heading">
                                <div className="flex items-center gap-3 mb-8 border-b border-surface-border pb-4">
                                    <span className="material-symbols-outlined text-text-muted">local_shipping</span>
                                    <h2 className="text-lg font-medium text-white uppercase tracking-wide" id="delivery-heading">Delivery Address</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs uppercase tracking-wide text-text-muted font-medium" htmlFor="street">Street Address</label>
                                        <div className="relative">
                                            <input className="block w-full rounded border border-surface-border bg-black p-3 text-white placeholder-text-muted/30 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm h-12 transition-all duration-300" id="street" placeholder="e.g. 12 Rustaveli Avenue" type="text" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="block text-xs uppercase tracking-wide text-text-muted font-medium" htmlFor="building">Building / Entrance</label>
                                            <input className="block w-full rounded border border-surface-border bg-black p-3 text-white placeholder-text-muted/30 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm h-12 transition-all duration-300" id="building" placeholder="Bldg 5, Ent 2" type="text" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs uppercase tracking-wide text-text-muted font-medium" htmlFor="apartment">Apartment / Floor</label>
                                            <input className="block w-full rounded border border-surface-border bg-black p-3 text-white placeholder-text-muted/30 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm h-12 transition-all duration-300" id="apartment" placeholder="Apt 42, Floor 7" type="text" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs uppercase tracking-wide text-text-muted font-medium" htmlFor="phone">Mobile Number</label>
                                        <div className="relative rounded shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">+995</span>
                                            </div>
                                            <input className="block w-full rounded border border-surface-border bg-black p-3 pl-14 text-white placeholder-text-muted/30 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm h-12 transition-all duration-300" id="phone" placeholder="555 00 00 00" type="tel" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs uppercase tracking-wide text-text-muted font-medium" htmlFor="notes">Delivery Instructions (Optional)</label>
                                        <textarea className="block w-full rounded border border-surface-border bg-black p-3 text-white placeholder-text-muted/30 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all duration-300 resize-none" id="notes" placeholder="Gate code, landmark, etc." rows={3}></textarea>
                                    </div>
                                </div>
                            </section>

                            <section aria-labelledby="payment-heading">
                                <div className="flex items-center gap-3 mb-8 border-b border-surface-border pb-4">
                                    <span className="material-symbols-outlined text-text-muted">credit_card</span>
                                    <h2 className="text-lg font-medium text-white uppercase tracking-wide" id="payment-heading">Payment Method</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <label className="group relative flex cursor-pointer rounded border border-primary bg-black p-5 shadow-sm focus:outline-none ring-1 ring-primary transition-all">
                                        <input defaultChecked className="sr-only" name="payment-method" type="radio" value="card" />
                                        <span className="flex flex-1">
                                            <span className="flex flex-col">
                                                <span className="block text-sm font-medium text-white">Credit / Debit Card</span>
                                                <span className="mt-1 flex items-center text-xs text-text-muted">
                                                    Visa, Mastercard
                                                </span>
                                            </span>
                                        </span>
                                        <span className="material-symbols-outlined text-white">check_circle</span>
                                    </label>
                                    <label className="group relative flex cursor-pointer rounded border border-surface-border bg-black p-5 shadow-sm focus:outline-none hover:border-zinc-600 transition-all">
                                        <input className="sr-only" name="payment-method" type="radio" value="cash" />
                                        <span className="flex flex-1">
                                            <span className="flex flex-col">
                                                <span className="block text-sm font-medium text-white">Cash on Delivery</span>
                                                <span className="mt-1 flex items-center text-xs text-text-muted">
                                                    Pay the courier directly
                                                </span>
                                            </span>
                                        </span>
                                        <span className="material-symbols-outlined text-zinc-600 group-hover:text-zinc-400">radio_button_unchecked</span>
                                    </label>
                                </div>
                            </section>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-5 xl:col-span-4">
                            <div className="sticky top-24 rounded border border-surface-border bg-card-dark p-6 shadow-2xl">
                                <h2 className="text-lg font-medium text-white mb-6 uppercase tracking-wide">Your Order</h2>
                                <div className="flow-root mb-8">
                                    <ul className="-my-6 divide-y divide-surface-border">
                                        {cart.length === 0 ? (
                                            <li className="py-6 text-text-muted text-sm text-center">Your cart is empty. <Link to="/menu" className="text-primary underline">Go to Menu</Link></li>
                                        ) : (
                                            cart.map((item) => (
                                                <li key={item.id} className="flex py-6">
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-surface-border bg-zinc-900">
                                                        <img alt={item.name} className="h-full w-full object-cover object-center opacity-80" src={item.imageUrl} />
                                                    </div>
                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-sm font-medium text-white">
                                                                <h3><a className="hover:text-gray-300 transition-colors" href="#">{item.name}</a></h3>
                                                                <p className="ml-4 tabular-nums">{item.price} ₾</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between text-xs">
                                                            <p className="text-text-muted">Qty {item.quantity}</p>
                                                            <button type="button" onClick={() => removeItem(item.id)} className="font-medium text-text-muted hover:text-white transition-colors">Remove</button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                                <div className="border-t border-surface-border py-6 space-y-4">
                                    <div className="flex justify-between text-sm text-text-muted">
                                        <p>Subtotal</p>
                                        <p className="tabular-nums">{totalPrice.toFixed(2)} ₾</p>
                                    </div>
                                    <div className="flex justify-between text-sm text-text-muted">
                                        <p>Delivery</p>
                                        <p>Free</p>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-surface-border pt-4">
                                        <p className="text-base text-white font-medium">Total</p>
                                        <p className="text-xl font-bold text-white tabular-nums">{totalPrice.toFixed(2)} ₾</p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <button className="w-full flex items-center justify-center rounded border border-transparent bg-primary px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black transition-all transform active:scale-[0.99]" type="submit">
                                        <span>Place Order</span>
                                        <span className="mx-2 opacity-50">•</span>
                                        <span>{totalPrice.toFixed(2)} ₾</span>
                                    </button>
                                    <p className="mt-4 text-center text-[10px] text-text-muted uppercase tracking-widest flex items-center justify-center gap-1 opacity-70">
                                        <span className="material-symbols-outlined text-[14px]">lock</span>
                                        Secure encrypted payment
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
