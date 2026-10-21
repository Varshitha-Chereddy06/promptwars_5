import { EventType, BudgetCategory, Milestone, Vendor, Guest, Table, MoodboardTheme } from '../types';

export const EVENT_TYPE_METADATA: Record<EventType, {
  name: string;
  tagline: string;
  badge: string;
  defaultVibe: string;
  defaultGuestCount: number;
  defaultBudget: number;
  vibes: string[];
}> = {
  wedding: {
    name: 'Wedding Celebration',
    tagline: 'High-stakes romance, timeless aesthetics, and precision logistics',
    badge: '💍 Wedding',
    defaultVibe: 'Romantic Garden Whimsy & Golden Hour Candlelight',
    defaultGuestCount: 120,
    defaultBudget: 35000,
    vibes: [
      'Romantic Garden Whimsy & Golden Hour Candlelight',
      'Black Tie Luxury Ballroom & Modern Glamour',
      'Bohemian Coastal Sunset & Wild Florals',
      'Modern Minimalist Industrial Loft & Editorial Chic',
      'Traditional Cultural Extravaganza & Royal Grandeur'
    ]
  },
  birthday: {
    name: 'Milestone Birthday Party',
    tagline: 'High-energy celebration, bespoke entertainment, and unforgettable surprises',
    badge: '🎂 Milestone Birthday',
    defaultVibe: 'Retro Disco Glamour & Studio 54 Cocktails',
    defaultGuestCount: 60,
    defaultBudget: 7500,
    vibes: [
      'Retro Disco Glamour & Studio 54 Cocktails',
      'Neon Cyberpunk Speakeasy & DJ Lounge',
      'Intimate Tuscan Al Fresco Vineyard Supper',
      'Tropical Luau Sunset Fiesta & Tiki Bar',
      'Gilded Gatsby 1920s Casino & Jazz Soirée'
    ]
  },
  community: {
    name: 'Community & Cultural Gathering',
    tagline: 'Inclusive public event, volunteer coordination, permits, and sponsor outreach',
    badge: '🤝 Community Event',
    defaultVibe: 'Vibrant Neighborhood Artisan Fair & Street Food Gala',
    defaultGuestCount: 300,
    defaultBudget: 18000,
    vibes: [
      'Vibrant Neighborhood Artisan Fair & Street Food Gala',
      'Grassroots Tech Innovation Summit & Hackathon',
      'Charity 5K Run & Eco-Festival for Green Spaces',
      'Civic Heritage Day & Cultural Music Festival',
      'Youth Empowerment Arts & Education Showcase'
    ]
  }
};

