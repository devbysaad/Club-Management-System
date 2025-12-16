"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Homepage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue p-[2px] flex-shrink-0">
                <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                  <Image src="/logo.png" alt="Logo" width={28} height={28} />
                </div>
              </div>
              <span className="font-heading font-bold text-base md:text-lg text-[var(--text-primary)]">
                Pato <span className="gradient-text">Hornets</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="#about" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">About</a>
              <a href="#teams" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">Teams</a>
              <a href="#coaches" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">Coaches</a>
              <a href="#gallery" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">Gallery</a>
              <a href="#training" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">Training</a>
              <a href="#contact" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">Contact</a>
              <Link href="/admin" className="px-4 py-2 rounded-lg bg-gradient-to-r from-fcGarnet to-fcBlue text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Dashboard
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-[var(--bg-surface)]"
            >
              <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass border-t border-[var(--border-color)] p-4">
            <div className="flex flex-col gap-3">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[var(--text-muted)] hover:text-fcGold">About</a>
              <a href="#teams" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[var(--text-muted)] hover:text-fcGold">Teams</a>
              <a href="#coaches" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[var(--text-muted)] hover:text-fcGold">Coaches</a>
              <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[var(--text-muted)] hover:text-fcGold">Gallery</a>
              <a href="#training" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[var(--text-muted)] hover:text-fcGold">Training</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[var(--text-muted)] hover:text-fcGold">Contact</a>
              <Link href="/admin" className="mt-2 px-4 py-3 rounded-lg bg-gradient-to-r from-fcGarnet to-fcBlue text-white text-center font-semibold">
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 md:pt-16 px-4">
        {/* Background */}
        <div className="absolute inset-0 hero-background" />
        <div className="absolute inset-0 opacity-20 hero-pattern" />

        {/* Gradient Orbs - smaller on mobile */}
        <div className="absolute top-1/4 left-0 w-48 md:w-96 h-48 md:h-96 bg-fcGarnet/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-48 md:w-96 h-48 md:h-96 bg-fcBlue/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center w-full max-w-5xl mx-auto py-8">
          <div className="mb-4 md:mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-fcGold/10 border border-fcGold/20 text-fcGold text-xs md:text-sm font-medium">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-fcGold rounded-full animate-pulse" />
              Building Champions Since 2015
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-black text-[var(--hero-text)] mb-4 md:mb-6 leading-tight">
            PATO <span className="gradient-text">HORNETS</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[var(--hero-text-sub)] mb-6 md:mb-8 max-w-xl mx-auto px-2">
            Premier football academy offering world-class training for junior and senior players
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <a href="#contact" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-bold text-base md:text-lg shadow-glow-garnet hover:scale-105 transition-transform">
              Join Academy
            </a>
            <a href="#about" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 rounded-xl border-2 border-fcGold/50 text-fcGold font-heading font-bold text-base md:text-lg hover:bg-fcGold/10 transition-colors">
              Learn More
            </a>
          </div>

          {/* Stats - 2x2 on all screens */}
          <div className="mt-10 md:mt-16 grid grid-cols-2 gap-3 md:gap-6 max-w-2xl mx-auto">
            {[
              { value: "100+", label: "Players" },
              { value: "15+", label: "Coaches" },
              { value: "All", label: "Ages" },
              { value: "95%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                <p className="text-2xl md:text-4xl font-heading font-bold text-fcGold">{stat.value}</p>
                <p className="text-xs md:text-sm text-[var(--hero-text-sub)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator - hidden on mobile */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-fcGold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <span className="text-fcGold uppercase tracking-widest text-xs md:text-sm font-semibold">About Us</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--text-primary)] mt-3 md:mt-4 mb-4 md:mb-6">
                Welcome to <span className="gradient-text">Pato Hornets</span>
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-[var(--text-muted)] mb-6 md:mb-8">
               Celebrated its opening on October 10, 2025, with supporters from Abu Dhabi and the UK, Pato Hornets Football Academy is dedicated to nurturing the next generation of football stars. Our holistic approach combines technical excellence, tactical awareness, and character development.
              </p>

              <div className="space-y-3 md:space-y-4">
                {[
                  { icon: "⚽", title: "Technical Excellence", desc: "Master ball control, passing, and shooting" },
                  { icon: "🎯", title: "Tactical Awareness", desc: "Understand game patterns and decision making" },
                  { icon: "💪", title: "Physical Development", desc: "Build strength, speed, and endurance" },
                  { icon: "🧠", title: "Mental Strength", desc: "Develop resilience and winning mentality" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-[var(--bg-surface)] hover:bg-fcGarnet/10 transition-colors">
                    <span className="text-xl md:text-2xl flex-shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-heading font-semibold text-sm md:text-base text-[var(--text-primary)]">{item.title}</h3>
                      <p className="text-xs md:text-sm text-[var(--text-muted)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="glass-card rounded-2xl md:rounded-3xl p-3 md:p-4 relative z-10">
                <div className="aspect-[4/3] rounded-xl md:rounded-2xl bg-gradient-to-br from-fcGarnet/20 to-fcBlue/20 flex items-center justify-center">
                  <span className="text-6xl md:text-8xl">⚽</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 md:w-32 h-24 md:h-32 bg-fcGold/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 md:w-32 h-24 md:h-32 bg-fcGarnet/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section id="teams" className="py-16 md:py-24 px-4 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-fcGold uppercase tracking-widest text-xs md:text-sm font-semibold">Our Teams</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--text-primary)] mt-3 md:mt-4">
              Age Group <span className="gradient-text">Categories</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "U-10", ages: "8-10 years", desc: "Foundation skills & fun", color: "from-fcGreen to-fcGreen/50" },
              { name: "U-12", ages: "10-12 years", desc: "Technical development", color: "from-fcBlue to-fcBlue/50" },
              { name: "U-15", ages: "12-15 years", desc: "Tactical understanding", color: "from-fcGold to-fcGold/50" },
              { name: "Senior", ages: "15+ years", desc: "Competition ready", color: "from-fcGarnet to-fcGarnet/50" },
            ].map((team, i) => (
              <div key={i} className="glass-card rounded-xl md:rounded-2xl p-5 md:p-6 hover:scale-105 transition-transform group">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${team.color} flex items-center justify-center mb-3 md:mb-4`}>
                  <span className="text-xl md:text-2xl font-heading font-bold text-white">{team.name}</span>
                </div>
                <h3 className="font-heading font-bold text-base md:text-xl text-[var(--text-primary)]">{team.ages}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1 md:mt-2">{team.desc}</p>
                <button className="mt-3 md:mt-4 text-fcGold text-sm font-semibold group-hover:underline">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section id="coaches" className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-fcGold uppercase tracking-widest text-xs md:text-sm font-semibold">Our Staff</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--text-primary)] mt-3 md:mt-4">
              Expert <span className="gradient-text">Coaching Team</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              { name: "Coach Ahmed", role: "Head Coach", exp: "15+ years", specialty: "Tactical Training" },
              { name: "Coach Sarah", role: "Youth Development", exp: "10+ years", specialty: "Technical Skills" },
              { name: "Coach Mike", role: "Fitness Coach", exp: "12+ years", specialty: "Physical Conditioning" },
            ].map((coach, i) => (
              <div key={i} className="glass-card rounded-xl md:rounded-2xl p-5 md:p-6 text-center group">
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue p-0.5 md:p-1 mb-3 md:mb-4">
                  <div className="w-full h-full rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
                    <span className="text-2xl md:text-4xl">👤</span>
                  </div>
                </div>
                <h3 className="font-heading font-bold text-base md:text-xl text-[var(--text-primary)]">{coach.name}</h3>
                <p className="text-fcGold text-xs md:text-sm font-medium">{coach.role}</p>
                <p className="text-[var(--text-muted)] text-xs md:text-sm mt-1 md:mt-2">{coach.exp} Experience</p>
                <span className="inline-block mt-2 md:mt-3 px-2 md:px-3 py-1 rounded-full bg-fcBlue/10 text-fcBlue text-[10px] md:text-xs font-medium">
                  {coach.specialty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 md:py-24 px-4 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-fcGold uppercase tracking-widest text-xs md:text-sm font-semibold">Gallery</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--text-primary)] mt-3 md:mt-4">
              Moments of <span className="gradient-text">Excellence</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square rounded-xl md:rounded-2xl bg-gradient-to-br from-fcGarnet/20 to-fcBlue/20 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                <span className="text-3xl md:text-4xl">📸</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Section */}
      <section id="training" className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-card rounded-2xl md:rounded-3xl p-3 md:p-4">
                <div className="aspect-video rounded-xl md:rounded-2xl bg-gradient-to-br from-fcBlue/20 to-fcGold/20 flex items-center justify-center">
                  <span className="text-4xl md:text-6xl">🏃</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-fcGold uppercase tracking-widest text-xs md:text-sm font-semibold">Training</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--text-primary)] mt-3 md:mt-4 mb-4 md:mb-6">
                World-Class <span className="gradient-text">Programs</span>
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-[var(--text-muted)] mb-6 md:mb-8">
                Our training methodology combines modern techniques with proven fundamentals to develop well-rounded players.
              </p>

              <div className="grid grid-cols-2 gap-2 md:gap-4">
                {[
                  { title: "Technical Skills", icon: "⚽" },
                  { title: "Tactical Awareness", icon: "🎯" },
                  { title: "Physical Fitness", icon: "💪" },
                  { title: "Mental Strength", icon: "🧠" },
                  { title: "Team Play", icon: "🤝" },
                  { title: "Match Practice", icon: "🏆" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl bg-[var(--bg-surface)]">
                    <span className="text-lg md:text-xl flex-shrink-0">{item.icon}</span>
                    <span className="text-xs md:text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 px-4 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            <div>
              <span className="text-fcGold uppercase tracking-widest text-xs md:text-sm font-semibold">Contact Us</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[var(--text-primary)] mt-3 md:mt-4 mb-4 md:mb-6">
                Get In <span className="gradient-text">Touch</span>
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-[var(--text-muted)] mb-6 md:mb-8">
                Ready to start your football journey? Contact us today to learn more about our programs.
              </p>

              <div className="space-y-3 md:space-y-4">
                {[
                  { icon: "📍", label: "Location", value: "New City Phase 2, C Block" },
                  { icon: "📞", label: "Phone", value: "+92 3364 67 63 87" },
                  { icon: "✉️", label: "Email", value: "patohornets@gmail.com" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-fcGarnet/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg md:text-xl">{item.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-[var(--text-muted)]">{item.label}</p>
                      <p className="text-sm md:text-base font-medium text-[var(--text-primary)] truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-3 md:gap-4 mt-6 md:mt-8">
                {["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => (
                  <button key={social} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center hover:border-fcGold transition-colors">
                    <span className="text-[var(--text-muted)] text-xs md:text-sm">📱</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl md:rounded-2xl p-5 md:p-8">
              <h3 className="font-heading font-bold text-lg md:text-xl text-[var(--text-primary)] mb-4 md:mb-6">Send us a message</h3>
              <form className="space-y-3 md:space-y-4">
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-dim)] text-sm md:text-base focus:border-fcGarnet focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-dim)] text-sm md:text-base focus:border-fcGarnet focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-dim)] text-sm md:text-base focus:border-fcGarnet focus:outline-none"
                />
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-dim)] text-sm md:text-base focus:border-fcGarnet focus:outline-none resize-none"
                />
                <button className="w-full py-3 md:py-4 rounded-lg md:rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-bold text-sm md:text-base shadow-glow-garnet hover:opacity-90 transition-opacity">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue p-[2px]">
                <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                  <Image src="/logo.png" alt="Logo" width={28} height={28} />
                </div>
              </div>
              <span className="font-heading font-bold text-base md:text-lg text-[var(--text-primary)]">
                Pato <span className="gradient-text">Hornets</span>
              </span>
            </div>

            <p className="text-[var(--text-muted)] text-xs md:text-sm text-center">
              © 2025 Pato Hornets Football Academy. All rights reserved.
            </p>

            <div className="flex gap-4 md:gap-6">
              <a href="#" className="text-xs md:text-sm text-[var(--text-muted)] hover:text-fcGold">Privacy</a>
              <a href="#" className="text-xs md:text-sm text-[var(--text-muted)] hover:text-fcGold">Terms</a>
              <Link href="/admin" className="text-xs md:text-sm text-fcGold font-semibold">Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;