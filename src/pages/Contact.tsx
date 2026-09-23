import { Button } from "../components/ui/Button";

export default function Contact() {
    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
            <div className="flex-grow w-full flex flex-col items-center">
                <div className="w-full max-w-[1280px] px-4 sm:px-10 py-10 lg:py-16 flex flex-col gap-12">
                    {/* Header */}
                    <div className="flex flex-col gap-4 max-w-3xl">
                        <span className="text-white/70 font-medium tracking-wider uppercase text-sm">
                            Customer Support
                        </span>
                        <h1 className="text-white font-serif text-5xl md:text-6xl font-medium leading-tight tracking-tight">
                            Get in Touch
                        </h1>
                        <p className="text-text-muted text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                            Experience the finest Georgian flavors in Batumi. We are here to
                            help with reservations, delivery orders, and general inquiries.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        {/* Contact Info & Map */}
                        <div className="lg:col-span-5 flex flex-col gap-8">
                            <div className="grid gap-4">
                                <div className="group flex items-start gap-4 rounded-xl border border-surface-border bg-surface-dark p-5 transition-all hover:border-white/10">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors shadow-md shadow-black/20">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 24 }}
                                        >
                                            call
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-white text-base font-bold">Phone</h3>
                                        <p className="text-text-muted text-sm">
                                            +995 555 12 34 56
                                        </p>
                                        <a
                                            className="text-white/70 text-xs font-medium mt-1 uppercase tracking-wide hover:text-white transition-colors"
                                            href="tel:+995555123456"
                                        >
                                            Call now
                                        </a>
                                    </div>
                                </div>
                                <div className="group flex items-start gap-4 rounded-xl border border-surface-border bg-surface-dark p-5 transition-all hover:border-white/10">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors shadow-md shadow-black/20">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 24 }}
                                        >
                                            mail
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-white text-base font-bold">Email</h3>
                                        <p className="text-text-muted text-sm">
                                            hello@kitchengallery.ge
                                        </p>
                                        <a
                                            className="text-white/70 text-xs font-medium mt-1 uppercase tracking-wide hover:text-white transition-colors"
                                            href="mailto:hello@kitchengallery.ge"
                                        >
                                            Send email
                                        </a>
                                    </div>
                                </div>
                                <div className="group flex items-start gap-4 rounded-xl border border-surface-border bg-surface-dark p-5 transition-all hover:border-white/10">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-colors shadow-md shadow-black/20">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 24 }}
                                        >
                                            location_on
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-white text-base font-bold">Location</h3>
                                        <p className="text-text-muted text-sm">
                                            Rustaveli Ave, Batumi, Georgia
                                        </p>
                                        <a
                                            className="text-white/70 text-xs font-medium mt-1 uppercase tracking-wide hover:text-white transition-colors"
                                            href="#"
                                        >
                                            Get directions
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-surface-border group cursor-pointer">
                                <img
                                    alt="Map location of Kitchen Gallery"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-100 group-hover:scale-105"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDUh6RTMDZ7KO4AHrop9wr-fw1HMpO471GI5aNDVDPqkWdEywAECyZvPSJjPD95dU5EKv3NC579BKaKjgSoKCHi-SsGyW2FWa7JH94jn7LCA-Ff6H_gbe96XVxF16HRgcbtLGVdw-k5DB2E6idy2wC32swT_Buq5Vx85PZqiJ76dZhCP34BR0mXI2AQSJmk_FWdi99uVv_thmO0_YnuVaFOc2Fl9JuKCErtTHioupLMN5rK9jPltVPS8Wao6kec5Qk8hhWtROK9_YI"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 to-transparent flex items-end p-5">
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <span className="material-symbols-outlined text-white">
                                            map
                                        </span>
                                        <span>View on Map</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-2">
                                <a
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-dark border border-surface-border text-white hover:bg-primary hover:text-white transition-all hover:border-primary"
                                    href="#"
                                >
                                    <span className="font-serif font-bold">f</span>
                                </a>
                                <a
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-dark border border-surface-border text-white hover:bg-primary hover:text-white transition-all hover:border-primary"
                                    href="#"
                                >
                                    <span className="font-serif font-bold">ig</span>
                                </a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-surface-dark border border-surface-border rounded-2xl p-6 md:p-8 lg:p-10 shadow-2xl backdrop-blur-sm">
                                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-2xl font-serif font-semibold text-white">
                                            Send a Message
                                        </h2>
                                        <p className="text-text-muted text-sm">
                                            We usually respond within 2 hours during business hours.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col flex-1">
                                            <span className="text-white text-sm font-medium leading-normal pb-2">
                                                Your Name
                                            </span>
                                            <input
                                                className="flex w-full resize-none overflow-hidden rounded-lg text-white placeholder:text-text-muted/30 border border-surface-border bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary/50 h-12 px-4 text-base transition-colors"
                                                placeholder="e.g. Giorgi Beridze"
                                                type="text"
                                            />
                                        </label>
                                        <label className="flex flex-col flex-1">
                                            <span className="text-white text-sm font-medium leading-normal pb-2">
                                                Phone Number
                                            </span>
                                            <input
                                                className="flex w-full resize-none overflow-hidden rounded-lg text-white placeholder:text-text-muted/30 border border-surface-border bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary/50 h-12 px-4 text-base transition-colors"
                                                placeholder="+995 ..."
                                                type="tel"
                                            />
                                        </label>
                                    </div>
                                    <label className="flex flex-col flex-1">
                                        <span className="text-white text-sm font-medium leading-normal pb-2">
                                            Email Address
                                        </span>
                                        <input
                                            className="flex w-full resize-none overflow-hidden rounded-lg text-white placeholder:text-text-muted/30 border border-surface-border bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary/50 h-12 px-4 text-base transition-colors"
                                            placeholder="name@example.com"
                                            type="email"
                                        />
                                    </label>
                                    <label className="flex flex-col flex-1">
                                        <span className="text-white text-sm font-medium leading-normal pb-2">
                                            How can we help?
                                        </span>
                                        <textarea
                                            className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-white placeholder:text-text-muted/30 border border-surface-border bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[160px] p-4 text-base font-normal leading-normal transition-colors"
                                            placeholder="I would like to inquire about a catering order..."
                                        ></textarea>
                                    </label>
                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-surface-border/50">
                                        <p className="text-xs text-text-muted hidden sm:block">
                                            By submitting this form you agree to our{" "}
                                            <a className="underline hover:text-white" href="#">
                                                Privacy Policy
                                            </a>
                                            .
                                        </p>
                                        <Button
                                            className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary text-white text-base font-bold leading-normal tracking-wide hover:bg-primary/90 transition-all shadow-lg shadow-black/40"
                                        >
                                            Send Message
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
