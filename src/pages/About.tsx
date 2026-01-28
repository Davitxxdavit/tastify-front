

export default function About() {
    return (
        <div className="min-h-screen bg-background-dark text-white font-display selection:bg-primary selection:text-white">
            {/* Header handled by Layout/Navbar, but design has specific header styling or implies it might be transparent. 
          We'll rely on the main Navbar for consistency, or we can override if needed. 
          The design shows a distinct header in code.html but we should probably strive for consistency.
          However, the user said "Change everything" to match design. 
          The provided design has a simple Navbar. Our global Navbar is more complex (with cart).
          I will stick to the Global Navbar but ensure it looks good over the black background.
      */}

            {/* Hero Section */}
            <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10"></div>
                    <div
                        className="h-full w-full bg-cover bg-center bg-no-repeat opacity-40 scale-105"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0HKVFuyq90k0MWqqiTAAcVtYFihC15rAc97oQyxF4Od4BRPnQuZ0tJOIqIAFtDewK6Psaxiu3BNqBBOcjY9aLfgy0e4yBU1jMDfMkscTrQA4lqm5dhlrR2zSDVvQlp3Sq62GbYLK6ro_UR3FqidBLrCC8RechVqcdUwMAdw1BAdQP2sCRvMgirXaIBjOcSMMsUoTe7aNzGVRn-mcjHWw5i7K9rpSyIKPG_3t7n0pPhTJbKwZAPhzuIWNGIJWHotJk2fViwHCGAwlX")',
                        }}
                    ></div>
                </div>
                <div className="relative z-20 mx-auto flex max-w-[1000px] flex-col items-center px-6 text-center lg:px-8">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="h-[1px] w-12 bg-primary"></div>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
                            Established 2024
                        </span>
                        <div className="h-[1px] w-12 bg-primary"></div>
                    </div>
                    <h1 className="font-serif text-6xl font-medium leading-[1.1] text-off-white sm:text-8xl lg:text-9xl tracking-tight text-balance text-[#F2F0E9]">
                        Heritage & <br />{" "}
                        <span className="italic text-white/80 font-normal">Innovation</span>
                    </h1>
                    <p className="mt-12 max-w-2xl text-lg font-light leading-relaxed text-gray-400 lg:text-xl font-serif italic">
                        Redefining Georgian cuisine in the heart of Batumi. <br />
                        Where old-world Adjarian recipes meet modern gastronomy.
                    </p>
                    <div className="mt-16 animate-bounce text-white/30">
                        <span className="material-symbols-outlined !text-4xl">
                            keyboard_arrow_down
                        </span>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="relative bg-black py-32 lg:py-40">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                    <div className="grid gap-20 lg:grid-cols-12 lg:gap-32 items-center">
                        <div className="lg:col-span-5 flex flex-col gap-10">
                            <div className="border-l-2 border-primary pl-6">
                                <h2 className="font-serif text-5xl leading-none text-[#F2F0E9] lg:text-6xl">
                                    The Philosophy <br /> of{" "}
                                    <span className="italic text-gray-500">Flavor</span>
                                </h2>
                            </div>
                            <div className="flex flex-col gap-8 text-gray-300 font-light leading-loose text-lg">
                                <p>
                                    We believe that a kitchen is more than a place of preparation; it
                                    is a gallery where ingredients are the medium and the plate is
                                    the canvas. Our mission is to honor the deep roots of Georgian
                                    culinary tradition while daring to explore new textures and
                                    presentations.
                                </p>
                                <p>
                                    Located on the Black Sea coast, Batumi offers us a unique
                                    palette of flavors—from the salty breeze influencing our herbs
                                    to the rich soil of the Adjarian mountains nurturing our vines.
                                    Every dish tells a story of this land.
                                </p>
                            </div>
                            <div className="flex gap-16 mt-8 pt-8 border-t border-white/10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-4xl font-serif text-[#F2F0E9]">100%</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                                        Local Sourcing
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-4xl font-serif text-[#F2F0E9]">24</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                                        Signature Dishes
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="relative lg:col-span-7 h-full min-h-[600px] flex items-center justify-center">
                            <div className="absolute right-0 top-10 w-3/4 h-[90%] border border-primary/30 rounded-full opacity-50"></div>
                            <div className="relative z-10 w-3/5 aspect-[3/4] overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-700 shadow-2xl shadow-black">
                                <div
                                    className="h-full w-full bg-cover bg-center"
                                    style={{
                                        backgroundImage:
                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfpO9OFkSYxeURXh2t-ie5FnxQiEzjItCaQ1gzJOyRz12qXHPfJqJ6hROnHf7UkEvAdNKO1oH2Xvn3dajX25Vk4sdEHfucdGP_OqtAXj2PhbXQoAg984CIIUEh4-7ECC8MdgWu4HrDkeiYS6QvUGU9fFekIUhkZcHh5U4qzuP97f_NxGw-GsLf0SrK_-b1PZfqwAUduzDHTsagKW7u5XGsL3XZ2fqDMiPa_pz3nkwuA2WyKEGz0HiT-UCYew0xUp3nJ1ZoZCADayJQ")',
                                    }}
                                ></div>
                            </div>
                            <div className="absolute left-10 bottom-20 w-1/3 aspect-square overflow-hidden shadow-2xl border border-primary/20 z-20">
                                <div
                                    className="h-full w-full bg-cover bg-center"
                                    style={{
                                        backgroundImage:
                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZDNEBz9a6wtKukhVWAGaPvkDtVxCQbExdHVULI3I-ke7sQx2ShkMyXV--ypHWvK_jc01dRGbInn4STjtvXpzkSEyjn5DWP4pJHHX5KvwiIAViImN-cyZNgW7lZS3nZHXeFOsSSfktkhYs5w_NjtD1-vHXQU5MSCoFoc1wt90wM_BBivJfTjLTF3AoSbhFfgAl0zu5ANMHRXlE9ltzCGj1MDxQwRnk3pzT3Vs_c_iwqF1JNDbwVTS9e94odlDaGTp53nchDcVXEWjW")',
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sourcing Section */}
            <section className="relative w-full py-32 bg-[#020202]">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                    <div className="mb-24 flex flex-col md:flex-row items-end justify-between border-b border-white/10 pb-8 gap-6">
                        <h3 className="font-serif text-4xl text-[#F2F0E9] md:text-6xl max-w-xl leading-tight">
                            From Mountains <br />
                            <span className="italic text-gray-600">to the Sea</span>
                        </h3>
                        <span className="mb-2 text-primary text-xs font-bold uppercase tracking-[0.2em]">
                            Sourcing Excellence
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-px bg-white/5 md:grid-cols-3 border border-white/5">
                        <div className="group relative bg-black p-12 transition hover:bg-[#080808]">
                            <div className="mb-8 text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined !text-5xl font-thin">
                                    eco
                                </span>
                            </div>
                            <h4 className="mb-4 font-serif text-2xl text-white">
                                Local Farmers
                            </h4>
                            <p className="text-sm font-light leading-relaxed text-gray-500">
                                We work directly with small-scale farmers in the Adjarian
                                highlands to source organic vegetables and dairy.
                            </p>
                        </div>
                        <div className="group relative bg-black p-12 transition hover:bg-[#080808]">
                            <div className="mb-8 text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined !text-5xl font-thin">
                                    set_meal
                                </span>
                            </div>
                            <h4 className="mb-4 font-serif text-2xl text-white">
                                Black Sea Catch
                            </h4>
                            <p className="text-sm font-light leading-relaxed text-gray-500">
                                Our seafood is delivered fresh daily from the Batumi port,
                                ensuring the authentic taste of the coast.
                            </p>
                        </div>
                        <div className="group relative bg-black p-12 transition hover:bg-[#080808]">
                            <div className="mb-8 text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined !text-5xl font-thin">
                                    wine_bar
                                </span>
                            </div>
                            <h4 className="mb-4 font-serif text-2xl text-white">
                                Ancient Vineyards
                            </h4>
                            <p className="text-sm font-light leading-relaxed text-gray-500">
                                Our wine list is curated from the oldest Qvevri wine cellars,
                                preserving 8,000 years of history.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chef Section */}
            <section className="bg-black py-32 lg:py-40 border-t border-white/5">
                <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">
                        <div className="w-full lg:w-5/12 order-2 lg:order-1">
                            <div className="relative w-full">
                                <div className="absolute -inset-4 border border-primary/30 z-0"></div>
                                <div className="relative z-10 aspect-[3/4] w-full mx-auto overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                                    <div
                                        className="h-full w-full bg-cover bg-center"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGnTIjg9zR6sfFkBNqaVaDlZOcH2z5qRBTqhoikezXzq2xQYbP5LztBEcb1yxHIC9M3G-oZLkPgrMw--DYzx3gE0bNmgn0n8bc4obqJg_w1t7ZUSioN-loaezOsh7nyssZS9Q8HqKBd5WRtC8i7p_VU8EaU_Wk-Uhv0o7GMJxRjWiSSirTfp7YwHMn7N1wgLDZaQLEyoiIpTFMDXBHjEeVAw-0iCCc7Gg00Afdh9PCVoXer4Ig2KKc7THe2Ka0gZfhAQ_cUntzSlEo")',
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="mt-8 text-center lg:text-left">
                                <h3 className="text-3xl font-serif text-[#F2F0E9]">
                                    Giorgi Beridze
                                </h3>
                                <p className="text-primary text-sm uppercase tracking-widest mt-2">
                                    Executive Chef
                                </p>
                            </div>
                        </div>
                        <div className="w-full lg:w-7/12 flex flex-col gap-10 order-1 lg:order-2">
                            <span className="material-symbols-outlined text-6xl text-white/10">
                                format_quote
                            </span>
                            <h3 className="font-serif text-3xl leading-snug text-[#F2F0E9] lg:text-5xl lg:leading-tight">
                                "Cooking is the art of balancing memory and imagination. We cook
                                what we remember, but we serve what we dream."
                            </h3>
                            <div className="h-px w-20 bg-primary"></div>
                            <p className="text-gray-400 font-light leading-loose text-lg">
                                Chef Giorgi brings over 15 years of experience from
                                Michelin-starred kitchens across Europe back to his hometown of
                                Batumi. His vision is to elevate the humble Khinkali and Adjaruli
                                Khachapuri into refined dining experiences without losing their
                                soul.
                            </p>
                            <div className="mt-4">
                                <img
                                    alt="Chef Signature"
                                    className="h-16 w-auto invert opacity-50"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaUM7NjxnzqZPomETwZII_-lj1phmt9I68Sbj26zmReX4h8ZKS8bL37gdPb1COP0HMTuclOUgrWrjjgc9kX80DkFNbkeHRygJlt_EOCnAPujDl7Ajs08kEjDmeQrVI1WeQyNkZmZ7vvUzGjic6L1F9e5PHmFYj8WINqxsXB6sHELxKozB69g-q7YuGI0h6WbO3Dv8hUidfZRZ8MANp1Z2FTtA1CJ3nJMjvrVfRxFPikhYCqVCIOEVhLL0oinpTg7WPNWXWIRkQL3Xn"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-20 bg-black">
                <div className="mx-auto max-w-[1600px] px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 auto-rows-[350px]">
                        <div className="md:col-span-2 row-span-2 overflow-hidden relative group">
                            <div
                                className="h-full w-full bg-cover bg-center transition duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuADc3Lq3-WZGcMHi12DqUqggDwXA1v0-GbzHqPiYgxAwVInW-wEEHXXYhSqD12ph0UK6b5_iDeDjjg8SlVEGHCgHrlRBOFOEuvwYoPNepjqgt2ItnTzusDhHwrbESI8OrD0qvHQ3UhzF7I3JCm1JUEaavq5bllxzwEqllGdV1pOdJsWaAbcj01XIjjowc0uM-vvyOlQwwlc1DBz6prjMMWZ9AEVNjFr6UPYl3AYxCiZ6x3DJbfzwFP5h9xWD9NPv8bDZ2xo-SjOtU_u")',
                                }}
                            ></div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                <div className="border border-white/30 p-8 bg-black/40 backdrop-blur-sm">
                                    <span className="text-white font-serif text-3xl italic">
                                        The Ambience
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Gallery items loop */}
                        {[
                            {
                                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUo6HxNrk0lW17DRIUR6sl806KnWt6rYaBWzuUh-voQyX2CIJ2DFTDuOX2IgFTblq4XGBkQPPepRJFmlawo7h1sMYaPrUX4a7MLqwGps_ve7OeS3m9kiTC0iI9j0-bGGJO1OKjvgJughaRi6h8ON5vPkYq9UfRrcZeaIjxHSLVpM6nwhtv4RnXPg_-p2dj2dxEc41reH8Ca-bNvFf4JhOpCX-C-yT9t8SpXN5-twFuhJ6yFSjQzQOy-R64lI1uoHLW9WgbXFENrQnC',
                                alt: 'Khinkali',
                            },
                            {
                                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPFUjaXWEbHEw5LHrpWNcYwgN1YXywgwJZysB3srwuh0uFHF5u17RdbR6EUPRhmN1oj-5yeAH2uhq0v09BIbIXvPyQ5OceU0pyaj6KtXT1lClSTnOVc5aaMd6aZXWDY4_ajR5fhnqH6oXiRgJCyJoKtT-jgLuUy2BE-JFp-hCbG8gm0nHKf0vHn8L60xYWsVLf6lCSYd_oO2vYrN5EkjaTBgEnTLrVl_DGsiup85uzSZxRMastQBwkxkxNgR1YHw0-SUePYcvk2bbE',
                                alt: 'Cocktails',
                            },
                            {
                                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsFofBX3nN5W5ijA6SPPpdBX6S33N5BYNjAhh5cPVqcvAhU3jMdbusa5lzD73IIctWIhzk0dAIQ1SEbFZJM4uFL5Zdg3Ee_7Y246tsUDpFIB4NjShJaX6tVX75_7X79qOYBPqqoONh92m5Nfa5GJOujCRWHRT22q2aWKXcpFW1vzf2OaA5j6YXmqxIfEFfL7L26ON79VoDIbudA-vYLjtc_BpF8wxVOpMfVeRpnEtTkiggAIwXOjzyRXP-OOmHVl8kXUD9AZdWoeNf',
                                alt: 'Khachapuri',
                            },
                            {
                                url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF6hEgZJbAZPWnBSsTMZAAUIkOuWcKcTXQE4kzl464G6bb1UH0968iM_tpUo-XQbUUlMWnuf_PPaRtkjlQSUuhS5KpeGJ86QJLQVzU0S2vz6LU-H5GTuv2U_Dcr41A4MqQhBLc6eEWSNI21CH_xLYuLlQNqbU01ar9w_geLD6wbCvGBlOi2q9ZCpjk1U-QpSTKBwgqH53oGtqs0jInhTbZ76BA5GOQAmN0JZUVGfL7WOesPmjCFzqMFQDHMC00ZC7ja8yfG_yb0dNq',
                                alt: 'Wine',
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="overflow-hidden relative group border border-black"
                            >
                                <div
                                    className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
                                    style={{ backgroundImage: `url("${item.url}")` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-40 bg-black relative overflow-hidden border-t border-white/5">
                <div
                    className="absolute inset-0 opacity-5 grayscale"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQBk42ccCZZt8qJg9wRW7bmGGZh8kPkQdNxuV1C976Sj6pxeSI7CgzSmjUhEbdocX-I7AGHa2uLeN1Iuxrxf_2Km0tY_bwc41UKDZ5aEgVI_mCdz13ewyeGlG0-vwwUvXsoPGFC7HOL-iLSmGqUHOyhkl2yY-NZ4qJl82QGshZRggb1wAZ3RqsC-tC_JeufQi7_e1sAZ4UGXLIJOrk0Y3xD-usGEOaBgg6S7noVbBtWgEANdinyuJZzos8MQv6YiXlh5NlMFA3KXVw")',
                    }}
                ></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-20 w-px bg-gradient-to-b from-primary to-transparent"></div>
                <div className="mx-auto max-w-[900px] px-6 text-center relative z-10">
                    <h2 className="mb-8 font-serif text-5xl text-[#F2F0E9] lg:text-7xl">
                        Taste the Gallery
                    </h2>
                    <p className="mb-12 text-gray-400 text-lg font-light max-w-2xl mx-auto">
                        Experience the finest Georgian cuisine delivered to your doorstep or
                        book a table for an unforgettable evening.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="flex h-14 min-w-[200px] items-center justify-center border border-primary bg-primary/10 px-10 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-primary hover:shadow-[0_0_30px_rgba(0,66,37,0.4)]">
                            View Menu
                        </button>
                        <button className="flex h-14 min-w-[200px] items-center justify-center border border-white/10 bg-transparent px-10 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black">
                            Book a Table
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
