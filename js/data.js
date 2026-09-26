/**
 * Authentic Brick & Bath Data Store
 * Sourced directly from live backend database
 */

const BRICKNBATH_DATA = {
  brand: {
    name: "BricknBath",
    tagline: "Creating Bathrooms That Inspire Everyday Living",
    subtagline: "India's most trusted and innovative bathroom transformation brand",
    parentCompany: "A unit of BricknBar Building Materials",
    phone: "+91 72058 89111",
    phoneClean: "917205889111",
    tollFree: "1800-212-0151",
    email: "contact@bricknbath.com",
    careerEmail: "career@bricknbath.com",
    helpEmail: "help@bricknbath.com",
    address: "Opp. HDFC Bank, Biju Pattnaik College Rd, near JIO Office, Jayadev Vihar, Bhubaneswar, Odisha 751013",
    googleMapsUrl: "https://maps.google.com/?q=BricknBath+Jayadev+Vihar+Bhubaneswar+Odisha+751013",
    catalogueUrl: "https://flipebooks.com/view/bricknbath-catalogue-final-compressed-R-abj3P-SV",
    socials: {
      instagram: "https://www.instagram.com/bricknbath/",
      facebook: "https://www.facebook.com/bricknbath/",
      pinterest: "https://in.pinterest.com/bricknbath/",
      youtube: "https://www.youtube.com/@Bricknbath/"
    },
    metrics: [
      { number: "21 Days", label: "Guaranteed Turnaround" },
      { number: "5-10 Years", label: "Waterproof Warranty" },
      { number: "100%", label: "Transparent Fixed Pricing" }
    ]
  },

  collections: [
    {
      id: "aura",
      name: "Aura Collection",
      tagline: "Smart Contemporary Transformation",
      bestFor: "Ideal for Apartments, Rental Homes & Budget Renovations",
      timeline: "21 Days",
      warranty: "5 Years",
      brandPartners: ["Johnson", "Jaquar", "Cera"],
      image: "assets/services/aura.png",
      popular: false,
      summary: "Where premium design meets complete bathroom transformation, crafted for modern urban living. Everything your dream bathroom needs, professionally delivered and beautifully installed.",
      features: [
        "Complete demolition of old tiles & fixtures",
        "Dual-coat polymer waterproofing & leak barrier",
        "Designer ceramic floor & wall tiles (12+ options)",
        "Premium Jaquar CP fittings & rain shower",
        "Contemporary wall-mounted vanity cabinet",
        "Wall-mounted WC with concealed dual-flush cistern",
        "Sleek counter basin & frameless LED mirror",
        "Complete bathroom accessories set (towel rail, hooks, paper holder)",
        "End-to-end dedicated labour, supervision & epoxy grouting"
      ],
      idealBudgetRange: "Custom Quote on 3D Survey"
    },
    {
      id: "prestige",
      name: "Prestige Collection",
      tagline: "Elevated Sophistication & Functional Elegance",
      bestFor: "Ideal for Modern Family Homes & Master Bathrooms",
      timeline: "21 - 25 Days",
      warranty: "5 Years",
      brandPartners: ["Jaquar", "Somany", "Hindware"],
      image: "assets/services/prestige.png",
      popular: true,
      summary: "Elevate your everyday bathroom with premium vitrified tiles, an enhanced vanity unit, designer LED mirror, elegant chrome accessories, smart storage, and a signature feature accent wall.",
      features: [
        "Full structural demolition with debris clearance",
        "Multi-layer heavy-duty waterproofing guarantee",
        "Large-format vitrified floor & wall tiles (600x1200mm)",
        "Artisanal feature accent wall (fluted, textured, or bookmatch)",
        "Enhanced moisture-resistant vanity with soft-close drawers",
        "Designer ambient-backlit LED anti-fog touch mirror",
        "Jaquar / Hindware premium diverter system & overhead shower",
        "Rimless wall-hung commode with soft-close seat",
        "Toughened glass partition option for wet/dry separation",
        "Rigorous 32-point pre-delivery quality inspection"
      ],
      idealBudgetRange: "Custom Quote on 3D Survey"
    },
    {
      id: "elite",
      name: "Elite Collection",
      tagline: "Architectural Haven of Luxury & Style",
      bestFor: "Ideal for Premium Villas, Luxury Penthouses & Duplexes",
      timeline: "25 - 30 Days",
      warranty: "7 Years",
      brandPartners: ["Kohler", "Grohe", "Kajaria", "Jaquar Artize"],
      image: "assets/services/elite.png",
      popular: false,
      summary: "An exclusive sanctuary of style, curated with premium materials, custom-designed architectural features, and luxurious accents to deliver a private spa sanctuary in your home.",
      features: [
        "Complete bespoke bathroom architectural redesign & 3D renders",
        "Slab-format imported porcelain tiles (1200x2400mm)",
        "Kohler / Grohe brushed brass or matte black thermostatic diverters",
        "Custom solid-wood vanity with quartz countertop",
        "Full wet-area toughened glass shower cubicle with black/gold hardware",
        "Concealed in-wall niche lighting and atmospheric cove illumination",
        "Designer table-top artisanal basin with tall basin mixer",
        "Intelligent smart toilet bidet system or rimless premium WC",
        "Dedicated site engineer & daily digital progress reporting",
        "7-Year warranty on waterproofing and plumbing craftsmanship"
      ],
      idealBudgetRange: "Custom Quote on 3D Survey"
    },
    {
      id: "signature",
      name: "Signature Collection",
      tagline: "The Pinnacle of Bespoke Opulence",
      bestFor: "Ultra-Luxury Estates, Bespoke Presidential Suites & High-End Residences",
      timeline: "30 - 35 Days",
      warranty: "10 Years",
      brandPartners: ["Grohe SPA", "Toto", "Kohler Statement", "Artize"],
      image: "assets/services/signature.png",
      popular: false,
      summary: "An ultra-premium offering where bespoke aesthetics, curated Italian marble, smart digital wellness showers, intelligent storage, and white-glove concierge management create a bathroom that is truly one-of-a-kind.",
      features: [
        "Fully tailored architectural consultation with senior interior lead",
        "Imported Italian marble or Spanish ultra-compact sintered stone",
        "Smart digital sensory multi-jet shower system with chromotherapy",
        "Freestanding stone resin luxury soaking bathtub",
        "Toto Neorest / Kohler smart integrated Japanese bidet toilet",
        "Custom double vanity with backlit onyx or quartz countertop",
        "Heated anti-fog smart touch mirrors with Bluetooth audio",
        "Custom walk-in closet & concealed designer storage integration",
        "White-glove project management with turnkey concierge service",
        "10-Year comprehensive warranty with biannual complimentary maintenance"
      ],
      idealBudgetRange: "Bespoke Architectural Quote"
    }
  ],

  transformations: [
    {
      id: "project-1",
      title: "Master Ensuite Transformation",
      location: "Jayadev Vihar, Bhubaneswar",
      scope: "Full Demolition, Italian Tile Overhaul, Wet-Dry Glass Partition, Concealed Grohe Diverter",
      turnaround: "22 Days",
      collection: "Elite Collection",
      beforeImg: "assets/transforms/transform1_before.png",
      afterImg: "assets/transforms/transform1_after.png",
      description: "From cramped, leaking 15-year-old traditional bathroom into a sleek, open-concept luxury sanctuary with recessed shelf lighting and marble vanity."
    },
    {
      id: "project-2",
      title: "Modern Minimalist Family Bath",
      location: "CDA Sector 9, Cuttack",
      scope: "Complete Waterproofing, Large Format 600x1200mm Tiles, Custom Fluted Vanity, Jaquar Rain Shower",
      turnaround: "19 Days",
      collection: "Prestige Collection",
      beforeImg: "assets/transforms/transform2_before.png",
      afterImg: "assets/transforms/transform2_after.png",
      description: "Transformed an outdated pastel bathroom into a warm, contemporary haven with brass accents and intelligent space planning."
    }
  ],

  processSteps: [
    {
      step: "01",
      title: "Free In-Home Consultation & 3D Plan",
      desc: "Our senior bathroom specialist visits your home, measures the layout, assesses plumbing/drainage, and creates a photo-realistic 3D design matching your style.",
      icon: "ruler-combined"
    },
    {
      step: "02",
      title: "Transparent Fixed Quote & Material Selection",
      desc: "No surprises or hidden fees. We provide a guaranteed itemized quote covering all tiles, fittings, electricals, waterproofing, and labor.",
      icon: "file-invoice-dollar"
    },
    {
      step: "03",
      title: "Clean Demolition & Moisture-Barrier Engineering",
      desc: "We dust-seal the work area, remove old tiles and rusty pipes safely, and apply multi-coat polymer waterproofing with flood testing.",
      icon: "shield-alt"
    },
    {
      step: "04",
      title: "Artisanal Tiling, Plumbing & Fixture Installation",
      desc: "Skilled master craftsmen lay precision laser-leveled tiles, install premium Jaquar/Kohler fittings, custom vanity, glass partition, and ambient lighting.",
      icon: "tools"
    },
    {
      step: "05",
      title: "32-Point Quality Inspection & White-Glove Handover",
      desc: "A dedicated project manager inspects water pressure, drainage slope, silicon seals, and finishes. We deep-clean the space and hand over your 5-year warranty card.",
      icon: "award"
    }
  ],

  brands: [
    { name: "Jaquar", tagline: "Complete Bathroom Solutions", tier: "Premium & Luxury" },
    { name: "Kohler", tagline: "Bold Luxury Fixtures", tier: "Global Luxury" },
    { name: "Grohe", tagline: "Pure Freude an Wasser", tier: "German Engineering" },
    { name: "Somany", tagline: "Tiles & Bath Fittings", tier: "Designer Ceramics" },
    { name: "Kajaria", tagline: "India's No. 1 Tile Company", tier: "Premium Vitrified" },
    { name: "Johnson", tagline: "Enduring Ceramic Elegance", tier: "Trusted Quality" },
    { name: "Hindware", tagline: "Italian Collection Sanitaryware", tier: "Modern Lifestyle" },
    { name: "Cera", tagline: "Style Matters", tier: "Contemporary Living" }
  ],

  testimonials: [
    {
      name: "Sneha Mishra",
      location: "Jayadev Vihar, Bhubaneswar",
      rating: 5,
      review: "The BricknBath team guided us through every step of the renovation process. They completed our master bathroom in exactly 20 days with zero mess in the living area. The communication and finishing were outstanding!",
      verified: true,
      serviceUsed: "Prestige Collection"
    },
    {
      name: "Sanjay Patel",
      location: "CDA, Cuttack",
      rating: 5,
      review: "Outstanding service and exceptional results! The bathroom design perfectly matched our 3D render, and the installation quality of our Jaquar fixtures and large tiles was top-notch. Highly recommended.",
      verified: true,
      serviceUsed: "Elite Collection"
    },
    {
      name: "Amit Kumar",
      location: "VIP Road, Puri",
      rating: 5,
      review: "We were impressed by the attention to detail and 100% transparent pricing. No sudden escalations. Our bathroom now feels like a 5-star luxury hotel spa. BricknBath made what looked stressful feel effortless.",
      verified: true,
      serviceUsed: "Signature Collection"
    },
    {
      name: "Priya Das",
      location: "Cuttack",
      rating: 5,
      review: "From the initial 3D design consultation to final silicone detailing, the entire experience was smooth and hassle-free. The quality of materials, tiles, and vanity craftsmanship exceeded our expectations!",
      verified: true,
      serviceUsed: "Aura Collection"
    },
    {
      name: "Rajesh Sharma",
      location: "Patia, Bhubaneswar",
      rating: 5,
      review: "BricknBath completely transformed our 20-year-old leaking bathroom into a modern, leak-free master retreat. The site supervisor was punctual, polite, and delivered exactly what was promised.",
      verified: true,
      serviceUsed: "Prestige Collection"
    }
  ],

  faqs: [
    {
      category: "Services & Scope",
      q: "What services does BricknBath provide?",
      a: "BricknBath provides end-to-end turnkey bathroom renovation solutions, including: in-home design consultation & 3D visualization, complete dust-controlled demolition, advanced multi-layer waterproofing, plumbing & drain line reconfiguration, electrical & ambient lighting upgrades, vitrified & marble tile installation, luxury sanitaryware & CP fittings installation, custom vanity cabinetry, toughened glass shower partitions, and final white-glove inspection."
    },
    {
      category: "About Us",
      q: "What is BricknBath?",
      a: "BricknBath is a specialized, luxury bathroom renovation service powered by BricknBar. We transform old, outdated, or leaking bathrooms into modern, functional, and luxurious private sanctuaries through professionally managed, fixed-price renovation packages."
    },
    {
      category: "Booking & Process",
      q: "How do I book a bathroom renovation consultation?",
      a: "Booking a consultation is easy! You can call us directly at +91 72058 89111 or Toll-Free at 1800-212-0151, click 'Book Free Consultation' on this website, or reach us on WhatsApp. Our renovation experts will contact you within 2 hours to discuss your project and schedule an in-home site visit."
    },
    {
      category: "Locations",
      q: "Which cities do you currently serve?",
      a: "We currently execute turnkey bathroom renovations across Bhubaneswar, Cuttack, Puri, and surrounding regions in Odisha. For projects outside these regions, please contact our team to confirm project availability."
    },
    {
      category: "Timeline",
      q: "How long does a complete bathroom renovation take?",
      a: "Our standard turnkey bathroom renovations are completed within 21 to 25 working days. Smaller cosmetic upgrades or Aura packages can take as little as 18 days, while bespoke luxury Signature suites with custom marble work take approximately 30-35 days. We commit to a guaranteed handover date before commencing work."
    },
    {
      category: "Warranty & Quality",
      q: "Do you provide a warranty on waterproofing and workmanship?",
      a: "Yes! Every BricknBath renovation comes with a written warranty of up to 5 to 10 years on our specialized multi-coat waterproofing barrier and workmanship. Furthermore, all branded fittings (Jaquar, Kohler, Grohe) carry standard manufacturer warranties of up to 10 years."
    },
    {
      category: "Pricing & Transparency",
      q: "Are there any hidden costs after the project begins?",
      a: "No. At BricknBath, transparency is our core promise. After our initial site assessment and 3D design approval, you receive a detailed, fixed-price contract outlining every material, brand, and scope of work. What you are quoted is what you pay."
    },
    {
      category: "Materials & Customization",
      q: "Can I choose my own tiles, sanitaryware, and vanity designs?",
      a: "Absolutely. You can select from our curated designer catalog or visit our flagship Jayadev Vihar Experience Center to touch and feel tiles, finishes, vanity wood grains, and fixture options with our interior designers."
    },
    {
      category: "Living in the House",
      q: "Can we live in the house while the bathroom is being renovated?",
      a: "Yes, our team follows strict clean-site protocols. We install dust barrier zip-doors, lay protective floor coverings across entry paths, clear debris daily, and maintain quiet working hours to cause minimal disruption to your daily home routine."
    },
    {
      category: "Demolition & Debris",
      q: "Who handles demolition and debris disposal?",
      a: "BricknBath manages 100% of demolition, debris bagging, and municipal disposal. You will not have to coordinate with any separate labor or disposal vehicles."
    },
    {
      category: "3D Visualization",
      q: "Do I get to see what my bathroom will look like before construction starts?",
      a: "Yes! Once we measure your bathroom, our design team produces photorealistic 3D renders showing the exact tiles, vanity, shower partition, and lighting layout. Work only begins after you are 100% satisfied with the visual plan."
    },
    {
      category: "Payment Terms",
      q: "What are the payment milestones?",
      a: "Payments are linked to verifiable project milestones (e.g. Booking & 3D approval, Demolition & Waterproofing stage, Tile completion, and Final Handover). You inspect the progress before releasing each milestone."
    }
  ],

  careers: [
    {
      id: "ops-manager",
      title: "Project Operations Manager",
      department: "Site Operations",
      location: "Bhubaneswar, Odisha",
      experience: "5 - 10 Years",
      type: "Full-Time",
      description: "Oversee multiple residential bathroom renovation sites, lead site supervisors and artisan teams, manage material supply chains, and ensure strict adherence to quality and safety standards."
    },
    {
      id: "crm-lead",
      title: "Client Experience & CRM Specialist",
      department: "Client Relations & Sales",
      location: "Bhubaneswar, Odisha",
      experience: "3 - 8 Years",
      type: "Full-Time",
      description: "Serve as the dedicated concierge for homeowners from initial consultation through design approval and handover. Ensure daily project updates and client delight."
    },
    {
      id: "site-supervisor",
      title: "Interior & Plumbing Site Supervisor",
      department: "Field Execution",
      location: "Bhubaneswar / Cuttack",
      experience: "3 - 6 Years",
      type: "Full-Time",
      description: "Direct on-site execution, laser-level tiling alignment, pressure testing of concealed plumbing, waterproofing flood tests, and vendor supervision."
    }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = BRICKNBATH_DATA;
}
