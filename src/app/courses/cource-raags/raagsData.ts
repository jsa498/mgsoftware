export interface Raag {
  name: string;
  description: string;
  time: string;
  mood: string;
  aroha: string;
  avroha: string;
}

export const raags: { sudh: Raag[]; mishrat: Raag[] } = {
  sudh: [
    {
      name: "Sri",
      description: "The first Raag in Guru Granth Sahib Ji. Guru Amardas Ji states 'Raagaa vich sreeraag hai jae sach dharae piaar' and Bhai Gurdas Ji affirms 'Raagan mein sireeraag paaras bakhaan hai'. It represents the morning hours and embodies devotion, meditation, and divine love.",
      time: "Evening 6 pm-9 pm",
      mood: "Sri Raag is a very old, melodious and a difficult raag. Sri Raag is known as a rejuvenating raag",
      aroha: "Sa Re Ma Pa Ni Sa", avroha: "Sa Ni Dha Pa Ma Ga Re Sa"
    },
    {
      name: "Majh",
      description: "In Punjab Majh Raag evolved from the folk music tune of Majha area of Punjab. There is no reference of this raga anywhere in Indian music. Raag Majh is a unique gift to Indian music by the Sikh Gurus. While passing through Majh Raag, on its spiritual journey the soul chants painfully, melodiously singing while suffering the pangs of separation and weeps 'Maeraa man lochai gur darasan taaee, bilap karae chaatrik kee niaaee'. Guru Arjan Devji has written Baramaha also in this Raag. Since it is purely a raag of Punjab, the baani of Bhagats is not written in this raag.",
      time: "Evening 6 pm-9 pm",
      mood: "Yearning, loving dialogue",
      aroha: "Sa Re, Ma Pa, Nee Sa'",
      avroha: "Sa' Nee Dha Pa, Dha Ma Ga Ma, Re Pa Ga Re, Ga Sa Re Ne Sa"
    },
    {
      name: "Gauri",
      description: "Gauri is a raag of serious nature. The weeping soul begs for the Grace of God, and searches itself within. That is why in this raag Guru Sahib has composed Bani on serious topics such as mind, intellect, buddhi, atma, death, mukti etc. Maximum baani in Sri Guru Granth Sahib is in this raag. Sukhmani Sahib and Baavan Akhri which are composed in this raag show the essence of all aspects of life. Maximum bani of Bhagat Kabirji is in this raag. Sri Guru Granth Sahib states 'Gauri raag sulakhanee jae khasamai chit karaee| Bhaanai chalai satiguroo kai aisaa seegaar karaee'",
      time: "Evening 6 pm-9 pm",
      mood: "Serious reflection, clarity",
      aroha: "Sa Re, Ga Re, Ma Pa, Nee Sa'",
      avroha: "Sa' Nee Dha Ma Pa, Dha Pa Ma Ga, Re Ga Re, Sa Ne Sa"
    },
    {
      name: "Asa",
      description: "In the Gurmat Sangeet style Asa in a very important raag. The melodius notes of raag Asa are heard in every particle of the sacred land of Punjab. The golden rays of every dawn enter with the melodius tune of this raag and the redness of every dusk when it hides in the lap of nature, the melodious tunes of this raag sing the praises 'Balhaaree kudarath vasiaa'. There is no mention of this raag in ancient or medieval texts. Baba Farid and Guru Nanak Devji have the maximum contribution in giving this raag its Shastri form.",
      time: "Dawn 3 am-6 am",
      mood: "Hope, inspiration",
      aroha: "Sa, Re Ma, Pa, Dha Sa'",
      avroha: "Sa' Nee Dha Pa, Ma, Ga Re Sa Re Ga Sa"
    },
    {
      name: "Gujri",
      description: "The old and famous Gujri Raag is considered especially favorable for the singing of Bhakti emotion. The entire form of this raag, being imbued with compassion, musicians have considered it as having a compassionate nature (prakriti). It begs for 'Har Sardha Har Piaas'. To attain one's Husband is the goal of life, and this is expressed in 'Goojaree jaat gavaar jaa sahu paaeae aapna. Gur kai sabad veechar anadin har jap jaapana'. To get the husband, everything has to be surrendered, 'Tan man arapo pooj charaavo'.",
      time: "Morning 9 am-12 pm",
      mood: "Meditation, quiet joy",
      aroha: "Sa Re, Ga Ma Dha, Nee Sa'",
      avroha: "Sa' Nee Dha, Ma Ga Re, Ga Re Sa"
    },
    {
      name: "Devgandhari",
      description: "In Guru Granth Sahib under the heading Devgandhari, Devgandhari and Devgandhar are listed. There is only one Shabad, 'Apunae har pehi binutee keheeai', in Devgandhar. The remaining bani under this heading is in Devgandhari. These two raags have different forms; except in Gurmat Sangeet, the form of Devgandhari is still not prevalent in Indian music. While immersed in this raag, one realises that happiness is in the feet of the Lord and in leaving false love.",
      time: "Morning 9 am-12 pm",
      mood: "Sweet compassion",
      aroha: "Sa Re Ma, Pa Dha, Sa'",
      avroha: "Sa' Nee Dha Pa, Ma Pa, Dha Nee Dha Pa, Ma Ga Re Sa"
    },
    {
      name: "Bihagara",
      description: "Raag Bihagara is a very melodious and effective night raag. Bihagara brings pangs of separation. This separation can be removed by becoming the Mardana of Guru. Becoming Mardana is getting imbued with the Shabad. By making changes in the style of Raag Behag, the form of this raag has been fixed. Due to the Bilaval aspect in Punjabi Bihagara, this raag is more impressive.",
      time: "Night 9 pm-12 am",
      mood: "Longing, tenderness",
      aroha: "Ne Sa Ga, Ma Pa Nee, Sa'",
      avroha: "Sa' Nee Dha Pa, Nee Dha Pa, Dha Ga Ma Ga, Re Sa"
    },
    {
      name: "Wadhans",
      description: "In Gurmat Sangeet, Wadhans raag has been used for classical music and also for folk tunes, ghorian and alaahania. It is necessary to be imbued with the Shabad to control this body horse because 'Sabad ratae vadhans hai sach naam our dhaar | Sach sangrehehi sad sach rehehi sachai naam piaar'. In Sri Guru Granth Sahib ji, this raag has two structures: Vadhans and Vadhans Dakhni.",
      time: "Afternoon 12 pm-3 pm",
      mood: "Mixed joy-sorrow (wedding/dirge)",
      aroha: "Sa Re Ma Pa, Dha Nee Pa, Nee Sa'",
      avroha: "Sa' Nee Pa, Dha Ma Ga Re, Sa Ne Sa"
    },
    {
      name: "Sorath",
      description: "Baani in Sorath raag is generally known by heart to most of the gursikhs. It is a very simple and sweet raag but it will be appealing only when the soul will seek the Lord's Name. Sorath taam suhaavanee jaa har naam dhandolae | Gur purakh manaavai aapanaa guramatee har har bolae | By singing the glorious praises of the Lord's name, lifelessness does not come. One will have an immaculate reputation in this world as well as the other world. Sorath so ras peejeeai kabehoo n feekaa hoe | Naanak raam naam gun gaaeeahi darageh niramal soe |5|",
      time: "Night 9 pm-12 am",
      mood: "Certainty, fulfilment",
      aroha: "Sa Re, Ma Pa, Nee Sa'",
      avroha: "Sa' Re' Nee Dha, Ma Pa Dha Ma Ga Re, Nee Sa"
    },
    {
      name: "Dhanasari",
      description: "Dhanaasaree raag is counted as one of the uncommon raags in Indian music. It is a very old and melodious raag. The Aartis sung by all Bhagats are composed in this raag. Guru Nanak who did Aarti of the entire universe by his Shabad 'Gugun mai thaal rav chund deepuk bunae taarikaa munddul junuk motee' also composed and sung it in this raag. Leaving aside rites and rituals only when a person sings the Name of the Lord 'Japiale Ramche Nama' the singer of Dhanaasaree will become Dhanvant (wealthy) 'Dhanaasaree dhanavanthee jaaneeai bhaaee Je satigur kee kaar kamaae'",
      time: "Afternoon 12 pm-3 pm",
      mood: "Detachment, peace",
      aroha: "Sa Ga, Ma Pa, Nee Sa'",
      avroha: "Sa' Nee Dha Pa, Ma Pa Ga, Re Sa"
    },
    {
      name: "Jaitsri",
      description: "In Sanskrit Granths Jaitsree is referred to as Jaishree Jayant Sri etc. In Guru Granth Sahib it occurs as Jaitsree. Only great singers can sing a difficult and entertaining raag with purity. Jaitsri brings about peace and happiness. To get happiness one has to leave the mind's lazy nature and seek Guru's Grace by imbibing the Nam jewel in one's heart.",
      time: "Late afternoon 3 pm-6 pm",
      mood: "Contentment, gratitude",
      aroha: "Sa Ga, Ma Pa, Nee Sa'",
      avroha: "Sa' Nee Dha Pa, Ma Ga, Re Sa"
    },
    {
      name: "Todi",
      description: "Todi is a very famous, easy but a serious raag. This raag has become such an inseparable part of Loksangeet (folk music) that one hears its notes in various folk songs. It is well known that a singer would sing Todi in the King's Darbars and would receive abundant gifts. Gurbani stresses on praising only the One (God), so that this worldly being does not have to run from pillar to post (worldly doors). One hears of about 21 types of Todi's. All those who cling to the worldly supports are unhappy but whosoever holds the robe of God becomes carefree. 'Beparvaah sadaa rangi hari kai ja ko paakhu suami'",
      time: "Morning 9 am-12 pm",
      mood: "Intense devotion",
      aroha: "Sa Re Ga, Ma Pa Ma Dha, Nee Sa'",
      avroha: "Sa' Nee Dha, Pa, Ma Ga, Re, Sa"
    },
    {
      name: "Bairari",
      description: "Raag Bairari is counted as an uncommon and not a very well known Raag. In medieval times there is hardly any other raag which can be compared with this raag as far as the prevalence of number of varieties is concerned. This is a difficult raag. Only highly accredited singers can sing this with purity (correctly). This raag is very melodious. 'Har Nirbhuau Nirvair Nirankaar' 'Kaaea sarir basat hai' and 'sarab sookh har naam vaddaaee |' all these shabads are in Raag Bairari. Also 'Sant janaa mil har jas gaaeiou' which is commonly sung at the end of Diwans is in Raag Bairari.",
      time: "Evening 6 pm-9 pm",
      mood: "Awe, solemnity",
      aroha: "Nee Re Ga Pa, Ma Ga, Ma Dha Sa'",
      avroha: "Sa' Nee Dha Pa, Ma Ga, Pa Ga, Re Sa"
    },
    {
      name: "Tilang",
      description: "Tilang is a very famous easy and melodious raag. Even ordinary listeners of music are easily able to recognize this raag. In Sri Guru Granth Sahib, under the heading of Tilang Raag two types of this raag are there. In Babarvani 'paap kee jannj', 'joree mangai daan', 'rat kaa kungoo', 'agad parrai saitaan' etc. shabads are there which put forth a frightening scene but being 'piaarae kaa raaeisaa' the devotee accepts this scene as the Leela (play) of God and remains under the Will of God.",
      time: "Afternoon 12 pm-3 pm",
      mood: "Gentle love",
      aroha: "Sa Ga, Ma Pa, Nee Sa'",
      avroha: "Sa' Nee Pa, Ma Ga, Sa"
    },
    {
      name: "Suhi",
      description: "Suhi is a less common raag. There is no mention of this raag in old, medieval or contemporary music tradition. Quite often Suha raag is mistaken as Suhi. In Sri Guru Granth Sahib, Bani is written in Suhi raag only. Suhi raag elevates one's spirits.",
      time: "Morning 9 am-12 pm",
      mood: "Bridal union, courage",
      aroha: "Sa Re Ga Ma Pa, Nee Dha Nee, Sa'",
      avroha: "Sa' Nee Dha Pa, Ma Ga, Re Ga Re Sa"
    },
    {
      name: "Bilaval",
      description: "Bilaaval Raag is very famous and old raag. Almost all Granths have mentioned this raag. The bani uttered in this raag mostly describes a unique happiness and bliss which one gets while on one's spiritual journey. But at the same time the happiness of Bilaaval is not attained if one is in love with the other. Bilaaval adorns only those whose mouth utters the name of God. 'Bilaaval tab hee keejeeai jab mukh hovai Naam. Raag naad sabad sohanae ja laagai sehaj dhiaan'",
      time: "Morning 9 am-12 pm",
      mood: "Cheerful brightness",
      aroha: "Sa, Re Ga, Ma Pa, Dha, Nee, Sa'",
      avroha: "Sa' Nee Dha, Pa, Ma Ga, Re Sa"
    },
    {
      name: "Gaund",
      description: "Gond Raag is every melodious, attractive and impressive raag. In Indian music, it is counted as one of the few uncommon raags. Classical kirtiniyas used to sing this raag with a touch of Bilaaval due to which it used to become even more melodious. The atma of a person who sings in this raag will be full of enthusiasm. The mind is constantly reminded to long for only One Lord for 'Eih aas puramithree bhaao dhoojaa hai khin mehi jhooth binas subh jaaee'.",
      time: "Morning 9 am-12 pm",
      mood: "Wonder, mysticism",
      aroha: "Sa Re Ga Ma, Pa Dha Nee Dha Nee Sa'",
      avroha: "Sa' Nee Dha Nee Pa, Ma Ga, Re Sa"
    },
    {
      name: "Ramkali",
      description: "Raamakalee is a very old and famous raag. It has an important place in the morning raags. This raag is a raag of compassion. It first tranquilises then brings about the nectar of compassion. Yogis are fond of raag Raamakalee. Raamukulee raam man vasiaa taa baniaa seegaar gur kai sabadh kamal bigasiaa taa soupiaa bhagat bhundaar. By this Guru Maharaj has made the context of Raamakalee raag very clear. Siddha Gosht, Raamakalee Sad, Anand Sahib, these Banis are written in this raag. That God is the creator this conviction is brought about in Bani of Oankar which is on the tune of Dakhni. For the attainment of Bliss, spiritual religious and psychological teachings are given in Anand Sahib.",
      time: "Morning 6 am-9 am",
      mood: "Transformation, discipline",
      aroha: "Sa, Ga Ma Pa, Dha, Nee Sa'",
      avroha: "Sa' Nee Dha, Pa, Ma Pa Dha Nee Dha Pa, Ga Ma Re, Sa"
    },
    {
      name: "Nat Narayan",
      description: "In Guru Granth Sahib under raag Natt Narayan we find another form of this raag viz.,Natt. Actually raag Natt Narayan is a form of raag Natt only. But both these raags are different and independent. Wherever Gurus have used the word Natt Narayan they have clearly written Natt Narayan Mahla 4th, 5th etc. Natt Narayan raag signifies haste. Amrit Jal alone can put an end to this haste. With Nam mind will become steady. Nar Narayan will take the place of Natt Narayan 'Khin khin nar Naaraaein gaavehi mukh bolehi nar nareharae'. Nam Amrit Jal brings about steadfastness of the mind. Summing up the essence in Gurbani Banee Guroo Guroo hai Banee vich Banee anmrit saarae Gurbanee kehai saevak jan maanai parthak guroo nisataarae.",
      time: "Night 9 pm-12 am",
      mood: "Royal splendour",
      aroha: "Sa, Ma Ga Ma Re, Ma Pa Dha Nee Sa'",
      avroha: ""
    },
    {
      name: "Maalee Gauraa",
      description: "Raag Maali Gaura is one of the not very well known raags and falls in the category of uncommon raags and it is a difficult raag. There is no reference to this raag in the ancient and medieval Granths of Indian Music nor in the Raagmala, which is written at the end of Sri Guru Granth Sahib. There ia a belief that this raag has originated from the Muslims In Sri Guru Granth Sahib we find 6 shabads of Guru Ramdasji, 3 Shabads of Guru Arjan Devji and 2 Shabads of Bhagat Namdev written in this raag. The nature of raag Mali Gaura is to arouse happiness and to prepare one to fight against Kama Krodha etc. One will learn the knack of using everything given by God if we take the support of Naam and bow down before Naam every second.",
      time: "Late afternoon 3 pm-6 pm",
      mood: "Spiritual blooming",
      aroha: "Sa Re, Sa, Ne Dha Ne Re Ga Ma Pa, Ma Dha Nee Dha Sa'",
      avroha: "Sa' Nee Dha Pa, Ma Nee Dha Ma Ga Re, Sa"
    },
    {
      name: "Maaru",
      description: "In a stable atma self dignity arises because only truth resides therein. The Truth is fearless, without enemity that is why svadharma gets perfected. Such a jivatma becomes courageous, carefree, fearless, this is the impact of Maru. On hearing Maru, 'sudh na rahe kayar ki,jab baajai dhun Maru'. Maru Raag is sung at the time of death of a person as there is the emotion of bairag in this raag. So, during time of wars and death this raag is sung. On the one side there is josh, on the other side there is Bairag in this raag. Expressing feelings of josh or excitement, Bhagat Kabirji says : sooraa so pehichaaneeai j lurai deen kae haet .Purujaa purujaa katt murai kubehoo n chhaaddai khaet.There are those spiritually enlightened brave ones, in whose praises drums are beaten in the celestial environnments and the effect of maya cannot be seen. While living, they have full awareness about death that is why, the seekers on the path of spirituality are ordered pehilaa murun kubool jeevun kee chhadd aas. Hohu subhunaa kee raenukaa to aao humaarai paas. In all situations the singing of Maru is successful only if the shabad resides within and the five enemies are conquered.Gur kai subadh araadheeai naam rung bairaag.Jeetae punch bairaaeeaa naanuk suful maaroo eihu raag. Maru is a very famous and old raag. In Indian Music it is called by different names and is sung in different ways. Maru raag of Gurmat Sangeet has its unique form and influence. It is an old tradition of singing shabads in Maru at the time of performing final rites of an individual after death. With the notes of this raag an atmosphere of Bairag is created.",
      time: "Afternoon 12 pm-3 pm",
      mood: "Heroic zeal",
      aroha: "Sa Ga Ma Pa, Dha Nee Sa'",
      avroha: "Sa' Nee Dha Pa, Ma Pa Dha Nee Dha Pa, Ma Ga Re Sa"
    },
    {
      name: "Tukharee",
      description: "Tukhari is a raag in the category of less famous raags. There is no reference to this raag in any ancient, medieval and contemporary texts of Indian music nor have the tunes of this Raag been heard from musicians and singers of any Gharanas. According to intellectuals, Guru Nanak Dev Ji composed this raag. This raag contains Bani of Guru Nanak Dev Ji, Guru Ramdas Ji and Guru Arjun Dev Ji. This raag is an unparalled contribution to Indian Sangeet style. The form of Tukhari is that of a silently sitting Yogi and in the nature of this raag the pangs of separation are seen. However, Guru Sahibs have composed the entire Bani of Tukhari in Chhants and induced the happiness of unison. In this Raag Guru Nanak Devji's Baramaha is written which is a composition of Vijog (separation) and being in chhants it has elements of Sanjog also. There is no Bhagat Bani in this raag.",
      time: "Late afternoon 3 pm-6 pm",
      mood: "Divine protection",
      aroha: "Nee Sa, Ga Ma Pa, Nee Sa'",
      avroha: "Sa' Nee Dha Pa, Nee Dha, Pa, Ma Ga, Re Sa"
    },
    {
      name: "Kedaaraa",
      description: "Raag Kedaaraa is a very ancient and famous raag of Indian music. In connection with this Raag there is a saying of Guru 'kaedaaraa raagaa vich jaaneeai bhaaee sabadae karae piaar, satasangat sio milado rehai sachae dharae piaar'. From this, it is clear that this raag has an important place in Gurumat Sangeet. Kedaaraa raag continues to be an integral part of Indian music. This raag is not counted in the very difficult and complicated raags but it is included in the category of very simple and easy raags. The Kedaaraa tune has been taken from the fluttering of the flag and it is said that only such a great warrior who has expert knowledge and rigorous yogic practice can sing the raag. Such a hero sings this after night sets in.",
      time: "Evening 6 pm-9 pm",
      mood: "Compassionate calm",
      aroha: "Sa Ma, Ma Pa, Dha Pa, Nee Dha Sa'",
      avroha: "Sa' Nee Dha Pa, Ma Pa Dha Pa Ma, Re Sa"
    },
    {
      name: "Bhairav",
      description: "Bhairav is very ancient, sweet raag and is one of the important raags. The environment of Bhairo is very pleasing and love inducing. In this raag Guru Sahib has described in detail the story of Bhagat Prahlad, who destroyed the ego of Harnakash. In this raag only there is reference to the bravery of Bhagat Namdev ji who told his mother 'N ho tarerra poongarraa n too maeree maae' 'Neither am I your son, nor are you my mother'",
      time: "Pre-dawn 3 am-6 am",
      mood: "Fearless grandeur",
      aroha: "Sa Re, Ga Ma Pa, Dha, Nee Sa'",
      avroha: "Sa' Nee Dha Dha Pa, Ga Ma Re Re, Sa"
    },
    {
      name: "Basant",
      description: "Since times immemorial there an inseparable relation between man and nature due to which colours of nature bring joy to man. In the cultural development of man, months, days and seasons have had an important place. According to the natural setting of India, the heating of earth and sky in the months of Jeth and Asadh, the thundering of clouds and the drizzling of rain in Saavan and Bhadon, the blooming of earth and the sky in Basant Season during the months of Chet and Vaisakh all these bring in man the remembrance of the Creator. While accepting Basant as the most important season it is called 'king of seasons' (Ritu-Raaj). While we see everything blooming all around us during Basant the mind also blooms and gets happiness. Kabeerji says 'maulee dharatee mouliaa akaas, ghatt ghatt mauliaa aatam pragaas' Guru Amardasji says, 'banasapat maulee charriaa Basant'. During Basant, that is from Magh month itself in every deewan, after the samapti of kirtan Basant ki Vaar is sung. This vaar is sung till Hola-Mohalla. It is said that the one who sings Basant ki Vaar always remains happy. His masculinity remains forever. Only that form of this Raag has been finalized which had been sung at Harmandar Sahib and knowledgeable kirtanias sing even now.",
      time: "Evening 6 pm-9 pm",
      mood: "Renewal, spring joy",
      aroha: "Sa Ga Ma, Dha Nee Sa'",
      avroha: "Sa' Nee Dha Pa Ma, Ga Re Sa"
    },
    {
      name: "Sarang",
      description: "Raag Saarang famous since centuries is an easy sweet and a raag loved by people. Notes of various folk songs are based on this raag. The sweet notes of this raag can be heard on the shepherd's flute and on the harp (been) of the snake charmer. On hearing these notes the snake gets mesmerized and starts dancing. Sarang has a cool effect. Hence it is sung at the peak of noon. In order to cool down the heat of the burning mind (burning due to desires) Guru Sahib has based the entire content of Saarang raag on the greatness of Gurshabad. This raag also gives the message that we can earn Naam in Satsangat only. 'ghaal khaae kichh hathahu daee, naanak raahu pachhaanehi saee' this message is also in this raag only.",
      time: "Afternoon 12 pm-3 pm",
      mood: "Soothing relief (rain)",
      aroha: "Sa, Re Ma Pa, Nee Sa'",
      avroha: "Sa' Nee Pa, Ma Re, Nee Sa"
    },
    {
      name: "Malaar",
      description: "About Raag Malaar Guru Amar Dass Ji has said 'malaar seehal raag hai har dhiaaeiai saanth hoe'. And also 'guramukh in Basant Season raag jo karehi tin man tan seetal hoe, gur sabadee eaek pachhaaniaa eaeko sachaa soe'. The effect of Malaar is to bring about an atmosphere of enthusiasm all around. In Malaar Raag one can see as if there is a rainfall of Gurbani and whosoever drinks a drop of amrit from this rain of Gurbani becomes exalted. Guru Nanak Ji says 'saachee baanee meethee anmrith dhaar, jin peetee tis mokh dhuaar'. In Gurbani of Malaar Raag most of the shabads depict the relation between rain and rain bird (Babiha). This is a very famous raag of Indian music. It is not only a favourite raag of musicians but also of general public. Malaar is a seasonal raag. As per the geographical situation of India, this raag is mostly sung during the months of Sawan and Bhadron (rainy season). During rainy season it can be sung at anytime of the day or night otherwise it is sung in the third quarter of the night.",
      time: "Night 9 pm-12 am",
      mood: "Yearning in rain",
      aroha: "Sa, Re Ga Ma, Ma Re Pa, Nee Dha Nee Sa'",
      avroha: "Sa', Dha Nee Pa Ma, Ga Ma Re, Sa"
    },
    {
      name: "Kaanraa",
      description: "It is a saying that if suddenly the utensils lying on the loft were to fall down, the echo and music produced thereby which continues for a long time, this music is Kaanara. One gets a similar feeling from the Shabads in this raag. In order to produce a longish echo like effect in many Shabads of this raag we find the lines ending with taen, pavaen, paen, kaen, taak, rageet, katteet, preet japees etc. Raag Kaanra belongs to the category of favorite and melodious raags of Indian music. It is such a famous raag that ordinary listeners of music who have very little knowledge of music also can easily recognize this raag. This famous and entertaining raag is equally difficult. In the medieval period this raag was not only sung in the Raj Darbars, but was prevalent among saint musicians, Bhagats and the common folks too.",
      time: "Night 9 pm-12 am",
      mood: "Philosophical depth",
      aroha: "Sa, Re Ga, Ma Pa, Nee Sa'",
      avroha: "Sa' Nee Pa, Ma Pa, Ga Ma Re Sa"
    },
    {
      name: "Prabhaatee",
      description: "A Raag that represents the early morning hours. It is associated with awakening and new beginnings. This Raag is known for its uplifting nature.",
      time: "Dawn 3 am-6 am",
      mood: "Enlightened awakening",
      aroha: "Sa Re Ga Ma Pa Dha Ni Sa", avroha: ""
    },
    {
      name: "Jaijavantee",
      description: "A Raag that represents the evening hours. It is associated with joy and celebration. This Raag is known for its festive and celebratory nature.",
      time: "Night 9 pm-12 am",
      mood: "Victory over ego",
      aroha: "Sa Re Ga Ma Pa Dha Ni Sa", avroha: ""
    }
  ],
  mishrat: [
    {
      name: "Gauri Deepaki",
      time: "Evening (6–9 PM)",
      mood: "Warm, secure and enlightening (lullaby-like comfort, instills hope)",
      aroha: "Poorvi thaat; 6-note ascent, 7-note descent; Komal Re & Dha (flat 2nd, 6th), Tivra Ma (sharp 4th).", avroha: "",
      description: "Generates feelings of motherly warmth and security, guiding from darkness to fearlessness:contentReference[oaicite:106]{index=106}."
    },
    {
      name: "Gauri Purbi",
      time: "Evening (6–9 PM)",
      mood: "Determined and preparatory, with confident feelings balanced by humility",
      aroha: "Poorvi scale; full 7-note, with Komal Re & Dha, Tivra Ma; some vakra (zigzag) phrases.", avroha: "",
      description: "Strong experiences and readiness to achieve more – a well-considered resolve without ego:contentReference[oaicite:107]{index=107}."
    },
    {
      name: "Gauri Guarairi",
      time: "Predawn (3–6 AM)",
      mood: "Calm, controlled, and truthful in expression, disciplined and focused",
      aroha: "Marwa thaat; 5-note ascend (omits Re, Pa), 6-note descend; Komal Re & Dha, Tivra Ma.", avroha: "",
      description: "Direct and open emotional message delivered with a restrained, middle-octave focus:contentReference[oaicite:108]{index=108}."
    },
    {
      name: "Gauri Chayti",
      time: "Late Afternoon (3–6 PM)",
      mood: "Evokes fear and regret as a warning, creating urgency to not take things for granted",
      aroha: "Poorvi thaat; 6-note ascend (no Ga), 7-note descend; Komal Re & Dha, Tivra Ma.", avroha: "",
      description: "Instills a sensation of panic and repentance – a conscious reminder of consequences if warnings are ignored:contentReference[oaicite:109]{index=109}."
    },
    {
      name: "Gauri Bairagan",
      time: "Early Morning (6–9 AM)",
      mood: "Intense sorrow of separation (bairaag) that motivates spiritual seeking",
      aroha: "Pentatonic (omits Ga, Pa); Komal Re & Dha as in Bhairav raag.", avroha: "",
      description: "Leaves one with emptiness and longing, yet Gauri's balance turns the pain into a search for what's missing:contentReference[oaicite:110]{index=110}."
    },
    {
      name: "Gauri Purbi Deepaki",
      time: "Evening (6–9 PM)",
      mood: "Self-assessing but optimistic, steadily progressing with confidence and hope",
      aroha: "Poorvi/Deepak blend; twilight raag with Komal Re, Dha and Tivra Ma; full 7-note scale.", avroha: "",
      description: "Tone of introspection with positivity – constantly improving with faith in eventual success:contentReference[oaicite:111]{index=111}."
    },
    {
      name: "Gauri Majh",
      time: "Evening (6–9 PM)",
      mood: "Deliberate yearning and longing, with regret and hope intertwining",
      aroha: "Full scale (Sampooran); uses both flat and natural forms of several notes (very rich tonal palette).", avroha: "",
      description: "Creates a planned emotional yearning similar to Raag Majh's vibe – evoking hope and anticipation through nostalgia:contentReference[oaicite:112]{index=112}."
    },
    {
      name: "Gauri Malva",
      time: "Late Afternoon (3–6 PM)",
      mood: "Thoughtful, serious yet caring – like truthful advice from a dear friend",
      aroha: "Hexatonic ascend (no Ni), pentatonic descend (no Dha); Komal Re & Dha, Tivra Ma.", avroha: "",
      description: "Serious but gentle persuasion that's impossible to resist – conveys honest counsel with warm sincerity:contentReference[oaicite:113]{index=113}."
    },
    {
      name: "Gauri Mala",
      time: "Evening (6–9 PM)",
      mood: "Pure, good and positive thoughts accumulating; energetic devotion after hard work",
      aroha: "Full 7-note scale; Komal Re, Ga, Dha; Shuddh Ma and Ni (Bhairav-thaat base with a Bhairavi touch).", avroha: "",
      description: "Conveys the feeling of having diligently added pure thoughts, increasing one's devotion and truthful energy:contentReference[oaicite:115]{index=115}."
    },
    {
      name: "Gauri Sorath",
      time: "Evening (6–9 PM)",
      mood: "Attractive and enticing yet balanced by duty – woos attention but reminds of responsibility",
      aroha: "Sampooran scale but omits Ga in ascent; employs both shuddh/komal Re, Ma, Dha, Ni (blend of major and minor inflections).", avroha: "",
      description: "Captures the listener's mind with allure and charm, while Gauri's influence adds a heedful caution to the enticing call:contentReference[oaicite:116]{index=116}."
    },
    {
      name: "Asa Kafi",
      time: "Evening (6–9 PM)",
      mood: "Carefree, energetic confidence – high-spirited and self-assured, brimming with optimism",
      aroha: "Audav-Sampooran: Ascend omits Ga, Ni; full descend. Komal Ga, Ni in descent (Kafi style); rest shuddh.", avroha: "",
      description: "Exudes boundless energy and fearless optimism, inspiring action without any false hopes or doubts:contentReference[oaicite:118]{index=118}."
    },
    {
      name: "Asa Asavari",
      time: "Mid-Morning (9 AM–12 PM)",
      mood: "Assured, courageous and positive – instills confidence and passion to achieve one's goals",
      aroha: "Asavari thaat; pentatonic ascent (no Ga, Ni), full descent. Komal Ga, Dha, Ni (flat 3rd, 6th, 7th).", avroha: "",
      description: "Provides a sense of certainty and fearless courage, converting spiritual energy into a passionate determination to succeed:contentReference[oaicite:119]{index=119}."
    },
    {
      name: "Tilang Kafi",
      time: "Late Evening (9 PM–12 AM)",
      mood: "Contented acceptance – efforts may go unappreciated but one remains loving and unbothered",
      aroha: "Based on Khamaj thaat. Ascend omits Re, Dha (Tilang's structure); Komal Ni (flat 7th) appears in descent; others shuddh.", avroha: "",
      description: "Carries Tilang's mood of unreciprocated effort yet, with Kafi's influence, the individual feels no anger – only patient love:contentReference[oaicite:121]{index=121}."
    },
    {
      name: "Suhi Kafi",
      time: "Late Morning (9 AM–12 PM)",
      mood: "Deep love, safety and security – like a child completely at peace in a parent's love",
      aroha: "Sampooran (all 7 notes). Both Ga and Ni used (shuddh and komal); other notes shuddh (mix of major and minor).", avroha: "",
      description: "Expresses profound comfort and trust – a carefree confidence born from feeling utterly safe and loved:contentReference[oaicite:122]{index=122}."
    },
    {
      name: "Suhi Lalit",
      time: "Late Morning (9 AM–12 PM)",
      mood: "Emotional resolve with a volatile edge – loving but willing to go to extremes to attain the goal",
      aroha: "Sampooran ascend, Shadav descend (no Pa in descent). Uses both Re, Ma, Dha (flat & natural); shuddh Ga, Ni.", avroha: "",
      description: "Conveys determined love that can become passionate or even reckless – a volatility moderated by devotional intent:contentReference[oaicite:123]{index=123}."
    },
    {
      name: "Bilawal Gond",
      time: "Late Morning (9 AM–12 PM)",
      mood: "Triumphant yet humble joy – courageous conviction paired with restraint, yielding confident happiness without pride",
      aroha: "Bilawal thaat (all natural notes). Major-scale structure; Gond adds stylistic embellishments but no scale change.", avroha: "",
      description: "Expresses abstract jubilation kept in check by humility and insight – **joy with discipline**, avoiding any egotism:contentReference[oaicite:125]{index=125}."
    },
    {
      name: "Maru Kafi",
      time: "Evening (6–9 PM)",
      mood: "Blunt and forceful yet sweetly charming – uncompromising truth delivered in an appealing, winsome manner",
      aroha: "Kafi thaat base. Full scale with both Ga and Ni (natural & flat) and even both Ma; blends Maru's scale with Kafi's komal Ga, Ni.", avroha: "",
      description: "Strong and assertive in tone but retains a charm that endears the listener – one feels the weight of truth without being put off by it:contentReference[oaicite:126]{index=126}."
    },
    {
      name: "Basant Hindol",
      time: "Morning (Spring season; ~6–9 AM)",
      mood: "Fresh, hopeful and content – the feeling of a joyful new beginning and the ease that comes with spiritual renewal",
      aroha: "Omits Re altogether (as Hindol does). Both Ma (shuddh & tivra) are used; other notes shuddh. Bright spring scale with no second note.", avroha: "",
      description: "Full of the delight of spring – encourages an internal 'spring cleaning,' refreshing the mind with hope and a sense of a new cycle beginning:contentReference[oaicite:127]{index=127}."
    },
    {
      name: "Kalyan Bhopali",
      time: "Evening (6–9 PM)",
      mood: "Direct, insistent determination – forceful in desire and inflexible in approach, tackling goals head-on",
      aroha: "Tivra Ma (sharp 4th) like Yaman; otherwise shuddh notes. Omits Ma and Ni in descent (as in Bhopali).", avroha: "",
      description: "Combines Yaman Kalyan's persuasive strength with Bhopali's simplicity – resulting in a confident, no-nonsense drive to fulfill its aim:contentReference[oaicite:128]{index=128}."
    },
    {
      name: "Parbhati Bibhas",
      time: "Dawn (6–9 AM)",
      mood: "Serene yet focused – a calm compromise between the yearning soul and the stubborn mind at daybreak, preparing for the day with balance",
      aroha: "6-note ascend, 5-note descend (no Ma; no Ni in descent). Both Re and Dha (2nd, 6th) can be komal or shuddh. Bright Bhairav-like scale without Ma.", avroha: "",
      description: "Feels like the quiet peace and determination of early morning – the mind and soul reaching a mutual understanding in the first light of day:contentReference[oaicite:129]{index=129}."
    },
    {
      name: "Bibhas Parbhati",
      time: "Dawn (6–9 AM)",
      mood: "Self-assured and wise – conveys certainty and gentle confidence born of knowledge, without any arrogance",
      aroha: "5-note ascend, 6-note descend (no Ma; no Ni in ascend). Both Re and Dha in use (flat & natural). Similar to a Bhairav variant sans Ma.", avroha: "",
      description: "Imparts the quiet confidence of wisdom at dawn – persuasive and content in its truth, seeking to share knowledge without pride:contentReference[oaicite:130]{index=130}."
    }
  ]
}; 