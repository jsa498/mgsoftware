import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const raags = {
  sudh: [
    {
      name: "1. Siree Raag",
      description: "The first Raag in Guru Granth Sahib Ji. It represents the morning hours and is associated with devotion and meditation. This Raag is considered the king of all Raags.",
      time: "First quarter of night (Sandhi-prakash, dusk)",
      mood: "Devotion, Peace",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ma Pa Ni Sa (Aroha), Sa Ni Dha Pa Ma Ga Re Sa (Avroha)"
    },
    {
      name: "2. Raag Majh",
      description: "A Raag that represents the mid-day hours. It is associated with courage and strength. This Raag is often used for expressing deep spiritual emotions.",
      time: "Mid-day (12 PM - 3 PM)",
      mood: "Courage, Strength",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "3. Raag Gaudi",
      description: "A Raag that represents the evening hours. It is associated with wisdom and knowledge. This Raag is known for its calming and meditative qualities.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Wisdom, Knowledge",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "4. Raag Asa",
      description: "A Raag that represents the early morning hours. It is associated with hope and optimism. This Raag is particularly popular in morning prayers.",
      time: "Early Morning (6 AM - 9 AM)",
      mood: "Hope, Optimism",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "5. Raag Gujri",
      description: "A Raag that represents the late morning hours. It is associated with humility and devotion. This Raag is known for its devotional nature.",
      time: "Late Morning (9 AM - 12 PM)",
      mood: "Humility, Devotion",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "6. Raag Devgandhari",
      description: "A Raag that represents the late evening hours. It is associated with peace and tranquility. This Raag is known for its soothing and calming effect.",
      time: "Late Evening (9 PM - 12 AM)",
      mood: "Peace, Tranquility",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "7. Raag Bihagara",
      description: "A Raag that represents the midnight hours. It is associated with deep meditation and spiritual connection.",
      time: "Midnight (12 AM - 3 AM)",
      mood: "Meditation, Spirituality",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "8. Raag Vadhans",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings.",
      time: "Early Morning (3 AM - 6 AM)",
      mood: "Awakening, New Beginnings",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "9. Raag Sorath",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual awakening. This Raag is known for its uplifting nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Awakening",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "10. Raag Dhanasari",
      description: "A Raag that represents the evening hours. It is associated with wealth and prosperity. This Raag is known for its majestic and royal nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Wealth, Prosperity",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "11. Raag Jaitsaree",
      description: "A Raag that represents the night hours. It is associated with victory and triumph. This Raag is known for its powerful and energetic nature.",
      time: "Night (9 PM - 12 AM)",
      mood: "Victory, Triumph",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "12. Raag Todi",
      description: "A Raag that represents the morning hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Peace, Tranquility",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "13. Raag Bairari",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "14. Raag Tilang",
      description: "A Raag that represents the evening hours. It is associated with love and devotion. This Raag is known for its romantic and devotional qualities.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Love, Devotion",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "15. Raag Suhi",
      description: "A Raag that represents the night hours. It is associated with peace and tranquility. This Raag is known for its soothing and calming effect.",
      time: "Night (9 PM - 12 AM)",
      mood: "Peace, Tranquility",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "16. Raag Bilawal",
      description: "A Raag that represents the morning hours. It is associated with joy and happiness. This Raag is known for its bright and cheerful nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Joy, Happiness",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "17. Raag Gond",
      description: "A Raag that represents the evening hours. It is associated with devotion and love. This Raag is known for its romantic and devotional qualities.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Love",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "18. Raag Ramkali",
      description: "A Raag that represents the morning hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Peace, Tranquility",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "19. Raag Nat Narayan",
      description: "A Raag that represents the evening hours. It is associated with joy and celebration. This Raag is known for its festive and celebratory nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Joy, Celebration",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "20. Raag Mali Gaura",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual awakening. This Raag is known for its uplifting and inspiring nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Awakening",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "21. Raag Maru",
      description: "A Raag that represents the evening hours. It is associated with courage and strength. This Raag is known for its powerful and energetic nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Courage, Strength",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "22. Raag Tukhari",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "23. Raag Kedara",
      description: "A Raag that represents the night hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Night (9 PM - 12 AM)",
      mood: "Peace, Tranquility",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "24. Raag Bhairo",
      description: "A Raag that represents the morning hours. It is associated with courage and determination. This Raag is known for its serious and profound nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Courage, Determination",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "25. Raag Basant",
      description: "A Raag that represents the spring season. It is associated with joy and celebration. This Raag is particularly popular during the spring festival of Vaisakhi.",
      time: "Spring Season",
      mood: "Joy, Celebration",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "26. Raag Saarang",
      description: "A Raag that represents the summer season. It is associated with energy and enthusiasm. This Raag is known for its bright and energetic nature.",
      time: "Summer Season",
      mood: "Energy, Enthusiasm",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "27. Raag Malaar",
      description: "A Raag that represents the monsoon season. It is associated with peace and tranquility. This Raag is believed to have the power to bring rain.",
      time: "Monsoon Season",
      mood: "Peace, Tranquility",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "28. Raag Kaanara",
      description: "A Raag that represents the autumn season. It is associated with wisdom and maturity. This Raag is known for its deep and profound nature.",
      time: "Autumn Season",
      mood: "Wisdom, Maturity",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "29. Raag Kalyan",
      description: "A Raag that represents the evening hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Peace, Tranquility",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "30. Raag Prabhati",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings. This Raag is known for its uplifting nature.",
      time: "Early Morning (3 AM - 6 AM)",
      mood: "Awakening, New Beginnings",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "31. Raag Jaijaiwanti",
      description: "A Raag that represents the evening hours. It is associated with joy and celebration. This Raag is known for its festive and celebratory nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Joy, Celebration",
      origin: "Ancient Indian Classical Music",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    }
  ],
  mishrat: [
    {
      name: "1. Raag Gaurî Guârarî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (first quarter of night)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Ga Ma Dha, Ni Sa (Aroha), Sa Ni Dha, Ma Ga Re Sa, Re Ga Re Sa Ni Sa (Avroha)"
    },
    {
      name: "2. Raag Gaurî Dakhnî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "3. Raag Gaurî Chetî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "4. Raag Gaurî Birâgan",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "5. Raag Gaurî Deepakî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "6. Raag Gaurî Pûrbî Deepakî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "7. Raag Gaurî Pûrbî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "8. Raag Gaurî Mâhj",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "9. Raag Gaurî Mâlwâ",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "10. Raag Gaurî Mâlâ",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "11. Raag Gaurî Sorathî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "12. Raag Âsâ Kâfî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "13. Raag Aâsâvarî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "14. Raag Aâsâvarî Sudhang",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "15. Raag Devgandhâr",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "16. Raag Vadhans Dakhnî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "17. Raag Tilang Kâfî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "18. Raag Sûhî Kâfî",
      description: "A Raag that represents the night hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Night (9 PM - 12 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "19. Raag Sûhî Lalit",
      description: "A Raag that represents the night hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Night (9 PM - 12 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "20. Bilâwal Dakhnî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "21. Bilâwal Mangal",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "22. Raag Bilâwal Gond",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "23. Raag Râmkalî Dakhnî",
      description: "A Raag that represents the morning hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Morning (6 AM - 9 AM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "24. Raag Nat",
      description: "A Raag that represents the evening hours. It is associated with joy and celebration. This Raag is known for its festive and celebratory nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Joy, Celebration",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "25. Raag Mârû Kâfî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "26. Raag Mâru Dakhnî",
      description: "A Raag that represents the evening hours. It is associated with devotion and spiritual connection. This Raag is known for its devotional nature.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Devotion, Spiritual Connection",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "27. Raag Basant Hindol",
      description: "A Raag that represents the spring season. It is associated with joy and celebration. This Raag is known for its festive and celebratory nature.",
      time: "Spring Season",
      mood: "Joy, Celebration",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "28. Raag Kalîân Bhupâlî",
      description: "A Raag that represents the evening hours. It is associated with peace and tranquility. This Raag is known for its calming and soothing effect.",
      time: "Evening (6 PM - 9 PM)",
      mood: "Peace, Tranquility",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "29. Raag Prabhâtî Bibhâs",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings. This Raag is known for its uplifting nature.",
      time: "Early Morning (3 AM - 6 AM)",
      mood: "Awakening, New Beginnings",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "30. Raag Bibhâs Prabhâtî",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings. This Raag is known for its uplifting nature.",
      time: "Early Morning (3 AM - 6 AM)",
      mood: "Awakening, New Beginnings",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    },
    {
      name: "31. Raag Prabhâtî Dakhnî",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings. This Raag is known for its uplifting nature.",
      time: "Early Morning (3 AM - 6 AM)",
      mood: "Awakening, New Beginnings",
      origin: "Combination of Raags",
      notes: "Sa Re Ga Ma Pa Dha Ni Sa"
    }
  ]
};

