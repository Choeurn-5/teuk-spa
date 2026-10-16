"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { checkAvailableSlots, submitBookingRequest } from "@/lib/booking/actions";
import { format, addDays } from "date-fns";
import { Check, Calendar as CalendarIcon, Clock, Users, ArrowLeft } from "lucide-react";
import Image from "next/image";

export function BookingStepper({ packages, treatments }: { packages: any[], treatments: any[] }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Selections
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [availableSlots, setAvailableSlots] = useState<{ time: string, available: boolean }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(1);

  const [guestDetails, setGuestDetails] = useState({
    name: "", phone: "", email: "", hotel: "", notes: ""
  });

  const [reference, setReference] = useState("");

  // Date selection triggers slot fetch
  useEffect(() => {
    if (step === 2 && selectedService && selectedDuration) {
      setLoading(true);
      checkAvailableSlots(date, selectedDuration, guests).then(slots => {
        setAvailableSlots(slots);
        setSelectedTime(null);
        setLoading(false);
      });
    }
  }, [date, guests, step, selectedService, selectedDuration]);

  const handleServiceSelect = (item: any, type: 'package'|'treatment', duration?: number, price?: number) => {
    setSelectedService({ ...item, type });
    setSelectedDuration(duration || item.totalMinutes);
    setSelectedPrice(price || item.price);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedTime || !selectedDuration) return;
    
    setLoading(true);
    setError("");

    const res = await submitBookingRequest({
      service: selectedService,
      durationMinutes: selectedDuration,
      price: selectedPrice,
      date,
      time: selectedTime,
      guests,
      guestDetails
    });

    if (res.success) {
      setReference(res.reference ?? "");
      setStep(4);
    } else {
      const errMsg = res.error ?? "An error occurred.";
      setError(errMsg);
      setLoading(false);
      if (errMsg.includes("time slot")) setStep(2);
    }
  };

  // The Steps UI
  return (
    <div className="bg-warm rounded-3xl shadow-sm border border-mist overflow-hidden relative">
      
      {/* Progress Line */}
      {step < 4 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-mist">
          <motion.div 
            className="h-full bg-gold"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Header Back Button */}
      {step > 1 && step < 4 && (
        <div className="pt-6 px-6 sm:px-10">
          <button onClick={() => setStep(step - 1)} className="flex items-center text-sm text-ink/60 hover:text-olive transition-colors font-medium tracking-wide">
            <ArrowLeft className="w-4 h-4 mr-2" /> BACK
          </button>
        </div>
      )}

      <div className="p-6 sm:p-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: CHOOSE SERVICE */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-serif text-olive mb-8">1. Choose your journey</h2>
              
              <div className="space-y-12">
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-gold font-medium mb-4">Packages</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packages.map(pkg => (
                      <button
                        key={pkg.id}
                        onClick={() => handleServiceSelect(pkg, 'package')}
                        className="text-left rounded-2xl border border-mist hover:border-olive hover:shadow-md transition-all bg-white group overflow-hidden flex flex-col"
                      >
                        <div className="relative w-full h-36 bg-mist overflow-hidden shrink-0">
                          <Image
                            src={pkg.imageUrl || '/images/defaults/spa_package.jpg'}
                            alt={pkg.name}
                            fill
                            unoptimized={Boolean(pkg.imageUrl?.startsWith("data:"))}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-xl text-olive mb-1 group-hover:text-gold transition-colors">{pkg.name}</h4>
                            <p className="text-xs uppercase tracking-widest text-gold font-medium mb-2">{pkg.totalMinutes} MIN | ${pkg.price}</p>
                            <p className="text-sm font-light text-ink/80 line-clamp-2">{pkg.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-widest text-gold font-medium mb-4">Treatments</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {treatments.map(t => (
                      <div key={t.id} className="p-6 rounded-2xl border border-mist bg-white">
                        <h4 className="font-serif text-xl text-olive mb-1">{t.name}</h4>
                        <p className="text-sm font-light text-ink/80 mb-4 line-clamp-2">{t.shortDescription}</p>
                        <div className="flex flex-wrap gap-2">
                          {t.durationOptions?.map((opt: any, i: number) => (
                            <button 
                              key={i} 
                              onClick={() => handleServiceSelect(t, 'treatment', opt.minutes, opt.price)}
                              className="px-4 py-2 rounded-full border border-mist hover:bg-olive hover:text-cream text-sm transition-colors text-ink/80"
                            >
                              {opt.minutes}m / ${opt.price}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-serif text-olive mb-2">2. Select a time</h2>
              <p className="text-ink/60 font-light mb-8">For {selectedService.name} ({selectedDuration} min)</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Inputs */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-ink/80 mb-2">Guests</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          onClick={() => setGuests(num)}
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${guests === num ? 'bg-olive text-cream border-olive' : 'bg-white border-mist text-ink hover:border-gold'}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink/80 mb-2">Date</label>
                    <input
                      type="date"
                      value={date}
                      min={format(new Date(), "yyyy-MM-dd")}
                      max={format(addDays(new Date(), 60), "yyyy-MM-dd")}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive text-ink"
                    />
                  </div>
                </div>

                {/* Slots */}
                <div>
                  <label className="block text-sm font-medium text-ink/80 mb-2">Available Start Times</label>
                  {loading ? (
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-10 w-20 bg-mist rounded-lg"></div>
                      <div className="h-10 w-20 bg-mist rounded-lg"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.length > 0 ? (
                        availableSlots.map(slot => (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                              !slot.available ? 'opacity-40 bg-mist/50 cursor-not-allowed border-transparent' : 
                              selectedTime === slot.time ? 'bg-olive text-cream border-olive shadow-md' : 'bg-white border-mist hover:border-gold text-ink'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-ink/60 col-span-3">No slots available for this date.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button
                  disabled={!selectedTime}
                  onClick={() => setStep(3)}
                  className="px-10 py-3 bg-olive text-cream tracking-widest uppercase text-sm rounded-full hover:bg-gold transition-colors disabled:opacity-50 disabled:hover:bg-olive"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                
                {/* Form */}
                <div className="lg:col-span-3">
                  <h2 className="text-3xl font-serif text-olive mb-2">3. Your details</h2>
                  <p className="text-ink/60 font-light mb-8">We will send a confirmation to your WhatsApp and Email.</p>

                  <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-ink/80 mb-1">Full Name *</label>
                        <input required type="text" value={guestDetails.name} onChange={e => setGuestDetails({...guestDetails, name: e.target.value})} className="w-full px-4 py-3 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink/80 mb-1">WhatsApp / Phone *</label>
                        <input required type="tel" value={guestDetails.phone} onChange={e => setGuestDetails({...guestDetails, phone: e.target.value})} className="w-full px-4 py-3 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-ink/80 mb-1">Email (to receive booking receipt)</label>
                        <input type="email" value={guestDetails.email} onChange={e => setGuestDetails({...guestDetails, email: e.target.value})} className="w-full px-4 py-3 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" placeholder="name@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink/80 mb-1">Hotel (optional)</label>
                        <input type="text" value={guestDetails.hotel} onChange={e => setGuestDetails({...guestDetails, hotel: e.target.value})} className="w-full px-4 py-3 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink/80 mb-1">Notes / Medical Conditions (optional)</label>
                      <textarea rows={3} value={guestDetails.notes} onChange={e => setGuestDetails({...guestDetails, notes: e.target.value})} className="w-full px-4 py-3 bg-white border border-mist rounded-xl focus:outline-none focus:ring-1 focus:ring-olive"></textarea>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 text-red-800 rounded-xl text-sm border border-red-100">
                        {error}
                      </div>
                    )}
                  </form>
                </div>

                {/* Summary Card */}
                <div className="lg:col-span-2">
                  <div className="bg-mist/30 border border-mist rounded-3xl p-8 sticky top-32">
                    <h3 className="font-serif text-2xl text-olive mb-6">Summary</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start">
                        <Flower2 className="w-5 h-5 text-gold mr-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-olive">{selectedService.name}</p>
                          <p className="text-sm text-ink/60">{selectedDuration} min</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CalendarIcon className="w-5 h-5 text-gold mr-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-olive">{format(new Date(date), "EEEE, MMMM d")}</p>
                          <p className="text-sm text-ink/60">at {selectedTime}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="w-5 h-5 text-gold mr-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-olive">{guests} Guest{guests > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-mist/50 flex justify-between items-end mb-8">
                      <p className="text-sm font-medium text-ink/80 uppercase tracking-widest">Total</p>
                      <p className="text-3xl font-serif text-olive">${(selectedPrice ?? 0) * guests}</p>
                    </div>

                    <button
                      form="booking-form"
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-olive text-cream tracking-widest uppercase text-sm rounded-full hover:bg-gold transition-colors shadow-md disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Request Booking"}
                    </button>
                    <p className="text-xs text-center text-ink/50 mt-4 font-light">No payment required now. Pay at the spa.</p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center max-w-2xl mx-auto py-12">
                <div className="w-20 h-20 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-olive" />
                </div>
                <h2 className="font-serif text-4xl text-olive mb-4">Request Received</h2>
                <p className="text-lg text-ink/80 font-light mb-8">
                  Thank you, {guestDetails.name}. Your booking reference is <strong className="font-medium text-olive">{reference}</strong>.
                </p>
                
                <div className="bg-white border border-mist p-8 rounded-2xl mb-10 text-left">
                  <p className="text-ink/80 font-light leading-relaxed mb-4">
                    Our team is currently reviewing your request. We will send a confirmation message to your WhatsApp within 30 minutes to confirm your appointment.
                  </p>
                  {guestDetails.email && (
                    <p className="text-olive font-medium text-sm leading-relaxed mb-4 flex items-center bg-cream/70 p-3 rounded-xl border border-mist/80">
                      <span className="mr-2 text-base">✉️</span>
                      <span>A booking summary email has been dispatched to <strong>{guestDetails.email}</strong>.</span>
                    </p>
                  )}
                  <p className="text-ink/80 font-light leading-relaxed">
                    If you need immediate assistance, please feel free to message us directly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href={`https://wa.me/8551770835459?text=Hello, I just submitted a booking request (${reference}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-[#25D366] text-white tracking-widest uppercase text-sm rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    WhatsApp Us Now
                  </a>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-3 border border-mist text-ink tracking-widest uppercase text-sm rounded-full hover:bg-mist transition-colors"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Just defining the missing icon here so we don't import fail
function Flower2(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 3.183-7.682"/><path d="M12 7.5a4.5 4.5 0 1 0-3.183-7.682"/><path d="M12 7.5V22"/><path d="m8 16 4-4 4 4"/><path d="M8 12a4.5 4.5 0 1 0 7.682-3.183"/><path d="M16 12a4.5 4.5 0 1 1-7.682-3.183"/></svg>;
}
