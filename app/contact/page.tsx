"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ActivityIcon, ArrowLeftIcon, MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    message: "",
    interest: "demo"
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    
    // Simulate form submission
    try {
      // In a real application, you would send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        message: "",
        interest: "demo"
      })
    } catch (error) {
      setSubmitError("There was an error submitting your form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="container flex h-16 items-center justify-between px-6 md:px-10">
          <Link href="/" className="flex items-center gap-3">
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
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-16">
        <div className="container px-6 md:px-10 lg:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Contact Us
              </h1>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                Get in touch with our team to learn more about EMT Vision, schedule a demonstration, or discuss how our AR headset technology can transform your emergency response operations.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-secondary/30 rounded-xl p-6 border">
                  <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 mt-1">
                        <MailIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-foreground/70">info@emtvision.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 mt-1">
                        <PhoneIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-foreground/70">(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 mt-1">
                        <MapPinIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-foreground/70">123 Innovation Drive<br />Tech City, TC 12345</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2 mt-1">
                        <ClockIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Business Hours</h3>
                        <p className="text-foreground/70">Monday - Friday: 9am - 5pm EST</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-xl p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Why Choose EMT Vision?</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-1">
                        <ActivityIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span>Hands-free operation saves critical time during emergencies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-1">
                        <ActivityIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span>Automatic transcription eliminates the need for a dedicated notetaker</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-1">
                        <ActivityIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span>Auto-populated ePCR forms reduce documentation errors</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-1.5 mt-1">
                        <ActivityIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span>Immediate access to patient information by hospital staff</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-background rounded-xl p-6 border shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
                
                {submitSuccess ? (
                  <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg mb-6">
                    <p className="font-medium">Thank you for your message!</p>
                    <p className="text-sm mt-1">We've received your inquiry and will get back to you shortly.</p>
                  </div>
                ) : null}

                {submitError ? (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
                    <p className="font-medium">Error</p>
                    <p className="text-sm mt-1">{submitError}</p>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="organization" className="text-sm font-medium">
                        Organization
                      </label>
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        placeholder="Your organization"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="interest" className="text-sm font-medium">
                      I'm interested in
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="demo">Scheduling a demo</option>
                      <option value="pricing">Pricing information</option>
                      <option value="partnership">Partnership opportunities</option>
                      <option value="support">Technical support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full rounded-full cta-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <ActivityIcon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">© 2025 EMT Vision. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 