export default function RaagsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Raags in Gurbani</h1>
      <p className="text-lg mb-8">
        Raags are the melodic modes used in Gurbani Kirtan. They are an essential part of Sikh music and help in expressing the spiritual message of the Gurus. Each Raag has its own unique characteristics, time of day or season, and emotional impact.
      </p>

      <div className="mb-8 p-4 bg-muted rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Understanding Raags</h2>
        <p className="mb-4">
          Raags in Gurbani are divided into two main categories:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Sudh Raags:</strong> These are the pure, basic Raags that form the foundation of Indian classical music.</li>
          <li><strong>Mishrat Raags:</strong> These are mixed Raags, created by combining different Sudh Raags to create new melodic patterns.</li>
        </ul>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Musical Structure</h3>
          <p>Each Raag follows a specific pattern of notes (swaras) that create its unique character:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Sa (Shadaj) - The root note</li>
            <li>Re (Rishabh) - The second note</li>
            <li>Ga (Gandhar) - The third note</li>
            <li>Ma (Madhyam) - The fourth note</li>
            <li>Pa (Pancham) - The fifth note</li>
            <li>Dha (Dhaivat) - The sixth note</li>
            <li>Ni (Nishad) - The seventh note</li>
          </ul>
        </div>
      </div>

      <Tabs defaultValue="sudh" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sudh">Sudh Raags</TabsTrigger>
          <TabsTrigger value="mishrat">Mishrat Raags</TabsTrigger>
        </TabsList>

        <TabsContent value="sudh">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raags.sudh.map((raag) => (
              <Card key={raag.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{raag.name}</CardTitle>
                  <CardDescription>{raag.time}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{raag.description}</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Mood:</strong> {raag.mood}</p>
                    <p><strong>Origin:</strong> {raag.origin}</p>
                    <p><strong>Notes:</strong> {raag.notes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mishrat">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raags.mishrat.map((raag) => (
              <Card key={raag.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{raag.name}</CardTitle>
                  <CardDescription>{raag.time}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{raag.description}</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Mood:</strong> {raag.mood}</p>
                    <p><strong>Origin:</strong> {raag.origin}</p>
                    <p><strong>Notes:</strong> {raag.notes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 