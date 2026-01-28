import { useState } from "react";
import { useCart } from "../context/CartContext";
import { clsx } from "clsx";

// Dummy data based on HTML
const categories = [
    { id: "appetizers", label: "Appetizers" },
    { id: "mains", label: "Mains" },
    { id: "pastry", label: "Pastry & Dough" },
    { id: "desserts", label: "Desserts" },
];

const menuItems = {
    appetizers: [
        {
            id: "101",
            name: "Badrijani Nigvzit",
            price: 12.0,
            description:
                "Fried eggplant rolls delicately stuffed with spiced walnut paste, garlic, and garnished with fresh pomegranate seeds.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCxnk073R7r-RWm2E2Npqa63zFXvI3zuX2-lZ5qgnl0J3tzOmARgNM7txIfD6F3q4fbYe_NxGX18CPo6nf2a32Bd-Bg1ZgUkJEoJ7ITa3dtqpqSOWHVRNzrPec6WH4bEnpRB3DkJ9Djg9B1BLPf0wW2AnIs4xAKTgGCZtn8jwx8GNj9fCPJ_Vlu0BpyzHZHFzEpCr2p87hzdbql9q3X2AYc9k2fg1FWbUKkWCibRHNDnvpKOHaQhwvRpDlpOOPYykio9o-QWmepjjt3",
            isAvailable: true,
        },
        {
            id: "102",
            name: "Assorted Pkhali",
            price: 14.0,
            description:
                "A traditional platter of minced vegetables (spinach, beet, beans) mixed with walnut paste and Georgian spices.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAIeHGdyT3e4RaFbGHU62gxjL5uVxbAQQQP5FeeXVNYQ4zx72a-mfrS6sIq-V5GiDizQV2XMh4CekmRn5T-ptK1j9l0xc7D64tPY44C-xFpZr4eRTjzDb6qX9Ljty7Oc092rVFjU7PqUDHWz1bezGUxAuMOO10o79d2cBMWwfYrCb0KDU9T7y-Db5YSh-6AqPDFn-N31TQ_FJq6vUPpl3cvohbR5le2VJPEuyjcMGmAQBSPEgQT1ukBsz9VNfhkmqoqRl2N2RrRMyuR",
            isAvailable: true,
        },
        {
            id: "103",
            name: "Georgian Salad",
            price: 10.0,
            description:
                "Fresh tomatoes and cucumbers tossed with purple basil, onions, and a rich walnut dressing.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD5zplqNiQlOAVqc82hpe03Y5CLYSQFgJGpjcmI5iCQUNErs753TS-_CECxVltiSNcKIbporX2URoBUd7HMF5_0fU1rKI4xKOpl0b1IXbidHRpmUXSJSUMdYwR_yhA8-NUKqZFu-5HCpL7fhFPDrLvxFtdUhDCD1NSUrClAGHGLmoCnZ-9_aBLcmZqIJrdue2YId1g0xJwAy-hH_dFIAaAWKCvSQ_QHqD4BYNkwfMPprMwv5WJJkxU9a4kYDWiB_P923HdHhpCSDeZF",
            isAvailable: true,
        },
    ],
    mains: [
        {
            id: "201",
            name: "Kalakuri Khinkali (5pcs)",
            price: 15.0,
            description:
                "Iconic Georgian dumplings filled with spiced minced meat (beef & pork), fresh herbs, and savory broth.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA-2p-XYx9quscKv5p7rHfBfr0cAsW2ZYaSgCmBe4yEh34iznzEwIoo-XDeqyU3i42fjXka5kr1fUAdLJ-1rrhFztX5VEp4tXFPg_Lj_td0dZxB3zT9kNUkPmeiDGG9j8BRox3Ky-7fsgd7HdXwer32kJDVz-ea5n_q7MP9IGtS3JHh1jMPh4UHDuA_W_KnrmlpCCd6hNEWTjWyQYKMYxz6Kk202g0gINQfoQj1YOoTp836knA08KoyDAw4uuOHu4Ajx0WE2D2vcXUY",
            isAvailable: true,
        },
        {
            id: "202",
            name: "Shkmeruli",
            price: 22.0,
            description:
                "Roasted chicken fried in a traditional clay pan, smothered in a rich and creamy garlic sauce.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDwDgNjaJ2yT4E8xBAGm7vbo6eOEgkceJK0dK9qm1q8jyI1OkeMZaNXTQWVHDVR4iGANPCb9k9xsG3vVQmsgJAQYL1CfRTwZnZOhObiWl899OMcXzqYnjr1Tf53-dXoddXDMNodK0INl51hPdWJL2MEZS_HH6NhFB8sCO-hwNBKWhO1NXvFkXAAS9tobe60byX78X5q_pr1HPKejv0frWQBfl95mPGRk3WJAZ0F0s1NHfENKnYQCkzGlrafIfSHNBnMccmpCTz1A8Yh",
            isAvailable: true,
        },
        {
            id: "203",
            name: "Ostri",
            price: 18.0,
            description:
                "A spicy, hot beef stew cooked with tomato sauce, pickles, coriander, and garlic.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBP3VF1QtTqUx1957kL40l1WP3LHaR8OGjTbBlLNFL2LJqSl8rsXPiHqjGf2AD3_40V5o7U-_1dNCY-CPizUnR4KaaUqBwJqtN8x9MOvB8bZyHMTbvJE0l81sXgv551KgRzK6c0hOAr9wb3ruZtxr2WTIu1dLApnaFO7vjAuNJjCs_wWAl0wCahBHywyQZZBas-lv2NYlKj5sJb98z15i3gEx-2DoBTxxBMTDQttOIRk8XD0-ev90PAm_ksxzBcHHiREu083-4L5bYi",
            isAvailable: true,
        },
        {
            id: "204",
            name: "Pork Mtsvadi",
            price: 19.0,
            description:
                "Traditional Georgian pork skewers grilled over vine wood coals, served with tkemali sauce and onions.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBZMMoEeGZXkoNbxaWW5975l_NTAx0xXWp_b0BfD32TiZqmRGtS-x7C5HePi3Ha66dY2i9N5xKL6UguTbbHhU9B3G7uj_3CSM8p0ZuzKNlc2Ggk_JUi8lOQr4riwv60HTiza3NWjXBCX_unjJBXlKt8Qaa3TWpG-qc1mWXDwQx5rg7ZMgZwNTrGMchxrKXF6D3D0NbtyvcyeDX5au4xFJQiUPHYtlvdbkq5FWi4VyjhKKq_jqeKBstWEa4N6Rsw3lK1eIr4BUjHLMVS",
            isAvailable: true,
        },
    ],
    pastry: [
        {
            id: "301",
            name: "Adjarian Khachapuri",
            price: 18.0,
            description:
                "Traditional boat-shaped dough topped with sulguni cheese, butter, and a runny organic egg.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA8Ql4yjA8xhjcWEpf3aJ5vzVpCj9S9ZXFCw7AnFxweyBf7l0rDA717g9ggHD2AS2LHSFQ3Mca1q3BBSe-q1UaabVNbL7AS98sWd5aLSjOp5JfFBxZBUmx6tE6wnJmZ1VdoiW7QrG_3Enx8HG7TOZwPmknbygYU4XHCUF2UXjh4s_zRUNJbL7RthEtuvemftgKQYkX9e38zLtZTJI0kGwqcBJOH6EasrDUwlWoGTRJBC1xyImoDibXnCSDpTq5yrp-m6bCmXiCWlYRU",
            isAvailable: true,
        },
        {
            id: "302",
            name: "Imeruli Khachapuri",
            price: 16.0,
            description:
                "A classic round Georgian cheese bread, soft, fluffy, and filled with melted Imeretian cheese.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA_lCzOWuQ8yGOHYK_Q_dIGEEzsAPBvM5l3n6NbgSfVwuzsCPzsJnGz7BiWF2jGdYAl4R1EC1sTxrFVqL0QGUpnZ6l-GnqS4yvmDKwAjJblb41djW9Zl2Ra_gnZVlWP7eIcl2lF5jqAlMnXF8xcyF5lnUK4a5rwchVGYqM1O8wOBz_e4pQlm9hnWQ16Nc497YTexnVW8iodMYkLcgBt20fI1QoEXxW8K3nGdJabWmfRnqfnk5IprzuHYMyL-Yw3QVjcVO5nuKiJnKtq",
            isAvailable: true,
        },
        {
            id: "303",
            name: "Lobiani",
            price: 14.0,
            description:
                "Flavorful bread filled with mashed kidney beans, onions, and spices, baked in a clay oven.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDTlBZkhE4-qtdf-EAWuC8gtU7jHr0csLmEjrc1etRKPYkZecmJnpHPqbopYBv7fc--h7x6RM2jWZWi1zt7-OebFIQHciBbe8EGz24rgzFtYUaT0B2MWoPdp6ZspWeiGqzs_hBNrNWULjV8LGILtUfWK_bgWK1mUT2xw0dnEipfeWJjbQyy4PFzoiLkyVvYoCuFNyDRBYUtkAn_yaI24N4umf4VQY9U2yq906wC-v9u8HroiVjpP0QF2Exze-fhIxzaxzaJExsBOuvW",
            isAvailable: true,
        },
    ],
    desserts: [
        {
            id: "401",
            name: "Churchkhela",
            price: 8.0,
            description:
                "Traditional candle-shaped candy. Walnuts are threaded onto a string, dipped in thickened grape juice, and dried.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuABxQR3OK21sklu_a2lVBpv6D3UAT6V3HzQCSWpvg6D-9ClVMnJG_7_8FVi-FMi6znIq1ScMMavhR0AUQ_Wm_TkqHFZYI0d119LpxnuQZgYzTBVd-d2wkz1_8mjkIPZ2wUaNQsdUrD49b6FYsT0bpekc4zqbgDz2uPN2CdACLdQN3Coxotye1DmI02_29PMUg8iR7KCN2NNq-Jy1FOvEYr1_WJicc2XjuNUjjiTfZ1Mq6Q6S9VIw-ufdvyuZKVPTsi4BmoaoZoIaOTb",
            isAvailable: true,
        },
        {
            id: "402",
            name: "Honey Cake (Medovik)",
            price: 10.0,
            description:
                "Layers of honey-infused sponge cake with a light sour cream frosting and walnut crumbs.",
            imageUrl:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuC-ZtJW2lq83RHefpdQDUN3ZXXY-4UlnYnIxDfjRRWu1v9jByKpnWMdIqdZBdNXmbSDmfdujuBKI0P8xCHSFmIYKN5XMruOrGvIGRGKPwrB-6IQSK2z2z9PxIRjzQQxrXDhLdD3H2ukOsjAuPAVMr-JC_bdHpDyseCI9UJVxICu0hdzK0-DSDyI7yZyZsmtTWpwaJvkglyaXuyIIYQSurSy1f2mCh47o8AdPx5AKstTOXlnsUV4ZhLY4e6UDR3ic4xTON7jmJD48Rs6",
            isAvailable: true,
        },
    ],
};

