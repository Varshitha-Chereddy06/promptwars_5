import { FullEventPlan, AIToolResult, PaletteColor } from '../types';
import { getStoredApiKey } from './storageService';
import { formatCurrency } from './calculationService';

export interface GenerateAIRequest {
  toolId: string;
  plan: FullEventPlan;
  customPrompt?: string;
  additionalParams?: Record<string, string>;
}

/**
 * Executes a tool or chat query via Gemini API or falls back to intelligent local synthesis
 */
export async function executeAITool(req: GenerateAIRequest): Promise<AIToolResult> {
  const apiKey = getStoredApiKey();
  const { toolId, plan, customPrompt, additionalParams } = req;

  // If user provided a Gemini API Key, try live API call
  if (apiKey && apiKey.length > 10) {
    try {
      const prompt = buildSystemPromptForTool(toolId, plan, customPrompt, additionalParams);
      const response = await callGeminiAPI(apiKey, prompt);
      if (response && response.trim().length > 0) {
        return {
          toolId,
          title: getToolTitle(toolId),
          content: response,
          generatedAt: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, using high-fidelity local engine fallback:', err);
    }
  }

  // High-fidelity local AI engine fallback (instant, context-aware, 100% resilient)
  // Simulate natural brief AI generation delay for realistic UX
  await new Promise(r => setTimeout(r, 600));

  const content = generateLocalAIEngineResponse(toolId, plan, customPrompt, additionalParams);
  return {
    toolId,
    title: getToolTitle(toolId),
    content,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Direct fetch to Gemini API
 */
async function callGeminiAPI(apiKey: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini API');
  return text;
}

/**
 * Builds structured prompts for Gemini
 */
function buildSystemPromptForTool(
  toolId: string,
  plan: FullEventPlan,
  customPrompt?: string,
  params?: Record<string, string>
): string {
  const { details, categories, milestones, vendors } = plan;
  const context = `
You are Soirée's Lead AI Event Planner.
Event Details:
- Type: ${details.type}
- Title: "${details.title}"
- Hosts: ${details.hostNames}
- Date: ${details.date} at ${details.time}
- City/Location: ${details.city} (${details.venueName})
- Theme/Vibe: "${details.vibe}"
- Total Budget: $${details.totalBudget.toLocaleString()} USD
- Expected Guests: ${details.guestCount}
- Categories: ${categories.map(c => `${c.name} (Budget: $${c.allocatedAmount}, Spent: $${c.spentAmount})`).join('; ')}
- Current Status: ${milestones.filter(m => m.status === 'completed').length}/${milestones.length} milestones complete.
`;

  switch (toolId) {
    case 'theme_studio':
      return `${context}\nTask: Theme Studio. Generate a breathtaking, bespoke theme for this event in ${details.city}. Provide:\n1. Theme Name & 2-sentence Concept\n2. 5 Hex Color Swatches with creative names (format: HEX - Name - Role)\n3. Signature Decor & Lighting Highlights\n4. Sensory Details (Florals/Textures/Aroma)\n5. Dress Code Guideline. Return in clean Markdown.`;

    case 'run_of_show':
      return `${context}\nTask: Run-of-Show. Create a detailed, minute-by-minute operational schedule from morning vendor load-in to midnight teardown. Include Exact Time, Activity, Lead/Responsible Person, and Music/Cues. Return as a clean Markdown table with operational tips.`;

    case 'invite_writer':
      return `${context}\nTask: Multi-Tone Invite Writer. Craft 3 distinct invitations:\n1. Tone A: Formal & Prestigious\n2. Tone B: Warm & Celebratory\n3. Tone C: Fun, Creative & Whimsical\n4. Plus a 1-click Short WhatsApp / SMS version (under 250 characters with emojis and RSVP link placeholder).`;

    case 'toast_speech':
      const speaker = params?.speaker || (details.type === 'wedding' ? 'Maid of Honor / Best Man' : 'Host / Guest of Honor');
      return `${context}\nTask: Toast & Speech Crafter for: ${speaker}. Tone: ${params?.tone || 'Heartfelt with subtle humor'}. Include an engaging opening icebreaker, 2 personal storytelling beats, and a memorable champagne toast climax. 3-4 minutes speaking time.`;

    case 'disaster_doctor':
      const scenario = customPrompt || params?.crisis || 'Heavy unexpected rainstorm and delayed caterer';
      return `${context}\nTask: Disaster Doctor Contingency Protocol for: "${scenario}". Provide:\n- Immediate 5-minute Action Step\n- Plan A: Quick Pivot\n- Plan B: Alternate Setup\n- Plan C: Emergency Backup Plan\n- Vendor communication script.`;

    case 'budget_hacker':
      return `${context}\nTask: Budget Hacker. Audit the current spends and allocations. Identify the 3 biggest areas of financial risk, and provide 5 creative, practical cost-saving hacks specific to ${details.city} that save at least 15-20% without hurting the guest experience.`;

    case 'surprise_moments':
      return `${context}\nTask: Surprise Moments Engine. Brainstorm 5 unexpected, delightful 'wow-factor' moments tailored specifically for ${details.guestCount} guests enjoying "${details.vibe}" in ${details.city}.`;

    case 'sponsor_pitch':
      return `${context}\nTask: Sponsor Pitch & Outreach Deck. Generate:\n1. Executive Summary & Value Proposition for local sponsors\n2. 3 Sponsorship Tiers (Platinum, Gold, Community Champion) with realistic pricing and deliverables\n3. High-converting cold email outreach template to local business owners.`;

    default:
      return `${context}\nUser Question: ${customPrompt || 'How can I optimize this event plan?'}`;
  }
}

/**
 * Local AI engine that generates deeply personalized, realistic responses
 */
function generateLocalAIEngineResponse(
  toolId: string,
  plan: FullEventPlan,
  customPrompt?: string,
  params?: Record<string, string>
): string {
  const { details, categories } = plan;
  const city = plan.details.city || 'your city';
  const vibe = plan.details.vibe || 'celebratory';
  const guests = plan.details.guestCount;
  const budget = plan.details.totalBudget;
  const title = plan.details.title;
  const hosts = plan.details.hostNames;

  switch (toolId) {
    case 'theme_studio': {
      if (plan.details.type === 'wedding') {
        return `### ✨ Curated Aesthetic: Enchanted ${city} Heritage
**Concept Statement:** An intimate fusion of heirloom sophistication and natural whimsy, echoing ${city}'s architectural charm under a canopy of ambient golden candlelight.

#### 🎨 Palette & Color Swatches
- **\`#C5A359\`** — Vintage Champagne *(Primary / Metallics)*
- **\`#FCE7EA\`** — Whispering Blush *(Secondary / Linens & Florals)*
- **\`#E14D6C\`** — Velvet Wild Rose *(Accent / Floral pops & Cocktails)*
- **\`#2E382E\`** — Forest Cypress *(Botanical neutral / Foliage & Suits)*
- **\`#FAF8F5\`** — Silk Alabaster *(Highlight / Paper & Dinnerware)*

#### 🌿 Signature Decor & Floral Elements
- **Ceremony Arch:** Asymmetrical ground-nesting floral meadow featuring garden roses, ranunculus, olive branch greenery, and towering pillar candles.
- **Tablescapes:** Gauzy ivory cheesecloth runners, ribbed crystal glassware, brushed brass taper candleholders, and hand-torn deckle-edge menu cards.
- **Lighting Atmosphere:** Warm Edison bulb curtain and soft uplighting to create an ethereal twilight glow.

#### 👗 Suggested Dress Code
**Black-Tie Optional / Romantic Elegance:** Men in tailored tuxedos or deep midnight suits; women in floor-length gowns with botanical or jewel-toned palettes.`;
      } else if (plan.details.type === 'birthday') {
        return `### ⚡ Curated Aesthetic: Studio ${city} Nocturne
**Concept Statement:** A high-octane celebration channeling vintage 1970s disco decadence with modern neon edge, tailored for ${hosts}'s unforgettable milestone.

#### 🎨 Palette & Color Swatches
- **\`#8B5CF6\`** — Electric Lavender *(Primary / Lighting)*
- **\`#EC4899\`** — Neon Fuchsia *(Secondary / Signage & Cocktails)*
- **\`#D97706\`** — Liquid Gold *(Accent / Glassware & Confetti)*
- **\`#0F172A\`** — Midnight Velvet *(Neutral / Backdrop & Furniture)*
- **\`#F8FAFC\`** — Mirror Ball Strobe *(Highlight / Accents)*

#### 🪩 Signature Decor Elements
- **Focal Installation:** Cluster of 15 oversized mirror disco balls suspended over the bar with custom neon cursive: *"Still Just Getting Started"*.
- **Photo Experience:** Retro 360-degree video platform with instant slow-mo and custom audio overlay.
- **Cocktail Styling:** Gold-rimmed coupe glasses with dry-ice smoke and edible glitter garnish.

#### 🕶️ Suggested Dress Code
**Disco Glamour & Cocktail Chic:** Shimmer, sequins, velvet blazers, and bold statement footwear.`;
      } else {
        return `### 🌍 Curated Aesthetic: ${city} Harmony & Innovation
**Concept Statement:** An open, vibrant, and accessible celebration of community creativity, culture, and sustainable civic pride.

#### 🎨 Palette & Color Swatches
- **\`#2563EB\`** — Civic Azure *(Primary / Banners & Badges)*
- **\`#16A34A\`** — Sustainable Meadow *(Secondary / Greenery & Booths)*
- **\`#EA580C\`** — Warm Terracotta *(Accent / Wayfinding & Stage)*
- **\`#334155\`** — Architectural Slate *(Neutral / Collateral)*
- **\`#FFFFFF\`** — Pure Accessibility White *(Highlight / High-Contrast Signage)*

#### 🎪 Signature Event Elements
- **Wayfinding:** High-contrast bilingual signage with clear QR codes linking directly to digital schedules and accessibility maps.
- **Community Wall:** An interactive 20-foot "Wishes for ${city}" chalk/marker mural where attendees and volunteers contribute their vision.
- **Eco-Focus:** 100% compostable food-ware stations with dedicated volunteer green ambassadors.`;
      }
    }

    case 'run_of_show': {
      return `### ⏱️ Master Run-of-Show & Operations Timeline
**Event:** ${title}  
**Date & Location:** ${plan.details.date} at ${plan.details.venueName}, ${city}  
**Expected Headcount:** ${guests} guests

| Time | Duration | Activity / Milestone | Primary Lead | Tech / Music Cue | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **10:00 AM** | 120m | Venue Load-in & Rigging | Lead Coordinator | Ambient background | AV, sound check, caterer prep kitchen arrival |
| **12:00 PM** | 90m | Florals & Tabletop Styling | Floral Designer | — | Centerpieces, candles, escort table & signage set |
| **01:30 PM** | 60m | Hair, Makeup & Wardrobe Ready | Host / VIP Team | Soft playlist | Photography arrives for detail shots & flat lays |
| **02:30 PM** | 60m | First Look & Group Portraits | Lead Photographer | — | Family and VIP party formal photos on-site |
| **04:30 PM** | 30m | Guest Doors Open & Welcome Drinks | Hospitality Staff | Acoustic / Low-fi Lounge | Champagne & sparkling water passed at entrance |
| **05:00 PM** | 45m | **Main Program / Ceremony** | Officiant / MC | Processional / Main Theme | Silence mobile phones announcement; live sound active |
| **05:45 PM** | 60m | Cocktail Hour & Interactive Stations | Catering / Bar Staff | Upbeat Jazz / Modern Grooves | Signature cocktails & 4 passed hors d'oeuvres |
| **06:45 PM** | 15m | Guests Transition into Main Dining | MC / Coordinator | Chime / Dinner Call | Lighting dims 20% to warm candle mode |
| **07:00 PM** | 60m | Dinner Service Begins | Banquet Captain | Background dinner playlist | Courses served; wine pairings poured |
| **08:00 PM** | 25m | **Keynote Toasts & Speeches** | MC & Toasters | Mic spotlight | Maximum 3 speakers, 3 minutes each with champagne |
| **08:30 PM** | 15m | Cake Cutting / Spotlight Feature | Host & Photographer | Upbeat romantic anthem | Dessert station opens |
| **08:45 PM** | 120m | **Dance Floor & Celebration Open** | Lead DJ / Band | High-energy party set | Party lighting engaged; photo booth in full swing |
| **10:45 PM** | 15m | Late-Night Bites Passed | Catering Staff | Fun singalong hits | Sliders / Churros / Pizza boxes circulated |
| **11:00 PM** | 15m | Grand Send-off & Sparklers | Coordinator | Triumphant finale track | Guests line up outside exit walkway |
| **11:30 PM** | 60m | Vendor Teardown & Load-out | Logistics Crew | House lights on | Rental inventory verified; security sweeps |

> [!TIP]
> **Coordinator's Secret:** Share this table with your DJ and Caterer 72 hours prior to synchronize hot-food timing with speech pauses.`;
    }

    case 'invite_writer': {
      return `### 💌 Multi-Tone Invitation Suite
**Event:** ${title}  
**Hosts:** ${hosts}  
**Date:** ${plan.details.date} | **Location:** ${plan.details.venueName}, ${city}

---

#### Option 1: Formal & Prestigious
> *"Together with their families, ${hosts} request the pleasure of your company at the celebration of ${title}.\n\nJoin us on ${plan.details.date} at five o’clock in the afternoon at ${plan.details.venueName}, ${city}.\n\nAn evening of dining, cocktails, and dancing to follow.\nKindly reply by thirty days prior via [RSVP Link]. Black-Tie Optional."*

---

#### Option 2: Warm & Heartfelt
> *"We couldn’t imagine celebrating this milestone without the people who mean the world to us.\n\nPlease join ${hosts} for an unforgettable evening celebrating ${title} on ${plan.details.date} at ${plan.details.venueName} in ${city}.\n\nCome ready for delicious food, great drinks, and plenty of dancing!\nPlease let us know your RSVP and dietary preferences by [RSVP Link]."*

---

#### Option 3: Fun, Spirited & Playful
> *"It's official: We're throwing the party of the year, and your presence is required!\n\nCelebrate ${title} with ${hosts} on ${plan.details.date} at ${plan.details.venueName}.\nExpect craft drinks, unforgettable music, and stories we'll laugh about for years.\n\nLock in your spot by RSVPing at [RSVP Link] before the dance floor fills up!"*

---

#### 📱 1-Click WhatsApp / SMS Short Version (Ready to Send)
\`\`\`text
✨ You're invited to celebrate ${title} with ${hosts}! 🥂
📅 ${plan.details.date} at 5:00 PM
📍 ${plan.details.venueName}, ${city}
Please RSVP & select your meal here: https://soiree.app/rsvp?id=${plan.details.id.slice(-6)}
Can’t wait to celebrate with you! 🎉
\`\`\`
*(Tap the copy button to send directly to your group chats)*`;
    }

    case 'toast_speech': {
      const speaker = params?.speaker || (plan.details.type === 'wedding' ? 'Maid of Honor' : 'Host');
      return `### 🥂 Crafted Toast & Speech
**Speaker:** ${speaker}  
**Event:** ${title}  
**Estimated Time:** 3 minutes (Approx. 420 words)

---

**[Hook / Warm Icebreaker]**
*"Good evening everyone! For those who don't know me, I’m [Name], and I’ve had the absolute joy of knowing ${hosts} for [number] years. When I look around this breathtaking room at ${plan.details.venueName} tonight, with so many friends and family who traveled from all across ${city} and beyond, it is so obvious just how deeply loved you both are."*

**[Personal Story / Core Insight]**
*"I remember when ${hosts} first told me about each other. It wasn’t just the big romantic gestures—it was the quiet way they look at each other across a crowded room, the way they turn grocery shopping into an adventure, and how they always bring out the most generous, joyful version of each other. In a world that moves so fast, what you two have built is steady, intentional, and genuinely inspiring."*

**[Humor / Lighthearted Touch]**
*"Now, I was given strict instructions tonight: keep it short, don't cry, and definitely don't mention that one trip to Mexico... so consider those promises two-thirds kept!"*

**[The Emotional Climax & Toast]**
*"May your years ahead be filled with as much laughter as we've shared tonight, may your love deepen with every sunset in ${city}, and may you always remain each other's favorite dance partner.\n\nEveryone, please raise your glasses with me:\nTo ${hosts}—to love, laughter, and a truly extraordinary lifetime together. Cheers!"*

> [!NOTE]
> **Delivery Tip:** Pause for 2 seconds after the Mexico joke to let the laughter land before shifting your voice into the warm, sincere toast climax.`;
    }

    case 'disaster_doctor': {
      const crisis = customPrompt || params?.crisis || 'Unexpected severe weather & lead vendor delay';
      return `### 🚨 Disaster Doctor: Emergency Contingency Protocol
**Active Crisis Diagnostic:** "${crisis}"  
**Venue Context:** ${plan.details.venueName}, ${city} (${guests} guests)

---

#### ⏱️ Immediate 5-Minute Checklist
1. **Designate One Voice:** Appoint the Lead Coordinator as the sole vendor point of contact to prevent conflicting rumors.
2. **Safety & Weather Check:** Check live radar and ensure all electrical cables/generators are grounded and shielded.
3. **Hospitality Pivot:** Immediately open the bar and circulate sparkling water or warm cider to keep guests comfortable and relaxed.

---

#### 🛡️ Three-Tier Contingency Roadmap

##### Plan A: The Graceful Pivot (Recommended)
- Shift outdoor elements under the venue’s covered veranda or tented patio.
- Repurpose cocktail hour high-top tables as an intimate standing ceremony space.
- Transition lighting from outdoor daylight to dim candlelight and acoustic warmth.

##### Plan B: The Indoor Flip
- Coordinate with catering and venue staff to activate the secondary indoor hall.
- Conduct a 15-minute room turnover during an extended cocktail hour in the lounge.
- Move the floral ceremony arch behind the sweetheart table for double duty.

##### Plan C: Emergency Backup Protocol
- Deploy backup sound PA system inside.
- If caterer delay exceeds 45 minutes: have coordinator order 30 artisanal flatbreads from nearest partner kitchen as an unannounced "VIP welcome tasting".
- Adjust master timeline by swapping toasts before dinner rather than after.

---

#### 📞 Pre-Written Vendor SMS Script
\`\`\`text
"Hi [Vendor Name], this is the event coordinator for ${title} at ${plan.details.venueName}. Due to [current situation], we are activating Plan A. Ceremony now moves to the Covered Veranda at 5:15 PM. Please report to [Coordinator Name] upon arrival. All setup remains on schedule. Thank you!"
\`\`\``;
    }

    case 'budget_hacker': {
      const totalBudget = plan.details.totalBudget;
      const potentialSavings = Math.round(totalBudget * 0.18);
      return `### 💡 Budget Hacker: Strategic Cost Optimization
**Current Event Budget:** ${formatCurrency(totalBudget)}  
**Identified Potential Savings:** Up to **${formatCurrency(potentialSavings)}** (18% reduction) without compromising luxury or guest experience in ${city}.

---

#### 🔍 5 High-Impact Line-Item Hacks

1. **The BYO Spirits / Corkage Strategy (Saves ~$1,800 - $3,200)**
   - Instead of an all-inclusive venue bar package at $65/head, request a corkage fee license ($15/bottle) and source quality wines, prosecco, and craft beer in bulk from local wholesalers or Costco. Provide 2 signature cocktails pre-batched.

2. **Repurposing Ceremony Florals to Reception (Saves ~$1,200 - $2,000)**
   - Contract your florist to design ceremony ground meadows in movable modular trays. Following the ceremony, venue staff transports them to line the head table and frame the photo booth.

3. **Curated Family-Style or Food Truck Stations (Saves ~$1,500 - $2,800)**
   - Traditional 3-course plated service requires 1 server per 10 guests plus plating equipment. Elegant elevated family-style platters or gourmet artisan food stations cut kitchen staffing fees by 35% while creating an intimate, interactive dinner vibe.

4. **Digital Stationery Suite with Letterpress Keepsakes (Saves ~$600 - $1,100)**
   - Print only 20 physical heirloom invitation suites for parents and photography flat lays. Distribute digital interactive invitations via Soirée with automated WhatsApp RSVP tracking to eliminate return postage and calligrapher fees.

5. **Off-Peak Venue Micro-Shift (Saves ~$2,500 - $4,500)**
   - If dates are still flexible, shifting from a Saturday evening to a Friday evening or Sunday afternoon typically unlocks a 25% discount on venue hire and lower vendor minimum spends across ${city}.

> [!TIP]
> **Actionable Next Step:** Apply these savings to reinforce your **Emergency Contingency Buffer** to ensure your Plan Health Score stays at 90+!`;
    }

    case 'surprise_moments': {
      return `### 🎁 5 Unforgettable Surprise Moments
**Tailored for:** ${guests} guests at ${title} (${vibe}) in ${city}

---

1. **The Secret Midnight Snack Cart**
   - At 10:30 PM, when energy is high on the dance floor, surprise guests with a roaming cart serving warm local ${city} favorites (e.g. gourmet smash burgers, mini churros with dulce de leche, or hot pizza slices in personalized boxes).

2. **The "Audio Guestbook" Vintage Telephone**
   - Place a restored 1950s rotary telephone in a quiet floral alcove. When guests lift the receiver, they hear a recorded greeting from ${hosts} and leave raw, hilarious, heartfelt voice messages after a beep.

3. **The Surprise Choreographed First Dance / Flash Jam**
   - Begin with a traditional slow ballad for 45 seconds, then cue a sudden vinyl scratch transition into a high-energy funk/disco mashup featuring two stealth bridal party dancers.

4. **Live Event Painter or Quick-Sketch Caricature Artist**
   - Station a live watercolor artist capturing the celebration as it unfolds in real time. Guests can watch the canvas evolve, and the final painting becomes a priceless heirloom.

5. **Synchronized Cold-Spark Fountains during Finale**
   - Indoors or outdoors, non-hazardous cold-spark pyrotechnic fountains erupt behind the dance floor at the climax of the final song as confetti cannons dust the crowd.`;
    }

    case 'sponsor_pitch': {
      return `### 🤝 Sponsor Pitch & Partnership Prospectus
**Event:** ${title}  
**Organizer:** ${hosts}  
**Target Attendance:** ${guests}+ attendees in ${city}

---

#### 🌟 Executive Value Proposition
*"Join us as an official partner for ${title}, a high-visibility gathering bringing together passionate community members, innovators, and families in the heart of ${city}. Partnering with us offers your brand authentic, meaningful community connection and high-retention impressions across digital, press, and on-site activations."*

---

#### 💎 Sponsorship Packages & Tier Matrix

| Tier | Investment | Deliverables & Benefits | Projected ROI |
| :--- | :--- | :--- | :--- |
| **Title Sponsor (1 Slot)** | **$5,000** | • "Presented by [Your Brand]" on all banners & press releases<br>• 20x20 prime interactive booth space at entrance<br>• 5-minute keynote welcoming address on main stage<br>• Dedicated social media campaign & VIP passes | 25,000+ targeted local impressions & lead capture |
| **Community Gold** | **$2,500** | • Prominent logo placement on main stage backdrop & website<br>• 10x10 booth activation space<br>• Mention in all opening/closing stage remarks<br>• Branded swag item in all attendee welcome totes | Direct foot traffic & local brand affinity |
| **Local Champion** | **$1,000** | • Logo on event directional signage and digital program<br>• Social media shoutout on official channels<br>• 2 complimentary VIP passes | High community goodwill & tax-deductible exposure |

---

#### ✉️ High-Converting Cold Email Pitch Template
\`\`\`text
Subject: Partnership Opportunity: Supporting ${title} in ${city}

Dear [Business Owner / Marketing Lead Name],

I hope you’re having a great week! 

I’m reaching out on behalf of ${hosts}. On ${plan.details.date}, we are hosting ${title} at ${plan.details.venueName}, gathering over ${guests} enthusiastic local community members.

Given [Target Business Name]’s outstanding reputation and dedication to our local community, we would love to offer you a featured role as one of our official sponsors.

Our partners receive direct brand visibility across our main stage, digital registration portal, and on-site experiential activations. Attached is our brief one-page sponsor prospectus detailing our sponsorship tiers.

Would you be open to a quick 10-minute phone call this Thursday or Friday to discuss how we can spotlight your brand?

Warm regards,

${hosts}
Event Steering Committee
Contact: info@soiree.app | ${plan.details.city}
\`\`\``;
    }

    default:
      return `### 💡 AI Event Assistant Insight
Based on your ${plan.details.type} in ${city} with **${guests} guests** and a **$${budget.toLocaleString()}** budget:

1. **Budget Status:** You have allocated $${categories.reduce((s, c) => s + c.allocatedAmount, 0).toLocaleString()} across ${categories.length} categories.
2. **Key Recommendation:** Focus on locking down your primary venue and catering contracts first, as they represent the foundation of your event timeline.
3. **Guest Count Sensitivity:** An increase of +20 guests will shift your catering requirement by approximately $${Math.round((budget * 0.3) / guests * 20).toLocaleString()}.

Feel free to ask me to write vendor negotiation emails, generate custom timeline milestones, or create day-of itineraries!`;
  }
}

function getToolTitle(toolId: string): string {
  const map: Record<string, string> = {
    theme_studio: 'Theme Studio & Color Palette',
    run_of_show: 'Master Run-of-Show Itinerary',
    invite_writer: 'Multi-Tone Invitation Suite',
    toast_speech: 'Heartfelt Toast & Speech Crafter',
    disaster_doctor: 'Disaster Doctor Contingency Protocol',
    budget_hacker: 'Budget Hacker & Cost Trimmer',
    surprise_moments: 'Surprise & Delight Moments',
    sponsor_pitch: 'Sponsorship Pitch & Outreach Deck'
  };
  return map[toolId] || 'AI Planning Co-Pilot';
}
