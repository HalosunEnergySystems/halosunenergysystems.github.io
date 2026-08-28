// ===========================================================
// Halosun - Simple EN / HI toggle
// Add data-i18n="key" to any element's tag, and add the key
// below with english + hindi text, to make it translatable.
// Persists the person's choice across pages via localStorage.
// ===========================================================
const TRANSLATIONS = {
  'nav-home':          { en: 'Home',                hi: 'होम' },
  'breadcrumb-back':   { en: '← Back',              hi: '← वापस' },
  'nav-services':      { en: 'Services',            hi: 'सेवाएँ' },
  'nav-pm-suryaghar':  { en: 'PM Surya Ghar',        hi: 'PM सूर्य घर' },
  'nav-process':       { en: 'Process',              hi: 'प्रक्रिया' },
  'nav-standard':      { en: 'Our Standard',         hi: 'हमारा मानक' },
  'nav-why':           { en: 'Why Halosun',          hi: 'हैलोसन क्यों' },
  'nav-calculator':    { en: 'Calculator',           hi: 'कैलकुलेटर' },
  'nav-projects':      { en: 'Projects',             hi: 'परियोजनाएँ' },
  'nav-faq':           { en: 'Solar FAQ',            hi: 'सोलर सवाल-जवाब' },
  'nav-about':         { en: 'About',                hi: 'हमारे बारे में' },
  'nav-contact':       { en: 'Contact',               hi: 'संपर्क करें' },
  'nav-cta':           { en: 'Get a Free Quote',      hi: 'मुफ़्त कोटेशन पाएं' },

  // ---- Deadline countdown banner (PM Surya Ghar subsidy window) ----
  'deadline-text':     { en: 'PM Surya Ghar subsidy window closes in', hi: 'PM सूर्य घर सब्सिडी विंडो बंद होने में' },
  'deadline-days':     { en: 'Days',  hi: 'दिन' },
  'deadline-hours':    { en: 'Hours', hi: 'घंटे' },
  'deadline-min':      { en: 'Min',   hi: 'मिनट' },
  'deadline-sec':      { en: 'Sec',   hi: 'सेकंड' },
  'deadline-closed':   { en: 'This subsidy window has closed.', hi: 'यह सब्सिडी विंडो बंद हो चुकी है।' },

  'hero-eyebrow':      { en: 'Design. Build. Power.', hi: 'डिज़ाइन. बिल्ड. पावर.' },
  'hero-title':        { en: 'Put your rooftop to work. Lower your electricity bills.', hi: 'अपनी छत को काम पर लगाएं। बिजली का बिल घटाएं।' },
  'hero-sub':          { en: 'Halosun Energy Systems designs, installs, and maintains solar systems for homes and businesses - from site survey and engineering to installation, net metering, and long-term support.',
                          hi: 'हैलोसन एनर्जी सिस्टम्स घरों और व्यवसायों के लिए सौर ऊर्जा प्रणालियों का डिज़ाइन, इंस्टॉलेशन और रखरखाव करता है - साइट सर्वे और इंजीनियरिंग से लेकर इंस्टॉलेशन, नेट मीटरिंग और दीर्घकालिक सेवा एवं सहायता तक।' },
  'hero-cta-1':        { en: 'Calculate My Savings',  hi: 'मेरी बचत जानें' },
  'hero-cta-2':        { en: 'Request a Free Site Visit', hi: 'मुफ़्त साइट विज़िट के लिए अनुरोध करें' },
  'hero-trust-1':      { en: 'MNRE Authorized Installer', hi: 'MNRE अधिकृत इंस्टॉलर' },
  'hero-trust-2':      { en: 'Subsidy Assistance',   hi: 'सब्सिडी सहायता' },
  'hero-trust-3':      { en: 'Turnkey Maintenance',  hi: 'टर्नकी रखरखाव' },

  'explore-eyebrow':   { en: 'Explore',               hi: 'जानिए' },
  'explore-title':     { en: 'Find what you need',    hi: 'जो चाहिए वह खोजें' },
  'card-01-title':     { en: 'Services',              hi: 'सेवाएँ' },
  'card-01-desc':      { en: 'Residential, commercial and turnkey EPC solar solutions.', hi: 'घरेलू, व्यावसायिक और टर्नकी ईपीसी सोलर समाधान।' },
  'card-02-title':     { en: 'Our Process',           hi: 'हमारी प्रक्रिया' },
  'card-02-desc':      { en: 'Six steps from site survey to a running meter.', hi: 'साइट सर्वे से लेकर चलते मीटर तक, छह चरण।' },
  'card-03-title':     { en: 'Savings Calculator',    hi: 'बचत कैलकुलेटर' },
  'card-03-desc':      { en: 'See your estimated system size, subsidy and payback.', hi: 'अपने सिस्टम आकार, सब्सिडी और पेबैक का अनुमान देखें।' },
  'card-04-title':     { en: 'Projects',              hi: 'परियोजनाएँ' },
  'card-04-desc':      { en: 'A look at recent installations on the roof.', hi: 'हाल की छत इंस्टॉलेशन की झलक।' },
  'card-08-title':     { en: 'Our Standard',           hi: 'हमारा मानक' },
  'card-08-desc':      { en: "What's actually under your panels — mounting, waterproofing, cabling and earthing.",
                          hi: 'आपके पैनल के नीचे असल में क्या है — माउंटिंग, वॉटरप्रूफिंग, केबलिंग और अर्थिंग।' },
  'card-09-title':     { en: 'Why Halosun',             hi: 'हैलोसन क्यों' },
  'card-09-desc':      { en: "Solar is easy to sell. Building it right is harder — here's why that's what we chase.",
                          hi: 'सोलर बेचना आसान है। इसे सही तरीके से बनाना मुश्किल — हम यही क्यों चुनते हैं, यहाँ जानें।' },
  'card-05-title':     { en: 'PM Surya Ghar',          hi: 'PM सूर्य घर' },
  'card-05-desc':      { en: 'Subsidy eligibility, documents and the full application process.',
                          hi: 'सब्सिडी पात्रता, दस्तावेज़ और पूरी आवेदन प्रक्रिया।' },
  'card-06-title':     { en: 'Solar FAQ',              hi: 'सोलर सवाल-जवाब' },
  'card-06-desc':      { en: 'Straight answers on cost, subsidy, maintenance and myths.',
                          hi: 'लागत, सब्सिडी, रखरखाव और भ्रांतियों पर सीधे जवाब।' },
  'card-07-title':     { en: 'Contact',                hi: 'संपर्क करें' },
  'card-07-desc':      { en: 'Get a free site visit and a no-obligation quote.',
                          hi: 'मुफ़्त साइट विज़िट और बिना किसी बाध्यता के कोटेशन पाएं।' },

  'faq-eyebrow':       { en: 'Know before you invest', hi: 'निवेश से पहले जानें' },
  'faq-title':         { en: 'Solar questions deserve engineering answers.', hi: 'सोलर सवालों के जवाब इंजीनियरिंग नज़रिए से मिलने चाहिए।' },
  'faq-desc':          { en: 'From net metering and subsidy to batteries, power cuts, roof safety and maintenance, our Solar FAQ explains the things that matter before you sign a quotation.',
                          hi: 'नेट मीटरिंग और सब्सिडी से लेकर बैटरी, बिजली कटौती, छत सुरक्षा और रखरखाव तक - कोटेशन साइन करने से पहले ज़रूरी बातें हमारे सोलर सवाल-जवाब में।' },
  'faq-cta':           { en: 'Explore Solar FAQ →',   hi: 'सोलर सवाल-जवाब देखें →' },

  'why-eyebrow':       { en: 'Why Halosun',           hi: 'हैलोसन क्यों' },
  'why-title':         { en: 'What you get, in plain terms', hi: 'आपको क्या मिलता है, सीधी भाषा में' },
  'why-1-title':       { en: 'One firm, start to finish', hi: 'शुरू से आखिर तक एक ही कंपनी' },
  'why-1-desc':        { en: 'Design, equipment and construction under a single contract and a single point of contact.', hi: 'डिज़ाइन, उपकरण और निर्माण - एक ही अनुबंध और एक ही संपर्क बिंदु के तहत।' },
  'why-2-title':       { en: 'Transparent quotes',    hi: 'पारदर्शी कोटेशन' },
  'why-2-desc':        { en: 'Line-item pricing with no hidden costs added after signing.', hi: 'हस्ताक्षर के बाद कोई छुपी लागत नहीं - हर मद की स्पष्ट कीमत।' },
  'why-3-title':       { en: 'Subsidy handled for you', hi: 'सब्सिडी की ज़िम्मेदारी हमारी' },
  'why-3-desc':        { en: 'We file the net-metering and subsidy paperwork so you don\'t have to.', hi: 'नेट-मीटरिंग और सब्सिडी के कागज़ात हम भरते हैं, आपको नहीं भरने पड़ते।' },
  'why-4-title':       { en: '25-year monitoring',    hi: '25 वर्षों की निगरानी' },
  'why-4-desc':        { en: 'Remote performance tracking so a drop in generation gets caught early.', hi: 'रिमोट परफॉरमेंस ट्रैकिंग से जनरेशन में गिरावट जल्दी पकड़ी जाती है।' },

  'impact-eyebrow':    { en: 'Our footprint so far',  hi: 'अब तक हमारा योगदान' },
  'impact-title':      { en: 'Real solar, real impact', hi: 'असली सोलर, असली असर' },
  'impact-kw-label':   { en: 'kW installed',          hi: 'kW स्थापित' },
  'impact-kwh-label':  { en: 'kWh generated / year',  hi: 'kWh प्रति वर्ष उत्पन्न' },
  'impact-co2-label':  { en: 'tons CO₂ avoided / year', hi: 'टन CO₂ प्रति वर्ष बचाई गई' },
  'impact-trees-label':{ en: 'trees-equivalent / year', hi: 'पेड़ों के बराबर / वर्ष' },
  'impact-note':       { en: 'Figures update as our installed base grows - based on standard grid emission-factor estimates, not a guarantee for any single system.',
                          hi: 'ये आंकड़े हमारे स्थापित आधार बढ़ने के साथ अपडेट होते हैं - मानक ग्रिड उत्सर्जन-कारक अनुमानों पर आधारित, किसी एक सिस्टम की गारंटी नहीं।' },

  'footer-lead':       { en: 'Professional solar engineering, installation and maintenance for homes and businesses.',
                          hi: 'घरों और व्यवसायों के लिए पेशेवर सोलर इंजीनियरिंग, इंस्टॉलेशन और रखरखाव।' },
  'footer-explore':    { en: 'Explore',               hi: 'जानिए' },
  'footer-contact':    { en: 'Contact',               hi: 'संपर्क करें' },
  'footer-contactAdd': { en: 'Tilak Nagar, Raebareli, Uttar Pradesh', hi: 'तिलक नगर, रायबरेली, उत्तर प्रदेश' },
  
  'footer-connect':    { en: 'Connect',                hi: 'जुड़ें' },
  'footer-connect-desc': { en: 'Follow Halosun for solar projects, engineering insights and updates.',
                          hi: 'सोलर परियोजनाओं, इंजीनियरिंग जानकारी और अपडेट के लिए हैलोसन को फॉलो करें।' },
  'footer-wa':         { en: 'Chat on WhatsApp →',    hi: 'व्हाट्सएप पर बात करें →' },
  'footer-tagline':    { en: 'Design · Build · Power', hi: 'डिज़ाइन · बिल्ड · पावर' },
  'footer-upneda-badge': { en: 'UPNEDA Registered',   hi: 'यूपीनेडा पंजीकृत' },
  'footer-updated-label': { en: 'Site Last Updated:', hi: 'साइट अपडेट की गई:' },

  // ---- FAQ page ----
  'faq-page-eyebrow':  { en: 'Solar, explained clearly', hi: 'सोलर, सीधी भाषा में समझाया गया' },
  'faq-page-title':    { en: 'Solar FAQ & common myths', hi: 'सोलर सवाल-जवाब और सामान्य भ्रांतियाँ' },
  'faq-page-sub':      { en: 'No sales jargon. Just practical answers to the questions homeowners and businesses should ask before investing in solar.',
                          hi: 'कोई सेल्स जार्गन नहीं। बस उन सवालों के व्यावहारिक जवाब जो घर और व्यवसाय के मालिकों को सोलर में निवेश करने से पहले पूछने चाहिए।' },

  'faq-filter-all':     { en: 'All questions',        hi: 'सभी सवाल' },
  'faq-filter-basics':  { en: 'Basics',                hi: 'बुनियादी बातें' },
  'faq-filter-money':   { en: 'Savings & subsidy',    hi: 'बचत और सब्सिडी' },
  'faq-filter-safety':  { en: 'Safety & maintenance', hi: 'सुरक्षा और रखरखाव' },
  'faq-filter-battery': { en: 'Battery & backup',     hi: 'बैटरी और बैकअप' },

  'faq-q1-q':          { en: 'Does solar work when the weather is cloudy?', hi: 'क्या बादल छाए मौसम में सोलर काम करता है?' },
  'faq-q1-a':          { en: 'Yes. Solar panels still produce electricity from diffuse sunlight on cloudy days, although output is lower than on a clear day. A properly designed system is sized using realistic local generation assumptions rather than assuming bright sunshine every day.',
                          hi: 'हाँ। बादल वाले दिनों में भी सोलर पैनल फैली हुई धूप से बिजली बनाते हैं, हालांकि आउटपुट साफ़ दिन की तुलना में कम होता है। सही ढंग से डिज़ाइन किया गया सिस्टम रोज़ाना तेज़ धूप मानने के बजाय स्थानीय स्तर के वास्तविक जनरेशन अनुमानों के आधार पर तय किया जाता है।' },

  'faq-q2-q':          { en: 'Will an on-grid solar system run my house during a power cut?', hi: 'क्या ऑन-ग्रिड सोलर सिस्टम बिजली कटौती के दौरान मेरा घर चलाएगा?' },
  'faq-q2-a':          { en: 'Normally, no. A standard grid-tied inverter shuts down during a grid outage for electrical safety and anti-islanding protection. If backup during outages is important, a suitable hybrid inverter and battery-backed backup circuit must be designed into the system.',
                          hi: 'सामान्यतः नहीं। एक मानक ग्रिड-टाई इनवर्टर विद्युत सुरक्षा और एंटी-आइलैंडिंग सुरक्षा के लिए ग्रिड आउटेज के दौरान बंद हो जाता है। यदि आउटेज के दौरान बैकअप ज़रूरी है, तो सिस्टम में उपयुक्त हाइब्रिड इनवर्टर और बैटरी-समर्थित बैकअप सर्किट डिज़ाइन करना होगा।' },

  'faq-q3-q':          { en: 'What is the difference between on-grid, hybrid and off-grid solar?', hi: 'ऑन-ग्रिड, हाइब्रिड और ऑफ-ग्रिड सोलर में क्या अंतर है?' },
  'faq-q3-a-b1':       { en: 'On-grid:', hi: 'ऑन-ग्रिड:' },
  'faq-q3-a-t1':       { en: 'connected to the utility grid and generally the most economical for bill reduction.', hi: 'यूटिलिटी ग्रिड से जुड़ा होता है और आमतौर पर बिल घटाने के लिए सबसे किफ़ायती है।' },
  'faq-q3-a-b2':       { en: 'Hybrid:', hi: 'हाइब्रिड:' },
  'faq-q3-a-t2':       { en: 'grid + solar + battery, allowing selected or designed loads to receive backup.', hi: 'ग्रिड + सोलर + बैटरी, जिससे चुने हुए या डिज़ाइन किए गए लोड को बैकअप मिलता है।' },
  'faq-q3-a-b3':       { en: 'Off-grid:', hi: 'ऑफ-ग्रिड:' },
  'faq-q3-a-t3':       { en: 'designed around batteries and solar without relying on the utility grid, requiring careful load and storage sizing.', hi: 'यूटिलिटी ग्रिड पर निर्भर हुए बिना बैटरी और सोलर के इर्द-गिर्द डिज़ाइन किया जाता है, जिसमें लोड और स्टोरेज का सावधानीपूर्वक आकलन ज़रूरी होता है।' },

  'faq-q4-q':          { en: 'Does installing solar make electricity completely free?', hi: 'क्या सोलर लगवाने से बिजली पूरी तरह मुफ़्त हो जाती है?' },
  'faq-q4-a':          { en: 'No. Solar can substantially reduce energy charges, but the final electricity bill can still contain fixed charges, minimum charges, taxes or other utility components. Savings depend on system size, generation, tariff, self-consumption and the applicable net-metering rules.',
                          hi: 'नहीं। सोलर ऊर्जा शुल्क को काफ़ी हद तक घटा सकता है, लेकिन अंतिम बिजली बिल में अभी भी फिक्स्ड चार्ज, न्यूनतम शुल्क, टैक्स या अन्य यूटिलिटी घटक शामिल हो सकते हैं। बचत सिस्टम के आकार, जनरेशन, टैरिफ, स्व-उपभोग और लागू नेट-मीटरिंग नियमों पर निर्भर करती है।' },

  'faq-q5-q':          { en: 'What is net metering?', hi: 'नेट मीटरिंग क्या है?' },
  'faq-q5-a':          { en: 'Net metering allows eligible grid-connected consumers to export surplus electricity to the distribution network and receive the applicable billing credit or adjustment under the prevailing utility rules. The exact process, limits and settlement mechanism depend on the consumer category and current regulations.',
                          hi: 'नेट मीटरिंग योग्य ग्रिड-कनेक्टेड उपभोक्ताओं को अतिरिक्त बिजली वितरण नेटवर्क में भेजने और प्रचलित यूटिलिटी नियमों के तहत उपयुक्त बिलिंग क्रेडिट या समायोजन पाने की अनुमति देती है। सटीक प्रक्रिया, सीमाएँ और निपटान तंत्र उपभोक्ता श्रेणी और मौजूदा नियमों पर निर्भर करते हैं।' },

  'faq-q6-q':          { en: 'How much electricity can a 3 kW solar system generate?', hi: 'एक 3 kW सोलर सिस्टम कितनी बिजली बना सकता है?' },
  'faq-q6-a':          { en: 'Generation varies with location, orientation, tilt, shading, temperature, equipment and weather. A useful planning estimate in India is often around 3.5–4.5 units per kW per day averaged over a year, but the actual result should be assessed from the site and system design rather than a single universal number.',
                          hi: 'जनरेशन स्थान, दिशा, झुकाव, छाया, तापमान, उपकरण और मौसम के अनुसार बदलता है। भारत में एक उपयोगी अनुमान अक्सर वर्ष भर औसतन प्रति kW प्रति दिन लगभग 3.5–4.5 यूनिट होता है, लेकिन वास्तविक परिणाम किसी एक सार्वभौमिक संख्या के बजाय साइट और सिस्टम डिज़ाइन से आंका जाना चाहिए।' },

  'faq-q7-q':          { en: 'Is the government subsidy available for every solar installation?', hi: 'क्या हर सोलर इंस्टॉलेशन के लिए सरकारी सब्सिडी उपलब्ध है?' },
  'faq-q7-a':          { en: 'Subsidy eligibility depends on the applicable scheme, consumer category, installation type and the rules in force when the application is processed. Residential rooftop systems under the relevant government programme may qualify, while commercial and industrial systems are generally treated differently. Always verify the current official eligibility and rates before making a financial decision.',
                          hi: 'सब्सिडी की पात्रता लागू योजना, उपभोक्ता श्रेणी, इंस्टॉलेशन के प्रकार और आवेदन प्रक्रिया के समय लागू नियमों पर निर्भर करती है। संबंधित सरकारी कार्यक्रम के तहत आवासीय रूफटॉप सिस्टम पात्र हो सकते हैं, जबकि व्यावसायिक और औद्योगिक सिस्टम को आमतौर पर अलग तरह से माना जाता है। कोई भी वित्तीय निर्णय लेने से पहले हमेशा मौजूदा आधिकारिक पात्रता और दरों की पुष्टि करें।' },

  'faq-q8-q':          { en: 'Does solar damage or weaken the roof?', hi: 'क्या सोलर छत को नुकसान पहुँचाता या कमज़ोर करता है?' },
  'faq-q8-a':          { en: 'A properly engineered rooftop installation should not compromise a sound roof. Mounting method, structural condition, waterproofing, fasteners, ballast and cable routing all matter. The installation should be planned for the actual roof rather than simply drilling wherever convenient.',
                          hi: 'सही ढंग से इंजीनियर किया गया रूफटॉप इंस्टॉलेशन एक मज़बूत छत को नुकसान नहीं पहुँचाना चाहिए। माउंटिंग विधि, संरचनात्मक स्थिति, वॉटरप्रूफिंग, फास्टनर, बैलास्ट और केबल रूटिंग - सब मायने रखते हैं। इंस्टॉलेशन की योजना असली छत के अनुसार बनाई जानी चाहिए, न कि जहाँ सुविधाजनक लगे वहाँ ड्रिल कर देना चाहिए।' },

  'faq-q9-q':          { en: 'Why are earthing and surge protection important in a solar system?', hi: 'सोलर सिस्टम में अर्थिंग और सर्ज प्रोटेक्शन क्यों ज़रूरी हैं?' },
  'faq-q9-a':          { en: 'Solar equipment is exposed on a roof and is connected to long outdoor cable runs. Proper protective earthing, bonding and appropriately selected surge protective devices help manage fault currents and transient overvoltages. Lightning protection, where required, should be designed as a coordinated system rather than improvised by connecting random conductors together.',
                          hi: 'सोलर उपकरण छत पर खुला रहता है और लंबे आउटडोर केबल रूट से जुड़ा होता है। उचित सुरक्षात्मक अर्थिंग, बॉन्डिंग और सही ढंग से चुने गए सर्ज प्रोटेक्टिव डिवाइस फ़ॉल्ट करंट और क्षणिक ओवरवोल्टेज को नियंत्रित करने में मदद करते हैं। जहाँ ज़रूरी हो, लाइटनिंग प्रोटेक्शन को यूँ ही किसी भी कंडक्टर को जोड़कर तात्कालिक तरीके से नहीं, बल्कि एक समन्वित सिस्टम के रूप में डिज़ाइन किया जाना चाहिए।' },

  'faq-q10-q':         { en: 'How much maintenance do solar panels need?', hi: 'सोलर पैनल को कितने रखरखाव की ज़रूरत होती है?' },
  'faq-q10-a':         { en: 'Solar is relatively low-maintenance, but it is not maintenance-free. Periodic cleaning may be required depending on dust and local conditions, while inspections should cover module condition, mounting hardware, cable routes, connectors, inverter alarms, protection devices and generation performance.',
                          hi: 'सोलर अपेक्षाकृत कम रखरखाव वाला है, लेकिन पूरी तरह रखरखाव-मुक्त नहीं है। धूल और स्थानीय परिस्थितियों के अनुसार समय-समय पर सफ़ाई की ज़रूरत हो सकती है, जबकि निरीक्षण में मॉड्यूल की स्थिति, माउंटिंग हार्डवेयर, केबल रूट, कनेक्टर, इनवर्टर अलार्म, सुरक्षा उपकरण और जनरेशन प्रदर्शन शामिल होने चाहिए।' },

  'faq-q11-q':         { en: 'Do solar panels stop working after 10 years?', hi: 'क्या सोलर पैनल 10 साल बाद काम करना बंद कर देते हैं?' },
  'faq-q11-a':         { en: 'No. Good-quality modules are designed for long service lives and normally continue producing electricity for decades, although output gradually degrades over time. The exact warranty and degradation guarantee depend on the module manufacturer and product.',
                          hi: 'नहीं। अच्छी गुणवत्ता वाले मॉड्यूल लंबी सेवा अवधि के लिए डिज़ाइन किए जाते हैं और आमतौर पर दशकों तक बिजली बनाते रहते हैं, हालांकि समय के साथ आउटपुट धीरे-धीरे कम होता जाता है। सटीक वारंटी और डिग्रेडेशन गारंटी मॉड्यूल निर्माता और उत्पाद पर निर्भर करती है।' },

  'faq-q12-q':         { en: 'Can I use solar during a power cut and keep only selected appliances on battery?', hi: 'क्या मैं बिजली कटौती के दौरान सोलर का उपयोग कर सकता हूँ और सिर्फ़ चुने हुए उपकरणों को बैटरी पर रख सकता हूँ?' },
  'faq-q12-a':         { en: 'Yes, with a correctly designed hybrid/backup system. A backup distribution board can supply selected essential circuits from the inverter\'s backup output, while non-essential loads remain on the normal supply. The inverter, battery, changeover/protection and wiring must be designed for the intended loads.',
                          hi: 'हाँ, सही ढंग से डिज़ाइन किए गए हाइब्रिड/बैकअप सिस्टम के साथ। एक बैकअप डिस्ट्रीब्यूशन बोर्ड इनवर्टर के बैकअप आउटपुट से चुने हुए ज़रूरी सर्किट को बिजली दे सकता है, जबकि गैर-ज़रूरी लोड सामान्य आपूर्ति पर बने रहते हैं। इनवर्टर, बैटरी, चेंजओवर/सुरक्षा और वायरिंग को इच्छित लोड के अनुसार डिज़ाइन किया जाना चाहिए।' },

  'faq-q13-q':         { en: 'Is a battery necessary for an on-grid solar system?', hi: 'क्या ऑन-ग्रिड सोलर सिस्टम के लिए बैटरी ज़रूरी है?' },
  'faq-q13-a':         { en: 'Not necessarily. An on-grid system can operate without batteries and use the grid for supply when solar generation is insufficient. Batteries add backup capability and can shift energy to later hours, but they also add cost, complexity and a component with its own service life.',
                          hi: 'ज़रूरी नहीं। एक ऑन-ग्रिड सिस्टम बिना बैटरी के भी काम कर सकता है और जब सोलर जनरेशन अपर्याप्त हो तो आपूर्ति के लिए ग्रिड का उपयोग करता है। बैटरी बैकअप क्षमता जोड़ती है और ऊर्जा को बाद के घंटों में स्थानांतरित कर सकती है, लेकिन इससे लागत, जटिलता और अपनी सेवा अवधि वाला एक अतिरिक्त घटक भी जुड़ जाता है।' },

  'faq-q14-q':         { en: 'Does more panel wattage always mean a better solar system?', hi: 'क्या अधिक पैनल वाट क्षमता का मतलब हमेशा बेहतर सोलर सिस्टम होता है?' },
  'faq-q14-a':         { en: 'Not by itself. System quality depends on module performance, inverter selection, string design, shading, structure, cable sizing, protection, earthing, installation workmanship and how well the plant matches the consumer\'s load. A larger nameplate can be a poor investment if the design is wrong.',
                          hi: 'अकेले इससे नहीं। सिस्टम की गुणवत्ता मॉड्यूल प्रदर्शन, इनवर्टर चयन, स्ट्रिंग डिज़ाइन, छाया, संरचना, केबल आकार, सुरक्षा, अर्थिंग, इंस्टॉलेशन की कारीगरी और प्लांट उपभोक्ता के लोड से कितना मेल खाता है - इस पर निर्भर करती है। यदि डिज़ाइन ग़लत हो तो बड़ी नेमप्लेट क्षमता भी एक ख़राब निवेश साबित हो सकती है।' },

  'faq-note-label':    { en: 'Engineering note:', hi: 'इंजीनियरिंग नोट:' },
  'faq-note-text':     { en: 'Solar generation, subsidy, net-metering rules and equipment specifications can change. Treat this page as general education and confirm project-specific numbers and current government/utility rules before installation.',
                          hi: 'सोलर जनरेशन, सब्सिडी, नेट-मीटरिंग नियम और उपकरण विशिष्टताएँ बदल सकती हैं। इस पृष्ठ को सामान्य जानकारी के रूप में लें और इंस्टॉलेशन से पहले प्रोजेक्ट-विशिष्ट आंकड़ों और मौजूदा सरकारी/यूटिलिटी नियमों की पुष्टि करें।' },

  'myths-eyebrow':    { en: 'Myths worth leaving behind', hi: 'भ्रांतियाँ जो छोड़ देनी चाहिए' },
  'myths-title':      { en: 'Three common solar myths', hi: 'तीन आम सोलर भ्रांतियाँ' },

  'myth-01-label':    { en: 'Myth 01', hi: 'भ्रांति 01' },
  'myth-01-title':    { en: '"Solar means zero electricity bill."', hi: '"सोलर मतलब बिजली का बिल शून्य।"' },
  'myth-01-desc':     { en: 'Solar can reduce the energy component dramatically, but fixed charges and other billing components may remain.',
                         hi: 'सोलर ऊर्जा घटक को काफ़ी हद तक घटा सकता है, लेकिन फिक्स्ड चार्ज और अन्य बिलिंग घटक फिर भी बने रह सकते हैं।' },

  'myth-02-label':    { en: 'Myth 02', hi: 'भ्रांति 02' },
  'myth-02-title':    { en: '"Solar is useless in winter or clouds."', hi: '"सर्दियों या बादलों में सोलर बेकार है।"' },
  'myth-02-desc':     { en: 'Panels generate whenever there is usable light. Generation changes with irradiance, temperature, shading and weather.',
                         hi: 'जब भी उपयोगी रोशनी होती है, पैनल बिजली बनाते हैं। जनरेशन विकिरण, तापमान, छाया और मौसम के साथ बदलता है।' },

  'myth-03-label':    { en: 'Myth 03', hi: 'भ्रांति 03' },
  'myth-03-title':    { en: '"Any electrician can install solar."', hi: '"कोई भी इलेक्ट्रीशियन सोलर लगा सकता है।"' },
  'myth-03-desc':     { en: 'Solar needs coordinated DC, AC, protection, earthing, structure and grid-interface design. Workmanship matters.',
                         hi: 'सोलर के लिए समन्वित DC, AC, सुरक्षा, अर्थिंग, संरचना और ग्रिड-इंटरफ़ेस डिज़ाइन ज़रूरी है। कारीगरी मायने रखती है।' },

  'myth-cta-1':        { en: 'Estimate My Savings', hi: 'मेरी बचत का अनुमान लगाएं' },
  'myth-cta-2':        { en: 'Talk to Halosun',     hi: 'हैलोसन से बात करें' },

  'footer-process':   { en: 'Our Process',          hi: 'हमारी प्रक्रिया' },
  'footer-calc':      { en: 'Savings Calculator',   hi: 'बचत कैलकुलेटर' },
  'footer-faq-myths': { en: 'Solar FAQ & Myths',    hi: 'सोलर सवाल-जवाब और भ्रांतियाँ' },

  // ---- Services page ----
  'svc-hero-eyebrow':  { en: 'What we do', hi: 'हम क्या करते हैं' },
  'svc-hero-title':    { en: 'Solar, engineered end to end', hi: 'सोलर, शुरू से आखिर तक इंजीनियर्ड' },
  'svc-hero-sub':      { en: 'From a single rooftop to a full commercial plant, one firm handles design, procurement and construction.',
                          hi: 'एक अकेली छत से लेकर पूर्ण व्यावसायिक प्लांट तक, एक ही कंपनी डिज़ाइन, खरीद और निर्माण संभालती है।' },

  'svc-card-01-title': { en: 'Residential Solar', hi: 'आवासीय सोलर' },
  'svc-card-01-desc':  { en: 'Rooftop systems sized to your electricity bill, not a sales quota. On-grid and hybrid options for homes.',
                          hi: 'रूफटॉप सिस्टम आपके बिजली बिल के अनुसार तय किए जाते हैं, सेल्स कोटा के अनुसार नहीं। घरों के लिए ऑन-ग्रिड और हाइब्रिड विकल्प।' },
  'svc-card-02-title': { en: 'Commercial & Industrial', hi: 'व्यावसायिक और औद्योगिक' },
  'svc-card-02-desc':  { en: 'Rooftop and ground-mount plants engineered for uptime, with financing routes and O&M built in from day one.',
                          hi: 'अपटाइम के लिए इंजीनियर किए गए रूफटॉप और ग्राउंड-माउंट प्लांट, पहले दिन से ही फाइनेंसिंग विकल्प और O&M शामिल।' },
  'svc-card-03-title': { en: 'Turnkey EPC', hi: 'टर्नकी ईपीसी' },
  'svc-card-03-desc':  { en: 'One firm for design, procurement and construction. No handoffs and no finger-pointing between contractors.',
                          hi: 'डिज़ाइन, खरीद और निर्माण के लिए एक ही कंपनी। कोई हैंडऑफ नहीं और ठेकेदारों के बीच एक-दूसरे पर दोष मढ़ने की नौबत नहीं।' },
  'svc-card-04-title': { en: 'Operations & Maintenance', hi: 'संचालन और रखरखाव' },
  'svc-card-04-desc':  { en: 'Scheduled cleaning, remote monitoring and repairs that keep your plant generating at rated capacity for 25 years.',
                          hi: 'निर्धारित सफ़ाई, रिमोट मॉनिटरिंग और मरम्मत जो आपके प्लांट को 25 वर्षों तक निर्धारित क्षमता पर जनरेट करते रहने में मदद करते हैं।' },
  'cta-band-services-title': { en: 'Ready to see what solar could look like for you?', hi: 'देखना चाहते हैं कि आपके लिए सोलर कैसा दिखेगा?' },

  // ---- Process page ----
  'process-eyebrow':   { en: 'How a project runs', hi: 'एक प्रोजेक्ट कैसे चलता है' },
  'process-title':     { en: 'Six steps from roof to running meter', hi: 'छत से चलते मीटर तक, छह चरण' },

  'process-step1-title': { en: 'Site Survey', hi: 'साइट सर्वे' },
  'process-step1-desc':  { en: 'An engineer visits your roof or land to check shading, structure and available load.',
                             hi: 'एक इंजीनियर छाया, संरचना और उपलब्ध लोड जांचने के लिए आपकी छत या ज़मीन पर आता है।' },
  'process-step2-title': { en: 'System Design', hi: 'सिस्टम डिज़ाइन' },
  'process-step2-desc':  { en: 'We size the plant to your actual consumption and roof, and prepare drawings and layout.',
                             hi: 'हम प्लांट को आपकी वास्तविक खपत और छत के अनुसार तय करते हैं, और ड्रॉइंग व लेआउट तैयार करते हैं।' },
  'process-step3-title': { en: 'Approvals & Subsidy Filing', hi: 'अनुमोदन और सब्सिडी आवेदन' },
  'process-step3-desc':  { en: 'We handle net-metering paperwork and government subsidy applications on your behalf.',
                             hi: 'हम आपकी ओर से नेट-मीटरिंग कागज़ात और सरकारी सब्सिडी आवेदन संभालते हैं।' },
  'process-step4-title': { en: 'Installation', hi: 'इंस्टॉलेशन' },
  'process-step4-desc':  { en: 'Certified crews install panels, inverter and wiring - most rooftop jobs finish in three to seven days.',
                             hi: 'प्रमाणित टीमें पैनल, इनवर्टर और वायरिंग इंस्टॉल करती हैं - अधिकांश रूफटॉप काम तीन से सात दिनों में पूरे हो जाते हैं।' },
  'process-step5-title': { en: 'Commissioning', hi: 'कमीशनिंग' },
  'process-step5-desc':  { en: 'Utility inspection, net meter installation, and formal handover of your plant.',
                             hi: 'यूटिलिटी निरीक्षण, नेट मीटर इंस्टॉलेशन, और आपके प्लांट की औपचारिक सुपुर्दगी।' },
  'process-step6-title': { en: 'Monitoring & Maintenance', hi: 'निगरानी और रखरखाव' },
  'process-step6-desc':  { en: 'Ongoing performance tracking and scheduled service to protect your generation over time.',
                             hi: 'समय के साथ आपकी जनरेशन सुरक्षित रखने के लिए निरंतर प्रदर्शन ट्रैकिंग और निर्धारित सर्विस।' },

  'cta-band-process-title': { en: 'Curious what your system would look like?', hi: 'जानना चाहते हैं कि आपका सिस्टम कैसा दिखेगा?' },

  // ---- Standard Page Hero ----
  'std-eyebrow':       { en: 'The Halosun Standard', hi: 'हैलोसन मानक' },
  'std-title':         { en: 'What\'s actually under your panels', hi: 'आपके पैनल के नीचे असल में क्या है' },
  'std-sub':           { en: 'Two rooftop systems can look identical from the street and perform completely differently for the next 25 years. The difference is almost never the panel brand - it\'s what\'s fixed to your roof, routed through your walls, and buried in your earth pit. That\'s what this page is about.',
                          hi: 'दो छत की सोलर प्रणालियाँ सड़क से देखने पर एक जैसी लग सकती हैं, लेकिन अगले 25 वर्षों तक उनका प्रदर्शन बिल्कुल अलग हो सकता है। यह फर्क लगभग कभी पैनल ब्रांड का नहीं होता - यह इस बात का होता है कि आपकी छत पर क्या फिक्स किया गया है, दीवारों से क्या रूट किया गया है, और आपके अर्थ पिट में क्या दबा है। यह पेज इसी बारे में है।' },
  'std-hero-cta1':     { en: 'Request a Free Site Visit', hi: 'मुफ़्त साइट विज़िट का अनुरोध करें' },
  'std-hero-cta2':     { en: 'Calculate My Savings', hi: 'मेरी बचत जानें' },

  // ---- Ten checks ----
  'std-checks-eyebrow': { en: 'Applied to every job, same size or not', hi: 'हर काम पर लागू, आकार चाहे जो भी हो' },
  'std-checks-title':   { en: 'Ten checks, no exceptions', hi: 'दस जाँच, कोई अपवाद नहीं' },
  'std-checks-sub':     { en: 'Whether it\'s a 6-panel rooftop or a 50 kW commercial plant, every Halosun installation is signed off against the same checklist before we call it finished.',
                           hi: 'चाहे 6-पैनल की छत हो या 50 kW का व्यावसायिक प्लांट, हर हैलोसन इंस्टॉलेशन को पूरा मानने से पहले उसी चेकलिस्ट पर परखा जाता है।' },
  'std-check-1':  { en: 'Mounting structure sized for your roof and your panel load - not trimmed on steel gauge to shave the quote.', hi: 'माउंटिंग संरचना आपकी छत और पैनल भार के अनुसार तय की जाती है - कोटेशन घटाने के लिए स्टील की मोटाई कम नहीं की जाती।' },
  'std-check-2':  { en: 'Every leg fixed to resist wind uplift, not just hold the array down under its own weight.', hi: 'हर पैर हवा के दबाव को झेलने के लिए फिक्स किया जाता है, सिर्फ अपने वज़न से टिकने के लिए नहीं।' },
  'std-check-3':  { en: 'Every roof penetration sealed in layers - the roof slab underneath stays untouched and dry.', hi: 'हर छत छेदन को परतों में सील किया जाता है - नीचे की छत की स्लैब सूखी और सुरक्षित रहती है।' },
  'std-check-4':  { en: 'DC and AC cabling sized for minimal voltage drop, not the cheapest gauge that technically carries current.', hi: 'DC और AC केबलिंग न्यूनतम वोल्टेज ड्रॉप के लिए तय की जाती है, सिर्फ करंट ले जाने वाली सबसे सस्ती मोटाई नहीं।' },
  'std-check-5':  { en: 'Earthed at every stage - panels, structure, inverter, and distribution board - tied into one system, not one token pit.', hi: 'हर चरण पर अर्थिंग - पैनल, संरचना, इन्वर्टर और डिस्ट्रिब्यूशन बोर्ड - सबको एक प्रणाली में जोड़ा जाता है, सिर्फ एक दिखावटी पिट नहीं।' },
  'std-check-6':  { en: 'Cable runs dressed, labeled, and routed for a future electrician to actually trace - not hidden behind the inverter.', hi: 'केबल रन व्यवस्थित, लेबल किए गए और इस तरह रूट किए जाते हैं कि भविष्य में कोई इलेक्ट्रीशियन आसानी से समझ सके - इन्वर्टर के पीछे छिपाए नहीं जाते।' },
  'std-check-7':  { en: 'Every electrical and structural joint torqued correctly, not just hand-tight.', hi: 'हर इलेक्ट्रिकल और संरचनात्मक जोड़ को सही टॉर्क से कसा जाता है, सिर्फ हाथ से नहीं।' },
  'std-check-8':  { en: 'A full commissioning test before we call the job finished - not before we send the invoice.', hi: 'काम को पूरा मानने से पहले एक पूर्ण कमीशनिंग टेस्ट किया जाता है - बिल भेजने से पहले नहीं।' },
  'std-check-9':  { en: 'An on-site walkthrough - you see your isolators, your monitoring app, and your earth points before we leave.', hi: 'साइट पर एक वॉकथ्रू - हम जाने से पहले आप अपने आइसोलेटर, मॉनिटरिंग ऐप और अर्थ पॉइंट खुद देखते हैं।' },
  'std-check-10': { en: 'A complete handover file, in writing - not a phone number you have to hope still works in year three.', hi: 'लिखित रूप में एक पूरी हैंडओवर फाइल - सिर्फ एक फ़ोन नंबर नहीं जिसके तीसरे साल भी काम करने की उम्मीद करनी पड़े।' },

  // ---- Mounting / structure ----
  'std-mount-eyebrow': { en: 'Structure & waterproofing', hi: 'संरचना और वॉटरप्रूफिंग' },
  'std-mount-title':   { en: 'The part nobody checks after handover', hi: 'वह हिस्सा जिसे हैंडओवर के बाद कोई नहीं देखता' },
  'std-mount-sub':     { en: 'Roof leaks and lifted panels almost never come from bad weather alone. They come from a structure gauge trimmed to win a quote, or a leg that was never meant to hold against wind. We size the structure for the load your roof will actually carry, and every leg is fixed to take wind uplift, not just gravity - nothing here gets undercut to save on steel.',
                          hi: 'छत में रिसाव और पैनल उखड़ना लगभग कभी सिर्फ खराब मौसम से नहीं होता। यह तब होता है जब कोटेशन जीतने के लिए संरचना की मोटाई घटा दी जाती है, या कोई पैर हवा झेलने के लिए बना ही नहीं होता। हम संरचना को आपकी छत के असल भार के अनुसार तय करते हैं, और हर पैर हवा के दबाव को झेलने के लिए फिक्स किया जाता है, सिर्फ गुरुत्वाकर्षण के लिए नहीं - स्टील बचाने के लिए यहाँ कोई कमी नहीं की जाती।' },
  'std-mount-caption': { en: '// simplified reference - anchor points are drilled and resealed; full structural spec is in your project handover file', hi: '// सरल संदर्भ - एंकर पॉइंट ड्रिल कर उन्हें फिर से सील किया जाता है; पूरा संरचनात्मक विवरण आपकी प्रोजेक्ट हैंडओवर फाइल में है' },

  // ---- Cable routing ----
  'std-cable-eyebrow':   { en: 'Cable routing', hi: 'केबल रूटिंग' },
  'std-cable-title':     { en: 'Every cable run is planned, not improvised', hi: 'हर केबल रन पहले से तय होता है, तात्कालिक नहीं' },
  'std-cable-sub':       { en: 'Cable routing is decided at the design stage, before anything is fixed in place - not worked out on site after the fact. A shortcut here is one of the most common ways installers quietly cost you generation for the next 25 years.',
                            hi: 'केबल रूटिंग डिज़ाइन चरण में ही तय कर ली जाती है, कुछ भी फिक्स होने से पहले - साइट पर बाद में सोचकर नहीं। यहाँ की गई एक छोटी सी चूक अगले 25 वर्षों तक चुपचाप आपकी जनरेशन को कम करने का सबसे आम तरीका है।' },
  'std-cable-good-title':{ en: 'Halosun standard', hi: 'हैलोसन मानक' },
  'std-cable-good-1':    { en: 'Cable paths planned at the design stage, not decided on site', hi: 'केबल के रास्ते डिज़ाइन चरण में ही तय किए जाते हैं, साइट पर नहीं' },
  'std-cable-good-2':    { en: 'Lower AC voltage drop, lower cable losses overall', hi: 'कम AC वोल्टेज ड्रॉप, कुल मिलाकर कम केबल नुकसान' },
  'std-cable-good-3':    { en: 'Runs labeled and documented for future inspection', hi: 'भविष्य में जाँच के लिए लेबल और दस्तावेज़ीकृत रूट' },
  'std-cable-good-4':    { en: 'Easy to trace, easy to service', hi: 'ढूंढना आसान, सर्विस करना आसान' },
  'std-cable-bad-title': { en: 'What we avoid', hi: 'हम इनसे बचते हैं' },
  'std-cable-bad-1':     { en: 'Routing improvised after equipment is already fixed in place', hi: 'उपकरण फिक्स होने के बाद तात्कालिक रूप से रूटिंग तय करना' },
  'std-cable-bad-2':     { en: 'Longer runs than necessary, adding avoidable loss', hi: 'ज़रूरत से लंबे रन, जिससे टाली जा सकने वाली हानि होती है' },
  'std-cable-bad-3':     { en: 'Higher voltage drop, more cable, more cost', hi: 'अधिक वोल्टेज ड्रॉप, अधिक केबल, अधिक लागत' },
  'std-cable-bad-4':     { en: 'Harder to trace, harder to service, harder to fault-find', hi: 'ढूंढना मुश्किल, सर्विस करना मुश्किल, खराबी पकड़ना मुश्किल' },

  // ---- Earthing ----
  'std-earth-eyebrow': { en: 'Earthing', hi: 'अर्थिंग' },
  'std-earth-title':   { en: 'Earthed the way the code requires - tied together, not scattered', hi: 'नियमानुसार अर्थिंग - बिखरी हुई नहीं, आपस में जुड़ी हुई' },
  'std-earth-sub':     { en: 'A single earth pit that looks fine to an inspector isn\'t the same as a system that\'s actually protected. We earth every stage of the system and connect the earthing network together, so a fault has one reliable, low-resistance path to ground - not four separate pits each hoping it\'s the one that works.',
                          hi: 'एक अकेला अर्थ पिट जो निरीक्षक को ठीक लगे, यह ज़रूरी नहीं कि प्रणाली वाकई सुरक्षित हो। हम प्रणाली के हर चरण की अर्थिंग करते हैं और पूरे अर्थिंग नेटवर्क को आपस में जोड़ते हैं, ताकि किसी फॉल्ट को ज़मीन तक जाने का एक भरोसेमंद, कम-प्रतिरोध वाला रास्ता मिले - चार अलग-अलग पिट नहीं जिनमें से किसी एक के काम करने की उम्मीद की जाए।' },
  'std-earth-tag1':    { en: '4 POINTS', hi: '4 बिंदु' },
  'std-earth-item1':   { en: 'Panels, mounting structure, inverter, and distribution board are each earthed independently.', hi: 'पैनल, माउंटिंग संरचना, इन्वर्टर और डिस्ट्रिब्यूशन बोर्ड - हर एक की अलग अर्थिंग की जाती है।' },
  'std-earth-tag2':    { en: '16 SQ.MM', hi: '16 वर्ग मिमी' },
  'std-earth-item2':   { en: 'Aluminium earth conductor sized to carry a fault current safely, not the thinnest wire that technically qualifies.', hi: 'एल्युमिनियम अर्थ कंडक्टर फॉल्ट करंट को सुरक्षित रूप से ले जाने के लिए तय किया जाता है, सिर्फ काम चलाऊ सबसे पतला तार नहीं।' },
  'std-earth-tag3':    { en: 'BONDED', hi: 'बॉन्डेड' },
  'std-earth-item3':   { en: 'Every earth point is bonded into a single, low-resistance network as the electrical code requires - not left as isolated, disconnected points.', hi: 'विद्युत कोड की आवश्यकता के अनुसार हर अर्थ पॉइंट को एक ही कम-प्रतिरोध वाले नेटवर्क में बॉन्ड किया जाता है - अलग-थलग, असंबद्ध बिंदुओं के रूप में नहीं छोड़ा जाता।' },
  'std-earth-caption': { en: '// simplified reference - full earthing spec is in your project handover file', hi: '// सरल संदर्भ - पूरा अर्थिंग विवरण आपकी प्रोजेक्ट हैंडओवर फाइल में है' },

  // ---- Handover file ----
  'std-handover-eyebrow':    { en: 'Documentation', hi: 'दस्तावेज़ीकरण' },
  'std-handover-title':      { en: 'You get this in writing, not a phone number to remember', hi: 'यह आपको लिखित में मिलता है, सिर्फ याद रखने के लिए एक फ़ोन नंबर नहीं' },
  'std-handover-sub':        { en: 'Every Halosun customer receives a personal Owner\'s Handbook at handover - your system specs, single line diagram, cleaning routine, maintenance schedule and warranty terms, in one document. Most local installers hand over a working system and a phone number. You get both, plus this.',
                                hi: 'हर हैलोसन ग्राहक को हैंडओवर पर एक निजी ओनर्स हैंडबुक मिलती है - आपके सिस्टम की जानकारी, सिंगल लाइन डायग्राम, सफाई की दिनचर्या, रखरखाव अनुसूची और वारंटी शर्तें, सब एक ही दस्तावेज़ में। ज़्यादातर स्थानीय इंस्टॉलर सिर्फ चालू सिस्टम और एक फ़ोन नंबर देकर चले जाते हैं। आपको दोनों मिलते हैं, साथ ही यह भी।' },
  'std-handover-cta':        { en: 'Request a Free Site Visit', hi: 'मुफ़्त साइट विज़िट का अनुरोध करें' },
  'std-handover-card-title': { en: 'Owner\'s Handbook', hi: 'ओनर्स हैंडबुक' },
  'std-handover-card-sub':   { en: 'ISSUED AT HANDOVER · YOURS TO KEEP', hi: 'हैंडओवर पर जारी · आपके पास रहेगी' },
  'std-handover-li1': { en: 'System specification sheet', hi: 'सिस्टम विनिर्देश शीट' },
  'std-handover-li2': { en: 'Single line diagram (SLD)', hi: 'सिंगल लाइन डायग्राम (SLD)' },
  'std-handover-li3': { en: 'Panel care & cleaning routine', hi: 'पैनल देखभाल और सफाई की दिनचर्या' },
  'std-handover-li4': { en: 'Scheduled maintenance plan', hi: 'निर्धारित रखरखाव योजना' },
  'std-handover-li5': { en: 'Warranty summary, by component', hi: 'घटक-वार वारंटी सारांश' },
  'std-handover-li6': { en: 'Support & emergency contact details', hi: 'सहायता और आपातकालीन संपर्क विवरण' },

  // ---- CTA band ----
  'std-cta-title': { en: 'Ask any installer to show you this page', hi: 'किसी भी इंस्टॉलर से यह पेज दिखाने को कहें' },
  'std-cta-sub':   { en: 'If they can\'t, that tells you what you need to know. If they can - compare it to ours, and then call us.',
                      hi: 'अगर वे नहीं दिखा पाते, तो यही आपके लिए काफी जवाब है। अगर दिखा पाते हैं - तो उसकी तुलना हमारे मानक से करें, फिर हमें कॉल करें।' },
  'std-cta-btn1':  { en: 'Request a Free Site Visit', hi: 'मुफ़्त साइट विज़िट का अनुरोध करें' },
  'std-cta-btn2':  { en: 'Calculate My Savings', hi: 'मेरी बचत जानें' },
  
  // ---- Gallery page ----
  'gallery-title': { en: 'On the roof', hi: 'छत पर' },
  'gallery-sub':   { en: 'Explore our recent solar installations', hi: 'हमारी हाल की सोलर इंस्टॉलेशन देखें' },
  'gallery-tile-1': { en: 'Residential rooftop', hi: 'आवासीय रूफटॉप' },
  'gallery-tile-2': { en: 'Commercial plant', hi: 'व्यावसायिक प्लांट' },
  'gallery-tile-3': { en: 'Ground-mount plant', hi: 'ग्राउंड-माउंट प्लांट' },
  'gallery-tile-4': { en: 'Inverter & wiring', hi: 'इनवर्टर और वायरिंग' },
  'gallery-tile-5': { en: 'Net meter install', hi: 'नेट मीटर इंस्टॉल' },
  'gallery-tile-6': { en: 'Commissioning day', hi: 'कमीशनिंग दिवस' },
  'cta-band-gallery-title': { en: 'Want a plant like this on your roof?', hi: 'अपनी छत पर ऐसा प्लांट चाहते हैं?' },

  // ---- Contact page ----
  'contact-eyebrow': { en: 'Get started', hi: 'शुरू करें' },
  'contact-title':   { en: 'Request a free site visit', hi: 'मुफ़्त साइट विज़िट का अनुरोध करें' },
  'contact-intro':   { en: 'Tell us a little about your property and we\'ll get back to you to schedule a free survey and detailed quote.',
                       hi: 'अपनी संपत्ति के बारे में हमें थोड़ी जानकारी दें और हम मुफ़्त सर्वे व विस्तृत कोटेशन के लिए आपसे संपर्क करेंगे।' },

  'contact-label-phone':          { en: 'Phone:', hi: 'फ़ोन:' },
  'contact-label-email':          { en: 'Email:', hi: 'ईमेल:' },
  'contact-label-address':        { en: 'Address:', hi: 'पता:' },
  'contact-label-proprietor':     { en: 'Proprietor:', hi: 'प्रोप्राइटर:' },
  'contact-label-Addvalue':       { en: 'Tilak Nagar, Raebareli', hi: 'तिलक नगर, रायबरेली' },
  'contact-label-proprietorTitle':{ en: 'Er.', hi: 'इंजी.' },
  'contact-label-proprietorName': { en: 'Shishir Srivastava', hi: 'शिशिर श्रीवास्तव' },
  
  'form-name':          { en: 'Full name *', hi: 'पूरा नाम *' },
  'form-phone':         { en: 'Phone number *', hi: 'फ़ोन नंबर *' },
  'form-email':         { en: 'Email', hi: 'ईमेल' },
  'form-city':          { en: 'City / Address *', hi: 'शहर / पता *' },
  'form-property-type': { en: 'Property type', hi: 'संपत्ति का प्रकार' },
  'field-residential':  { en: 'Residential', hi: 'आवासीय' },
  'field-commercial':   { en: 'Commercial / Industrial', hi: 'व्यावसायिक / औद्योगिक' },
  'form-bill':          { en: 'Average monthly bill (₹)', hi: 'औसत मासिक बिल (₹)' },
  'form-message':       { en: 'Message', hi: 'संदेश' },
  'form-submit':        { en: 'Request Free Visit', hi: 'मुफ़्त विज़िट का अनुरोध करें' },
  'contact-footer-desc':{ en: 'Solar Installation & Energy Solutions.', hi: 'सोलर इंस्टॉलेशन और ऊर्जा समाधान।' },

  // ---- Calculator page ----
  'calc-eyebrow': { en: 'Instant estimate', hi: 'तुरंत अनुमान' },
  'calc-title':   { en: 'What could solar save you?', hi: 'सोलर से आपको कितनी बचत हो सकती है?' },
  'calc-sub':     { en: 'Enter your average monthly electricity bill for a rough sizing and savings estimate. This is a guide, not a quote - book a free site visit for exact numbers.',
                   hi: 'मोटे आकार और बचत अनुमान के लिए अपना औसत मासिक बिजली बिल दर्ज करें। यह एक मार्गदर्शन है, कोटेशन नहीं - सटीक आंकड़ों के लिए मुफ़्त साइट विज़िट बुक करें।' },

  'calc-field-bill':   { en: 'Average monthly electricity bill (₹)', hi: 'औसत मासिक बिजली बिल (₹)' },
  'calc-field-tariff': { en: 'Your electricity tariff (₹ per unit)', hi: 'आपका बिजली टैरिफ (₹ प्रति यूनिट)' },
  'calc-field-name':   { en: 'Your name', hi: 'आपका नाम' },
  'calc-field-phone':  { en: 'WhatsApp number (required to view results)', hi: 'व्हाट्सएप नंबर (परिणाम देखने के लिए आवश्यक)' },
  'calc-reset-btn':    { en: 'Reset', hi: 'रीसेट करें' },
  'calc-placeholder-text': { en: 'Fill in your details on the left to see your solar savings estimate here.', hi: 'अपना सोलर बचत अनुमान यहाँ देखने के लिए बाईं ओर अपना विवरण भरें।' },
  'calc-whatsapp-btn': { en: 'Send My Estimate via WhatsApp →', hi: 'व्हाट्सएप के ज़रिए मेरा अनुमान भेजें →' },
  'calc-pdf-btn':      { en: 'Download PDF Estimate', hi: 'PDF अनुमान डाउनलोड करें' },
  'calc-pdf-btn-generating': { en: 'Generating PDF…', hi: 'PDF तैयार हो रहा है…' },
  'calc-btn':          { en: 'Calculate', hi: 'गणना करें' },
  'calc-note-main':    { en: 'Assumes ~4 sun-hours/day generation and current PM Surya Ghar (central) + UPNEDA (UP state) subsidy slabs for residential rooftop. Editable defaults - ask us for a site-specific number.',
                        hi: 'लगभग 4 सन-आवर/दिन जनरेशन और मौजूदा PM सूर्य घर (केंद्रीय) + UPNEDA (यूपी राज्य) सब्सिडी स्लैब आवासीय रूफटॉप के लिए मानते हुए। संपादन योग्य डिफ़ॉल्ट - साइट-विशिष्ट आंकड़े के लिए हमसे पूछें।' },

  'res-size-label':            { en: 'Recommended system size', hi: 'अनुशंसित सिस्टम आकार' },
  'res-units-label':           { en: 'Estimated generation', hi: 'अनुमानित जनरेशन' },
  'res-cost-label':            { en: 'System cost (before subsidy)', hi: 'सिस्टम की कीमत (सब्सिडी से पहले)' },
  'res-subsidy-central-label': { en: 'Central subsidy (PM Surya Ghar)', hi: 'केंद्रीय सब्सिडी (PM सूर्य घर)' },
  'res-subsidy-state-label':   { en: 'State subsidy (UPNEDA)', hi: 'राज्य सब्सिडी (UPNEDA)' },
  'res-subsidy-total-label':   { en: 'Total subsidy', hi: 'कुल सब्सिडी' },
  'res-net-label':             { en: 'Your cost after subsidy', hi: 'सब्सिडी के बाद आपकी लागत' },
  'res-savings-label':         { en: 'Estimated monthly savings', hi: 'अनुमानित मासिक बचत' },
  'res-payback-label':         { en: 'Payback period', hi: 'पेबैक अवधि' },
  'res-lifetime-label':        { en: 'Estimated 25-year savings', hi: '25 साल की अनुमानित बचत' },

  'emi-heading-1':             { en: 'Prefer to pay monthly? See the EMI', hi: 'मासिक भुगतान पसंद करते हैं? EMI देखें' },
  'emi-downpayment-label':     { en: 'Down payment (%)', hi: 'डाउन पेमेंट (%)' },
  'emi-tenure-label':          { en: 'Loan tenure (years)', hi: 'लोन अवधि (वर्ष)' },
  'emi-rate-label':            { en: 'Interest rate (% p.a.)', hi: 'ब्याज दर (% सालाना)' },
  'emi-loan-amount-label':     { en: 'Loan amount', hi: 'लोन राशि' },
  'emi-monthly-label':         { en: 'Estimated monthly EMI', hi: 'अनुमानित मासिक EMI' },
  'emi-old-bill-label':        { en: 'Your old electricity bill', hi: 'आपका पुराना बिजली बिल' },
  'emi-heading-2':             { en: 'Once your subsidy is credited', hi: 'जब आपकी सब्सिडी जमा हो जाए' },
  'emi-loan-amount-post-label': { en: 'Reduced loan amount after subsidy disbursal', hi: 'सब्सिडी वितरण के बाद घटी हुई लोन राशि' },
  'emi-monthly-post-label':    { en: 'Reduced monthly EMI', hi: 'घटी हुई मासिक EMI' },
  'emi-note':                  { en: 'Illustrative only, based on the down payment, tenure and rate above - your actual loan terms depend on the lender. Not a loan offer from Halosun Energy Systems. The loan is sized on the full system cost since the subsidy is typically credited after installation; once it\'s credited, your outstanding loan and EMI can be reduced as shown above (same tenure and rate).',
                                hi: 'यह केवल उदाहरण है, ऊपर दिए गए डाउन पेमेंट, अवधि और दर पर आधारित - आपकी वास्तविक लोन शर्तें ऋणदाता पर निर्भर करती हैं। यह हैलोसन एनर्जी सिस्टम्स की ओर से लोन ऑफ़र नहीं है। लोन पूरे सिस्टम की लागत पर तय किया जाता है क्योंकि सब्सिडी आमतौर पर इंस्टॉलेशन के बाद जमा होती है; एक बार जमा होने पर, आपका बकाया लोन और EMI ऊपर दिखाए अनुसार घटाया जा सकता है (वही अवधि और दर)।' },

  'calc-cta-btn': { en: 'Get an Exact Quote for This System', hi: 'इस सिस्टम के लिए सटीक कोटेशन पाएं' },

  // ---- PDF-only strings ----
  'pdf-doc-title':        { en: 'Solar Savings Estimate', hi: 'सोलर बचत अनुमान' },
  'pdf-generated':        { en: 'Generated:', hi: 'तैयार किया गया:' },
  'pdf-prepared-for':     { en: 'Prepared for', hi: 'ग्राहक' },
  'pdf-valued-customer':  { en: 'Valued Customer', hi: 'माननीय ग्राहक' },
  'pdf-section-summary':  { en: 'System & Savings Summary', hi: 'सिस्टम और बचत सारांश' },
  'pdf-section-emi':      { en: 'Financing (EMI) \u2014 Optional', hi: 'फाइनेंसिंग (EMI) \u2014 वैकल्पिक' },
  'pdf-down-payment':     { en: 'Down payment', hi: 'डाउन पेमेंट' },
  'pdf-loan-tenure':      { en: 'Loan tenure', hi: 'लोन अवधि' },
  'pdf-years-suffix':     { en: 'years', hi: 'वर्ष' },
  'pdf-units-month-suffix': { en: 'units/month', hi: 'यूनिट/माह' },
  'pdf-per-month-suffix':   { en: '/month', hi: '/माह' },
  'pdf-per-mo-suffix':      { en: '/mo', hi: '/माह' },
  'pdf-not-applicable':     { en: 'Not applicable', hi: 'लागू नहीं' },
  'pdf-interest-rate':    { en: 'Interest rate', hi: 'ब्याज दर' },
  'pdf-pa-suffix':        { en: '% p.a.', hi: '% सालाना' },
  'pdf-disclaimer':       { en: 'This is an illustrative estimate only, based on the figures you entered \u2014 not a final quotation. Actual system size, pricing, subsidy eligibility and loan terms depend on a site visit and lender approval.',
                             hi: 'यह केवल एक उदाहरणात्मक अनुमान है, आपके द्वारा दर्ज आंकड़ों पर आधारित \u2014 यह अंतिम कोटेशन नहीं है। वास्तविक सिस्टम आकार, कीमत, सब्सिडी पात्रता और लोन शर्तें साइट विज़िट और ऋणदाता की मंज़ूरी पर निर्भर करती हैं।' },

  // ---- PM Surya Ghar page ----
  'pm-hero-eyebrow-badge': { en: 'PM Surya Ghar · Residential Solar', hi: 'PM सूर्य घर · आवासीय सोलर' },
  'pm-hero-eyebrow-guide': { en: 'A practical guide for homeowners', hi: 'घर के मालिकों के लिए एक व्यावहारिक मार्गदर्शिका' },
  'pm-hero-h1-line1':      { en: 'PM Surya Ghar', hi: 'PM सूर्य घर' },
  'pm-hero-h1-line2':      { en: 'from application to subsidy.', hi: 'आवेदन से सब्सिडी तक।' },
  'pm-hero-sub':            { en: 'Thinking about rooftop solar under PM Surya Ghar Muft Bijli Yojana? Here is the complete journey - eligibility, documents, portal application, installation, DISCOM inspection, net meter and Central Financial Assistance.',
                              hi: 'PM सूर्य घर मुफ़्त बिजली योजना के तहत रूफटॉप सोलर के बारे में सोच रहे हैं? यहाँ पूरी यात्रा दी गई है - पात्रता, दस्तावेज़, पोर्टल आवेदन, इंस्टॉलेशन, DISCOM निरीक्षण, नेट मीटर और केंद्रीय वित्तीय सहायता।' },
  'pm-hero-cta-1':          { en: 'Calculate My Savings', hi: 'मेरी बचत जानें' },
  'pm-hero-cta-2':          { en: 'Talk to Halosun', hi: 'हैलोसन से बात करें' },
  'pm-hero-note':           { en: 'Residential rooftop solar · Uttar Pradesh · UPNEDA registered vendor', hi: 'आवासीय रूफटॉप सोलर · उत्तर प्रदेश · UPNEDA पंजीकृत वेंडर' },

  'pm-subsidy-eyebrow':          { en: 'The headline number', hi: 'सबसे अहम आंकड़ा' },
  'pm-subsidy-h2':                { en: 'Up to ₹78,000 central subsidy', hi: '₹78,000 तक केंद्रीय सब्सिडी' },
  'pm-subsidy-sub':                { en: 'Under the central scheme, residential consumers can receive CFA for the first 2 kW and an additional 1 kW. Capacity beyond 3 kW does not receive additional central CFA under the standard residential structure.',
                                    hi: 'केंद्रीय योजना के तहत, आवासीय उपभोक्ता पहले 2 kW और अतिरिक्त 1 kW के लिए CFA प्राप्त कर सकते हैं। मानक आवासीय संरचना के तहत 3 kW से अधिक क्षमता पर कोई अतिरिक्त केंद्रीय CFA नहीं मिलती।' },
  'pm-subsidy-card1-kicker':       { en: '1 kW', hi: '1 kW' },
  'pm-subsidy-card2-kicker':       { en: '2 kW', hi: '2 kW' },
  'pm-subsidy-card3-kicker':       { en: '3 kW or more', hi: '3 kW या अधिक' },
  'pm-subsidy-card-desc':          { en: 'Indicative central CFA', hi: 'संकेतात्मक केंद्रीय CFA' },
  'pm-subsidy-card3-desc':         { en: 'Maximum standard central CFA for a residential system', hi: 'आवासीय सिस्टम के लिए अधिकतम मानक केंद्रीय CFA' },
  'pm-subsidy-disclaimer-strong':  { en: 'Important:', hi: 'ज़रूरी बात:' },
  'pm-subsidy-disclaimer-text':    { en: 'Subsidy/CFA is subject to the applicable PM Surya Ghar guidelines, eligible system capacity, approved equipment and DISCOM verification. Do not treat the subsidy as an instant discount unless your specific financing/vendor arrangement explicitly provides one.',
                                    hi: 'सब्सिडी/CFA लागू PM सूर्य घर दिशानिर्देशों, पात्र सिस्टम क्षमता, स्वीकृत उपकरण और DISCOM सत्यापन पर निर्भर करती है। सब्सिडी को तुरंत छूट न समझें, जब तक कि आपकी विशेष फाइनेंसिंग/वेंडर व्यवस्था स्पष्ट रूप से ऐसा प्रावधान न करे।' },

  'pm-eligible-eyebrow': { en: '01 · Before you apply', hi: '01 · आवेदन करने से पहले' },
  'pm-eligible-h2':       { en: 'Who can benefit?', hi: 'कौन लाभ उठा सकता है?' },
  'pm-eligible-1-title':  { en: 'Residential electricity connection', hi: 'आवासीय बिजली कनेक्शन' },
  'pm-eligible-1-desc':   { en: 'The scheme\'s central residential CFA is intended for eligible residential electricity consumers.', hi: 'योजना की केंद्रीय आवासीय CFA पात्र आवासीय बिजली उपभोक्ताओं के लिए है।' },
  'pm-eligible-2-title':  { en: 'Suitable rooftop', hi: 'उपयुक्त छत' },
  'pm-eligible-2-desc':   { en: 'Your roof should have adequate usable area, structural suitability and reasonable solar access.', hi: 'आपकी छत पर पर्याप्त उपयोगी क्षेत्र, संरचनात्मक उपयुक्तता और उचित धूप की पहुँच होनी चाहिए।' },
  'pm-eligible-3-title':  { en: 'Eligible DISCOM area', hi: 'पात्र DISCOM क्षेत्र' },
  'pm-eligible-3-desc':   { en: 'Your electricity connection must fall under a participating distribution utility/process.', hi: 'आपका बिजली कनेक्शन किसी सहभागी वितरण उपयोगिता/प्रक्रिया के अंतर्गत होना चाहिए।' },
  'pm-eligible-4-title':  { en: 'Bank & identity details', hi: 'बैंक और पहचान विवरण' },
  'pm-eligible-4-desc':   { en: 'Keep the required consumer, bank and electricity-account details ready for portal processing.', hi: 'पोर्टल प्रोसेसिंग के लिए आवश्यक उपभोक्ता, बैंक और बिजली-खाता विवरण तैयार रखें।' },

  'pm-docs-eyebrow': { en: '02 · Keep these ready', hi: '02 · ये तैयार रखें' },
  'pm-docs-h2':       { en: 'Documents & information checklist', hi: 'दस्तावेज़ और जानकारी की सूची' },
  'pm-docs-sub':      { en: 'Exact requirements can vary by DISCOM and application stage. Halosun can help you prepare the submission.', hi: 'सटीक आवश्यकताएँ DISCOM और आवेदन चरण के अनुसार अलग हो सकती हैं। हैलोसन आपकी प्रविष्टि तैयार करने में मदद कर सकता है।' },
  'pm-doc-1-title':   { en: 'Electricity bill', hi: 'बिजली बिल' },
  'pm-doc-1-desc':    { en: 'Latest electricity bill / consumer account details.', hi: 'नवीनतम बिजली बिल / उपभोक्ता खाता विवरण।' },
  'pm-doc-2-title':   { en: 'Consumer details', hi: 'उपभोक्ता विवरण' },
  'pm-doc-2-desc':    { en: 'Name, mobile number and identity information matching the electricity connection where required.', hi: 'नाम, मोबाइल नंबर और पहचान जानकारी जो आवश्यकतानुसार बिजली कनेक्शन से मेल खाती हो।' },
  'pm-doc-3-title':   { en: 'Bank details', hi: 'बैंक विवरण' },
  'pm-doc-3-desc':    { en: 'Bank account information as required for CFA/subsidy processing.', hi: 'CFA/सब्सिडी प्रोसेसिंग के लिए आवश्यक बैंक खाता जानकारी।' },
  'pm-doc-4-title':   { en: 'Roof / property details', hi: 'छत / संपत्ति विवरण' },
  'pm-doc-4-desc':    { en: 'Ownership/occupancy information and NOC or consent where applicable.', hi: 'स्वामित्व/निवास जानकारी और लागू होने पर NOC या सहमति।' },
  'pm-doc-5-title':   { en: 'Portal credentials', hi: 'पोर्टल क्रेडेंशियल्स' },
  'pm-doc-5-desc':    { en: 'Mobile number, application details and OTP access for the National Portal.', hi: 'राष्ट्रीय पोर्टल के लिए मोबाइल नंबर, आवेदन विवरण और OTP एक्सेस।' },
  'pm-doc-6-title':   { en: 'Installation records', hi: 'इंस्टॉलेशन रिकॉर्ड' },
  'pm-doc-6-desc':    { en: 'Vendor invoice, system details, photographs and commissioning documents as applicable.', hi: 'वेंडर इनवॉइस, सिस्टम विवरण, फ़ोटो और लागू होने पर कमीशनिंग दस्तावेज़।' },

  'pm-journey-eyebrow': { en: '03 · The complete journey', hi: '03 · पूरी यात्रा' },
  'pm-journey-h2':       { en: 'From application to subsidy', hi: 'आवेदन से सब्सिडी तक' },
  'pm-journey-sub':      { en: 'The exact time at each stage depends on the portal, DISCOM workload, site conditions and inspection/verification schedule.', hi: 'प्रत्येक चरण में लगने वाला सटीक समय पोर्टल, DISCOM कार्यभार, साइट की स्थिति और निरीक्षण/सत्यापन की समय-सारणी पर निर्भर करता है।' },

  'pm-step-1-label':     { en: 'APPLICATION', hi: 'आवेदन' },
  'pm-step-1-title':     { en: 'Register on the National Portal', hi: 'राष्ट्रीय पोर्टल पर पंजीकरण करें' },
  'pm-step-1-desc':      { en: 'Start the rooftop solar application using your electricity consumer details and the applicable DISCOM selection.', hi: 'अपने बिजली उपभोक्ता विवरण और लागू DISCOM चयन का उपयोग करके रूफटॉप सोलर आवेदन शुरू करें।' },
  'pm-step-1-role-label':{ en: 'Halosun:', hi: 'हैलोसन:' },
  'pm-step-1-role-text': { en: 'Can guide you through the application and information required.', hi: 'आवेदन और आवश्यक जानकारी में आपका मार्गदर्शन कर सकता है।' },

  'pm-step-2-label':     { en: 'TECHNICAL APPROVAL', hi: 'तकनीकी स्वीकृति' },
  'pm-step-2-title':     { en: 'DISCOM reviews the application', hi: 'DISCOM आवेदन की समीक्षा करता है' },
  'pm-step-2-desc':      { en: 'The electricity distribution utility processes the request according to its technical and portal workflow.', hi: 'बिजली वितरण कंपनी अपनी तकनीकी और पोर्टल प्रक्रिया के अनुसार अनुरोध को प्रोसेस करती है।' },
  'pm-step-2-role-label':{ en: 'You:', hi: 'आप:' },
  'pm-step-2-role-text': { en: 'Keep your consumer details and documents available if clarification is requested.', hi: 'यदि स्पष्टीकरण माँगा जाए तो अपने उपभोक्ता विवरण और दस्तावेज़ उपलब्ध रखें।' },

  'pm-step-3-label':     { en: 'DESIGN', hi: 'डिज़ाइन' },
  'pm-step-3-title':     { en: 'System design & quotation', hi: 'सिस्टम डिज़ाइन और कोटेशन' },
  'pm-step-3-desc':      { en: 'Halosun assesses your load, roof, orientation, available area and expected generation before finalising the system design.', hi: 'हैलोसन सिस्टम डिज़ाइन अंतिम रूप देने से पहले आपके लोड, छत, दिशा, उपलब्ध क्षेत्र और अपेक्षित जनरेशन का आकलन करता है।' },
  'pm-step-3-role-label':{ en: 'Halosun:', hi: 'हैलोसन:' },
  'pm-step-3-role-text': { en: 'System sizing, engineering, quotation and installation planning.', hi: 'सिस्टम साइज़िंग, इंजीनियरिंग, कोटेशन और इंस्टॉलेशन योजना।' },

  'pm-step-4-label':     { en: 'INSTALLATION', hi: 'इंस्टॉलेशन' },
  'pm-step-4-title':     { en: 'Solar plant is installed', hi: 'सोलर प्लांट स्थापित किया जाता है' },
  'pm-step-4-desc':      { en: 'Panels, mounting structure, inverter, protection equipment, cabling and earthing are installed according to the approved design and applicable requirements.', hi: 'पैनल, माउंटिंग स्ट्रक्चर, इन्वर्टर, सुरक्षा उपकरण, केबलिंग और अर्थिंग स्वीकृत डिज़ाइन और लागू आवश्यकताओं के अनुसार स्थापित की जाती है।' },
  'pm-step-4-role-label':{ en: 'Halosun:', hi: 'हैलोसन:' },
  'pm-step-4-role-text': { en: 'EPC execution, documentation and commissioning support.', hi: 'EPC निष्पादन, दस्तावेज़ीकरण और कमीशनिंग सहायता।' },

  'pm-step-5-label':     { en: 'INSPECTION', hi: 'निरीक्षण' },
  'pm-step-5-title':     { en: 'DISCOM verification / inspection', hi: 'DISCOM सत्यापन / निरीक्षण' },
  'pm-step-5-desc':      { en: 'The completed installation is submitted for the applicable DISCOM verification process. Additional information or corrections may be requested.', hi: 'पूर्ण इंस्टॉलेशन को लागू DISCOM सत्यापन प्रक्रिया के लिए प्रस्तुत किया जाता है। अतिरिक्त जानकारी या सुधार माँगे जा सकते हैं।' },
  'pm-step-5-role-label':{ en: 'Important:', hi: 'ज़रूरी बात:' },
  'pm-step-5-role-text': { en: 'Inspection timing is controlled by the DISCOM, not the installer.', hi: 'निरीक्षण का समय DISCOM द्वारा नियंत्रित होता है, इंस्टॉलर द्वारा नहीं।' },

  'pm-step-6-label':     { en: 'METERING', hi: 'मीटरिंग' },
  'pm-step-6-title':     { en: 'Net meter / meter process', hi: 'नेट मीटर / मीटर प्रक्रिया' },
  'pm-step-6-desc':      { en: 'After the applicable technical and verification steps, the meter/net-metering process is completed according to the DISCOM workflow.', hi: 'लागू तकनीकी और सत्यापन चरणों के बाद, मीटर/नेट-मीटरिंग प्रक्रिया DISCOM की कार्यप्रणाली के अनुसार पूरी की जाती है।' },

  'pm-step-7-label':     { en: 'COMMISSIONING', hi: 'कमीशनिंग' },
  'pm-step-7-title':     { en: 'Commissioning documents submitted', hi: 'कमीशनिंग दस्तावेज़ प्रस्तुत किए जाते हैं' },
  'pm-step-7-desc':      { en: 'Required commissioning, installation and vendor documentation is completed and submitted through the applicable process.', hi: 'आवश्यक कमीशनिंग, इंस्टॉलेशन और वेंडर दस्तावेज़ीकरण पूरा करके लागू प्रक्रिया के माध्यम से प्रस्तुत किया जाता है।' },

  'pm-step-8-label':     { en: 'CFA', hi: 'CFA' },
  'pm-step-8-title':     { en: 'Central Financial Assistance is processed', hi: 'केंद्रीय वित्तीय सहायता प्रोसेस की जाती है' },
  'pm-step-8-desc':      { en: 'After successful installation and verification, the eligible CFA is processed according to the scheme and portal requirements.', hi: 'सफल इंस्टॉलेशन और सत्यापन के बाद, पात्र CFA योजना और पोर्टल आवश्यकताओं के अनुसार प्रोसेस की जाती है।' },
  'pm-step-8-role-label':{ en: 'Note:', hi: 'नोट:' },
  'pm-step-8-role-text': { en: 'The actual credit date depends on government/portal processing and successful verification.', hi: 'वास्तविक क्रेडिट तिथि सरकार/पोर्टल प्रोसेसिंग और सफल सत्यापन पर निर्भर करती है।' },

  'pm-timeline-eyebrow': { en: '04 · How long does it take?', hi: '04 · इसमें कितना समय लगता है?' },
  'pm-timeline-h2':       { en: 'A realistic way to think about the timeline', hi: 'समय-सीमा को समझने का एक व्यावहारिक तरीका' },
  'pm-time-1-tag':        { en: 'Day 0', hi: 'दिन 0' },
  'pm-time-1-title':      { en: 'Application', hi: 'आवेदन' },
  'pm-time-1-desc':       { en: 'Customer application and initial documentation.', hi: 'ग्राहक आवेदन और प्रारंभिक दस्तावेज़ीकरण।' },
  'pm-time-2-tag':        { en: 'Next', hi: 'अगला' },
  'pm-time-2-title':      { en: 'DISCOM stage', hi: 'DISCOM चरण' },
  'pm-time-2-desc':       { en: 'Technical approval / applicable portal workflow.', hi: 'तकनीकी स्वीकृति / लागू पोर्टल प्रक्रिया।' },
  'pm-time-3-tag':        { en: 'After approval', hi: 'स्वीकृति के बाद' },
  'pm-time-3-title':      { en: 'Installation', hi: 'इंस्टॉलेशन' },
  'pm-time-3-desc':       { en: 'Site preparation, installation and commissioning.', hi: 'साइट तैयारी, इंस्टॉलेशन और कमीशनिंग।' },
  'pm-time-4-tag':        { en: 'After installation', hi: 'इंस्टॉलेशन के बाद' },
  'pm-time-4-title':      { en: 'Inspection & meter', hi: 'निरीक्षण और मीटर' },
  'pm-time-4-desc':       { en: 'DISCOM verification and applicable metering process.', hi: 'DISCOM सत्यापन और लागू मीटरिंग प्रक्रिया।' },
  'pm-time-5-tag':        { en: 'After successful verification', hi: 'सफल सत्यापन के बाद' },
  'pm-time-5-title':      { en: 'CFA processing', hi: 'CFA प्रोसेसिंग' },
  'pm-time-5-desc':       { en: 'Eligible subsidy/CFA is processed through the applicable system.', hi: 'पात्र सब्सिडी/CFA लागू प्रणाली के माध्यम से प्रोसेस की जाती है।' },
  'pm-timeline-disclaimer-strong': { en: 'Why we don\'t promise “subsidy in X days”:', hi: 'हम "X दिनों में सब्सिडी" का वादा क्यों नहीं करते:' },
  'pm-timeline-disclaimer-text':   { en: 'Installation is within the vendor\'s control; DISCOM inspection, meter work and government/portal processing are external stages. A professional installer should give you a process estimate, not a guaranteed subsidy-credit date.',
                                     hi: 'इंस्टॉलेशन वेंडर के नियंत्रण में है; DISCOM निरीक्षण, मीटर कार्य और सरकार/पोर्टल प्रोसेसिंग बाहरी चरण हैं। एक पेशेवर इंस्टॉलर को आपको प्रक्रिया का अनुमान देना चाहिए, न कि सब्सिडी-क्रेडिट की गारंटीशुदा तारीख।' },

  'pm-role-eyebrow': { en: '05 · What Halosun handles', hi: '05 · हैलोसन क्या संभालता है' },
  'pm-role-h2':       { en: 'One team. Fewer things for you to chase.', hi: 'एक टीम। आपको कम चीज़ों के पीछे भागना पड़े।' },
  'pm-role-1-title':  { en: 'Site assessment', hi: 'साइट मूल्यांकन' },
  'pm-role-1-desc':   { en: 'Roof, shade, orientation, access and electrical considerations.', hi: 'छत, छाया, दिशा, पहुँच और विद्युत संबंधी बातें।' },
  'pm-role-2-title':  { en: 'Engineering', hi: 'इंजीनियरिंग' },
  'pm-role-2-desc':   { en: 'System sizing, equipment selection, protection and installation planning.', hi: 'सिस्टम साइज़िंग, उपकरण चयन, सुरक्षा और इंस्टॉलेशन योजना।' },
  'pm-role-3-title':  { en: 'Portal assistance', hi: 'पोर्टल सहायता' },
  'pm-role-3-desc':   { en: 'Guidance with the application, documentation and required project information.', hi: 'आवेदन, दस्तावेज़ीकरण और आवश्यक प्रोजेक्ट जानकारी में मार्गदर्शन।' },
  'pm-role-4-title':  { en: 'Installation & support', hi: 'इंस्टॉलेशन और सहायता' },
  'pm-role-4-desc':   { en: 'Professional installation, commissioning support and coordination through the applicable process.', hi: 'पेशेवर इंस्टॉलेशन, कमीशनिंग सहायता और लागू प्रक्रिया के माध्यम से समन्वय।' },

  'pm-example-eyebrow':      { en: '06 · Simple example', hi: '06 · सरल उदाहरण' },
  'pm-example-h2':            { en: 'What does the subsidy actually mean?', hi: 'सब्सिडी का वास्तव में क्या मतलब है?' },
  'pm-example-text':          { en: 'Suppose your eligible residential system is 3 kW. The standard central CFA structure provides up to ₹78,000 for the eligible capacity. Your actual project price is determined by the system specification and quotation; subsidy eligibility does not mean every 3 kW installation costs the same.',
                               hi: 'मान लीजिए आपका पात्र आवासीय सिस्टम 3 kW का है। मानक केंद्रीय CFA संरचना पात्र क्षमता के लिए ₹78,000 तक प्रदान करती है। आपकी वास्तविक प्रोजेक्ट कीमत सिस्टम विनिर्देश और कोटेशन से तय होती है; सब्सिडी पात्रता का यह मतलब नहीं कि हर 3 kW इंस्टॉलेशन की कीमत एक जैसी होगी।' },
  'pm-example-number-label':  { en: 'Maximum standard central CFA', hi: 'अधिकतम मानक केंद्रीय CFA' },
  'pm-example-number-sub':    { en: 'for eligible residential capacity', hi: 'पात्र आवासीय क्षमता के लिए' },

  'pm-faq-eyebrow': { en: '07 · Common questions', hi: '07 · सामान्य सवाल' },
  'pm-faq-h2':       { en: 'PM Surya Ghar FAQ', hi: 'PM सूर्य घर सवाल-जवाब' },

  'pm-faq-q1-q': { en: 'Is ₹78,000 guaranteed for every solar installation?', hi: 'क्या हर सोलर इंस्टॉलेशन के लिए ₹78,000 की गारंटी है?' },
  'pm-faq-q1-a': { en: 'No. ₹78,000 is the maximum standard central CFA for eligible residential capacity under the stated structure. Actual eligibility depends on the scheme requirements, system capacity, approved equipment and successful verification.',
                   hi: 'नहीं। ₹78,000 बताई गई संरचना के तहत पात्र आवासीय क्षमता के लिए अधिकतम मानक केंद्रीय CFA है। वास्तविक पात्रता योजना की आवश्यकताओं, सिस्टम क्षमता, स्वीकृत उपकरण और सफल सत्यापन पर निर्भर करती है।' },

  'pm-faq-q2-q': { en: 'Can I install more than 3 kW?', hi: 'क्या मैं 3 kW से अधिक इंस्टॉल कर सकता हूँ?' },
  'pm-faq-q2-a': { en: 'Yes, a residential system can be larger where technically and financially appropriate. However, under the standard central CFA structure, additional central CFA is not provided beyond the eligible 3 kW threshold.',
                   hi: 'हाँ, तकनीकी और वित्तीय रूप से उपयुक्त होने पर आवासीय सिस्टम बड़ा हो सकता है। हालांकि, मानक केंद्रीय CFA संरचना के तहत, पात्र 3 kW सीमा से आगे कोई अतिरिक्त केंद्रीय CFA नहीं दी जाती।' },

  'pm-faq-q3-q': { en: 'Does Halosun directly give me the government subsidy?', hi: 'क्या हैलोसन सीधे सरकारी सब्सिडी देता है?' },
  'pm-faq-q3-a': { en: 'No. Halosun is the solar EPC/vendor. The CFA is a government scheme benefit processed through the applicable portal and verification workflow.',
                   hi: 'नहीं। हैलोसन सोलर EPC/वेंडर है। CFA एक सरकारी योजना लाभ है जो लागू पोर्टल और सत्यापन प्रक्रिया के माध्यम से प्रोसेस किया जाता है।' },

  'pm-faq-q4-q': { en: 'Who controls the inspection and meter timeline?', hi: 'निरीक्षण और मीटर की समय-सीमा किसके नियंत्रण में होती है?' },
  'pm-faq-q4-a': { en: 'The applicable DISCOM controls its inspection and metering workflow. Halosun can coordinate and assist, but cannot honestly guarantee a government/DISCOM date.',
                   hi: 'लागू DISCOM अपनी निरीक्षण और मीटरिंग प्रक्रिया को नियंत्रित करता है। हैलोसन समन्वय और सहायता कर सकता है, लेकिन ईमानदारी से सरकार/DISCOM की तारीख की गारंटी नहीं दे सकता।' },

  'pm-faq-q5-q': { en: 'Can I take a loan for the solar system?', hi: 'क्या मैं सोलर सिस्टम के लिए लोन ले सकता हूँ?' },
  'pm-faq-q5-a': { en: 'Financing may be available through participating financial institutions and scheme-linked arrangements. Loan approval, interest rate and disbursement remain subject to the lender\'s terms.',
                   hi: 'सहभागी वित्तीय संस्थानों और योजना-संबद्ध व्यवस्थाओं के माध्यम से फाइनेंसिंग उपलब्ध हो सकती है। लोन स्वीकृति, ब्याज दर और वितरण ऋणदाता की शर्तों पर निर्भर रहते हैं।' },

  'pm-faq-q6-q': { en: 'Do I need to visit government offices?', hi: 'क्या मुझे सरकारी कार्यालयों में जाना होगा?' },
  'pm-faq-q6-a': { en: 'Many steps are handled through the portal and coordinated digitally, but some DISCOM processes may still require field verification or additional documentation. Halosun can help you understand what is required at each stage.',
                   hi: 'कई चरण पोर्टल के माध्यम से और डिजिटल रूप से समन्वित होते हैं, लेकिन कुछ DISCOM प्रक्रियाओं में फील्ड सत्यापन या अतिरिक्त दस्तावेज़ीकरण की आवश्यकता हो सकती है। हैलोसन आपको हर चरण में आवश्यक बातें समझने में मदद कर सकता है।' },

  'pm-cta-eyebrow':      { en: 'Ready to check your roof?', hi: 'अपनी छत जाँचने के लिए तैयार हैं?' },
  'pm-cta-h2':            { en: 'Let\'s work out your solar requirement first.', hi: 'पहले आपकी सोलर आवश्यकता तय करते हैं।' },
  'pm-cta-sub':           { en: 'Get an estimate of system size, generation, subsidy and payback before you commit.', hi: 'प्रतिबद्ध होने से पहले सिस्टम आकार, जनरेशन, सब्सिडी और पेबैक का अनुमान पाएं।' },
  'pm-cta-btn-1':         { en: 'Open Solar Calculator', hi: 'सोलर कैलकुलेटर खोलें' },
  'pm-cta-btn-2':         { en: 'WhatsApp Halosun', hi: 'हैलोसन को व्हाट्सएप करें' },
  'pm-cta-official-text': { en: 'Want to verify the scheme directly?', hi: 'क्या आप योजना को सीधे सत्यापित करना चाहते हैं?' },
  'pm-cta-official-link': { en: 'Visit the official PM Surya Ghar portal →', hi: 'आधिकारिक PM सूर्य घर पोर्टल पर जाएँ →' },

  // ---- Why Halosun Exists page ----
  'why-hero-cta':          { en: 'See the Halosun Standard', hi: 'हैलोसन मानक देखें' },

  'whyexists-eyebrow':     { en: 'Why Halosun Exists', hi: 'हैलोसन क्यों है' },
  'whyexists-title':       { en: 'Solar is easy to sell. Building it right is harder.', hi: 'सोलर बेचना आसान है। इसे सही तरीके से बनाना मुश्किल।' },
  'why-sub':               { en: "A solar installation is supposed to last for decades. Yet most of the attention in this industry goes into getting the panels on the roof, switching the system on, and handing over the invoice. We believe that's only the beginning.",
                              hi: 'सोलर इंस्टॉलेशन को दशकों तक चलना चाहिए। फिर भी इस उद्योग में ज़्यादातर ध्यान पैनल छत पर लगाने, सिस्टम चालू करने और बिल थमाने पर जाता है। हमारा मानना है कि यह तो बस शुरुआत है।' },

  'why-problem-eyebrow':   { en: 'The problem, stated plainly', hi: 'समस्या, सीधे शब्दों में' },
  'why-problem-title':     { en: 'From the outside, every installation looks the same', hi: 'बाहर से देखने पर हर इंस्टॉलेशन एक जैसी दिखती है' },
  'why-problem-sub':       { en: 'The panels look the same. The inverter looks the same. The structure may look the same. But some of the most important differences are things you cannot see easily:',
                              hi: 'पैनल एक जैसे दिखते हैं। इन्वर्टर एक जैसा दिखता है। संरचना भी एक जैसी लग सकती है। लेकिन सबसे महत्वपूर्ण अंतर वे होते हैं जो आसानी से नहीं दिखते:' },
  'why-problem-q1':        { en: 'Was the structure designed properly for the site?', hi: 'क्या संरचना साइट के अनुसार सही तरीके से डिज़ाइन की गई थी?' },
  'why-problem-q2':        { en: 'Are the supports and anchors right for this roof and these conditions?', hi: 'क्या सपोर्ट और एंकर इस छत और इन परिस्थितियों के लिए सही हैं?' },
  'why-problem-q3':        { en: 'Was the steel chosen for strength and durability, not just cost?', hi: 'क्या स्टील मज़बूती और टिकाऊपन के लिए चुना गया, सिर्फ लागत के लिए नहीं?' },
  'why-problem-q4':        { en: 'Are the cables correctly sized and routed?', hi: 'क्या केबल सही आकार की हैं और सही तरीके से रूट की गई हैं?' },
  'why-problem-q5':        { en: 'Is the DC wiring protected from unnecessary exposure?', hi: 'क्या DC वायरिंग को अनावश्यक जोखिम से सुरक्षित रखा गया है?' },
  'why-problem-q6':        { en: 'Are the earthing and surge-protection systems properly designed?', hi: 'क्या अर्थिंग और सर्ज-प्रोटेक्शन सिस्टम सही ढंग से डिज़ाइन किए गए हैं?' },
  'why-problem-q7':        { en: 'Was waterproofing considered wherever the roof was penetrated?', hi: 'जहाँ भी छत में छेद किया गया, क्या वहाँ वॉटरप्रूफिंग का ध्यान रखा गया?' },
  'why-problem-q8':        { en: 'Was the installation actually inspected against a defined standard before handover?', hi: 'क्या हैंडओवर से पहले इंस्टॉलेशन को वाकई एक तय मानक के विरुद्ध जाँचा गया था?' },
  'why-problem-closing':   { en: 'Good solar engineering is often invisible. Poor engineering usually becomes visible later - when something fails.',
                              hi: 'अच्छी सोलर इंजीनियरिंग अक्सर अदृश्य होती है। खराब इंजीनियरिंग आमतौर पर बाद में दिखाई देती है - जब कुछ खराब हो जाता है।' },

  'why-started-eyebrow':   { en: 'Where it started', hi: 'शुरुआत कहाँ से हुई' },
  'why-started-title':     { en: 'An engineering mindset, applied to solar', hi: 'एक इंजीनियरिंग सोच, सोलर पर लागू' },
  'why-started-body':      { en: 'Halosun came from an engineering mindset - not because solar was simply another product to sell, but because engineering teaches a different way of thinking: define the requirement, choose the right solution, build it correctly, verify the result, and don\'t stop at "it works." That discipline became the foundation of Halosun. We believe a solar installation should be treated as an engineered system - not simply a collection of panels, cables, an inverter and a structure.',
                              hi: 'हैलोसन की शुरुआत एक इंजीनियरिंग सोच से हुई - इसलिए नहीं कि सोलर बस एक और बेचने वाला प्रोडक्ट था, बल्कि इसलिए कि इंजीनियरिंग सोचने का एक अलग तरीका सिखाती है: आवश्यकता तय करें, सही समाधान चुनें, इसे सही ढंग से बनाएं, परिणाम की पुष्टि करें, और "यह चल रहा है" पर न रुकें। यही अनुशासन हैलोसन की नींव बना। हमारा मानना है कि सोलर इंस्टॉलेशन को एक इंजीनियर्ड सिस्टम माना जाना चाहिए - सिर्फ पैनल, केबल, इन्वर्टर और संरचना का जमावड़ा नहीं।' },

  'why-became-eyebrow':    { en: 'What it became', hi: 'यह क्या बना' },
  'why-became-title':      { en: 'We wrote the standard before we wrote the first invoice', hi: 'हमने पहला बिल बनाने से पहले मानक लिखा' },
  'why-became-body-1':     { en: "Before our first installation, we started putting our expectations into writing. Not because a checklist looks impressive on a website - because if a standard exists only in someone's head, it isn't really a standard. It's a hope.",
                              hi: 'अपनी पहली इंस्टॉलेशन से पहले, हमने अपनी अपेक्षाओं को लिखित रूप में उतारना शुरू किया। इसलिए नहीं कि वेबसाइट पर चेकलिस्ट प्रभावशाली लगती है - बल्कि इसलिए कि अगर कोई मानक सिर्फ किसी के दिमाग में है, तो वह असल में मानक नहीं है। वह एक उम्मीद भर है।' },
  'why-became-body-2':     { en: "So we built our own installation standard around the things that actually matter on a rooftop - from material selection and structural fixing to cable routing, earthing, protection, safety and final verification. Every installation is judged against the same principles, regardless of size. A six-panel residential rooftop deserves the same attention to fundamentals as a 50 kW commercial installation. The scale changes. The standard doesn't.",
                              hi: 'इसलिए हमने अपना खुद का इंस्टॉलेशन मानक उन चीज़ों के इर्द-गिर्द बनाया जो छत पर वाकई मायने रखती हैं - सामग्री चयन और संरचनात्मक फिक्सिंग से लेकर केबल रूटिंग, अर्थिंग, सुरक्षा और अंतिम सत्यापन तक। हर इंस्टॉलेशन को आकार चाहे जो भी हो, उन्हीं सिद्धांतों पर परखा जाता है। एक 6-पैनल घरेलू छत उतनी ही बुनियादी सावधानी की हकदार है जितनी एक 50 kW की व्यावसायिक इंस्टॉलेशन। पैमाना बदलता है। मानक नहीं बदलता।' },
  'why-became-cta':        { en: 'See what the Halosun Standard actually is →', hi: 'देखें हैलोसन मानक असल में क्या है →' },

  'why-work-eyebrow':      { en: 'How we work', hi: 'हम कैसे काम करते हैं' },
  'why-work-title':        { en: 'Quality is created long before the panels are switched on', hi: 'गुणवत्ता पैनल चालू होने से बहुत पहले तय हो जाती है' },
  'why-work-1-title':      { en: 'Design before installation', hi: 'इंस्टॉलेशन से पहले डिज़ाइन' },
  'why-work-1-desc':       { en: 'We don\'t start with "where can we fit the panels." We start by understanding the site, the electrical requirements, the structure, shading and cable routes - so the system makes sense for the site, not just the quotation.',
                              hi: 'हम "पैनल कहाँ फिट होंगे" से शुरुआत नहीं करते। हम साइट, बिजली की आवश्यकताओं, संरचना, छाया और केबल रास्तों को समझने से शुरुआत करते हैं - ताकि सिस्टम साइट के लिए सही बने, सिर्फ कोटेशन के लिए नहीं।' },
  'why-work-2-title':      { en: 'Materials with a purpose', hi: 'हर सामग्री का एक मकसद' },
  'why-work-2-desc':       { en: "Structure, fasteners, cables, connectors, protection devices, earthing and waterproofing all have a job to do. We choose them for suitability, safety and durability - not just what's cheapest to source.",
                              hi: 'संरचना, फास्टनर, केबल, कनेक्टर, सुरक्षा उपकरण, अर्थिंग और वॉटरप्रूफिंग - सबका एक काम होता है। हम इन्हें उपयुक्तता, सुरक्षा और टिकाऊपन के लिए चुनते हैं - सिर्फ सबसे सस्ता स्रोत नहीं।' },
  'why-work-3-title':      { en: 'Installation that follows a standard', hi: 'मानक के अनुसार इंस्टॉलेशन' },
  'why-work-3-desc':       { en: "Cable routing is deliberate. Connections are secure. Structures are properly fixed. Earthing is treated as a safety system, not an afterthought. And the finished installation is checked before it's handed over.",
                              hi: 'केबल रूटिंग सोच-समझकर होती है। कनेक्शन सुरक्षित होते हैं। संरचनाएँ सही तरीके से फिक्स होती हैं। अर्थिंग को एक सुरक्षा प्रणाली माना जाता है, बाद का काम नहीं। और हैंडओवर से पहले पूरी इंस्टॉलेशन की जाँच होती है।' },
  'why-work-4-title':      { en: 'Safety is part of the design', hi: 'सुरक्षा डिज़ाइन का हिस्सा है' },
  'why-work-4-desc':       { en: "Electrical safety isn't added at the end - it's considered from the beginning, including protection, earthing, surge protection, cable selection and safe isolation. A solar system is part of your building's electrical infrastructure. It deserves to be treated that way.",
                              hi: 'बिजली सुरक्षा को अंत में नहीं जोड़ा जाता - इसे शुरुआत से ही ध्यान में रखा जाता है, जिसमें सुरक्षा, अर्थिंग, सर्ज प्रोटेक्शन, केबल चयन और सुरक्षित आइसोलेशन शामिल है। सोलर सिस्टम आपकी इमारत के विद्युत ढांचे का हिस्सा है। इसे उसी तरह माना जाना चाहिए।' },

  'why-people-eyebrow':    { en: 'The people behind the work', hi: 'काम के पीछे के लोग' },
  'why-people-title':      { en: 'Not a giant corporation. Not a generalist either.', hi: 'न कोई बड़ी कॉर्पोरेट कंपनी, न ही एक साधारण इंस्टॉलर।' },
  'why-people-body-1':     { en: 'Halosun today is not a giant corporation with layers of people between the customer and the installation. It is a founder-led engineering business supported by qualified electrical professionals who carry out the work on site.',
                              hi: 'हैलोसन आज कोई विशाल कंपनी नहीं है जहाँ ग्राहक और इंस्टॉलेशन के बीच कई परतें हों। यह एक फाउंडर-नेतृत्व वाला इंजीनियरिंग व्यवसाय है, जिसे साइट पर काम करने वाले योग्य विद्युत पेशेवरों का सहयोग प्राप्त है।' },
  'why-people-electrician':{ en: 'The electricians who wire, earth, and connect every panel on your roof are qualified professionals - not generalists learning on your installation.',
                              hi: 'जो इलेक्ट्रीशियन आपकी छत पर हर पैनल की वायरिंग, अर्थिंग और कनेक्शन करते हैं, वे योग्य पेशेवर हैं - आपकी इंस्टॉलेशन पर सीख रहे सामान्य कारीगर नहीं।' },
  'why-people-body-2':     { en: "That has an advantage: accountability stays close to the installation. The people responsible for the work know the standard they're expected to follow, and the founder remains directly involved in how that standard is developed, applied and improved. We'd rather build a smaller company known for doing things properly than a larger one that simply installs more systems.",
                              hi: 'इसका एक फायदा है: जवाबदेही इंस्टॉलेशन के करीब बनी रहती है। काम के लिए ज़िम्मेदार लोग जानते हैं कि उनसे किस मानक का पालन करने की अपेक्षा है, और फाउंडर सीधे तौर पर इस बात में शामिल रहता है कि वह मानक कैसे बनता, लागू होता और सुधरता है। हम एक ऐसी छोटी कंपनी बनाना पसंद करेंगे जो सही तरीके से काम करने के लिए जानी जाए, बजाय एक बड़ी कंपनी के जो सिर्फ ज़्यादा सिस्टम लगाती है।' },

  'why-onestandard-eyebrow': { en: 'One standard. Every site.', hi: 'एक मानक। हर साइट पर।' },
  'why-onestandard-title':   { en: "A rooftop and a commercial plant look very different. The fundamentals don't.", hi: 'एक छत और एक व्यावसायिक प्लांट देखने में बहुत अलग लगते हैं। बुनियादी बातें नहीं बदलतीं।' },
  'why-tag-1':               { en: 'GOOD DESIGN', hi: 'अच्छा डिज़ाइन' },
  'why-tag-2':               { en: 'CORRECT MATERIALS', hi: 'सही सामग्री' },
  'why-tag-3':               { en: 'PROPER INSTALLATION', hi: 'उचित इंस्टॉलेशन' },
  'why-tag-4':               { en: 'ELECTRICAL SAFETY', hi: 'विद्युत सुरक्षा' },
  'why-tag-5':               { en: 'STRUCTURAL INTEGRITY', hi: 'संरचनात्मक मज़बूती' },
  'why-tag-6':               { en: 'RELIABLE PROTECTION', hi: 'भरोसेमंद सुरक्षा' },
  'why-tag-7':               { en: 'VERIFICATION', hi: 'सत्यापन' },
  'why-tag-8':               { en: 'ACCOUNTABILITY', hi: 'जवाबदेही' },
  'why-onestandard-sub':     { en: "These aren't premium add-ons. They're the basics of doing the job properly.", hi: 'ये कोई प्रीमियम ऐड-ऑन नहीं हैं। ये काम को सही तरीके से करने की बुनियादी बातें हैं।' },

  'why-price-eyebrow':     { en: 'Why we may not be the cheapest', hi: 'हम सबसे सस्ते क्यों नहीं हो सकते' },
  'why-price-title':       { en: 'There will always be a lower number', hi: 'हमेशा कोई न कोई कम कीमत देगा' },
  'why-price-body':        { en: "Sometimes the difference is obvious. Sometimes it isn't. A cheaper quotation may use a different structure, different cable, different protection, fewer components, less installation work, or simply a different standard of workmanship. Because much of solar quality is hidden, comparing two quotations by price alone can be misleading. We don't try to win every project by being the cheapest - we try to build the installation we'd be comfortable putting on our own roof. You may find a cheaper quote. Our job is to make sure you understand what you're comparing.",
                              hi: 'कभी-कभी अंतर साफ़ दिखता है। कभी-कभी नहीं। एक सस्ती कोटेशन में अलग संरचना, अलग केबल, अलग सुरक्षा, कम कंपोनेंट, कम इंस्टॉलेशन काम, या बस कारीगरी का एक अलग स्तर हो सकता है। चूंकि सोलर की ज़्यादातर गुणवत्ता छुपी होती है, इसलिए सिर्फ कीमत के आधार पर दो कोटेशन की तुलना करना भ्रामक हो सकता है। हम हर प्रोजेक्ट सबसे सस्ता होकर नहीं जीतना चाहते - हम वही इंस्टॉलेशन बनाना चाहते हैं जो अपनी ही छत पर लगवाने में हमें सहज लगे। आपको इससे सस्ता कोटेशन मिल सकता है। हमारा काम यह सुनिश्चित करना है कि आप समझें कि आप किसकी तुलना कर रहे हैं।' },

  'why-promise-eyebrow':   { en: 'The actual promise', hi: 'असली वादा' },
  'why-promise-title':     { en: 'We won\'t treat "it works today" as the definition of a good installation', hi: 'हम "आज यह चल रहा है" को अच्छी इंस्टॉलेशन की परिभाषा नहीं मानेंगे' },
  'why-promise-body':      { en: 'We don\'t promise that nothing will ever go wrong. Solar systems are exposed to weather, electrical conditions and the realities of a physical installation. What we promise is more fundamental: we will design carefully, build to a defined standard, use materials for a reason, take safety seriously, and stand behind the work we put our name on.',
                              hi: 'हम यह वादा नहीं करते कि कभी कुछ गलत नहीं होगा। सोलर सिस्टम मौसम, विद्युत परिस्थितियों और भौतिक इंस्टॉलेशन की वास्तविकताओं के संपर्क में रहते हैं। हमारा वादा अधिक बुनियादी है: हम सावधानी से डिज़ाइन करेंगे, एक तय मानक के अनुसार बनाएंगे, सामग्री को किसी वजह से चुनेंगे, सुरक्षा को गंभीरता से लेंगे, और जिस काम पर हमारा नाम है उसके पीछे खड़े रहेंगे।' },
  'why-promise-closing':   { en: "A solar installation isn't successful when the inverter starts producing power. It's successful when the system continues to be a safe, reliable, well-built part of your property for years to come.",
                              hi: 'सोलर इंस्टॉलेशन तब सफल नहीं होती जब इन्वर्टर बिजली बनाना शुरू करता है। यह तब सफल होती है जब सिस्टम आने वाले वर्षों तक आपकी संपत्ति का एक सुरक्षित, भरोसेमंद और मज़बूती से बना हिस्सा बना रहता है।' }
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

  if (typeof refreshCalcResultsLanguage === 'function') {
    refreshCalcResultsLanguage();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('halosun-lang') || 'en';
  applyLanguage(saved);

  document.querySelectorAll('.lang-toggle button').forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });
});
