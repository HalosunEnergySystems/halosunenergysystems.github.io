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
  'footer-tagline':  { en: 'Design · Build · Power', hi: 'डिज़ाइन · निर्माण · ऊर्जा' }
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
