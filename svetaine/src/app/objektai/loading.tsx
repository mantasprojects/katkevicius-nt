export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      {/* Header */}
      <section className="bg-background pt-12 text-center pb-12 border-b border-border">
        <div className="container px-4">
          <h1 className="text-4xl md:text-5xl font-sans font-weight font-bold text-foreground tracking-tight">
            Parduodami objektai
          </h1>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col gap-10">
            
            {/* Filter Bar Skeleton */}
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl p-6 md:p-8 relative z-10 animate-pulse">
              <div className="h-7 bg-slate-200 rounded-lg w-48 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
                ))}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="flex flex-col bg-transparent rounded-none h-full animate-pulse">
                  {/* Image skeleton */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl mb-6 bg-slate-200"></div>
                  
                  {/* Content skeleton */}
                  <div className="flex flex-col flex-1 px-2 gap-4">
                    <div className="h-8 bg-slate-200 rounded-xl w-3/4"></div>
                    <div className="h-5 bg-slate-100 rounded-xl w-1/2"></div>
                    <div className="h-8 bg-slate-200 rounded-xl w-1/3 mt-2"></div>
                    <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-100">
                      <div className="h-5 bg-slate-100 rounded-lg w-1/4"></div>
                      <div className="h-5 bg-slate-100 rounded-lg w-1/4"></div>
                      <div className="h-5 bg-slate-100 rounded-lg w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
