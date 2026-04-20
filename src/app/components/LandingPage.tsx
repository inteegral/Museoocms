import svgPaths from "../../imports/svg-9z7qluted5";
import imgStatue from "figma:asset/deec1ba57c58b8400482b1dfcd04c022adda04ca.png";
import imgStatueNoBackground from "figma:asset/2dc2cd6dddf858065cd01041dc7bbf7a0b2cec56.png";
import img631271F7E078Ad92Fcd2A9DaFrame2018Png from "figma:asset/2dce1fe1c1cb6f1f248dc0b590997eb4134c6bfa.png";
import img631271F58Ebd851B72979114Frame2012Png from "figma:asset/43c6fbac5d0d80ec3cc96bfa044810e2e2c489a4.png";
import img631271F51D848B4Ce75Ff596Frame2011Png from "figma:asset/99c2478b9c19bd08b4b883dff6f65b7d9559fdd8.png";
import img631271F42E256F4Fbb3Db8F0Frame208Png from "figma:asset/f86ba00f71f9c293484a443d16729874da63e0e6.png";
import Group22SVG from "../../imports/Group_22.svg";

function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`relative ${className} aspect-[170/32]`}>
      <div className="absolute inset-[2.29%_80.58%_1.34%_0]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.0061 30.8386">
          <path d={svgPaths.p2d74d6f0} fill="#D33333" />
        </svg>
      </div>
      <div className="absolute inset-[0_50.41%_0_37.13%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.1699 32">
          <path d={svgPaths.p21130f80} fill="#D33333" />
        </svg>
      </div>
      <div className="absolute inset-[2.72%_37.45%_1.6%_51.67%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.5047 30.6196">
          <path d={svgPaths.p7cac400} fill="#D33333" />
        </svg>
      </div>
      <div className="absolute inset-[2.15%_64.78%_0.45%_21.54%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.2666 31.1696">
          <path d={svgPaths.p8993d80} fill="#D33333" />
        </svg>
      </div>
      <div className="absolute inset-[2.43%_0_1.35%_82.12%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.4005 30.791">
          <path d={svgPaths.p2c92f00} fill="#D33333" />
        </svg>
      </div>
      <div className="absolute inset-[3.07%_19.05%_1.02%_63.25%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.0946 30.6915">
          <path d={svgPaths.p140eb800} fill="#D33333" />
        </svg>
      </div>
      <div className="absolute inset-[68.75%_97.45%_1.6%_0.06%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.22847 9.4884">
          <path d={svgPaths.p135d3bf2} fill="#D33333" />
        </svg>
      </div>
    </div>
  );
}

function HamburgerMenu() {
  return (
    <button className="h-7 w-8 flex items-center justify-center">
      <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.3333 29.1667">
        <path d={svgPaths.p6883d00} fill="#D33333" />
      </svg>
    </button>
  );
}

