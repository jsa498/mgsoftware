export interface Raag {
  name: string;
  description: string;
  time: string;
  mood: string;
  origin: string;
  notes: string;
}

export const raags: { sudh: Raag[]; mishrat: Raag[] } = {
  sudh: [
    {
      name: "Siree (Sri)",
      description: "The first Raag in Guru Granth Sahib Ji. It represents the morning hours and is associated with devotion and meditation. This Raag is considered the king of all Raags.",
      time: "Evening 6 pm-9 pm",
      mood: "Deep devotion, humility",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ma Pa Ni Sa (Aroha), Sa Ni Dha Pa Ma Ga Re Sa (Avroha)"
    },
    {
      name: "Maajh",
      description: "A Raag that represents the mid-day hours. It is associated with courage and strength. This Raag is often used for expressing deep spiritual emotions.",
      time: "Late afternoon 3 pm-6 pm",
      mood: "Yearning, loving dialogue",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Gauree",
      description: "A Raag that represents the evening hours. It is associated with wisdom and knowledge. This Raag is known for its calming and meditative qualities.",
      time: "Early afternoon 12 pm-3 pm",
      mood: "Serious reflection, clarity",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Asaa",
      description: "A Raag that represents the early morning hours. It is associated with hope and optimism. This Raag is particularly popular in morning prayers.",
      time: "Dawn 3 am-6 am",
      mood: "Hope, inspiration",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Gujree",
      description: "A Raag that represents the late morning hours. It is associated with humility and devotion. This Raag is known for its devotional nature.",
      time: "Morning 6 am-9 am",
      mood: "Meditation, quiet joy",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Devgandhaaree",
      description: "A Raag that represents the late evening hours. It is associated with peace and tranquility. This Raag is known for its soothing and calming effect.",
      time: "Morning 6 am-9 am",
      mood: "Sweet compassion",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Bihaagara",
      description: "A Raag that represents the midnight hours. It is associated with deep meditation and spiritual connection.",
      time: "Night 9 pm-12 am",
      mood: "Longing, tenderness",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Vadhans",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings.",
      time: "Mid-day 12 pm-3 pm",
      mood: "Mixed joy-sorrow (wedding/dirge)",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Sorat'h",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual awakening. This Raag is known for its uplifting nature.",
      time: "Late morning 9 am-12 pm",
      mood: "Certainty, fulfilment",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Dhanaasaree",
      description: "A Raag that represents the evening hours. It is associated with wealth and prosperity. This Raag is known for its majestic and royal nature.",
      time: "Late morning 9 am-12 pm",
      mood: "Detachment, peace",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Jaitsree",
      description: "A Raag that represents the night hours. It is associated with victory and triumph. This Raag is known for its powerful and energetic nature.",
      time: "Late morning 9 am-12 pm",
      mood: "Contentment, gratitude",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Todee",
      description: "A Raag that represents the morning hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing nature.",
      time: "Morning 9 am-12 pm",
      mood: "Intense devotion",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Bhairav",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Pre-dawn 3 am-6 am",
      mood: "Awe, solemnity",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Tilang",
      description: "A Raag that represents the evening hours. It is associated with love and devotion. This Raag is known for its romantic and devotional qualities.",
      time: "Evening 6 pm-9 pm",
      mood: "Gentle love",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Soohee",
      description: "A Raag that represents the night hours. It is associated with peace and tranquility. This Raag is known for its soothing and calming effect.",
      time: "Morning 9 am-12 pm",
      mood: "Bridal union, courage",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Bilaaval",
      description: "A Raag that represents the morning hours. It is associated with joy and happiness. This Raag is known for its bright and cheerful nature.",
      time: "Morning 6 am-9 am",
      mood: "Cheerful brightness",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Gaund",
      description: "A Raag that represents the evening hours. It is associated with devotion and love. This Raag is known for its romantic and devotional qualities.",
      time: "Morning 6 am-9 am",
      mood: "Wonder, mysticism",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Raamkalee",
      description: "A Raag that represents the morning hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Midnight 12 am-3 am",
      mood: "Transformation, discipline",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Nat Narayan",
      description: "A Raag that represents the evening hours. It is associated with joy and celebration. This Raag is known for its festive and celebratory nature.",
      time: "Night 9 pm-12 am",
      mood: "Royal splendour",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Maalee Gauraa",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual awakening. This Raag is known for its uplifting and inspiring nature.",
      time: "Late night 9 pm-12 am",
      mood: "Spiritual blooming",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Maaroo",
      description: "A Raag that represents the evening hours. It is associated with courage and strength. This Raag is known for its powerful and energetic nature.",
      time: "Early afternoon 12 pm-3 pm",
      mood: "Heroic zeal",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Tukharee",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Early afternoon 12 pm-3 pm",
      mood: "Divine protection",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Kedaaraa",
      description: "A Raag that represents the night hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Late night 12 am-3 am",
      mood: "Compassionate calm",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Bhairon",
      description: "A Raag that represents the morning hours. It is associated with courage and determination. This Raag is known for its serious and profound nature.",
      time: "Pre-dawn 3 am-6 am",
      mood: "Fearless grandeur",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Basant",
      description: "A Raag that represents the spring season. It is associated with joy and celebration. This Raag is particularly popular during the spring festival of Vaisakhi.",
      time: "Evening 6 pm-9 pm",
      mood: "Renewal, spring joy",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Sarang",
      description: "A Raag that represents the summer season. It is associated with energy and enthusiasm. This Raag is known for its bright and energetic nature.",
      time: "Mid-day 12 pm-3 pm",
      mood: "Soothing relief (rain)",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Malaar",
      description: "A Raag that represents the monsoon season. It is associated with peace and tranquility. This Raag is believed to have the power to bring rain.",
      time: "Monsoon season (night)",
      mood: "Yearning in rain",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Kaanraa",
      description: "A Raag that represents the autumn season. It is associated with wisdom and maturity. This Raag is known for its deep and profound nature.",
      time: "Late night 12 am-3 am",
      mood: "Philosophical depth",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Kalyan",
      description: "A Raag that represents the evening hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Late night 12 am-3 am",
      mood: "Auspicious celebration",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Parbhaatee",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings. This Raag is known for its uplifting nature.",
      time: "Pre-sunrise 3 am-6 am",
      mood: "Enlightened awakening",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "Jaijavantee",
      description: "A Raag that represents the evening hours. It is associated with joy and celebration. This Raag is known for its festive and celebratory nature.",
      time: "Night 9 pm-12 am",
      mood: "Victory over ego",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    }
  ],
  mishrat: [
    { name: "1. Raag Gaurî Guârarî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (first quarter of night)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Ga Ma Dha, Ni Sa (Aroha), Sa Ni Dha, Ma Ga Re Sa, Re Ga Re Sa Ni Sa (Avroha)"
    },
    { name: "2. Raag Gaurî Dakhnî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "3. Raag Gaurî Chetî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "4. Raag Gaurî Birâgan",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "5. Raag Gaurî Deepakî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "6. Raag Gaurî Pûrbî Deepakî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "7. Raag Gaurî Pûrbî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "8. Raag Gaurî Mâhj",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "9. Raag Gaurî Mâlwâ",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "10. Raag Gaurî Mâlâ",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "11. Raag Gaurî Sorathî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "12. Raag Âsâ Kâfî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "13. Raag Aâsâvarî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "14. Raag Aâsâvarî Sudhang",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "15. Raag Devgandhâr",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "16. Raag Vadhans Dakhnî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "17. Raag Tilang Kâfî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "18. Raag Sûhî Kâfî",
      description: "A Raag that represents the night hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Night (9 PM - 12 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "19. Raag Sûhî Lalit",
      description: "A Raag that represents the night hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Night (9 PM - 12 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "20. Bilâwal Dakhnî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "21. Bilâwal Mangal",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "22. Raag Bilâwal Gond",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    { name: "23. Raag Râmkalî Dakhnî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    }
  ]
}; 