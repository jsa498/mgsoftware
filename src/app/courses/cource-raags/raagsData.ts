export interface Raag {
  name: string;
  description: string;
  time: string;
  mood: string;
  notes: string;
}

export const raags: { sudh: Raag[]; mishrat: Raag[] } = {
  sudh: [
    {
      name: "Sri",
      description: "The first Raag in Guru Granth Sahib Ji. Guru Amardas Ji states 'Raagaa vich sreeraag hai jae sach dharae piaar' and Bhai Gurdas Ji affirms 'Raagan mein sireeraag paaras bakhaan hai'. It represents the morning hours and embodies devotion, meditation, and divine love.",
      time: "Evening 6 pm-9 pm",
      mood: "Sri Raag is a very old, melodious and a difficult raag. Sri Raag is known as a rejuvenating raag",
      notes: "Sa Re Ma Pa Ni Sa (Aroha), Sa Ni Dha Pa Ma Ga Re Sa (Avroha)"
    },
    {
      name: "Majh",
      description: "A Raag that represents the mid-day hours. It is associated with courage and strength. This Raag is often used for expressing deep spiritual emotions.",
      time: "Evening 6 pm-9 pm",
      mood: "Yearning, loving dialogue",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Gauri",
      description: "A Raag that represents the evening hours. It is associated with wisdom and knowledge. This Raag is known for its calming and meditative qualities.",
      time: "Evening 6 pm-9 pm",
      mood: "Serious reflection, clarity",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Asa",
      description: "A Raag that represents the early morning hours. It is associated with hope and optimism. This Raag is particularly popular in morning prayers.",
      time: "Dawn 3 am-6 am",
      mood: "Hope, inspiration",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Gujri",
      description: "A Raag that represents the late morning hours. It is associated with humility and devotion. This Raag is known for its devotional nature.",
      time: "Morning 9 am-12 pm",
      mood: "Meditation, quiet joy",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Devgandhari",
      description: "A Raag that represents the late evening hours. It is associated with peace and tranquility. This Raag is known for its soothing and calming effect.",
      time: "Morning 9 am-12 pm",
      mood: "Sweet compassion",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Bihagara",
      description: "A Raag that represents the midnight hours. It is associated with deep meditation and spiritual connection.",
      time: "Night 9 pm-12 am",
      mood: "Longing, tenderness",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Wadhans",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings.",
      time: "Afternoon 12 pm-3 pm",
      mood: "Mixed joy-sorrow (wedding/dirge)",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Sorath",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual awakening. This Raag is known for its uplifting nature.",
      time: "Night 9 pm-12 am",
      mood: "Certainty, fulfilment",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Dhanasari",
      description: "A Raag that represents the evening hours. It is associated with wealth and prosperity. This Raag is known for its majestic and royal nature.",
      time: "Afternoon 12 pm-3 pm",
      mood: "Detachment, peace",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Jaitsri",
      description: "A Raag that represents the night hours. It is associated with victory and triumph. This Raag is known for its powerful and energetic nature.",
      time: "Late afternoon 3 pm-6 pm",
      mood: "Contentment, gratitude",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Todi",
      description: "A Raag that represents the morning hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing nature.",
      time: "Morning 9 am-12 pm",
      mood: "Intense devotion",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Bairari",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening 6 pm-9 pm",
      mood: "Awe, solemnity",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Tilang",
      description: "A Raag that represents the evening hours. It is associated with love and devotion. This Raag is known for its romantic and devotional qualities.",
      time: "Afternoon 12 pm-3 pm",
      mood: "Gentle love",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Suhi",
      description: "A Raag that represents the night hours. It is associated with peace and tranquility. This Raag is known for its soothing and calming effect.",
      time: "Morning 9 am-12 pm",
      mood: "Bridal union, courage",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Bilaval",
      description: "A Raag that represents the morning hours. It is associated with joy and happiness. This Raag is known for its bright and cheerful nature.",
      time: "Morning 9 am-12 pm",
      mood: "Cheerful brightness",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Gaund",
      description: "A Raag that represents the evening hours. It is associated with devotion and love. This Raag is known for its romantic and devotional qualities.",
      time: "Morning 9 am-12 pm",
      mood: "Wonder, mysticism",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Ramkali",
      description: "A Raag that represents the morning hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Morning 6 am-9 am",
      mood: "Transformation, discipline",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Nat Narayan",
      description: "A Raag that represents the evening hours. It is associated with joy and celebration. This Raag is known for its festive and celebratory nature.",
      time: "Night 9 pm-12 am",
      mood: "Royal splendour",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Maalee Gauraa",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual awakening. This Raag is known for its uplifting and inspiring nature.",
      time: "Late afternoon 3 pm-6 pm",
      mood: "Spiritual blooming",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Maaru",
      description: "A Raag that represents the evening hours. It is associated with courage and strength. This Raag is known for its powerful and energetic nature.",
      time: "Afternoon 12 pm-3 pm",
      mood: "Heroic zeal",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Tukharee",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Late afternoon 3 pm-6 pm",
      mood: "Divine protection",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Kedaaraa",
      description: "A Raag that represents the night hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Evening 6 pm-9 pm",
      mood: "Compassionate calm",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Bhairav",
      description: "A Raag that represents the morning hours. It is associated with courage and determination. This Raag is known for its serious and profound nature.",
      time: "Pre-dawn 3 am-6 am",
      mood: "Fearless grandeur",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Basant",
      description: "A Raag that represents the spring season. It is associated with joy and celebration. This Raag is particularly popular during the spring festival of Vaisakhi.",
      time: "Evening 6 pm-9 pm",
      mood: "Renewal, spring joy",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Sarang",
      description: "A Raag that represents the summer season. It is associated with energy and enthusiasm. This Raag is known for its bright and energetic nature.",
      time: "Afternoon 12 pm-3 pm",
      mood: "Soothing relief (rain)",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Malaar",
      description: "A Raag that represents the monsoon season. It is associated with peace and tranquility. This Raag is believed to have the power to bring rain.",
      time: "Night 9 pm-12 am",
      mood: "Yearning in rain",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Kaanraa",
      description: "A Raag that represents the autumn season. It is associated with wisdom and maturity. This Raag is known for its deep and profound nature.",
      time: "Night 9 pm-12 am",
      mood: "Philosophical depth",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Kalyaan",
      description: "A Raag that represents the evening hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Evening 6 pm-9 pm",
      mood: "Auspicious celebration",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Prabhaatee",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings. This Raag is known for its uplifting nature.",
      time: "Dawn 3 am-6 am",
      mood: "Enlightened awakening",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Jaijavantee",
      description: "A Raag that represents the evening hours. It is associated with joy and celebration. This Raag is known for its festive and celebratory nature.",
      time: "Night 9 pm-12 am",
      mood: "Victory over ego",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    }
  ],
  mishrat: [
    {
      name: "Gauri Deepaki",
      time: "Evening (6–9 PM)",
      mood: "Warm, secure and enlightening (lullaby-like comfort, instills hope)",
      notes: "Poorvi thaat; 6-note ascent, 7-note descent; Komal Re & Dha (flat 2nd, 6th), Tivra Ma (sharp 4th).",
      description: "Generates feelings of motherly warmth and security, guiding from darkness to fearlessness:contentReference[oaicite:106]{index=106}."
    },
    {
      name: "Gauri Purbi",
      time: "Evening (6–9 PM)",
      mood: "Determined and preparatory, with confident feelings balanced by humility",
      notes: "Poorvi scale; full 7-note, with Komal Re & Dha, Tivra Ma; some vakra (zigzag) phrases.",
      description: "Strong experiences and readiness to achieve more – a well-considered resolve without ego:contentReference[oaicite:107]{index=107}."
    },
    {
      name: "Gauri Guarairi",
      time: "Predawn (3–6 AM)",
      mood: "Calm, controlled, and truthful in expression, disciplined and focused",
      notes: "Marwa thaat; 5-note ascend (omits Re, Pa), 6-note descend; Komal Re & Dha, Tivra Ma.",
      description: "Direct and open emotional message delivered with a restrained, middle-octave focus:contentReference[oaicite:108]{index=108}."
    },
    {
      name: "Gauri Chayti",
      time: "Late Afternoon (3–6 PM)",
      mood: "Evokes fear and regret as a warning, creating urgency to not take things for granted",
      notes: "Poorvi thaat; 6-note ascend (no Ga), 7-note descend; Komal Re & Dha, Tivra Ma.",
      description: "Instills a sensation of panic and repentance – a conscious reminder of consequences if warnings are ignored:contentReference[oaicite:109]{index=109}."
    },
    {
      name: "Gauri Bairagan",
      time: "Early Morning (6–9 AM)",
      mood: "Intense sorrow of separation (bairaag) that motivates spiritual seeking",
      notes: "Pentatonic (omits Ga, Pa); Komal Re & Dha as in Bhairav raag.",
      description: "Leaves one with emptiness and longing, yet Gauri's balance turns the pain into a search for what's missing:contentReference[oaicite:110]{index=110}."
    },
    {
      name: "Gauri Purbi Deepaki",
      time: "Evening (6–9 PM)",
      mood: "Self-assessing but optimistic, steadily progressing with confidence and hope",
      notes: "Poorvi/Deepak blend; twilight raag with Komal Re, Dha and Tivra Ma; full 7-note scale.",
      description: "Tone of introspection with positivity – constantly improving with faith in eventual success:contentReference[oaicite:111]{index=111}."
    },
    {
      name: "Gauri Majh",
      time: "Evening (6–9 PM)",
      mood: "Deliberate yearning and longing, with regret and hope intertwining",
      notes: "Full scale (Sampooran); uses both flat and natural forms of several notes (very rich tonal palette).",
      description: "Creates a planned emotional yearning similar to Raag Majh's vibe – evoking hope and anticipation through nostalgia:contentReference[oaicite:112]{index=112}."
    },
    {
      name: "Gauri Malva",
      time: "Late Afternoon (3–6 PM)",
      mood: "Thoughtful, serious yet caring – like truthful advice from a dear friend",
      notes: "Hexatonic ascend (no Ni), pentatonic descend (no Dha); Komal Re & Dha, Tivra Ma.",
      description: "Serious but gentle persuasion that's impossible to resist – conveys honest counsel with warm sincerity:contentReference[oaicite:113]{index=113}."
    },
    {
      name: "Gauri Mala",
      time: "Evening (6–9 PM)",
      mood: "Pure, good and positive thoughts accumulating; energetic devotion after hard work",
      notes: "Full 7-note scale; Komal Re, Ga, Dha; Shuddh Ma and Ni (Bhairav-thaat base with a Bhairavi touch).",
      description: "Conveys the feeling of having diligently added pure thoughts, increasing one's devotion and truthful energy:contentReference[oaicite:115]{index=115}."
    },
    {
      name: "Gauri Sorath",
      time: "Evening (6–9 PM)",
      mood: "Attractive and enticing yet balanced by duty – woos attention but reminds of responsibility",
      notes: "Sampooran scale but omits Ga in ascent; employs both shuddh/komal Re, Ma, Dha, Ni (blend of major and minor inflections).",
      description: "Captures the listener's mind with allure and charm, while Gauri's influence adds a heedful caution to the enticing call:contentReference[oaicite:116]{index=116}."
    },
    {
      name: "Asa Kafi",
      time: "Evening (6–9 PM)",
      mood: "Carefree, energetic confidence – high-spirited and self-assured, brimming with optimism",
      notes: "Audav-Sampooran: Ascend omits Ga, Ni; full descend. Komal Ga, Ni in descent (Kafi style); rest shuddh.",
      description: "Exudes boundless energy and fearless optimism, inspiring action without any false hopes or doubts:contentReference[oaicite:118]{index=118}."
    },
    {
      name: "Asa Asavari",
      time: "Mid-Morning (9 AM–12 PM)",
      mood: "Assured, courageous and positive – instills confidence and passion to achieve one's goals",
      notes: "Asavari thaat; pentatonic ascent (no Ga, Ni), full descent. Komal Ga, Dha, Ni (flat 3rd, 6th, 7th).",
      description: "Provides a sense of certainty and fearless courage, converting spiritual energy into a passionate determination to succeed:contentReference[oaicite:119]{index=119}."
    },
    {
      name: "Tilang Kafi",
      time: "Late Evening (9 PM–12 AM)",
      mood: "Contented acceptance – efforts may go unappreciated but one remains loving and unbothered",
      notes: "Based on Khamaj thaat. Ascend omits Re, Dha (Tilang's structure); Komal Ni (flat 7th) appears in descent; others shuddh.",
      description: "Carries Tilang's mood of unreciprocated effort yet, with Kafi's influence, the individual feels no anger – only patient love:contentReference[oaicite:121]{index=121}."
    },
    {
      name: "Suhi Kafi",
      time: "Late Morning (9 AM–12 PM)",
      mood: "Deep love, safety and security – like a child completely at peace in a parent's love",
      notes: "Sampooran (all 7 notes). Both Ga and Ni used (shuddh and komal); other notes shuddh (mix of major and minor).",
      description: "Expresses profound comfort and trust – a carefree confidence born from feeling utterly safe and loved:contentReference[oaicite:122]{index=122}."
    },
    {
      name: "Suhi Lalit",
      time: "Late Morning (9 AM–12 PM)",
      mood: "Emotional resolve with a volatile edge – loving but willing to go to extremes to attain the goal",
      notes: "Sampooran ascend, Shadav descend (no Pa in descent). Uses both Re, Ma, Dha (flat & natural); shuddh Ga, Ni.",
      description: "Conveys determined love that can become passionate or even reckless – a volatility moderated by devotional intent:contentReference[oaicite:123]{index=123}."
    },
    {
      name: "Bilawal Gond",
      time: "Late Morning (9 AM–12 PM)",
      mood: "Triumphant yet humble joy – courageous conviction paired with restraint, yielding confident happiness without pride",
      notes: "Bilawal thaat (all natural notes). Major-scale structure; Gond adds stylistic embellishments but no scale change.",
      description: "Expresses abstract jubilation kept in check by humility and insight – **joy with discipline**, avoiding any egotism:contentReference[oaicite:125]{index=125}."
    },
    {
      name: "Maru Kafi",
      time: "Evening (6–9 PM)",
      mood: "Blunt and forceful yet sweetly charming – uncompromising truth delivered in an appealing, winsome manner",
      notes: "Kafi thaat base. Full scale with both Ga and Ni (natural & flat) and even both Ma; blends Maru's scale with Kafi's komal Ga, Ni.",
      description: "Strong and assertive in tone but retains a charm that endears the listener – one feels the weight of truth without being put off by it:contentReference[oaicite:126]{index=126}."
    },
    {
      name: "Basant Hindol",
      time: "Morning (Spring season; ~6–9 AM)",
      mood: "Fresh, hopeful and content – the feeling of a joyful new beginning and the ease that comes with spiritual renewal",
      notes: "Omits Re altogether (as Hindol does). Both Ma (shuddh & tivra) are used; other notes shuddh. Bright spring scale with no second note.",
      description: "Full of the delight of spring – encourages an internal 'spring cleaning,' refreshing the mind with hope and a sense of a new cycle beginning:contentReference[oaicite:127]{index=127}."
    },
    {
      name: "Kalyan Bhopali",
      time: "Evening (6–9 PM)",
      mood: "Direct, insistent determination – forceful in desire and inflexible in approach, tackling goals head-on",
      notes: "Tivra Ma (sharp 4th) like Yaman; otherwise shuddh notes. Omits Ma and Ni in descent (as in Bhopali).",
      description: "Combines Yaman Kalyan's persuasive strength with Bhopali's simplicity – resulting in a confident, no-nonsense drive to fulfill its aim:contentReference[oaicite:128]{index=128}."
    },
    {
      name: "Parbhati Bibhas",
      time: "Dawn (6–9 AM)",
      mood: "Serene yet focused – a calm compromise between the yearning soul and the stubborn mind at daybreak, preparing for the day with balance",
      notes: "6-note ascend, 5-note descend (no Ma; no Ni in descent). Both Re and Dha (2nd, 6th) can be komal or shuddh. Bright Bhairav-like scale without Ma.",
      description: "Feels like the quiet peace and determination of early morning – the mind and soul reaching a mutual understanding in the first light of day:contentReference[oaicite:129]{index=129}."
    },
    {
      name: "Bibhas Parbhati",
      time: "Dawn (6–9 AM)",
      mood: "Self-assured and wise – conveys certainty and gentle confidence born of knowledge, without any arrogance",
      notes: "5-note ascend, 6-note descend (no Ma; no Ni in ascend). Both Re and Dha in use (flat & natural). Similar to a Bhairav variant sans Ma.",
      description: "Imparts the quiet confidence of wisdom at dawn – persuasive and content in its truth, seeking to share knowledge without pride:contentReference[oaicite:130]{index=130}."
    }
  ]
}; 