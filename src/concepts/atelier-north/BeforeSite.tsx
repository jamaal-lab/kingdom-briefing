import { useState } from 'react'
import { MEDIA, fallbackSrc } from '~/lib/media'
import { ConceptBadge } from './AfterSite'

/**
 * ATELIER NORTH — "before". A deliberately ordinary template site for the
 * same fictional practice, using the same photographs: weak hierarchy,
 * generic copy, undifferentiated navigation and a contact form as the only
 * path forward. Section ids match the "after" site so the Lab can compare
 * them section by section.
 */
export function BeforeSite() {
  const [note, setNote] = useState(false)
  const box = { fontFamily: 'Arial, Helvetica, sans-serif' }
  return (
    <div style={box} className="min-h-screen bg-white text-[15px] text-[#333]">
      <ConceptBadge tone="plain" />
      <div className="bg-[#2b4c7e] px-4 py-1.5 text-right text-[12px] text-white">Call us today! (555) 010-0000 | info@example.com</div>
      <header className="border-b border-[#ddd] bg-white">
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="text-[22px] font-bold text-[#2b4c7e]">
            ATELIER NORTH <span className="font-normal text-[#888]">Architects</span>
          </div>
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-[#2b4c7e]">
              {['Home', 'About Us', 'Services', 'Projects', 'News', 'Contact Us'].map((l) => (
                <li key={l}>
                  <a href={`#${l === 'Projects' ? 'work' : l === 'Services' ? 'services' : l === 'Contact Us' ? 'inquiry' : 'arrival'}`} className="hover:underline">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <section id="arrival" className="relative">
        <img src={fallbackSrc(MEDIA.morrow, 640)} alt="Building" className="block h-[260px] w-full object-cover sm:h-[340px]" style={{ imageRendering: 'auto', filter: 'saturate(1.25) contrast(1.05)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-4 text-center text-white">
          <h1 className="text-[28px] font-bold sm:text-[36px]" style={{ textShadow: '1px 1px 3px #000' }}>
            Welcome to Atelier North Architects!
          </h1>
          <p className="mt-2 max-w-lg text-[15px]" style={{ textShadow: '1px 1px 2px #000' }}>
            We are a full service architecture firm dedicated to quality, innovation and customer satisfaction.
          </p>
          <a href="#services" className="mt-4 rounded bg-[#3b82f6] px-5 py-2 text-[14px] font-bold text-white">
            Learn More
          </a>
        </div>
        <div className="flex justify-center gap-2 bg-[#eee] py-2" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-[#2b4c7e]' : 'bg-[#bbb]'}`} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-4 py-8">
        <h2 className="text-[22px] font-bold text-[#2b4c7e]">About Us</h2>
        <p className="mt-2 leading-relaxed">
          Atelier North Architects has been providing architecture services for many years. Our team of experienced professionals is passionate about design and we work
          hard to exceed our clients expectations on every project. We offer a wide range of services for residential and commercial clients. Contact us today to learn
          more about how we can help with your next project!
        </p>
      </section>

      <section id="services" className="bg-[#f5f5f5] py-8">
        <div className="mx-auto max-w-[1000px] px-4">
          <h2 className="text-center text-[22px] font-bold text-[#2b4c7e]">Our Services</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              ['🏠', 'Residential', 'We design beautiful homes for families of all sizes. Quality and service are our top priorities.'],
              ['🏢', 'Commercial', 'Our commercial services include offices, retail and more. We deliver on time and on budget.'],
              ['📐', 'Interiors', 'Let our interior design team help you create the space of your dreams.'],
            ].map(([icon, t, b]) => (
              <div key={t} className="rounded border border-[#ddd] bg-white p-4 text-center">
                <div className="text-[34px]" aria-hidden="true">
                  {icon}
                </div>
                <h3 className="mt-1 font-bold">{t}</h3>
                <p className="mt-1 text-[14px] text-[#666]">{b}</p>
                <a href="#inquiry" className="mt-2 inline-block text-[13px] text-[#3b82f6] underline">
                  Read more »
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-[1000px] px-4 py-8">
        <h2 className="text-[22px] font-bold text-[#2b4c7e]">Recent Projects</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[MEDIA.halden, MEDIA.kestrel, MEDIA.nocturne, MEDIA.interior].map((m, i) => (
            <figure key={m.base} className="border border-[#ddd] p-1">
              <img src={fallbackSrc(m, 640)} alt={`Project ${i + 1}`} loading="lazy" className="block h-24 w-full object-cover" />
              <figcaption className="py-1 text-center text-[12px] text-[#666]">Project {i + 1}</figcaption>
            </figure>
          ))}
        </div>
        <h2 className="mt-8 text-[22px] font-bold text-[#2b4c7e]">Why Choose Us?</h2>
        <ul className="mt-2 list-disc pl-6 leading-7">
          <li>Experienced team</li>
          <li>Quality service</li>
          <li>Competitive prices</li>
          <li>Customer satisfaction guaranteed</li>
        </ul>
      </section>

      <section id="inquiry" className="bg-[#f5f5f5] py-8">
        <div className="mx-auto max-w-[1000px] px-4">
          <h2 className="text-[22px] font-bold text-[#2b4c7e]">Contact Us</h2>
          <p className="mt-1 text-[14px]">Fill out the form below and we will get back to you as soon as possible.</p>
          <form
            className="mt-4 grid max-w-md gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              setNote(true)
            }}
          >
            {['Name', 'Email', 'Phone'].map((f) => (
              <label key={f} className="grid gap-1 text-[13px]">
                {f}*
                <input className="border border-[#bbb] px-2 py-1.5" disabled aria-describedby="before-note" />
              </label>
            ))}
            <label className="grid gap-1 text-[13px]">
              Message*
              <textarea className="h-20 border border-[#bbb] px-2 py-1.5" disabled aria-describedby="before-note" />
            </label>
            <button type="submit" className="mt-1 w-28 rounded bg-[#3b82f6] px-4 py-2 text-[14px] font-bold text-white">
              Submit
            </button>
            <p id="before-note" className="text-[12px] text-[#888]">
              {note ? 'This form is part of a fictional example and does not send anything.' : 'Example form — fields are disabled in this concept.'}
            </p>
          </form>
        </div>
      </section>

      <footer className="bg-[#2b4c7e] px-4 py-4 text-center text-[12px] text-white">
        © Atelier North Architects. All Rights Reserved. | Home | Privacy Policy | Sitemap
      </footer>
    </div>
  )
}
