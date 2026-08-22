// ===========================================================
// Halosun — Simple EN / HI toggle
// Add data-i18n="key" to any element's tag, and add the key
// below with english + hindi text, to make it translatable.
// Persists the person's choice across pages via localStorage.
// ===========================================================
const TRANSLATIONS = {
  'nav-services':    { en: 'Services',            hi: 'सेवाएँ' },
  'nav-process':     { en: 'Process',              hi: 'प्रक्रिया' },
  'nav-calculator':  { en: 'Calculator',           hi: 'कैलकुलेटर' },
  'nav-projects':    { en: 'Projects',             hi: 'परियोजनाएँ' },
  'nav-faq':         { en: 'Solar FAQ',            hi: 'सोलर सवाल-जवाब' },
  'nav-contact':     { en: 'Contact',               hi: 'संपर्क करें' },
  'nav-cta':         { en: 'Get a Free Quote',      hi: 'मुफ़्त कोटेशन पाएं' },

  'hero-eyebrow':    { en: 'Design. Build. Power.', hi: 'डिज़ाइन. निर्माण. ऊर्जा.' },
  'hero-title':      { en: 'Your rooftop has a second job.', hi: 'आपकी छत की एक दूसरी नौकरी भी है।' },
  'hero-sub':        { en: "Halosun Energy Systems designs, builds and maintains solar power plants for homes and businesses — from the first site survey to the day your meter starts running backward.",
                        hi: 'हैलोसन एनर्जी सिस्टम्स घरों और व्यवसायों के लिए सोलर पावर प्लांट डिज़ाइन, निर्माण और रखरखाव करता है — पहली साइट विज़िट से लेकर उस दिन तक जब आपका मीटर उल्टा चलना शुरू करे।' },
  'hero-cta-1':      { en: 'Calculate My Savings',  hi: 'मेरी बचत जानें' },
  'hero-cta-2':      { en: 'Request a Free Site Visit', hi: 'मुफ़्त साइट विज़िट के लिए अनुरोध करें' },

  'explore-eyebrow': { en: 'Explore',               hi: 'जानिए' },
  'explore-title':   { en: 'Find what you need',    hi: 'जो चाहिए वह खोजें' },
  'card-01-title':   { en: 'Services',              hi: 'सेवाएँ' },
  'card-01-desc':    { en: 'Residential, commercial and turnkey EPC solar solutions.', hi: 'घरेलू, व्यावसायिक और टर्नकी ईपीसी सोलर समाधान।' },
  'card-02-title':   { en: 'Our Process',           hi: 'हमारी प्रक्रिया' },
  'card-02-desc':    { en: 'Six steps from site survey to a running meter.', hi: 'साइट सर्वे से लेकर चलते मीटर तक, छह चरण।' },
  'card-03-title':   { en: 'Savings Calculator',    hi: 'बचत कैलकुलेटर' },
  'card-03-desc':    { en: 'See your estimated system size, subsidy and payback.', hi: 'अपने सिस्टम आकार, सब्सिडी और पेबैक का अनुमान देखें।' },
  'card-04-title':   { en: 'Projects',              hi: 'परियोजनाएँ' },
  'card-04-desc':    { en: 'A look at recent installations on the roof.', hi: 'हाल की छत इंस्टॉलेशन की झलक।' },

  'faq-eyebrow':     { en: 'Know before you invest', hi: 'निवेश से पहले जानें' },
  'faq-title':       { en: 'Solar questions deserve engineering answers.', hi: 'सोलर सवालों के जवाब इंजीनियरिंग नज़रिए से मिलने चाहिए।' },
  'faq-desc':        { en: 'From net metering and subsidy to batteries, power cuts, roof safety and maintenance, our Solar FAQ explains the things that matter before you sign a quotation.',
                        hi: 'नेट मीटरिंग और सब्सिडी से लेकर बैटरी, बिजली कटौती, छत सुरक्षा और रखरखाव तक — कोटेशन साइन करने से पहले ज़रूरी बातें हमारे सोलर सवाल-जवाब में।' },
  'faq-cta':         { en: 'Explore Solar FAQ →',   hi: 'सोलर सवाल-जवाब देखें →' },

  'why-eyebrow':     { en: 'Why Halosun',           hi: 'हैलोसन क्यों' },
  'why-title':       { en: 'What you get, in plain terms', hi: 'आपको क्या मिलता है, सीधी भाषा में' },
  'why-1-title':     { en: 'One firm, start to finish', hi: 'शुरू से आखिर तक एक ही कंपनी' },
  'why-1-desc':      { en: 'Design, equipment and construction under a single contract and a single point of contact.', hi: 'डिज़ाइन, उपकरण और निर्माण — एक ही अनुबंध और एक ही संपर्क बिंदु के तहत।' },
  'why-2-title':     { en: 'Transparent quotes',    hi: 'पारदर्शी कोटेशन' },
  'why-2-desc':      { en: 'Line-item pricing with no hidden costs added after signing.', hi: 'हस्ताक्षर के बाद कोई छुपी लागत नहीं — हर मद की स्पष्ट कीमत।' },
  'why-3-title':     { en: 'Subsidy handled for you', hi: 'सब्सिडी की ज़िम्मेदारी हमारी' },
  'why-3-desc':      { en: "We file the net-metering and subsidy paperwork so you don't have to.", hi: 'नेट-मीटरिंग और सब्सिडी के कागज़ात हम भरते हैं, आपको नहीं भरने पड़ते।' },
  'why-4-title':     { en: '25-year monitoring',    hi: '25 वर्षों की निगरानी' },
  'why-4-desc':      { en: 'Remote performance tracking so a drop in generation gets caught early.', hi: 'रिमोट परफॉरमेंस ट्रैकिंग से जनरेशन में गिरावट जल्दी पकड़ी जाती है।' },

  'impact-eyebrow':  { en: 'Our footprint so far',  hi: 'अब तक हमारा योगदान' },
  'impact-title':    { en: 'Real solar, real impact', hi: 'असली सोलर, असली असर' },
  'impact-kw-label': { en: 'kW installed',          hi: 'kW स्थापित' },
  'impact-kwh-label':{ en: 'kWh generated / year',  hi: 'kWh प्रति वर्ष उत्पन्न' },
  'impact-co2-label':{ en: 'tons CO₂ avoided / year', hi: 'टन CO₂ प्रति वर्ष बचाई गई' },
  'impact-trees-label': { en: 'trees-equivalent / year', hi: 'पेड़ों के बराबर / वर्ष' },
  'impact-note':     { en: 'Figures update as our installed base grows — based on standard grid emission-factor estimates, not a guarantee for any single system.',
                        hi: 'ये आंकड़े हमारे स्थापित आधार बढ़ने के साथ अपडेट होते हैं — मानक ग्रिड उत्सर्जन-कारक अनुमानों पर आधारित, किसी एक सिस्टम की गारंटी नहीं।' },

  'footer-lead':     { en: 'Professional solar engineering, installation and maintenance for homes and businesses.',
                        hi: 'घरों और व्यवसायों के लिए पेशेवर सोलर इंजीनियरिंग, इंस्टॉलेशन और रखरखाव।' },
  'footer-explore':  { en: 'Explore',               hi: 'जानिए' },
  'footer-contact':  { en: 'Contact',               hi: 'संपर्क करें' },
  'footer-connect':  { en: 'Connect',                hi: 'जुड़ें' },
  'footer-connect-desc': { en: 'Follow Halosun for solar projects, engineering insights and updates.',
                        hi: 'सोलर परियोजनाओं, इंजीनियरिंग जानकारी और अपडेट के लिए हैलोसन को फॉलो करें।' },
  'footer-wa':       { en: 'Chat on WhatsApp →',    hi: 'व्हाट्सएप पर बात करें →' },
  'footer-tagline':  { en: 'Design · Build · Power', hi: 'डिज़ाइन · निर्माण · ऊर्जा' },

  // ---- FAQ page ----
  'faq-page-eyebrow': { en: 'Solar, explained clearly', hi: 'सोलर, सीधी भाषा में समझाया गया' },
  'faq-page-title':   { en: 'Solar FAQ & common myths', hi: 'सोलर सवाल-जवाब और सामान्य भ्रांतियाँ' },
  'faq-page-sub':     { en: 'No sales jargon. Just practical answers to the questions homeowners and businesses should ask before investing in solar.',
                        hi: 'कोई सेल्स जार्गन नहीं। बस उन सवालों के व्यावहारिक जवाब जो घर और व्यवसाय के मालिकों को सोलर में निवेश करने से पहले पूछने चाहिए।' },

  'faq-filter-all':     { en: 'All questions',        hi: 'सभी सवाल' },
  'faq-filter-basics':  { en: 'Basics',                hi: 'बुनियादी बातें' },
  'faq-filter-money':   { en: 'Savings & subsidy',    hi: 'बचत और सब्सिडी' },
  'faq-filter-safety':  { en: 'Safety & maintenance', hi: 'सुरक्षा और रखरखाव' },
  'faq-filter-battery': { en: 'Battery & backup',     hi: 'बैटरी और बैकअप' },

  'faq-q1-q': { en: 'Does solar work when the weather is cloudy?', hi: 'क्या बादल छाए मौसम में सोलर काम करता है?' },
  'faq-q1-a': { en: 'Yes. Solar panels still produce electricity from diffuse sunlight on cloudy days, although output is lower than on a clear day. A properly designed system is sized using realistic local generation assumptions rather than assuming bright sunshine every day.',
                hi: 'हाँ। बादल वाले दिनों में भी सोलर पैनल फैली हुई धूप से बिजली बनाते हैं, हालांकि आउटपुट साफ़ दिन की तुलना में कम होता है। सही ढंग से डिज़ाइन किया गया सिस्टम रोज़ाना तेज़ धूप मानने के बजाय स्थानीय स्तर के वास्तविक जनरेशन अनुमानों के आधार पर तय किया जाता है।' },

  'faq-q2-q': { en: 'Will an on-grid solar system run my house during a power cut?', hi: 'क्या ऑन-ग्रिड सोलर सिस्टम बिजली कटौती के दौरान मेरा घर चलाएगा?' },
  'faq-q2-a': { en: "Normally, no. A standard grid-tied inverter shuts down during a grid outage for electrical safety and anti-islanding protection. If backup during outages is important, a suitable hybrid inverter and battery-backed backup circuit must be designed into the system.",
                hi: 'सामान्यतः नहीं। एक मानक ग्रिड-टाई इनवर्टर विद्युत सुरक्षा और एंटी-आइलैंडिंग सुरक्षा के लिए ग्रिड आउटेज के दौरान बंद हो जाता है। यदि आउटेज के दौरान बैकअप ज़रूरी है, तो सिस्टम में उपयुक्त हाइब्रिड इनवर्टर और बैटरी-समर्थित बैकअप सर्किट डिज़ाइन करना होगा।' },

  'faq-q3-q':    { en: 'What is the difference between on-grid, hybrid and off-grid solar?', hi: 'ऑन-ग्रिड, हाइब्रिड और ऑफ-ग्रिड सोलर में क्या अंतर है?' },
  'faq-q3-a-b1': { en: 'On-grid:', hi: 'ऑन-ग्रिड:' },
  'faq-q3-a-t1': { en: 'connected to the utility grid and generally the most economical for bill reduction.', hi: 'यूटिलिटी ग्रिड से जुड़ा होता है और आमतौर पर बिल घटाने के लिए सबसे किफ़ायती है।' },
  'faq-q3-a-b2': { en: 'Hybrid:', hi: 'हाइब्रिड:' },
  'faq-q3-a-t2': { en: 'grid + solar + battery, allowing selected or designed loads to receive backup.', hi: 'ग्रिड + सोलर + बैटरी, जिससे चुने हुए या डिज़ाइन किए गए लोड को बैकअप मिलता है।' },
  'faq-q3-a-b3': { en: 'Off-grid:', hi: 'ऑफ-ग्रिड:' },
  'faq-q3-a-t3': { en: 'designed around batteries and solar without relying on the utility grid, requiring careful load and storage sizing.', hi: 'यूटिलिटी ग्रिड पर निर्भर हुए बिना बैटरी और सोलर के इर्द-गिर्द डिज़ाइन किया जाता है, जिसमें लोड और स्टोरेज का सावधानीपूर्वक आकलन ज़रूरी होता है।' },

  'faq-q4-q': { en: 'Does installing solar make electricity completely free?', hi: 'क्या सोलर लगवाने से बिजली पूरी तरह मुफ़्त हो जाती है?' },
  'faq-q4-a': { en: 'No. Solar can substantially reduce energy charges, but the final electricity bill can still contain fixed charges, minimum charges, taxes or other utility components. Savings depend on system size, generation, tariff, self-consumption and the applicable net-metering rules.',
                hi: 'नहीं। सोलर ऊर्जा शुल्क को काफ़ी हद तक घटा सकता है, लेकिन अंतिम बिजली बिल में अभी भी फिक्स्ड चार्ज, न्यूनतम शुल्क, टैक्स या अन्य यूटिलिटी घटक शामिल हो सकते हैं। बचत सिस्टम के आकार, जनरेशन, टैरिफ, स्व-उपभोग और लागू नेट-मीटरिंग नियमों पर निर्भर करती है।' },

  'faq-q5-q': { en: 'What is net metering?', hi: 'नेट मीटरिंग क्या है?' },
  'faq-q5-a': { en: 'Net metering allows eligible grid-connected consumers to export surplus electricity to the distribution network and receive the applicable billing credit or adjustment under the prevailing utility rules. The exact process, limits and settlement mechanism depend on the consumer category and current regulations.',
                hi: 'नेट मीटरिंग योग्य ग्रिड-कनेक्टेड उपभोक्ताओं को अतिरिक्त बिजली वितरण नेटवर्क में भेजने और प्रचलित यूटिलिटी नियमों के तहत उपयुक्त बिलिंग क्रेडिट या समायोजन पाने की अनुमति देती है। सटीक प्रक्रिया, सीमाएँ और निपटान तंत्र उपभोक्ता श्रेणी और मौजूदा नियमों पर निर्भर करते हैं।' },

  'faq-q6-q': { en: 'How much electricity can a 3 kW solar system generate?', hi: 'एक 3 kW सोलर सिस्टम कितनी बिजली बना सकता है?' },
  'faq-q6-a': { en: 'Generation varies with location, orientation, tilt, shading, temperature, equipment and weather. A useful planning estimate in India is often around 3.5–4.5 units per kW per day averaged over a year, but the actual result should be assessed from the site and system design rather than a single universal number.',
                hi: 'जनरेशन स्थान, दिशा, झुकाव, छाया, तापमान, उपकरण और मौसम के अनुसार बदलता है। भारत में एक उपयोगी अनुमान अक्सर वर्ष भर औसतन प्रति kW प्रति दिन लगभग 3.5–4.5 यूनिट होता है, लेकिन वास्तविक परिणाम किसी एक सार्वभौमिक संख्या के बजाय साइट और सिस्टम डिज़ाइन से आंका जाना चाहिए।' },

  'faq-q7-q': { en: 'Is the government subsidy available for every solar installation?', hi: 'क्या हर सोलर इंस्टॉलेशन के लिए सरकारी सब्सिडी उपलब्ध है?' },
  'faq-q7-a': { en: 'Subsidy eligibility depends on the applicable scheme, consumer category, installation type and the rules in force when the application is processed. Residential rooftop systems under the relevant government programme may qualify, while commercial and industrial systems are generally treated differently. Always verify the current official eligibility and rates before making a financial decision.',
                hi: 'सब्सिडी की पात्रता लागू योजना, उपभोक्ता श्रेणी, इंस्टॉलेशन के प्रकार और आवेदन प्रक्रिया के समय लागू नियमों पर निर्भर करती है। संबंधित सरकारी कार्यक्रम के तहत आवासीय रूफटॉप सिस्टम पात्र हो सकते हैं, जबकि व्यावसायिक और औद्योगिक सिस्टम को आमतौर पर अलग तरह से माना जाता है। कोई भी वित्तीय निर्णय लेने से पहले हमेशा मौजूदा आधिकारिक पात्रता और दरों की पुष्टि करें।' },

  'faq-q8-q': { en: 'Does solar damage or weaken the roof?', hi: 'क्या सोलर छत को नुकसान पहुँचाता या कमज़ोर करता है?' },
  'faq-q8-a': { en: 'A properly engineered rooftop installation should not compromise a sound roof. Mounting method, structural condition, waterproofing, fasteners, ballast and cable routing all matter. The installation should be planned for the actual roof rather than simply drilling wherever convenient.',
                hi: 'सही ढंग से इंजीनियर किया गया रूफटॉप इंस्टॉलेशन एक मज़बूत छत को नुकसान नहीं पहुँचाना चाहिए। माउंटिंग विधि, संरचनात्मक स्थिति, वॉटरप्रूफिंग, फास्टनर, बैलास्ट और केबल रूटिंग — सब मायने रखते हैं। इंस्टॉलेशन की योजना असली छत के अनुसार बनाई जानी चाहिए, न कि जहाँ सुविधाजनक लगे वहाँ ड्रिल कर देना चाहिए।' },

  'faq-q9-q': { en: 'Why are earthing and surge protection important in a solar system?', hi: 'सोलर सिस्टम में अर्थिंग और सर्ज प्रोटेक्शन क्यों ज़रूरी हैं?' },
  'faq-q9-a': { en: 'Solar equipment is exposed on a roof and is connected to long outdoor cable runs. Proper protective earthing, bonding and appropriately selected surge protective devices help manage fault currents and transient overvoltages. Lightning protection, where required, should be designed as a coordinated system rather than improvised by connecting random conductors together.',
                hi: 'सोलर उपकरण छत पर खुला रहता है और लंबे आउटडोर केबल रूट से जुड़ा होता है। उचित सुरक्षात्मक अर्थिंग, बॉन्डिंग और सही ढंग से चुने गए सर्ज प्रोटेक्टिव डिवाइस फ़ॉल्ट करंट और क्षणिक ओवरवोल्टेज को नियंत्रित करने में मदद करते हैं। जहाँ ज़रूरी हो, लाइटनिंग प्रोटेक्शन को यूँ ही किसी भी कंडक्टर को जोड़कर तात्कालिक तरीके से नहीं, बल्कि एक समन्वित सिस्टम के रूप में डिज़ाइन किया जाना चाहिए।' },

  'faq-q10-q': { en: 'How much maintenance do solar panels need?', hi: 'सोलर पैनल को कितने रखरखाव की ज़रूरत होती है?' },
  'faq-q10-a': { en: 'Solar is relatively low-maintenance, but it is not maintenance-free. Periodic cleaning may be required depending on dust and local conditions, while inspections should cover module condition, mounting hardware, cable routes, connectors, inverter alarms, protection devices and generation performance.',
                hi: 'सोलर अपेक्षाकृत कम रखरखाव वाला है, लेकिन पूरी तरह रखरखाव-मुक्त नहीं है। धूल और स्थानीय परिस्थितियों के अनुसार समय-समय पर सफ़ाई की ज़रूरत हो सकती है, जबकि निरीक्षण में मॉड्यूल की स्थिति, माउंटिंग हार्डवेयर, केबल रूट, कनेक्टर, इनवर्टर अलार्म, सुरक्षा उपकरण और जनरेशन प्रदर्शन शामिल होने चाहिए।' },

  'faq-q11-q': { en: 'Do solar panels stop working after 10 years?', hi: 'क्या सोलर पैनल 10 साल बाद काम करना बंद कर देते हैं?' },
  'faq-q11-a': { en: 'No. Good-quality modules are designed for long service lives and normally continue producing electricity for decades, although output gradually degrades over time. The exact warranty and degradation guarantee depend on the module manufacturer and product.',
                hi: 'नहीं। अच्छी गुणवत्ता वाले मॉड्यूल लंबी सेवा अवधि के लिए डिज़ाइन किए जाते हैं और आमतौर पर दशकों तक बिजली बनाते रहते हैं, हालांकि समय के साथ आउटपुट धीरे-धीरे कम होता जाता है। सटीक वारंटी और डिग्रेडेशन गारंटी मॉड्यूल निर्माता और उत्पाद पर निर्भर करती है।' },

  'faq-q12-q': { en: 'Can I use solar during a power cut and keep only selected appliances on battery?', hi: 'क्या मैं बिजली कटौती के दौरान सोलर का उपयोग कर सकता हूँ और सिर्फ़ चुने हुए उपकरणों को बैटरी पर रख सकता हूँ?' },
  'faq-q12-a': { en: "Yes, with a correctly designed hybrid/backup system. A backup distribution board can supply selected essential circuits from the inverter's backup output, while non-essential loads remain on the normal supply. The inverter, battery, changeover/protection and wiring must be designed for the intended loads.",
                hi: 'हाँ, सही ढंग से डिज़ाइन किए गए हाइब्रिड/बैकअप सिस्टम के साथ। एक बैकअप डिस्ट्रीब्यूशन बोर्ड इनवर्टर के बैकअप आउटपुट से चुने हुए ज़रूरी सर्किट को बिजली दे सकता है, जबकि गैर-ज़रूरी लोड सामान्य आपूर्ति पर बने रहते हैं। इनवर्टर, बैटरी, चेंजओवर/सुरक्षा और वायरिंग को इच्छित लोड के अनुसार डिज़ाइन किया जाना चाहिए।' },

  'faq-q13-q': { en: 'Is a battery necessary for an on-grid solar system?', hi: 'क्या ऑन-ग्रिड सोलर सिस्टम के लिए बैटरी ज़रूरी है?' },
  'faq-q13-a': { en: 'Not necessarily. An on-grid system can operate without batteries and use the grid for supply when solar generation is insufficient. Batteries add backup capability and can shift energy to later hours, but they also add cost, complexity and a component with its own service life.',
                hi: 'ज़रूरी नहीं। एक ऑन-ग्रिड सिस्टम बिना बैटरी के भी काम कर सकता है और जब सोलर जनरेशन अपर्याप्त हो तो आपूर्ति के लिए ग्रिड का उपयोग करता है। बैटरी बैकअप क्षमता जोड़ती है और ऊर्जा को बाद के घंटों में स्थानांतरित कर सकती है, लेकिन इससे लागत, जटिलता और अपनी सेवा अवधि वाला एक अतिरिक्त घटक भी जुड़ जाता है।' },

  'faq-q14-q': { en: 'Does more panel wattage always mean a better solar system?', hi: 'क्या अधिक पैनल वाट क्षमता का मतलब हमेशा बेहतर सोलर सिस्टम होता है?' },
  'faq-q14-a': { en: "Not by itself. System quality depends on module performance, inverter selection, string design, shading, structure, cable sizing, protection, earthing, installation workmanship and how well the plant matches the consumer's load. A larger nameplate can be a poor investment if the design is wrong.",
                hi: 'अकेले इससे नहीं। सिस्टम की गुणवत्ता मॉड्यूल प्रदर्शन, इनवर्टर चयन, स्ट्रिंग डिज़ाइन, छाया, संरचना, केबल आकार, सुरक्षा, अर्थिंग, इंस्टॉलेशन की कारीगरी और प्लांट उपभोक्ता के लोड से कितना मेल खाता है — इस पर निर्भर करती है। यदि डिज़ाइन ग़लत हो तो बड़ी नेमप्लेट क्षमता भी एक ख़राब निवेश साबित हो सकती है।' },

  'faq-note-label': { en: 'Engineering note:', hi: 'इंजीनियरिंग नोट:' },
  'faq-note-text':  { en: 'Solar generation, subsidy, net-metering rules and equipment specifications can change. Treat this page as general education and confirm project-specific numbers and current government/utility rules before installation.',
                      hi: 'सोलर जनरेशन, सब्सिडी, नेट-मीटरिंग नियम और उपकरण विशिष्टताएँ बदल सकती हैं। इस पृष्ठ को सामान्य जानकारी के रूप में लें और इंस्टॉलेशन से पहले प्रोजेक्ट-विशिष्ट आंकड़ों और मौजूदा सरकारी/यूटिलिटी नियमों की पुष्टि करें।' },

  'myths-eyebrow': { en: 'Myths worth leaving behind', hi: 'भ्रांतियाँ जो छोड़ देनी चाहिए' },
  'myths-title':   { en: 'Three common solar myths', hi: 'तीन आम सोलर भ्रांतियाँ' },

  'myth-01-label': { en: 'Myth 01', hi: 'भ्रांति 01' },
  'myth-01-title': { en: '"Solar means zero electricity bill."', hi: '"सोलर मतलब बिजली का बिल शून्य।"' },
  'myth-01-desc':  { en: 'Solar can reduce the energy component dramatically, but fixed charges and other billing components may remain.',
                     hi: 'सोलर ऊर्जा घटक को काफ़ी हद तक घटा सकता है, लेकिन फिक्स्ड चार्ज और अन्य बिलिंग घटक फिर भी बने रह सकते हैं।' },

  'myth-02-label': { en: 'Myth 02', hi: 'भ्रांति 02' },
  'myth-02-title': { en: '"Solar is useless in winter or clouds."', hi: '"सर्दियों या बादलों में सोलर बेकार है।"' },
  'myth-02-desc':  { en: 'Panels generate whenever there is usable light. Generation changes with irradiance, temperature, shading and weather.',
                     hi: 'जब भी उपयोगी रोशनी होती है, पैनल बिजली बनाते हैं। जनरेशन विकिरण, तापमान, छाया और मौसम के साथ बदलता है।' },

  'myth-03-label': { en: 'Myth 03', hi: 'भ्रांति 03' },
  'myth-03-title': { en: '"Any electrician can install solar."', hi: '"कोई भी इलेक्ट्रीशियन सोलर लगा सकता है।"' },
  'myth-03-desc':  { en: 'Solar needs coordinated DC, AC, protection, earthing, structure and grid-interface design. Workmanship matters.',
                     hi: 'सोलर के लिए समन्वित DC, AC, सुरक्षा, अर्थिंग, संरचना और ग्रिड-इंटरफ़ेस डिज़ाइन ज़रूरी है। कारीगरी मायने रखती है।' },

  'myth-cta-1': { en: 'Estimate My Savings', hi: 'मेरी बचत का अनुमान लगाएं' },
  'myth-cta-2': { en: 'Talk to Halosun',     hi: 'हैलोसन से बात करें' },

  'footer-process':   { en: 'Our Process',          hi: 'हमारी प्रक्रिया' },
  'footer-calc':      { en: 'Savings Calculator',   hi: 'बचत कैलकुलेटर' },
  'footer-faq-myths': { en: 'Solar FAQ & Myths',    hi: 'सोलर सवाल-जवाब और भ्रांतियाँ' }
};

function applyLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const entry = TRANSLATIONS[key];
    if (entry && entry[lang]) {
      el.textContent = entry[lang];
    }
  });
  document.documentElement.setAttribute('lang', lang === 'hi' ? 'hi' : 'en');
  localStorage.setItem('halosun-lang', lang);
  document.querySelectorAll('.lang-toggle button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('halosun-lang') || 'en';
  applyLanguage(saved);

  document.querySelectorAll('.lang-toggle button').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });
});
