export default function SellerBanner() {
  return (
    <div className="bg-gradient-to-r mx-2 md:mx-10 rounded-xl mb-5 
      from-teal-200 via-emerald-300 to-teal-400 
      text-gray-900 relative overflow-hidden shadow-xl">
      
      {/* Abstract Art Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-10 w-20 h-20 bg-teal-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-32 w-16 h-16 bg-emerald-400 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute top-20 right-1/2 w-24 h-24 bg-teal-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content - Flex Column on Mobile, Row on Desktop */}
      <div className="relative z-20 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        
        {/* Illustration - Top on Mobile, Right on Desktop */}
        <div className="flex justify-center items-center py-2 md:py-6 px-6 lg:absolute lg:right-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:py-0 lg:px-0
          lg:w-96 lg:h-96 xl:w-[520px] xl:h-96 opacity-90 order-1 lg:order-2">
          <img 
            src="/seller-reg-image.png" 
            alt="Seller Illustration" 
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-full lg:h-full object-contain drop-shadow-xl 
              animate-float hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Text Content */}
        <div className="px-2 md:px-10 lg:px-20 pb-8 pt-4 lg:py-14 xl:py-16 order-2 lg:order-1">
          <div className="max-w-2xl lg:max-w-3xl">
            
            {/* Animated Badge */}
            <div className="inline-block mb-4 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full 
              border border-white/40 animate-fade-in text-center lg:text-left">
              <span className="text-sm md:text-base font-semibold text-slate-800 font-body">
                🚀 Pioneer Seller Program
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-heading
              bg-gradient-to-r from-slate-800 to-emerald-800 bg-clip-text text-transparent
              drop-shadow-sm leading-tight animate-slide-up text-center lg:text-left">
              Build Your Dream Business
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg font-medium mb-6 font-body
              text-slate-700 opacity-95 leading-relaxed max-w-xl animate-slide-up delay-200 text-center lg:text-left mx-auto lg:mx-0">
             Great things happen when we build together — join us.
            </p>

            {/* CTA Button */}
            <div className="mt-6 animate-slide-up delay-300 flex justify-center lg:justify-start">
              <button className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 
                hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl 
                text-base sm:text-lg md:text-xl font-semibold font-body shadow-lg hover:shadow-xl 
                transform hover:scale-105 transition-all duration-300 
                flex items-center gap-2 border border-white/20">
                <span>Become a Founder Seller</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}