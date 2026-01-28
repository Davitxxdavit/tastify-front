import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="bg-background-dark min-h-screen">
            {/* Header / Hero Section */}
            <header className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-background-dark">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/80 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
                    <div className="w-full h-full bg-cover bg-center object-cover opacity-60" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvsB-VgLulTCz9WYuA-65M01vmbuOJqPbuiBy26MlhOFAUIoRyJLf1ip6gxS8kSU40YL_nv4SoYIA5swoDdh9Dwtpb1pOYj--lGA5DLTBSkR1-TNtutG82BwrLxoEcj2PmJ8_zQ5o9NFQGupW8gBwD9LztpJKQtNaGMvQfOdO8Nu7erLrO3-lM-ZZbXe-NsIrN3hVIWOSgOHTS3RtLLVs9PHJ97lU5iHPIaPMehWU1Usr1rmabgZuxa_-NadadOSNG0Q1QSFH745-w")' }}></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-6 md:gap-8 max-w-2xl">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-12 bg-primary"></div>
                            <span className="text-gray-300 text-sm font-bold tracking-widest uppercase">Premium Delivery Service</span>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight font-georgian">
                                <span className="block">ნამდვილი</span>
                                <span className="text-gray-300">ქართული</span>
                                <span className="block italic font-serif-display font-medium text-4xl md:text-6xl pt-2 text-primary">gemo (taste)</span>
                            </h1>
                        </div>
                        <p className="text-accent-text text-lg md:text-xl font-light max-w-lg leading-relaxed border-l-2 border-primary/50 pl-6">
                            Experience the art of Georgian cuisine delivered to your doorstep in Batumi. Crafted with passion, served with elegance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <Link to="/menu" className="h-14 px-8 rounded-lg bg-primary text-white font-bold text-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(0,66,37,0.4)]">
                                <span>Order Delivery</span>
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                            <Link to="/menu" className="h-14 px-8 rounded-lg border border-white/20 text-white font-medium text-lg hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center backdrop-blur-sm">
                                View Menu
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-end items-end relative">
                        <div className="bg-surface-dark/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-xs text-center shadow-2xl animate-fade-in-up">
                            <div className="flex justify-center mb-4 text-primary">
                                <span className="material-symbols-outlined text-4xl">verified</span>
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">Chef's Special</h3>
                            <p className="text-gray-400 text-sm mb-4">Adjaruli Khachapuri with organic farm cheese and free-range egg.</p>
                            <div className="text-2xl font-serif-display text-white italic">24.00 ₾</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Collections Section */}
            <section className="py-16 bg-background-dark relative border-b border-surface-border">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 font-serif-display">Our Collections</h2>
                            <p className="text-gray-400">Curated dishes for every palate</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="size-10 rounded-full border border-surface-border flex items-center justify-center text-white hover:bg-surface-dark transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <button className="size-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { title: "From the Oven", subtitle: "Khachapuri & Breads", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcuu2qKOvudI9SbyoeW49zMBrFO7FGtffqpsN68XBJegyfNfeoV5JFaf1Y07GBHbx3teNTa0_2g37MYSGUl9JegtmjKgJ3tP_zHhuI04iEqy4FIRKoLoKUoc1QQ1KYyWCYMi9VjuijlDT4tHqrpLKO44H6KWNbMiNipABoIRX2Sda8WYY9HA6IfYDe8K57TkrLkHOHgkTnmPSj9A36ywekEH7wwvZg6wnw_MSjVEZltRP1LT7qIao3X5eYore1V1xecW2d36hfv8WW" },
                            { title: "Cold Starters", subtitle: "Pkhali & Cheeses", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAha0pHngaYQ-ZLR_so_DACguv8q4RD5a37gCbcz1nP6tb56Gi6al93hZgKQQxNKiAcnHbRUlDORsSbgSEVv-taHduxr7ulrDyBF87TxnuNHTcGfFJRHvEZsrGzjZqZOp9qk2hjn8zobn8xl-K6kPUuzP3kug6TwwCcerk_sLHtZlK1HhsAhlS8W4W7aEhf9REhAsW-wuM42E8nhq6rmRIpN9C00YzQ6Ro_YxXqQRIy4PVED7_19MWW0XtiQ4OlbgV4wZ4Ug06x_wXI" },
                            { title: "Main Courses", subtitle: "Mtsvadi & Stews", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoDIK9qf96pARzdh8ROaCHBxy9NB4ySEPZ5Zka8xCQqibAcyfhEUN0Q8NdKzOtLLS6-wczg1sgVNKrVg7IbzSK93usV-tT9NL7Qtuo6D1xierrjGLwIn5mVdQ6_Ls5pOmYBE09KC_P3fovabljTBGJjtaoSFRxIGniExs3bqdadP7tDoRoVmjl3HdYK3vHvu9q5DT_fpNBb_TDMyhSJ65SApyCUvZXzG8KPlqqN4P2vicnw4ZGd2v06zB0n-Hv0n4_y94tWS9yIy86" },
                            { title: "Khinkali", subtitle: "Hand-twisted dumplings", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEA81k1EVktW_LQBzcZ5531CKEgSYabMUPfp_AwmpOQDZzl3S7XmbJub7FbmXsPGA-vVc9sb2DZrg-gPwsOmYSJrjYbxyZGI4LYsJZAnamfxuiZ7k5pEXBC-qZVU9HhK8rxlkZm6XkKu2zbC4Mik0XPT1uXnQeqvRUzCcyr2zuSG9US-XIBqYS8hwHj7386D-iVIQr-FEoZIjAw8rgPXr7tEJnrsYxCvms5Cv42rMVHcH1kKAv6hq3a17H6Yv4oIzQ6yJpPn2K--1c" },
                            { title: "Wine Cellar", subtitle: "Qvevri Wines", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxSUIdA2lovkUZt2YYPK_nt5w8MTJqnfQKSeXdYYJOdA0OSinYyJgyvKHgMrfZ-KKGV9joRuPKJBUsjdKD43x56UMV4R9yMH3InciyrAUPv2AOxvfUZREHKfF6Rs-77OnmRL9GOa6ifqYzGXxOb2YyEdfmmiwi-oIKPiRSzxPI2THwZuOy9j4baraGn9jVCM8tvOJFaFNjyUPwD3JIY00RUikJKYeVd0MqOwVwAUyrqq1vl6CrKIgEx6qzq7O4qLDJ5IoCX1CYDig9" },
                        ].map((item, index) => (
                            <Link key={index} to="/menu" className="group block">
                                <div className="aspect-[4/5] rounded-xl overflow-hidden relative mb-4 border border-surface-border">
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors z-10"></div>
                                    <div className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url("${item.img}")` }}></div>
                                </div>
                                <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-gray-500 text-sm">{item.subtitle}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular This Week */}
            <section className="py-20 bg-background-dark">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-primary text-sm font-bold tracking-widest uppercase block mb-3">Chef's Recommendations</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-serif-display">Popular This Week</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Khinkali Kalakuri", price: "1.80 ₾", desc: "Traditional Georgian dumplings with minced meat and herbs.", rating: 4.9, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeP7Z8-eIAPBnh-BQylDc8gitcWJSL7YI3VSeFtxRUSG97wIVPDr3z3ht1w8cxr2LogCdBekCEXffgKzamEs3mvXjnEtF2GLaG0TjSGRwPg7UmB0bWo4yWPxN25rDATFIz4COLGHIzq3s4lsT7XOgOr-rJUIGB0ZQMJzODmvHh0hSzkR50I1D5db3yxfNlefbLiN6lKG52Lsun5XltbQ5AKROXOppuvDvys5KdXDfzQ8c5g6ha7f9kivwDWBY-3Y41Bm-fm3Z5grTq" },
                            { name: "Adjaruli Khachapuri", price: "18.00 ₾", desc: "Boat-shaped bread with cheese, butter and egg yolk.", rating: 4.8, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7Bq1Fh5gX7APxtYYEIF3KFXwppxwyOfUlkj1R_hSBt6yKD9IA0WHjhnDWe_gn7pqPzgmlGwvds9L_qGFzX1GT07ljYTtSVm_tqv9V0LXtHD5wL1sb5twxPkTkBf7eFWdt-pmNd_-5ICRkvvHsqnM4lv2dptc_7b1-qemlJedaP946kFU5T2A6ghRT-C9gG3IdnDz1Lwc-PfUlqPukVINl0bEcZvmnp9Fq-XLcQXU9XpX69MS-2kho1fJHiMSQICxD40-ERe7_UWhB" },
                            { name: "Pkhali Assortment", price: "22.00 ₾", desc: "Spinach, beet and eggplant appetizers with walnut paste.", rating: 4.7, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuATuWAOTdxmAhYW-YAJyPsMLskdPP9idNSERrLaGrLbLOihxVpjbrTuFIpuD3RDiVGN1lUuRMc9s8_NEhRDzVKoFCAqMoBlB_KRDIY9mO5eIzD-6lRUx9VTXYOK9q50JPXx_H8fAwvuOZ-3zxz7U5u5GBbLHxkYjDF3sPlxr1juhq84TaTy7pX6-q6Xn3gq0x7WfMhry1C5s13VQy8FOyo32QryPMWv6tQ8ooaoThZxDou0nvf-Gdjd_EArJpMcl7wmG9zWM8HN5ttH" },
                            { name: "Pork Mtsvadi", price: "28.00 ₾", desc: "Juicy pork skewers marinated in white wine and onions.", rating: 5.0, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpSC48IEO05wZ-kUhHz4oZLeAIge_B6Z87_IxERNjB6mPLKoZQOzt5-CU3YvU3yNewuHaeyruU7WH38WF3IXvLutiQCQGviDvRMXTo2sFwrc67Jj-TitxSPbuK1ojkWz7xKqx8yBw4rWdPFRNaak76nHcoIzjOhe8he48MMj8vHRHwWRmC_F4vjBNJ2gOUpAnPrVXsxMYo1jm6Y3r0dbrJbkVAlqdEEN7j3-Nu7r8uiwLKdp1sDbalEEzxNgisbQSMJ_xCYdBO0cN2" },
                        ].map((item, index) => (
                            <div key={index} className="bg-surface-dark rounded-2xl p-4 group hover:-translate-y-1 transition-transform duration-300 border border-surface-border hover:border-primary/40">
                                <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white z-10 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px] text-yellow-400">star</span> {item.rating}
                                    </div>
                                    <div className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${item.img}")` }}></div>
                                    <button className="absolute bottom-3 right-3 size-10 bg-white text-surface-dark rounded-full flex items-center justify-center translate-y-14 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:bg-primary hover:text-white">
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-white font-bold text-lg">{item.name}</h3>
                                    <span className="text-primary font-bold">{item.price}</span>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <Link to="/menu" className="px-8 py-3 rounded-lg border border-primary text-primary font-bold hover:bg-primary/10 transition-colors inline-block">
                            View Full Menu
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