export default function Menu() {
    const { addItem, totalItems, totalPrice, openCart } = useCart();
    const [activeCategory, setActiveCategory] = useState("appetizers");

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveCategory(id);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-display">
            {/* Hero Section */}
            <div
                className="relative w-full h-[400px] flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom, rgba(5, 5, 5, 0.5), rgba(5, 5, 5, 1)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBoF3I5haA2AYsuKmqDUn-FhgsSESKQpFE1JIGj0T9VheNGkeiaLY5_NXoGD5TtzINoUOaMAQ37XAUN99Ptuef9U3aplyT2nrXfwHOx0t1NEgkuytZj0N2lYqt3IyKTNg1Lp0mOpbVP7BLqhv58Mj1ZkDnbPbNgxvBu271t9orE3i-0IJ8xF7kvR57LJnXQ6fSrN4DCxIBK27H2Ts1i797v_-ItIMSVGeLAcqdHDoWng6GXJKppL6wxROgDU57YZ6RxpLoIzz5kKt-4')",
                }}
            >
                <div className="text-center z-10 px-4 max-w-2xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                        Authentic Georgian Cuisine
                    </span>
                    <h1 className="text-white font-serif text-5xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-xl">
                        Taste of Batumi
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light opacity-90 max-w-lg mx-auto leading-relaxed">
                        Experience the rich heritage of Georgian flavors, crafted with
                        passion and premium ingredients.
                    </p>
                </div>
            </div>

            {/* Sticky Categories */}
            <div className="sticky top-16 z-40 bg-background-dark/95 backdrop-blur-xl border-b border-primary/20 shadow-sm">
                <div className="layout-content-container flex flex-col max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40">
                    <div className="flex overflow-x-auto no-scrollbar gap-8 md:gap-12 py-0">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => scrollToSection(cat.id)}
                                className={clsx(
                                    "group flex flex-col items-center justify-center border-b-2 pb-3 pt-4 min-w-fit px-2 transition-all",
                                    activeCategory === cat.id
                                        ? "border-primary text-white"
                                        : "border-transparent hover:border-primary/50 text-gray-500 hover:text-white"
                                )}
                            >
                                <p
                                    className={clsx(
                                        "text-sm md:text-base font-bold leading-normal tracking-wide uppercase",
                                        activeCategory === cat.id ? "text-primary" : "text-gray-500"
                                    )}
                                >
                                    {cat.label}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full bg-background-dark">
                <div className="layout-content-container max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-10 flex flex-col gap-16">
                    {categories.map((cat) => (
                        <section
                            key={cat.id}
                            id={cat.id}
                            className="scroll-mt-32"
                        >
                            <div className="flex items-end justify-between mb-8 border-b border-primary/20 pb-4">
                                <div>
                                    <h2 className="text-white font-serif text-3xl font-bold tracking-tight mb-1">
                                        {cat.label}
                                    </h2>
                                    <p className="text-gray-400 text-sm font-medium">
                                        {cat.id === "appetizers" && "Start your journey"}
                                        {cat.id === "mains" && "Hearty Traditions"}
                                        {cat.id === "pastry" && "Fresh from the oven"}
                                        {cat.id === "desserts" && "Sweet endings"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {menuItems[cat.id as keyof typeof menuItems].map((item) => (
                                    <div key={item.id} className="@container group">
                                        <div className="flex flex-col sm:flex-row h-full items-stretch justify-start rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
                                            <div
                                                className="w-full sm:w-48 bg-center bg-no-repeat bg-cover min-h-[200px] sm:min-h-full"
                                                style={{ backgroundImage: `url('${item.imageUrl}')` }}
                                            ></div>
                                            <div className="flex w-full grow flex-col justify-between p-5 gap-4">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-white font-serif text-xl font-bold leading-tight">
                                                            {item.name}
                                                        </h3>
                                                        <span className="text-primary font-bold whitespace-nowrap">
                                                            $ {item.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm font-normal leading-relaxed line-clamp-3">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-end pt-2">
                                                    <button
                                                        onClick={() => addItem({
                                                            id: item.id,
                                                            name: item.name,
                                                            price: item.price,
                                                            description: item.description,
                                                            imageUrl: item.imageUrl,
                                                            isAvailable: true,
                                                        })}
                                                        className="flex items-center gap-2 px-4 py-2 rounded border border-primary/30 bg-primary/10 hover:bg-primary hover:border-primary hover:text-black text-primary text-xs uppercase tracking-wider font-bold transition-all duration-300 group/btn"
                                                    >
                                                        <span className="truncate">Add to Cart</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
                <div className="h-20"></div>
            </main>

            {/* Floating Cart Button */}
            {totalItems > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={openCart}
                        className="flex items-center gap-4 bg-primary hover:bg-primary-hover text-background-dark rounded-full px-6 py-4 shadow-[0_4px_20px_rgba(17,212,115,0.3)] transition-all hover:scale-105 active:scale-95 group"
                    >
                        <div className="flex flex-col items-start text-white">
                            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                                Total ({totalItems} items)
                            </span>
                            <span className="text-lg font-black">
                                $ {totalPrice.toFixed(2)}
                            </span>
                        </div>
                        <div className="h-8 w-[1px] bg-white/20"></div>
                        <div className="flex items-center gap-2 font-bold text-white">
                            <span>View Order</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                arrow_forward
                            </span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
