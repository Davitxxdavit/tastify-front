
import { useState } from 'react';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What areas in Batumi do you deliver to?",
            answer: "We proudly deliver to all central districts of Batumi, including Old Boulevard, Rustaveli Avenue, and the Vox area. For outlying areas such as Makhinjauri or Gonio, please contact our concierge directly to arrange a special delivery."
        },
        {
            question: "How long does delivery usually take?",
            answer: "Our standard delivery time is between 45 to 60 minutes. Because our Khachapuri is baked fresh to order in a wood-fired oven, we prioritize quality over speed. During peak dinner hours (7 PM - 9 PM), we recommend ordering in advance."
        },
        {
            question: "Do you offer vegetarian or vegan Khachapuri?",
            answer: "Absolutely. We offer a \"Lobiani\" (bean-filled bread) which is naturally vegan. For vegetarians, our classic Adjaruli Khachapuri is a favorite. We also have a modern vegan adaptation using artisanal cashew cheese upon request."
        },
        {
            question: "Can I customize the spice level of my Khinkali?",
            answer: "Yes, customization is a key part of the Kitchen Gallery experience. When ordering Khinkali, you can select from Mild, Traditional (Medium), or \"Highland\" (Spicy). Just specify your preference in the order notes."
        },
        {
            question: "Can I pay with card upon delivery?",
            answer: "Our couriers carry portable terminals that accept all major credit cards, including Visa, Mastercard, and Amex. You can also pay securely online via Apple Pay or Google Pay during checkout."
        },
        {
            question: "Are your ingredients locally sourced?",
            answer: "We pride ourselves on supporting Georgian agriculture. Our cheese comes from small farms in the Adjara mountains, our flour is milled locally, and our vegetables are sourced fresh daily from the Batumi agrarian market."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white font-display selection:bg-primary-bright selection:text-black">
            <div className="flex-1">
                <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-primary-bright">
                            Everything you need to know about our luxury delivery service in Batumi.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`group rounded-xl bg-surface-dark border border-border-green transition-all duration-300 ${openIndex === index ? 'bg-white/[0.02]' : ''}`}
                            >
                                <h3>
                                    <button
                                        type="button"
                                        id={`faq-question-${index}`}
                                        aria-expanded={openIndex === index}
                                        aria-controls={`faq-answer-${index}`}
                                        className="flex w-full cursor-pointer list-none items-center justify-between gap-4 p-6 text-left rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-bright"
                                        onClick={() => toggle(index)}
                                    >
                                        <span className="font-serif text-lg font-medium text-white group-hover:text-primary-bright transition-colors">
                                            {faq.question}
                                        </span>
                                        <span aria-hidden className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary border border-white/10 text-white transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                            <span className="material-symbols-outlined text-sm">expand_more</span>
                                        </span>
                                    </button>
                                </h3>
                                {openIndex === index && (
                                    <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} className="px-6 pb-6 pt-0">
                                        <p className="text-base leading-relaxed text-primary-bright/80">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 rounded-2xl bg-surface-dark p-8 text-center sm:p-12 border border-border-green">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-6 border border-white/10">
                            <span className="material-symbols-outlined text-3xl text-white">support_agent</span>
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-white mb-3">Still have questions?</h2>
                        <p className="mx-auto max-w-lg text-primary-bright/80 mb-8">
                            Our concierge team is here to assist you with specific dietary requirements, corporate catering, or special event orders.
                        </p>
                        <button className="inline-flex h-12 min-w-[160px] cursor-pointer items-center justify-center rounded-lg bg-primary-bright px-6 text-base font-bold text-background-dark shadow-lg shadow-primary-bright/20 transition-all hover:scale-105 hover:bg-white hover:shadow-primary-bright/40">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