export const DEFAULT_BUDGET_SPLITS: Record<EventType, Array<Omit<BudgetCategory, 'id' | 'allocatedAmount' | 'spentAmount'>>> = {
  wedding: [
    { name: 'Venue & Space Rental', percentage: 26, iconName: 'Building', color: '#c5a359', notes: 'Ceremony & reception halls, security deposit' },
    { name: 'Catering, Bar & Service', percentage: 20, iconName: 'Utensils', color: '#e14d6c', notes: 'Plated dinner, cocktail hour hors d\'oeuvres, open bar' },
    { name: 'Photography & Videography', percentage: 12, iconName: 'Camera', color: '#3b82f6', notes: 'Full-day coverage, drone shots, heirloom album' },
    { name: 'Floral Design & Decor', percentage: 10, iconName: 'Flower2', color: '#10b981', notes: 'Bridal bouquet, ceremony arch, table centerpieces' },
    { name: 'Music, Sound & DJ', percentage: 8, iconName: 'Music', color: '#8b5cf6', notes: 'Ceremony acoustic quartet + evening party DJ' },
    { name: 'Attire, Hair & Makeup', percentage: 8, iconName: 'Sparkles', color: '#ec4899', notes: 'Gown, tuxedos, trial runs, day-of bridal glam' },
    { name: 'Stationery & Favors', percentage: 3, iconName: 'Mail', color: '#f59e0b', notes: 'Letterpress save-the-dates, invites, custom favors' },
    { name: 'Contingency & Emergency Buffer', percentage: 13, iconName: 'ShieldAlert', color: '#64748b', notes: 'Crucial rainy-day safety margin and unexpected fees' }
  ],
  birthday: [
    { name: 'Venue Rental / Private Room', percentage: 28, iconName: 'Building', color: '#3b82f6', notes: 'Private rooftop lounge or venue rental' },
    { name: 'Food, Cocktails & Bartender', percentage: 32, iconName: 'Utensils', color: '#e14d6c', notes: 'Signature cocktails, gourmet buffet or food truck' },
    { name: 'Entertainment, DJ & Audio', percentage: 16, iconName: 'Music', color: '#8b5cf6', notes: 'Live DJ, lighting rig, karaoke or MC' },
    { name: 'Custom Cake & Dessert Station', percentage: 8, iconName: 'Cake', color: '#ec4899', notes: 'Multi-tiered centerpiece cake & dessert shooters' },
    { name: 'Theme Decor, Balloons & Photo Booth', percentage: 10, iconName: 'Camera', color: '#10b981', notes: '360 video booth, custom neon signage, balloon garlands' },
    { name: 'Contingency & Guest Favors', percentage: 6, iconName: 'Gift', color: '#64748b', notes: 'Personalized gift bags and tip buffer' }
  ],
  community: [
    { name: 'Venue, City Permits & Licensing', percentage: 22, iconName: 'Building', color: '#c5a359', notes: 'Park booking, sound permits, street closure insurance' },
    { name: 'Food Stalls & Hospitality', percentage: 26, iconName: 'Utensils', color: '#e14d6c', notes: 'Free community refreshments, water stations, food vouchers' },
    { name: 'Stage, Sound & AV Production', percentage: 20, iconName: 'Music', color: '#8b5cf6', notes: 'PA system, microphones, staging, generators' },
    { name: 'Signage, Marketing & Badges', percentage: 12, iconName: 'Megaphone', color: '#3b82f6', notes: 'Directional banners, flyers, social promo, name tags' },
    { name: 'Volunteer Care & Supplies', percentage: 8, iconName: 'Users', color: '#10b981', notes: 'Volunteer t-shirts, walkie-talkies, crew lunch' },
    { name: 'Security, Sanitation & Safety', percentage: 6, iconName: 'Shield', color: '#f59e0b', notes: 'First aid tent, portable restrooms, waste collection' },
    { name: 'Emergency Contingency Reserve', percentage: 6, iconName: 'ShieldAlert', color: '#64748b', notes: 'Weather delays or surge attendance safety margin' }
  ]
};