export function LandingPage() {
  return (
    <div className="bg-white relative w-full min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen py-20 lg:py-32 overflow-hidden">
        {/* Background Statue with Opacity */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-14 overflow-hidden">
            <img
              alt=""
              className="absolute h-full w-full object-cover scale-125 -translate-x-[8%]"
              src={imgStatue}
            />
          </div>
          <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.06)] via-transparent to-[rgba(255,255,255,0.2)] inset-0" />
        </div>

        {/* Red Accent Bar - Left */}
        <div className="hidden xl:block absolute bg-[#d33333] h-20 left-0 top-[40vh] w-[7px]" aria-hidden="true" />

        {/* Watermark Text - Background */}
        <div
          aria-hidden="true"
          className="hidden xl:block absolute font-['Fraunces'] font-thin text-[clamp(40px,5vw,80px)] text-[rgba(144,144,144,0.19)] text-center top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] pointer-events-none select-none"
          style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1", letterSpacing: "0.1em" }}
        >
          <div className="leading-relaxed pt-32">
            Storytellinging for evolving museums
          </div>
        </div>

        {/* Container */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {/* Navbar */}
          <nav className="flex items-center justify-between mb-16 lg:mb-24">
            {/* Left Side - Logo */}
            <div className="flex items-center gap-8 lg:gap-12">
              <HamburgerMenu />
              <Logo className="h-8 lg:h-10" />
            </div>

            {/* Right Side - Menu and Auth */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Navigation Links */}
              <div className="flex items-center gap-6 font-['Inter'] text-[#8a8a8a] text-sm lg:text-base">
                <a href="#experience" className="hover:text-[#d33333] transition-colors">Experience</a>
                <a href="#pricing" className="hover:text-[#d33333] transition-colors">Pricing</a>
                <a href="#stories" className="hover:text-[#d33333] transition-colors">Success Stories</a>
                <a href="#resources" className="hover:text-[#d33333] transition-colors">Resources</a>
                <a href="#support" className="hover:text-[#d33333] transition-colors">Support</a>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-[#D5D7DD]" />

              {/* Auth */}
              <a href="#signin" className="font-['Inter'] text-[#8a8a8a] text-sm lg:text-base hover:text-[#d33333] transition-colors">
                Sign In
              </a>
              <button className="bg-[#d33333] text-white font-['Inter'] font-semibold px-6 py-2.5 rounded-lg text-sm lg:text-base hover:bg-[#b82828] transition-colors">
                Sign Up
              </button>
            </div>
          </nav>

          {/* Hero Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Hero Text */}
            <div className="space-y-12 lg:space-y-16">
              {/* Large Logo */}
              <Logo className="h-16 lg:h-20 xl:h-24" />

              {/* Hero Headline */}
              <h1
                className="font-['Fraunces'] font-thin text-[#d33333] text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight"
                style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
              >
                We design experiences that move businesses to the future.
              </h1>

              {/* CTAs */}
              <div className="flex flex-wrap gap-6 lg:gap-8">
                {/* Let's Talk Button with Arrow */}
                <button className="group relative h-14 lg:h-16 px-8 lg:px-12 rounded-2xl border border-[#d33333] hover:bg-[#d333330a] transition-all">
                  <span
                    className="font-['Fraunces'] font-light text-[#d33333] text-base lg:text-lg"
                    style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                  >
                    Let's Talk
                  </span>
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 -rotate-45 opacity-0 group-hover:opacity-100 group-hover:-right-8 transition-all">
                    <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" viewBox="0 0 45.0826 45.0826">
                      <path d={svgPaths.p28f6dd00} fill="#D33333" />
                    </svg>
                  </div>
                </button>

                {/* About Us Button */}
                <button
                  className="h-14 lg:h-16 px-8 lg:px-12 rounded-2xl border border-[#d33333] font-['Fraunces'] font-light text-[#d33333] text-base lg:text-lg hover:bg-[#d333330a] transition-all"
                  style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                >
                  About us
                </button>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg mx-auto" style={{ transform: 'scale(0.75)' }}>
                <img
                  alt="Museum illustration"
                  className="w-full h-auto object-contain"
                  src={Group22SVG}
                />
              </div>
            </div>
          </div>

          {/* Tagline - Right Aligned */}
          <div className="mt-20 lg:mt-32 flex justify-end">
            <p
              className="font-['Fraunces'] font-thin text-[#f63535] text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-right leading-tight max-w-xs md:max-w-md lg:max-w-lg"
              style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
            >
              Storytelling for evolving Museums
            </p>
          </div>
        </div>
      </section>

      {/* The Journey - Workflow Section */}
      <section className="relative py-32 lg:py-48 xl:py-64 overflow-hidden bg-white">
        {/* Background Statue with Opacity */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.08] overflow-hidden">
            <img
              alt=""
              className="absolute h-full w-full object-cover scale-125 -translate-x-[8%]"
              src={imgStatue}
            />
          </div>
          <div className="absolute bg-gradient-to-b from-white via-transparent to-white inset-0" />
        </div>

        {/* Container */}
        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12 xl:px-20">
          {/* Section Title */}
          <div className="text-center mb-32 lg:mb-48">
            <h2
              className="font-['Fraunces'] font-thin text-[#1f2937] text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-8"
              style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
            >
              A continuous cycle of{" "}
              <span className="text-[#d33333]">intelligence</span>
            </h2>
            <p className="font-['Inter'] text-[#6b7280] text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Data-driven innovation where visitor insights refine the knowledge graph, creating an ever-evolving experience
            </p>
          </div>

          {/* Circular Flow Diagram */}
          <div className="relative max-w-[1400px] mx-auto">
            {/* Central Circle - Connecting Lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
              <svg className="w-full h-full max-w-4xl max-h-4xl" viewBox="0 0 800 800">
                {/* Circular flow path */}
                <circle
                  cx="400"
                  cy="400"
                  r="280"
                  fill="none"
                  stroke="#d33333"
                  strokeWidth="1"
                  opacity="0.15"
                  strokeDasharray="8 8"
                />

                {/* Arrows indicating flow direction */}
                <path d="M 400 120 L 395 110 L 405 110 Z" fill="#d33333" opacity="0.3" />
                <path d="M 680 400 L 690 395 L 690 405 Z" fill="#d33333" opacity="0.3" />
                <path d="M 400 680 L 405 690 L 395 690 Z" fill="#d33333" opacity="0.3" />
                <path d="M 120 400 L 110 405 L 110 395 Z" fill="#d33333" opacity="0.3" />
              </svg>
            </div>

            {/* Three Steps in Circular Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">
              {/* Step 1: Knowledge Analysis */}
              <div className="group">
                <div className="relative">
                  {/* Number */}
                  <div className="mb-8">
                    <div className="inline-block relative">
                      <span
                        className="font-['Fraunces'] font-thin text-[#d33333] text-[140px] lg:text-[180px] leading-none opacity-20"
                        style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                      >
                        01
                      </span>
                      <div className="absolute -right-8 top-8 w-32 h-px bg-[#d33333] opacity-30" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-8">
                    <div>
                      <h3
                        className="font-['Fraunces'] font-normal text-[#1f2937] text-3xl lg:text-4xl xl:text-5xl mb-4 leading-tight"
                        style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                      >
                        Knowledge<br />Analysis
                      </h3>
                      <p className="font-['Inter'] text-[#d33333] text-sm font-medium uppercase tracking-wider">
                        Ingestion
                      </p>
                    </div>

                    <div className="space-y-4 font-['Inter'] text-[#6b7280] text-base leading-relaxed">
                      <p>Curators upload artworks and content</p>
                      <p>AI guides through structured process</p>
                      <p>System organizes into knowledge graph</p>
                      <p>Relationships emerge between nodes</p>
                    </div>

                    <div className="pt-6 border-t border-black/5">
                      <p
                        className="font-['Fraunces'] font-light text-[#1f2937] text-xl italic"
                        style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                      >
                        Understanding, not storage
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Content Generation */}
              <div className="group lg:mt-32">
                <div className="relative">
                  {/* Number */}
                  <div className="mb-8">
                    <div className="inline-block relative">
                      <span
                        className="font-['Fraunces'] font-thin text-[#d33333] text-[140px] lg:text-[180px] leading-none opacity-20"
                        style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                      >
                        02
                      </span>
                      <div className="absolute -right-8 top-8 w-32 h-px bg-[#d33333] opacity-30" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-8">
                    <div>
                      <h3
                        className="font-['Fraunces'] font-normal text-[#1f2937] text-3xl lg:text-4xl xl:text-5xl mb-4 leading-tight"
                        style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                      >
                        Content<br />Generation
                      </h3>
                      <p className="font-['Inter'] text-[#d33333] text-sm font-medium uppercase tracking-wider">
                        AI-Powered
                      </p>
                    </div>

                    <div className="space-y-4 font-['Inter'] text-[#6b7280] text-base leading-relaxed">
                      <p>System proposes guide structures</p>
                      <p>Museum defines audience and style</p>
                      <p>AI generates from knowledge graph</p>
                      <p>Human oversight and refinement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Delivery */}
              <div className="group lg:mt-64">
                <div className="relative">
                  {/* Number */}
                  <div className="mb-8">
                    <div className="inline-block relative">
                      <span
                        className="font-['Fraunces'] font-thin text-[#d33333] text-[140px] lg:text-[180px] leading-none opacity-20"
                        style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                      >
                        03
                      </span>
                      <div className="absolute -right-8 top-8 w-32 h-px bg-[#d33333] opacity-30" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-8">
                    <div>
                      <h3
                        className="font-['Fraunces'] font-normal text-[#1f2937] text-3xl lg:text-4xl xl:text-5xl mb-4 leading-tight"
                        style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                      >
                        Delivery &<br />Learning
                      </h3>
                      <p className="font-['Inter'] text-[#d33333] text-sm font-medium uppercase tracking-wider">
                        Live Interaction
                      </p>
                    </div>

                    <div className="space-y-4 font-['Inter'] text-[#6b7280] text-base leading-relaxed">
                      <p>Visitors experience audio guides</p>
                      <p>Real-time questions navigate graph</p>
                      <p>Behavioral data captured</p>
                      <p>Insights refine the knowledge base</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Loop Indicator */}
            <div className="mt-24 lg:mt-32 text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 border border-[#d33333]/20 rounded-full">
                <svg className="size-6 text-[#d33333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p
                  className="font-['Fraunces'] font-light text-[#1f2937] text-lg"
                  style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
                >
                  Continuous improvement loop
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Statue with Opacity */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-14 overflow-hidden">
            <img
              alt=""
              className="absolute h-full w-full object-cover scale-125 -translate-x-[8%]"
              src={imgStatue}
            />
          </div>
          <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.07)] via-transparent to-[rgba(255,255,255,0.11)] inset-0" />
        </div>

        {/* Red Accent Bars */}
        <div className="hidden xl:block absolute bg-[#d33333] h-20 right-0 top-0 w-[7px]" aria-hidden="true" />
        <div className="hidden xl:block absolute bg-[#d33333] h-20 right-0 bottom-[20%] w-[7px]" aria-hidden="true" />
        <div className="hidden xl:block absolute bg-[#d33333] h-20 left-0 top-[40%] w-[7px]" aria-hidden="true" />

        {/* Watermark Text */}
        <div
          aria-hidden="true"
          className="hidden xl:block absolute font-['Fraunces'] font-thin text-[clamp(40px,5vw,80px)] text-[rgba(144,144,144,0.19)] text-center top-1/3 left-1/2 -translate-x-1/2 w-full max-w-[1440px] pointer-events-none select-none"
          style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1", letterSpacing: "0.1em" }}
        >
          <div className="leading-relaxed">
            Storytellinging for evolving museums
          </div>
        </div>

        {/* Container */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {/* Red Horizontal Divider */}
          <div className="max-w-4xl mx-auto mb-16 lg:mb-24">
            <div className="h-px bg-[#d33333]" />
          </div>

          {/* Success Stories Heading */}
          <h2
            className="font-['Fraunces'] font-semibold text-[#d33333] text-4xl md:text-5xl lg:text-6xl mb-16 lg:mb-24 text-center"
            style={{ fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
          >
            Success stories
          </h2>

          {/* Partner Logos Grid */}
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 max-w-3xl mx-auto">
            <div className="h-12 lg:h-14 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
              <img alt="Partner 1" className="h-full w-auto object-contain" src={img631271F7E078Ad92Fcd2A9DaFrame2018Png} />
            </div>
            <div className="h-12 lg:h-14 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
              <img alt="Partner 2" className="h-full w-auto object-contain" src={img631271F58Ebd851B72979114Frame2012Png} />
            </div>
            <div className="h-12 lg:h-14 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
              <img alt="Partner 3" className="h-full w-auto object-contain" src={img631271F51D848B4Ce75Ff596Frame2011Png} />
            </div>
            <div className="h-12 lg:h-14 w-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
              <img alt="Partner 4" className="h-full w-auto object-contain" src={img631271F42E256F4Fbb3Db8F0Frame208Png} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
