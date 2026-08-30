// Verbatim customer reviews from the Kell Electricals Google Business
// Profile (https://maps.app.goo.gl/CUDxCDE74MvUX3HRA?g_st=ic) and Trustpilot
// profile (https://www.trustpilot.com/review/kellelectricals.com). Text,
// star ratings, customer names, and dates are reproduced exactly as
// supplied — do not rewrite, paraphrase, "improve," or invent review
// content here. Reviews marked `truncated: true` were captured from a
// screenshot that cut the review short; only the text actually supplied is
// included (any trailing "…" is part of the supplied text itself, not
// added by us). This site never displays every review on either platform,
// only this curated subset — and never displays a negative review: the
// Trustpilot profile has an additional 1-star review that is deliberately
// excluded and must not be added here.
export type Testimonial = {
  id: number
  customerName: string
  rating: number
  date: string
  source: 'Google' | 'Trustpilot'
  review: string
  truncated?: boolean
  featured?: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    customerName: 'Daniella',
    rating: 5,
    date: '1 month ago',
    source: 'Google',
    review:
      'It was the most perfect service I have received in Nigeria so far.\n\nAnd the follow up was very helpful',
    featured: true,
  },
  {
    id: 2,
    customerName: 'Star Talker',
    rating: 5,
    date: '1 month ago',
    source: 'Google',
    review:
      'I employed the services of Kell Electricals to help install my inverter system as I had just moved into a new apartment and I have to say they were stellar in their delivery. Gabi and the team were professional and more than ready to answer …',
    truncated: true,
    featured: true,
  },
  {
    id: 3,
    customerName: 'Edith Essien',
    rating: 5,
    date: '7 months ago',
    source: 'Google',
    review:
      'Excellent service. They helped me install my inverter system and the finishing was very clean. No messy wires everywhere. They really know their stuff\nDefinitely my go to from now on',
    featured: true,
  },
  {
    id: 4,
    customerName: 'Kelechi Nnajiofor',
    rating: 5,
    date: '4 months ago',
    source: 'Google',
    review:
      'The work was really neat and had a general good outlook, also liked how mild and soothing it came out.',
  },
  {
    id: 5,
    customerName: 'Jimmy John',
    rating: 5,
    date: '3 months ago',
    source: 'Google',
    review: 'Nice and solid work that was done during the entire electrical installation process',
    featured: true,
  },
  {
    id: 6,
    customerName: 'Jemimah Duyle',
    rating: 5,
    date: '10 months ago',
    source: 'Google',
    review:
      'Kell Electricals is the best. They have professionals that actually know their onions. I had an issue with my meter for good three days and within a few seconds after placing a call, I got the solution. …',
    truncated: true,
    featured: true,
  },
  {
    id: 7,
    customerName: 'Nr. Deborah Omeni',
    rating: 5,
    date: '11 months ago',
    source: 'Google',
    review:
      'Great service. Didn’t have light for a whole day and I called this people in less than two hours he came to my house, very polite guy fixed it in less than an hour. Their prices are quite on the high side but it was worth it',
  },
  {
    id: 8,
    customerName: 'Mavis John',
    rating: 5,
    date: '11 months ago',
    source: 'Google',
    review:
      'I found Kell Electricals through a friend’s recommendation after struggling with constant power trips in my house. To be honest, I wasn’t sure what to expect because I’ve dealt with electricians in the past who either showed up late or …',
    truncated: true,
  },
  {
    id: 9,
    customerName: 'Motunrayo Fakorede',
    rating: 5,
    date: '11 months ago',
    source: 'Google',
    review:
      'I am very pleased with the service. The electricians were knowledgeable and most importantly, were dedicated to ensuring that the work was done properly and all issues resolved. Kudos to the team.',
    featured: true,
  },
  {
    id: 10,
    customerName: 'Jasmine Jasmine',
    rating: 5,
    date: '1 year ago',
    source: 'Google',
    review:
      'Fantastic service! The electricians were professional and efficient. They explained everything clearly and made sure the job was done safely and neatly. Great quality work at a fair price...highly recommend.',
    featured: true,
  },
  {
    id: 11,
    customerName: 'Amara',
    rating: 5,
    date: '1 year ago',
    source: 'Google',
    review:
      'Exceptional service from start to finish! The team was professional, attentive, and went above and beyond to ensure everything was seamless. Their attention to detail and commitment to quality truly set them apart. I highly recommend their services to anyone looking for reliability and excellence!',
    featured: true,
  },
  {
    id: 12,
    customerName: "Andromeda's Locs",
    rating: 5,
    date: '1 year ago',
    source: 'Google',
    review:
      "I recently had Kell Electricals Company handle the complete electrical installation and related services for my new salon, and I couldn't be more impressed. They took care of everything: ceiling installation, interior lighting, and all …",
    truncated: true,
    featured: true,
  },
  {
    id: 13,
    customerName: 'Peace Eze',
    rating: 5,
    date: '1 year ago',
    source: 'Google',
    review:
      "Great Customer Service. And they did an excellent job with my generator. Now it's so easy to start. I don't even have to pull twice.",
    featured: true,
  },
  {
    id: 14,
    customerName: 'Ms RM Gowon',
    rating: 5,
    date: '4 years ago',
    source: 'Google',
    review:
      "To say I'm impressed would be putting it mildly. Kell Electricals is an outstanding company with true professionals who have proven that our systems can work. …",
    truncated: true,
    featured: true,
  },
  {
    id: 15,
    customerName: 'Emmanuel Mathew',
    rating: 5,
    date: '2 years ago',
    source: 'Google',
    review:
      'I recently had Kell Electricals install a new electrical panel in my apartment. Am very impressed with their service from the beginning to the end of the service, they were responsive to my initial inquiry and schedule the work quickly. The …',
    truncated: true,
    featured: true,
  },
  {
    id: 16,
    customerName: 'R. E',
    rating: 5,
    date: '2 years ago',
    source: 'Google',
    review:
      'I reached out to them on a very short notice and they came through for me without questions. The engineers were also very nice and professional. They did a great job! I highly recommend them!',
    featured: true,
  },
  {
    id: 17,
    customerName: 'Edith Essien',
    rating: 5,
    date: 'January 25, 2026',
    source: 'Trustpilot',
    review:
      "I used kell electricals for a full rewire of my property recently, and I'm genuinely impressed. In an industry where it's hard to find technicians you can trust, their team stood out. They were punctual and provided a clear breakdown for the cost of materials used. There were no hidden charges and the finishing was very neat. It's refreshing to see a local business prioritize quality over shortcuts. I'll definitely be using them again for future maintenance.",
    featured: true,
  },
  {
    id: 18,
    customerName: 'Precious Inyang',
    rating: 4,
    date: 'January 16, 2026',
    source: 'Trustpilot',
    review:
      'Their service is satisfactory. They pay attention to details and give good recommendations to save costs and last.',
  },
  {
    id: 19,
    customerName: 'Motunrayo Fakorede',
    rating: 5,
    date: 'November 30, 2025',
    source: 'Trustpilot',
    review:
      'I can always trust the Kell team to resolve any electrical issues I may have, and go above and beyond to ensure that everything goes smoothly.\nGreat customer experience and professional technicians.',
    featured: true,
  },
  {
    id: 20,
    customerName: 'Chiemeria G EbubeDike',
    rating: 5,
    date: 'June 27, 2025',
    source: 'Trustpilot',
    review:
      "Kell Electricals did an outstanding job at my Gwarinpa home! They professionally installed my inverter and solar panels, set up my CCTV system, and replaced my home's switches, all of which are working perfectly. Their team was incredibly professional, and their work was remarkably clean and precise. For top-notch electrical services, I highly recommend Kell Electricals!",
    featured: true,
  },
  {
    id: 21,
    customerName: 'Sabastine Ugowuke',
    rating: 5,
    date: 'July 30, 2026',
    source: 'Trustpilot',
    review:
      "My industrial training experience at has been exceptional and rewarding. From the start, the team created a supportive learning environment and allowed me to work independently after clear explanations, which built my confidence and problem-solving skills. I gained a deeper understanding of electrical systems, especially the differences between industrial and domestic wiring, by applying theory to real projects. I'm truly grateful for the mentorship and knowledge shared.",
  },
  {
    id: 22,
    customerName: 'terhile waku',
    rating: 5,
    date: 'July 17, 2026',
    source: 'Trustpilot',
    review:
      'Kell Electricals gave me valuable industry experience as an IT student in Electrical Engineering.\nThe work environment was collaborative and professional.\nI learned a lot about [industrial machinery and connections,] while working alongside an experience Supervisor.\nThe experience improved my technical skills and gave me a better understanding of how Electrical Engineering work together.\nGreat place for students who want practical, hands-on learning.',
  },
  {
    id: 23,
    customerName: 'Collins Anthony',
    rating: 5,
    date: 'July 16, 2026',
    source: 'Trustpilot',
    review:
      'Firstly, I would like to thank the company for the great work they have done for me, by makings their work affordable, transparent, and reliable. I would say the material they use are all top-notch. And I recommend that you give them a trial.',
  },
]

export const featuredTestimonials = testimonials.filter((t) => t.featured)

export function getReviewUrl() {
  return 'https://maps.app.goo.gl/CUDxCDE74MvUX3HRA?g_st=ic'
}

// Direct link to the Google review composer — distinct from getReviewUrl()
// above, which points to the full review list on the Business Profile.
export function getWriteReviewUrl() {
  return 'https://g.page/r/CTxnaFyO9LMyEBE/review'
}

// Trustpilot profile — used both for the "read more reviews" CTA and as
// the write-a-review destination (Trustpilot doesn't have a separate
// review-composer URL the way Google does).
export function getTrustpilotUrl() {
  return 'https://www.trustpilot.com/review/kellelectricals.com'
}
