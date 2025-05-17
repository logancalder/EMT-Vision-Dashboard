"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ParallaxSection } from "@/components/parallax-section"
import { ActivityIcon, ShieldCheckIcon, BrainCircuitIcon, HeartPulseIcon, ArrowRightIcon, MenuIcon, HeadphonesIcon, FileTextIcon, CloudIcon, EyeIcon, ClockIcon, UsersIcon } from "lucide-react"
import "./landing.css"

export default function LandingPage() {
  // Initialize scroll animations
  const [showArrow, setShowArrow] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      // Parallax effect for hero section
      const heroSection = document.querySelector(".hero-content")
      if (heroSection) {
        heroSection.setAttribute("style", `transform: translateY(${scrollPosition * 0.2}px)`)
      }

      // Arrow fade logic
      setShowArrow(scrollPosition < 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll function
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80 // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="logo relative h-8 w-8 flex items-center justify-center">
            <svg viewBox="0 0 128 128" className="text-primary w-full h-full">
              <path
                transform="matrix(0.13470488,0,0,0.13470488,3874.9859,-1363.2471)"
                fill="currentColor"
                d="M-28134.268,10198.376c-9.904-0.278-20.645,1.116-32.361,4.885c-27.758,8.652-46.59,26.516-56.771,48.009
                c-9.764,20.934-13.111,68.803-13.111,68.803l-112.848,0.418c0,0-3.348-48.148-13.25-69.221
                c-9.904-21.493-28.875-39.775-56.494-48.009c-11.02-3.21-22.457-5.163-32.5-4.885c-29.57,0.697-311.477,65.313-314.824,70.896
                c-1.256,2.094,37.662,39.495,96.805,82.619l56.633-56.661l23.434,23.445l-52.588,52.614c17.855,12.002,36.826,24.144,56.771,35.867
                l56.074-56.104l23.436,23.446l-49.24,49.265c17.297,9.211,35.15,17.863,53.285,25.4l56.213-56.243l23.434,23.446l-45.752,43.848
                c52.17,17.725,105.035,13.005,152.461,13.005h45.195c44.914,0,94.154-4.492,143.252-21.379l-37.383-36.438l23.436-22.965
                l47.982,48.25c18.414-7.536,36.408-15.79,54.123-24.442l-41.848-41.808l23.434-23.416l49.24,49.28
                c20.504-11.164,40.033-22.74,58.445-34.185l-47.426-47.447l23.434-23.443l52.447,52.476
                c61.793-41.031,102.943-76.339,101.549-78.433C-27822.791,10263.689-28104.695,10199.073-28134.268,10198.376z
                M-28319.648,10488.487l4.498,565.808v0.419c0,4.744,3.027,8.513,7.77,8.513c4.604-0.14,7.49-4.048,7.49-8.513v-0.419
                l33.527-565.808H-28319.648z M-28293.006,10127.48c-34.453,0-62.49,27.074-62.49,61.545c0,22.19,11.717,36.919,29.293,47.805
                l1.953,68.459h62.49l1.953-68.459c17.574-10.886,29.291-25.019,29.291-47.349
                C-28230.516,10155.15-28258.553,10127.48-28293.006,10127.48z M-28320.205,10933.854c-7.812-2.372-14.506-5.304-20.086-8.932
                c-11.16-7.536-15.764-15.771-15.764-23.446s4.604-15.91,15.764-23.306c4.881-3.35,11.018-6.421,18.271-8.514
                c-0.418-13.956-0.836-27.912-1.256-42.007c-15.482-3.489-29.012-9.072-39.613-16.189c-16.879-11.583-24.83-25.261-24.83-39.217
                c0-13.677,7.951-27.632,24.83-39.216c10.043-6.698,22.318-12.142,36.406-15.491c-0.279-13.956-0.559-27.912-0.977-41.728
                c-23.852-4.467-44.914-12.979-60.957-24.144c-23.572-16.05-35.848-36.426-35.848-57.499c-0.279-38.658,26.084-31.4,52.867-39.355
                c12.553-3.769,22.875-8.653,30.686-16.189c3.906-3.768,8.51-8.933,8.789-17.724c-2.65-22.609-25.527-26.237-41.707-26.099
                c-7.254,0.279-13.252,1.257-15.484,1.396c-50.354,7.396-67.791,68.245-69.047,97.971c0,35.448,20.924,66.012,51.193,86.945
                c10.182,6.979,21.48,12.979,33.617,17.725c-2.791,1.535-5.58,3.35-8.23,5.163c-23.434,15.909-40.174,40.193-40.174,68.244
                c0,28.331,16.74,52.335,40.174,68.245c5.998,4.047,12.555,7.815,19.389,11.024c-16.6,11.724-28.316,29.448-28.316,49.963
                c0,21.911,13.391,40.333,31.246,52.057c11.576,7.815,25.107,13.117,40.172,16.188
                C-28319.508,10957.72-28319.926,10945.856-28320.205,10933.854z M-28370.002,10505.406c8.787,0,15.762,3.908,15.762,8.793
                c0,4.745-6.975,8.652-15.762,8.652c-8.789,0-15.764-3.907-15.764-8.652
                C-28385.766,10509.314-28378.791,10505.406-28370.002,10505.406z M-28127.852,10594.167c-1.256-29.726-18.691-90.714-69.047-97.971
                c-6.555-0.698-13.111-1.396-18.551-1.396c-15.902,0.279-35.988,4.886-38.639,26.099c0.418,8.791,4.881,13.956,8.787,17.724
                c7.951,7.536,18.133,12.421,30.688,16.189c26.781,7.955,53.285,0.697,52.865,39.355c0,21.073-12.273,41.449-35.848,57.499
                c-16.041,11.164-37.104,19.677-60.957,24.144c-0.418,13.815-0.836,27.771-1.254,41.728c13.809,3.35,21.131,8.513,30.756,15.073
                c17.016,11.164,20.711,24.98,20.711,38.657c0,0,0,0.14,0,0.419v0.558c0,13.956-2.998,27.634-19.875,39.217
                c-10.461,7.117-21.654,12.979-37.137,16.329c-0.42,13.955,0.609,27.911,0.191,41.867c6.695,2.093,8.828,4.885,13.709,8.094
                c11.438,7.397,12.594,15.492,12.594,23.028v0.697c0,7.676-0.014,15.91-11.172,23.446c-5.301,3.628-10.26,6.56-18.07,8.932
                c-0.279,12.002,0.658,23.865,0.24,35.867c14.926-3.071,22.855-8.373,34.154-16.188c17.715-11.444,25.365-29.588,25.365-50.939
                v-1.117c0,0,0-0.278,0-0.418v-1.257c0-19.817-5.926-36.844-21.828-48.288c6.975-3.209,9.713-6.978,15.852-11.024
                c23.293-15.91,36.494-39.774,36.494-67.407v-2.931c0-27.772-11.002-51.219-34.576-66.988c-2.371-1.396-1.246-2.931-3.617-4.188
                c12.414-4.884,25.111-10.885,35.154-17.863C-28150.592,10660.179-28127.852,10629.615-28127.852,10594.167z M-28210.848,10522.852
                c-8.787,0-15.762-3.907-15.762-8.652c0-4.885,6.975-8.793,15.762-8.793c8.789,0,15.762,3.908,15.762,8.793
                C-28195.086,10518.944-28202.059,10522.852-28210.848,10522.852z"
              />
            </svg>
            </div>
            <span className="text-lg font-medium tracking-tight">EMT Vision</span>
          </div>
          <nav className="hidden md:flex gap-8">
            {/* <Link
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="nav-link text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Features
            </Link> */}
            {/* <Link 
              href="#about" 
              onClick={(e) => scrollToSection(e, "about")}
              className="nav-link text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              About
            </Link> */}
            {/* <Link
              href="#testimonials"
              onClick={(e) => scrollToSection(e, "testimonials")}
              className="nav-link text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Testimonials
            </Link> */}
            {/* <Link
              href="/contact"
              className="nav-link text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Contact
            </Link> */}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
            </Button>
            <Link href="/dashboard">
              <Button className="hidden md:flex rounded-full cta-button">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0"></div>
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, var(--primary) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 mt-16">
          <div className="hero-content max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-primary">Hands-Free</span> ePCR Documentation
            </h1>
            <div className="flex justify-center mt-4">
              <span className="inline-block rounded-full bg-yellow-200 text-yellow-800 px-4 py-1 text-sm font-semibold shadow-sm border border-yellow-300 flex items-center gap-2">
                <span role="img" aria-label="trophy">🏆</span>
                2025 SCU Senior Design Winner
              </span>
            </div>
            <p className="max-w-[600px] mx-auto text-foreground/80 text-lg md:text-xl">
              AR headset technology that automatically transcribes your calls and auto-populates patient ePCR forms, saving valuable time in emergency situations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="rounded-full cta-button">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Floating heartbeat animation */}
        <div
          className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity duration-500 pointer-events-none ${showArrow ? 'opacity-100' : 'opacity-0'}`}
        >
          <ArrowRightIcon className="h-6 w-6 rotate-90 text-primary/70" />
        </div>
      </section>

      {/* Features Section */}
      <ParallaxSection className="py-24 md:py-32 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Revolutionary AR Technology
              </h2>
              <p className="text-foreground/70 text-lg">Designed for emergency medical professionals</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal delay={100}>
              <div className="feature-card flex flex-col items-start space-y-3 p-6">
                <div className="rounded-full bg-primary/10 p-3 mb-2">
                  <HeadphonesIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Automatic Transcription</h3>
                <p className="text-foreground/70">
                  Our AR headset automatically transcribes your calls, eliminating the need for manual note-taking during critical moments.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="feature-card flex flex-col items-start space-y-3 p-6">
                <div className="rounded-full bg-primary/10 p-3 mb-2">
                  <FileTextIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Auto-Populated ePCR Forms</h3>
                <p className="text-foreground/70">
                  Patient information is automatically extracted and populated into ePCR forms, reducing errors and saving time.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="feature-card flex flex-col items-start space-y-3 p-6">
                <div className="rounded-full bg-primary/10 p-3 mb-2">
                  <CloudIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Immediate Access</h3>
                <p className="text-foreground/70">
                  Forms are instantly accessible by accredited medical professionals at regional hospitals, enabling faster response times.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxSection>

      {/* Product Showcase */}
      <section id="about" className="py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6 p-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Designed for the Field</h2>
                <p className="text-foreground/70 text-lg">
                  Our AR headset is built to enhance your emergency response capabilities while maintaining focus on patient care.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <ShieldCheckIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span>Lightweight design for extended wear</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <ShieldCheckIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span>Seamless cloud synchronization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <ShieldCheckIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span>Non-obtrusive design maintains eye contact</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <ShieldCheckIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span>Hands-free operation saves critical time</span>
                  </li>
                </ul>
                <Button className="rounded-full mt-4 cta-button">View Specifications</Button>
              </div>
              <div className="relative p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl -rotate-1"></div>
                <div className="relative bg-background rounded-2xl border shadow-lg overflow-hidden rotate-1 transform transition-transform hover:rotate-0 duration-500">
                  <Image
                    src="/hololens.png"
                    width={800}
                    height={600}
                    alt="EMT Vision AR headset"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Section */}
      <ParallaxSection className="py-24 md:py-32 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Key Benefits
              </h2>
              <p className="text-foreground/70 text-lg">How EMT Vision transforms emergency response</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-center">
            <ScrollReveal delay={100}>
              <div className="testimonial-card bg-background rounded-xl p-8 shadow-sm border">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-primary">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Saves Critical Time</h3>
                  <p className="text-foreground/80">
                    Eliminates the need for a dedicated notetaker, allowing all team members to focus on patient care during emergencies.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="testimonial-card bg-background rounded-xl p-8 shadow-sm border">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-primary">
                    <EyeIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Maintains Eye Contact</h3>
                  <p className="text-foreground/80">
                    Non-obtrusive design ensures you can maintain eye contact with patients while the system captures all necessary information.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="testimonial-card bg-background rounded-xl p-8 shadow-sm border">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-primary">
                    <UsersIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Enhanced Collaboration</h3>
                  <p className="text-foreground/80">
                    Immediate access to patient information by hospital staff enables better preparation and faster response times.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ParallaxSection>

      {/* Testimonials */}
      {/* <section id="testimonials" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Trusted by Professionals
              </h2>
              <p className="text-foreground/70 text-lg">Hear from the emergency medical teams using our technology</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal delay={100}>
              <div className="testimonial-card bg-background rounded-xl p-8 shadow-sm border">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/80">
                    "EMT Vision has transformed how we document patient information. The automatic transcription saves us precious minutes during critical situations."
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">Dr. Sarah Johnson</p>
                    <p className="text-sm text-foreground/60">Emergency Department Director, Metro Hospital</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="testimonial-card bg-background rounded-xl p-8 shadow-sm border">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/80">
                    "The auto-populated ePCR forms have significantly reduced our documentation errors. We can now focus entirely on patient care without worrying about paperwork."
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">James Martinez</p>
                    <p className="text-sm text-foreground/60">Paramedic Supervisor, County EMS</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="testimonial-card bg-background rounded-xl p-8 shadow-sm border">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/80">
                    "The lightweight design and seamless cloud sync make EMT Vision a game-changer. We can access patient information immediately upon arrival at the hospital."
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">Lisa Chen</p>
                    <p className="text-sm text-foreground/60">Operations Director, City Fire Department</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-24 md:py-32 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to Transform Your Emergency Response?
              </h2>
              <p className="text-foreground/70 text-lg">
                Get in touch with our team to schedule a demonstration or learn more about our AR headset technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/contact">
                  <Button size="lg" className="rounded-full cta-button">
                    Contact Sales
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-full cta-button">
                  View Documentation
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-3">
              <ActivityIcon className="h-6 w-6 text-primary" />
              <span className="text-lg font-medium">EMT Vision</span>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-4">
              <Link 
                href="#features" 
                onClick={(e) => scrollToSection(e, "features")}
                className="footer-link text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link 
                href="#about" 
                onClick={(e) => scrollToSection(e, "about")}
                className="footer-link text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/60">© 2025 EMT Vision. All rights reserved. Developed by Logan Calder for Senior Design 2025.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