export const DEFAULT_TIMELINE_TEMPLATES: Record<EventType, Array<{ title: string; daysBeforeEvent: number; category: string; notes: string }>> = {
  wedding: [
    { title: 'Lock down Ceremony & Reception Venue', daysBeforeEvent: 365, category: 'Venue', notes: 'Confirm capacity, sound curfew, and caterer policy' },
    { title: 'Determine Target Guest Count & Rough Budget', daysBeforeEvent: 330, category: 'Planning', notes: 'Gather family lists and set initial spending caps' },
    { title: 'Hire Lead Photographer & Videographer', daysBeforeEvent: 270, category: 'Media', notes: 'Review portfolio lighting in similar venues' },
    { title: 'Send Save-the-Dates to Guests', daysBeforeEvent: 240, category: 'Stationery', notes: 'Include event city, date, and travel advice' },
    { title: 'Select & Order Wedding Attire', daysBeforeEvent: 210, category: 'Attire', notes: 'Allow 4-6 months for alterations and fittings' },
    { title: 'Book Caterer, Bar Service & Cake Tasting', daysBeforeEvent: 150, category: 'Food & Drink', notes: 'Test signature cocktails and request allergen options' },
    { title: 'Book DJ / Band & Sound Engineering', daysBeforeEvent: 120, category: 'Entertainment', notes: 'Create "Must-Play" and "Do-Not-Play" music lists' },
    { title: 'Mail Formal Wedding Invitations', daysBeforeEvent: 75, category: 'Stationery', notes: 'Specify dietary card and RSVP return date' },
    { title: 'Final RSVP Cutoff & Headcount Lock', daysBeforeEvent: 30, category: 'Guests', notes: 'Follow up with all non-responders directly' },
    { title: 'Finalize Seating Chart & Table Escort Cards', daysBeforeEvent: 14, category: 'Planning', notes: 'Group guests by rapport and dietary badges' },
    { title: 'Final Venue Walkthrough & Vendor Timeline Sync', daysBeforeEvent: 7, category: 'Coordination', notes: 'Distribute Day-of Run-of-Show to all vendors' },
    { title: 'Rehearsal Dinner & Final Toast Walkthrough', daysBeforeEvent: 1, category: 'Event', notes: 'Relax, review cues, and rest before the big day' },
    { title: 'The Wedding Day: Ceremony & Celebration!', daysBeforeEvent: 0, category: 'Day-of', notes: 'Celebrate your love with family and friends!' }
  ],
  birthday: [
    { title: 'Select Theme, Vibe & Scout Venue Options', daysBeforeEvent: 60, category: 'Venue', notes: 'Determine if home, private room, or lounge fits best' },
    { title: 'Book Venue, DJ or Live Entertainment', daysBeforeEvent: 45, category: 'Entertainment', notes: 'Confirm deposit and sound system requirements' },
    { title: 'Send Digital Invitations (WhatsApp / Paperless)', daysBeforeEvent: 30, category: 'Guests', notes: 'Set RSVP deadline 2 weeks before the party' },
    { title: 'Design Custom Centerpiece Cake & Specialty Bar', daysBeforeEvent: 21, category: 'Food & Drink', notes: 'Coordinate cake aesthetic with party colors' },
    { title: 'Order Customized Balloon Installation & Decor', daysBeforeEvent: 14, category: 'Decor', notes: 'Neon sign, photo backdrop, and selfie props' },
    { title: 'Lock Down Final Guest RSVP & Catering Order', daysBeforeEvent: 10, category: 'Catering', notes: 'Confirm platter quantities and bar alcohol count' },
    { title: 'Coordinate Secret Surprise Moment or Toast', daysBeforeEvent: 4, category: 'Surprise', notes: 'Brief key conspirators on timing and musical cues' },
    { title: 'Venue Setup, Sound Check & Party Kickoff!', daysBeforeEvent: 0, category: 'Day-of', notes: 'Turn up the music, pop champagne, and enjoy!' }
  ],
  community: [
    { title: 'Submit Municipal Park & Street Closure Permits', daysBeforeEvent: 120, category: 'Legal & Permits', notes: 'Coordinate with city council, police, and fire dept' },
    { title: 'Form Steering Committee & Assign Team Leads', daysBeforeEvent: 90, category: 'Volunteers', notes: 'Logistics, sponsorship, marketing, volunteer heads' },
    { title: 'Draft Sponsor Prospectus & Outreach Campaign', daysBeforeEvent: 75, category: 'Sponsors', notes: 'Pitch local businesses for tier packages and banner slots' },
    { title: 'Contract AV Staging, Sound PA & Generators', daysBeforeEvent: 60, category: 'Production', notes: 'Ensure sufficient wattage for food vendors and stages' },
    { title: 'Launch Public Registration & Volunteer Drive', daysBeforeEvent: 45, category: 'Community', notes: 'Publish press release, social flyers, and poster boards' },
    { title: 'Book Food Trucks, Artisans & Stage Performers', daysBeforeEvent: 30, category: 'Vendors', notes: 'Collect health inspection certificates and insurance' },
    { title: 'Print Directional Signage, Banners & Volunteer Badges', daysBeforeEvent: 14, category: 'Signage', notes: 'Include map QR codes and emergency contact info' },
    { title: 'Volunteer Orientation & Emergency Safety Drill', daysBeforeEvent: 7, category: 'Volunteers', notes: 'Review crowd flow, lost child protocol, and shifts' },
    { title: 'Event Day: Gates Open, Live Stage & Festival!', daysBeforeEvent: 0, category: 'Day-of', notes: 'Execute seamless community celebration!' }
  ]
};

