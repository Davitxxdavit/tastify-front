import { Skeleton } from '../../../components/ui/Skeleton';

export function MenuSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading menu" className="flex flex-col gap-16">
            {[0, 1].map((section) => (
                <section key={section}>
                    <div className="mb-8 border-b border-primary/20 pb-4">
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[0, 1, 2, 3].map((card) => (
                            <div key={card} className="flex flex-col sm:flex-row rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden">
                                <Skeleton className="w-full sm:w-48 min-h-[200px] rounded-none" />
                                <div className="flex-1 p-5 space-y-3">
                                    <Skeleton className="h-6 w-2/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-9 w-32 ml-auto mt-6" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