export const DEFAULT_VENDORS_BY_TYPE: Record<EventType, Array<{ category: string; name: string; notes: string; estimatedPrice: number }>> = {
  wedding: [
    { category: 'Venue', name: 'Grand Pavilion / Estate Grounds', notes: 'Includes 10 hours rental, chairs, and bridal suite', estimatedPrice: 9100 },
    { category: 'Catering', name: 'Artisan Culinary Co.', notes: '3-course plated dinner + late night bite station', estimatedPrice: 7000 },
    { category: 'Photography', name: 'Lumière Fine Art Photo', notes: '2 photographers, 9 hours coverage, online gallery', estimatedPrice: 4200 },
    { category: 'Florals & Decor', name: 'Petals & Branches Studio', notes: 'Ceremony arch, 14 table centerpieces, bridal party bouquets', estimatedPrice: 3500 },
    { category: 'Music & DJ', name: 'Sonic Groove Entertainment', notes: 'Wireless mics, dance floor intelligent lighting, sound tech', estimatedPrice: 2800 },
    { category: 'Hair & Glam', name: 'Velvet Glam Bridal Team', notes: 'Bride trial + 5 bridesmaids hair and makeup', estimatedPrice: 1800 },
    { category: 'Wedding Cake', name: 'Sweet Flourishes Bakery', notes: '3-tier vanilla bean with raspberry buttercream', estimatedPrice: 950 }
  ],
  birthday: [
    { category: 'Venue', name: 'Skyline Terrace Lounge', notes: 'Private indoor/outdoor terrace with heated pergolas', estimatedPrice: 2100 },
    { category: 'Catering & Bar', name: 'Craft Cocktail & Taco Truck', notes: 'Bespoke cocktail menu + gourmet street taco buffet', estimatedPrice: 2400 },
    { category: 'DJ & Sound', name: 'Vibe Master Entertainment', notes: 'Custom disco/funk playlist with subwoofer and laser rig', estimatedPrice: 1200 },
    { category: 'Cake & Treats', name: 'Sugar Artistry Studio', notes: 'Architectural celebration cake with sparklers', estimatedPrice: 600 },
    { category: 'Decor & Photo Booth', name: 'Luxe Balloon & 360 Booth Co.', notes: 'Gold arch, neon birthday sign, and interactive booth', estimatedPrice: 750 }
  ],
  community: [
    { category: 'Permits & Municipal Space', name: 'City Parks & Recreation Department', notes: 'Public park permit, noise variance, and cleanup bond', estimatedPrice: 3960 },
    { category: 'AV & Staging Tech', name: 'Pulse Stage & Sound Solutions', notes: 'Covered mobile stage, 4-way speaker array, microphones', estimatedPrice: 3600 },
    { category: 'Community Refreshments', name: 'Local Food Collective', notes: 'Free lemonade, hydration stations, and volunteer lunches', estimatedPrice: 4680 },
    { category: 'Signage & Marketing', name: 'Express Print & Banner Works', notes: 'Fence banners, A-frame directionals, and printed program maps', estimatedPrice: 2160 },
    { category: 'Safety & Facilities', name: 'Metro Safety & Sanitation Services', notes: 'First-aid station, 6 portable restrooms, recycle bins', estimatedPrice: 1080 }
  ]
};

export const PRESET_THEMES: MoodboardTheme[] = [
  {
    id: 'theme-champagne-rose',
    name: 'Champagne & Rose Gold Romance',
    description: 'Effortlessly luxurious with warm glowing metallics, blush tones, and lush botanical accents.',
    palette: [
      { hex: '#c5a359', name: 'Vintage Champagne', role: 'primary' },
      { hex: '#fce7ea', name: 'Blush Whisper', role: 'secondary' },
      { hex: '#e14d6c', name: 'Velvet Rose', role: 'accent' },
      { hex: '#292524', name: 'Warm Onyx', role: 'neutral' },
      { hex: '#fafaf9', name: 'Alabaster Silk', role: 'highlight' }
    ],
    fontPairing: {
      heading: 'Playfair Display (Serif)',
      body: 'Plus Jakarta Sans (Sans-serif)'
    },
    decorElements: ['Floating taper candles in fluted glass', 'Cascading ranunculus & blush peonies', 'Brushed gold cutlery with linen napkins', 'Fairy light ceiling canopy'],
    stylingKeywords: ['Timeless', 'Romantic', 'Intimate', 'Luminous', 'Heirloom']
  },
  {
    id: 'theme-emerald-botanical',
    name: 'Emerald Forest & Modern Botanical',
    description: 'Deep woodland greens paired with crisp white marble and modern brass accents for an organic, upscale vibe.',
    palette: [
      { hex: '#064e3b', name: 'Deep Emerald', role: 'primary' },
      { hex: '#059669', name: 'Forest Jade', role: 'secondary' },
      { hex: '#d97706', name: 'Warm Amber', role: 'accent' },
      { hex: '#1c1917', name: 'Charcoal Slate', role: 'neutral' },
      { hex: '#f4fbf7', name: 'Eucalyptus Mist', role: 'highlight' }
    ],
    fontPairing: {
      heading: 'Cormorant Garamond',
      body: 'Inter'
    },
    decorElements: ['Hanging eucalyptus and monstera foliage', 'Smoked olive glassware', 'Raw natural wood banquet tables', 'Edison bulb chandeliers'],
    stylingKeywords: ['Organic', 'Botanical', 'Earthy Elegance', 'Modern Rustic', 'Fresh']
  },
  {
    id: 'theme-cyber-sunset',
    name: 'Neon Sunset & Electric Retro',
    description: 'High energy, vibrant retro-wave palette made for unforgettable birthday parties and lively modern events.',
    palette: [
      { hex: '#8b5cf6', name: 'Electric Purple', role: 'primary' },
      { hex: '#ec4899', name: 'Hot Pink Neon', role: 'secondary' },
      { hex: '#06b6d4', name: 'Cyan Glow', role: 'accent' },
      { hex: '#0f172a', name: 'Midnight Navy', role: 'neutral' },
      { hex: '#fdf4ff', name: 'Strobe White', role: 'highlight' }
    ],
    fontPairing: {
      heading: 'Syne / Montserrat Bold',
      body: 'Plus Jakarta Sans'
    },
    decorElements: ['Custom laser-cut neon quote signage', 'Holographic acrylic place cards', 'Mirrored disco ball clusters', 'Interactive LED dance floor'],
    stylingKeywords: ['High-Voltage', 'Playful', 'Retro Glam', 'Photogenic', 'Electric']
  },
  {
    id: 'theme-civic-harmony',
    name: 'Civic Harmony & Community Green',
    description: 'Warm, approachable, and highly accessible aesthetic tailored for inclusive festivals, conferences, and charity galas.',
    palette: [
      { hex: '#2563eb', name: 'Civic Royal Blue', role: 'primary' },
      { hex: '#16a34a', name: 'Community Meadow', role: 'secondary' },
      { hex: '#ea580c', name: 'Warm Terracotta', role: 'accent' },
      { hex: '#334155', name: 'Slate Gray', role: 'neutral' },
      { hex: '#ffffff', name: 'Pure White', role: 'highlight' }
    ],
    fontPairing: {
      heading: 'Plus Jakarta Sans Bold',
      body: 'Inter'
    },
    decorElements: ['Weatherproof canvas sponsor banners', 'Biodegradable kraft paper signage', 'Potted native plants as centerpieces', 'Clear ADA-compliant wayfinding arrows'],
    stylingKeywords: ['Welcoming', 'Inclusive', 'Accessible', 'Vibrant', 'Sustainable']
  }
];

export const INITIAL_GUESTS: Guest[] = [
  { id: 'g-1', name: 'Sophia Montgomery', email: 'sophia@example.com', phone: '+1 (555) 234-5678', group: 'VIP', rsvpStatus: 'confirmed', plusOnes: 1, dietary: 'vegetarian', mealChoice: 'Truffle Risotto', tableId: 't-1', seatNumber: 1, notes: 'Maid of honor' },
  { id: 'g-2', name: 'Alexander Wright', email: 'alex@example.com', phone: '+1 (555) 345-6789', group: 'VIP', rsvpStatus: 'confirmed', plusOnes: 0, dietary: 'none', mealChoice: 'Filet Mignon', tableId: 't-1', seatNumber: 2, notes: 'Best man' },
  { id: 'g-3', name: 'Elena Rostova', email: 'elena@example.com', phone: '+1 (555) 456-7890', group: 'Family', rsvpStatus: 'confirmed', plusOnes: 1, dietary: 'gluten_free', mealChoice: 'Pan-seared Salmon', tableId: 't-2', seatNumber: 1 },
  { id: 'g-4', name: 'Marcus Chen', email: 'marcus@example.com', phone: '+1 (555) 567-8901', group: 'Friends', rsvpStatus: 'confirmed', plusOnes: 0, dietary: 'nut_allergy', mealChoice: 'Filet Mignon', tableId: 't-2', seatNumber: 2, notes: 'Severe peanut allergy' },
  { id: 'g-5', name: 'Amina Al-Mansoor', email: 'amina@example.com', phone: '+1 (555) 678-9012', group: 'Friends', rsvpStatus: 'pending', plusOnes: 1, dietary: 'halal', mealChoice: 'Herb-roasted Chicken' },
  { id: 'g-6', name: 'David Miller', email: 'david@example.com', phone: '+1 (555) 789-0123', group: 'Colleagues', rsvpStatus: 'pending', plusOnes: 0, dietary: 'none' },
  { id: 'g-7', name: 'Clara Oswald', email: 'clara@example.com', phone: '+1 (555) 890-1234', group: 'Family', rsvpStatus: 'declined', plusOnes: 0, dietary: 'none', notes: 'Overseas work commitment' }
];

export const INITIAL_TABLES: Table[] = [
  { id: 't-1', name: 'Head Table (Emerald)', shape: 'head', capacity: 6, x: 280, y: 50, guestIds: ['g-1', 'g-2'] },
  { id: 't-2', name: 'Table 1: Gardenia', shape: 'round', capacity: 8, x: 120, y: 190, guestIds: ['g-3', 'g-4'] },
  { id: 't-3', name: 'Table 2: Magnolia', shape: 'round', capacity: 8, x: 440, y: 190, guestIds: [] },
  { id: 't-4', name: 'Table 3: Camellia', shape: 'round', capacity: 8, x: 280, y: 320, guestIds: [] }
];
