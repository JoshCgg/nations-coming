import { useState, useEffect } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
`;

/* ─── BRAND COLORS ─── */
const C = {
  indigo:     "#1B456A",
  blue:       "#3E67AC",
  blueJeans:  "#5388F3",
  orange:     "#F38E53",
  brightGray: "#ECF1EE",
  white:      "#FFFFFF",
  text:       "#1B2B3A",
};

/* ─── ALL NATIONS DATA ─── */
const RAW_COUNTRIES = [
  // Americas (13)
  { n:"USA",          f:"🇺🇸", r:"Americas", cf:"CONCACAF", pop:"335M", rel:"Christianity", u:25, ug:["Arab Americans","South Asian Americans","Somali Americans"], cap:"Washington D.C.", lang:"English, Spanish", m:"The US hosts millions of unreached immigrants—among the world's greatest mission opportunities without leaving home." },
  { n:"Canada",       f:"🇨🇦", r:"Americas", cf:"CONCACAF", pop:"38M",  rel:"Christianity", u:18, ug:["South Asian Canadians","Chinese Canadians","Afghan refugees"], cap:"Ottawa", lang:"English, French", m:"Canada's cities are home to growing diaspora communities from least-reached nations." },
  { n:"Mexico",       f:"🇲🇽", r:"Americas", cf:"CONCACAF", pop:"130M", rel:"Christianity", u:10, ug:["Mixtec","Zapotec","Nahua"], cap:"Mexico City", lang:"Spanish", m:"Indigenous communities in southern Mexico still await contextualized gospel witness." },
  { n:"Argentina",    f:"🇦🇷", r:"Americas", cf:"CONMEBOL", pop:"46M",  rel:"Christianity", u:5,  ug:["Korean Argentines","Jewish Argentines","Syrian diaspora"], cap:"Buenos Aires", lang:"Spanish", m:"Buenos Aires holds one of Latin America's largest Jewish populations, largely unreached." },
  { n:"Brazil",       f:"🇧🇷", r:"Americas", cf:"CONMEBOL", pop:"215M", rel:"Christianity", u:12, ug:["Japanese Brazilians","Lebanese Brazilians","Indigenous Amazonian"], cap:"Brasília", lang:"Portuguese", m:"Over 100 uncontacted/unreached tribal groups remain in the Amazon basin." },
  { n:"Uruguay",      f:"🇺🇾", r:"Americas", cf:"CONMEBOL", pop:"3.5M", rel:"Secular/Christianity", u:3, ug:["Lebanese diaspora","Jewish community","Korean diaspora"], cap:"Montevideo", lang:"Spanish", m:"Uruguay is one of the most secular nations in Latin America—spiritual openness is growing." },
  { n:"Ecuador",      f:"🇪🇨", r:"Americas", cf:"CONMEBOL", pop:"18M",  rel:"Christianity", u:7,  ug:["Kichwa","Shuar","Achuar"], cap:"Quito", lang:"Spanish, Kichwa", m:"Amazonian indigenous groups represent a frontier of gospel witness in Ecuador." },
  { n:"Colombia",     f:"🇨🇴", r:"Americas", cf:"CONMEBOL", pop:"51M",  rel:"Christianity", u:6,  ug:["Wayuu","Nasa","Venezuelan refugees"], cap:"Bogotá", lang:"Spanish", m:"Millions of Venezuelan refugees in Colombia create an urgent gospel opportunity." },
  { n:"Paraguay",     f:"🇵🇾", r:"Americas", cf:"CONMEBOL", pop:"7.4M", rel:"Christianity", u:4,  ug:["Guaraní","Korean Paraguayans","Mennonite diaspora"], cap:"Asunción", lang:"Spanish, Guaraní", m:"The Guaraní people maintain a distinct cultural identity and are increasingly open to the gospel." },
  { n:"Chile",        f:"🇨🇱", r:"Americas", cf:"CONMEBOL", pop:"19M",  rel:"Christianity", u:5,  ug:["Mapuche","Aymara","Haitian immigrants"], cap:"Santiago", lang:"Spanish", m:"Haiti's diaspora in Chile faces isolation—a missions opportunity in an unexpected place." },
  { n:"Panama",       f:"🇵🇦", r:"Americas", cf:"CONCACAF", pop:"4.4M", rel:"Christianity", u:5,  ug:["Ngäbe","Kuna","Chinese Panamanians"], cap:"Panama City", lang:"Spanish", m:"Panama City is a global crossroads—its diverse immigrant populations include many unreached peoples." },
  { n:"Curaçao",      f:"🇨🇼", r:"Americas", cf:"CONCACAF", pop:"151K", rel:"Christianity", u:3,  ug:["Dutch Antillean Muslims","Jewish community","Sephardic Jews"], cap:"Willemstad", lang:"Papiamentu, Dutch", m:"A tiny island with a surprising diversity of unreached communities." },
  { n:"Haiti",        f:"🇭🇹", r:"Americas", cf:"CONCACAF", pop:"11M",  rel:"Christianity/Vodou", u:4, ug:["Haitian Vodouists","Rural unreached communities","Haitian diaspora"], cap:"Port-au-Prince", lang:"Haitian Creole, French", m:"Despite a Christian majority, syncretism with Vodou affects millions spiritually." },

  // Europe (12)
  { n:"England",      f:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", r:"Europe", cf:"UEFA", pop:"56M",  rel:"Christianity (nominal)", u:22, ug:["British Pakistanis","British Bangladeshis","British Somalis"], cap:"London", lang:"English", m:"London is among the world's most diverse cities—home to unreached diaspora communities from across the globe." },
  { n:"France",       f:"🇫🇷", r:"Europe", cf:"UEFA", pop:"68M",  rel:"Secular/Islam", u:28, ug:["Algerian French","Moroccan French","Turkish French"], cap:"Paris", lang:"French", m:"France hosts Europe's largest Muslim population—a mission field on Europe's doorstep." },
  { n:"Germany",      f:"🇩🇪", r:"Europe", cf:"UEFA", pop:"84M",  rel:"Christianity (nominal)", u:24, ug:["Turkish Germans","Afghan Germans","Syrian Germans"], cap:"Berlin", lang:"German", m:"Post-Christian Germany has become a gateway for Muslim diaspora—ripe for cross-cultural mission." },
  { n:"Spain",        f:"🇪🇸", r:"Europe", cf:"UEFA", pop:"47M",  rel:"Catholicism (nominal)", u:18, ug:["Moroccan Spanish","Romanian Roma","Sub-Saharan Africans"], cap:"Madrid", lang:"Spanish", m:"Spain's rapid secularization and growing Muslim immigrant population create new mission dynamics." },
  { n:"Portugal",     f:"🇵🇹", r:"Europe", cf:"UEFA", pop:"10M",  rel:"Catholicism (nominal)", u:14, ug:["Cape Verdean Portuguese","Brazilian Portuguese","Chinese Portuguese"], cap:"Lisbon", lang:"Portuguese", m:"Portugal's historical role as a colonial power means its diaspora communities span the globe." },
  { n:"Netherlands",  f:"🇳🇱", r:"Europe", cf:"UEFA", pop:"17.9M",rel:"Secular", u:20, ug:["Turkish Dutch","Moroccan Dutch","Surinamese Dutch"], cap:"Amsterdam", lang:"Dutch", m:"The Netherlands is one of Europe's most secular nations, with large unreached Muslim communities." },
  { n:"Belgium",      f:"🇧🇪", r:"Europe", cf:"UEFA", pop:"11.6M",rel:"Secular/Catholicism", u:19, ug:["Moroccan Belgians","Turkish Belgians","Congolese Belgians"], cap:"Brussels", lang:"French, Dutch, German", m:"Brussels, seat of the EU, houses some of Europe's most unreached immigrant populations." },
  { n:"Croatia",      f:"🇭🇷", r:"Europe", cf:"UEFA", pop:"3.9M", rel:"Catholicism", u:8,  ug:["Bosnian Muslims","Roma Croatians","Serbian minority"], cap:"Zagreb", lang:"Croatian", m:"The Western Balkans remain a frontier for Protestant gospel witness in post-communist Europe." },
  { n:"Austria",      f:"🇦🇹", r:"Europe", cf:"UEFA", pop:"9.1M", rel:"Catholicism (nominal)", u:16, ug:["Turkish Austrians","Chechen refugees","Afghan Austrians"], cap:"Vienna", lang:"German", m:"Vienna serves as a crossroads for refugees from Muslim-majority nations." },
  { n:"Scotland",     f:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", r:"Europe", cf:"UEFA", pop:"5.5M", rel:"Christianity (nominal)", u:10, ug:["Pakistani Scots","South Asian Scots","Chinese Scots"], cap:"Edinburgh", lang:"English, Scottish Gaelic", m:"Scotland's post-Christian landscape is spiritually open yet deeply nominally Christian." },
  { n:"Norway",       f:"🇳🇴", r:"Europe", cf:"UEFA", pop:"5.4M", rel:"Christianity (nominal)", u:13, ug:["Pakistani Norwegians","Somali Norwegians","Iraqi Norwegians"], cap:"Oslo", lang:"Norwegian", m:"Norway's generosity to refugees has created a multi-cultural mission field in Scandinavian cities." },
  { n:"Switzerland",  f:"🇨🇭", r:"Europe", cf:"UEFA", pop:"8.7M", rel:"Secular/Christianity", u:17, ug:["Kosovan Swiss","Turkish Swiss","Sri Lankan Swiss"], cap:"Bern", lang:"German, French, Italian", m:"Geneva and Zurich host international communities from least-reached nations." },

  // Africa (9)
  { n:"Morocco",      f:"🇲🇦", r:"Africa", cf:"CAF", pop:"37M",  rel:"Islam", u:8,  ug:["Amazigh (Berber)","Arab Moroccans","Saharan nomads"], cap:"Rabat", lang:"Arabic, Tamazight, French", m:"Morocco is 99.9% Muslim—yet a growing underground church testifies to quiet transformation." },
  { n:"Tunisia",      f:"🇹🇳", r:"Africa", cf:"CAF", pop:"12M",  rel:"Islam", u:6,  ug:["Arab Tunisians","Berber Tunisians","Sub-Saharan migrants"], cap:"Tunis", lang:"Arabic, French", m:"Post-Arab Spring Tunisia has seen remarkable openness to spiritual conversation." },
  { n:"Senegal",      f:"🇸🇳", r:"Africa", cf:"CAF", pop:"17M",  rel:"Islam", u:9,  ug:["Wolof","Serer","Mandinka"], cap:"Dakar", lang:"French, Wolof", m:"Over 95% Muslim, Senegal is home to Sufi brotherhoods with strong spiritual hunger." },
  { n:"Nigeria",      f:"🇳🇬", r:"Africa", cf:"CAF", pop:"220M", rel:"Islam/Christianity", u:31, ug:["Hausa-Fulani","Kanuri","TIV"], cap:"Abuja", lang:"English, Hausa, Yoruba, Igbo", m:"Nigeria holds the largest number of unreached people groups in Africa—the Hausa-Fulani alone number 30M." },
  { n:"Egypt",        f:"🇪🇬", r:"Africa", cf:"CAF", pop:"104M", rel:"Islam", u:11, ug:["Egyptian Arabs","Bedouin","Nubian"], cap:"Cairo", lang:"Arabic", m:"Egypt is home to the largest Arab Christian community—the Coptic Church—yet 90% remain Muslim." },
  { n:"Cameroon",     f:"🇨🇲", r:"Africa", cf:"CAF", pop:"27M",  rel:"Christianity/Islam", u:14, ug:["Fulani","Arab Choa","Kotoko"], cap:"Yaoundé", lang:"French, English", m:"Northern Cameroon has significant Muslim-majority areas with limited gospel access." },
  { n:"Côte d'Ivoire",f:"🇨🇮", r:"Africa", cf:"CAF", pop:"27M",  rel:"Islam/Christianity", u:12, ug:["Dioula","Malinke","Senufo"], cap:"Yamoussoukro", lang:"French", m:"The Muslim north of Côte d'Ivoire remains largely unreached by contextualized gospel witness." },
  { n:"South Africa", f:"🇿🇦", r:"Africa", cf:"CAF", pop:"60M",  rel:"Christianity", u:7,  ug:["Cape Malay Muslims","South Asian Muslims","Zulu traditionalists"], cap:"Pretoria", lang:"Zulu, Xhosa, Afrikaans, English (11 official)", m:"Despite a majority Christian identity, South Africa's Muslim and traditional communities need deeper engagement." },
  { n:"Algeria",      f:"🇩🇿", r:"Africa", cf:"CAF", pop:"46M",  rel:"Islam", u:7,  ug:["Kabyle Berber","Tuareg","Arab Algerians"], cap:"Algiers", lang:"Arabic, Tamazight, French", m:"Algeria has seen remarkable church growth among Kabyle Berbers—one of Africa's great gospel stories." },

  // Asia (8)
  { n:"Japan",        f:"🇯🇵", r:"Asia", cf:"AFC", pop:"125M", rel:"Buddhism/Shinto", u:16, ug:["Japanese Buddhists","Korean Japanese","Zainichi Koreans"], cap:"Tokyo", lang:"Japanese", m:"Japan is often called one of the world's hardest mission fields—less than 1% Christian after 150 years of mission." },
  { n:"South Korea",  f:"🇰🇷", r:"Asia", cf:"AFC", pop:"52M",  rel:"Christianity/Buddhism", u:9,  ug:["Korean Buddhists","Chinese Koreans","Southeast Asian migrants"], cap:"Seoul", lang:"Korean", m:"South Korea has become a major missionary-sending nation—over 20,000 Korean missionaries serve globally." },
  { n:"Iran",         f:"🇮🇷", r:"Asia", cf:"AFC", pop:"87M",  rel:"Islam (Shia)", u:14, ug:["Persian Iranians","Azerbaijani Iranians","Kurdish Iranians"], cap:"Tehran", lang:"Persian (Farsi)", m:"Iran has one of the fastest-growing church movements in the world—mostly underground house churches." },
  { n:"Saudi Arabia", f:"🇸🇦", r:"Asia", cf:"AFC", pop:"35M",  rel:"Islam", u:10, ug:["Saudi Arabs","Yemeni workers","South Asian migrants"], cap:"Riyadh", lang:"Arabic", m:"The birthplace of Islam—yet Saudi Arabia has seen a remarkable wave of Saudis turning to Christ." },
  { n:"Australia",    f:"🇦🇺", r:"Asia", cf:"AFC", pop:"26M",  rel:"Christianity (nominal)", u:19, ug:["Chinese Australians","Lebanese Australians","Afghan Australians"], cap:"Canberra", lang:"English", m:"Australia's cities are home to growing diaspora communities from Southeast Asia and the Middle East." },
  { n:"Uzbekistan",   f:"🇺🇿", r:"Asia", cf:"AFC", pop:"36M",  rel:"Islam", u:6,  ug:["Uzbeks","Tajiks","Karakalpaks"], cap:"Tashkent", lang:"Uzbek", m:"Central Asia's most populous nation—Uzbekistan's church faces significant pressure but continues to grow." },
  { n:"Jordan",       f:"🇯🇴", r:"Asia", cf:"AFC", pop:"10M",  rel:"Islam", u:8,  ug:["Jordanian Arabs","Palestinian refugees","Iraqi refugees"], cap:"Amman", lang:"Arabic", m:"Jordan hosts one of the largest refugee populations per capita—a mission field and bridge to the Arab world." },
  { n:"Qatar",        f:"🇶🇦", r:"Asia", cf:"AFC", pop:"2.9M", rel:"Islam", u:5,  ug:["Qatari Arabs","South Asian migrants","Filipino workers"], cap:"Doha", lang:"Arabic", m:"Qatar's migrant worker population (over 85% of residents) includes many unreached South Asians." },

  // Oceania (1)
  { n:"New Zealand",  f:"🇳🇿", r:"Oceania", cf:"OFC", pop:"5.1M", rel:"Christianity (nominal)", u:9, ug:["Māori","Pacific Islander NZ","Chinese New Zealanders"], cap:"Wellington", lang:"English, Māori", m:"New Zealand's Māori people are experiencing revival—and Polynesian churches are sending missionaries across the Pacific." },

  // Additional confirmed qualifiers
  { n:"Bosnia & Herzegovina", f:"🇧🇦", r:"Europe", cf:"UEFA", pop:"3.3M", rel:"Islam/Christianity", u:6, ug:["Bosniak Muslims","Roma Bosnians","Croatian Catholics"], cap:"Sarajevo", lang:"Bosnian, Serbian, Croatian", m:"Bosnia is home to Europe's largest indigenous Muslim community — the Bosniaks — whose spiritual openness has drawn growing missionary attention." },
  { n:"Sweden",           f:"🇸🇪", r:"Europe", cf:"UEFA", pop:"10.5M", rel:"Secular/Christianity", u:14, ug:["Somali Swedes","Iraqi Swedes","Afghan Swedes"], cap:"Stockholm", lang:"Swedish", m:"Sweden is one of Europe's most secular nations, yet its cities hold large diaspora communities from Muslim-majority nations — a mission field within a mission field." },
  { n:"Türkiye",          f:"🇹🇷", r:"Europe", cf:"UEFA", pop:"85M",  rel:"Islam", u:11, ug:["Kurds","Alevi Turks","Arab Turks"], cap:"Ankara", lang:"Turkish", m:"Türkiye bridges Europe and Asia — and its Kurdish minority and Alevi communities represent distinct gospel frontiers within a Muslim-majority nation." },
  { n:"Czechia",          f:"🇨🇿", r:"Europe", cf:"UEFA", pop:"10.9M", rel:"Secular/Atheism", u:8, ug:["Roma Czechs","Vietnamese Czechs","Ukrainian refugees"], cap:"Prague", lang:"Czech", m:"Czechia is one of the world's most atheist nations — a post-communist spiritual vacuum where gospel seeds are being quietly sown." },
  { n:"DR Congo",         f:"🇨🇩", r:"Africa", cf:"CAF", pop:"100M", rel:"Christianity", u:18, ug:["Pygmy communities","Congolese Muslims","Nande"], cap:"Kinshasa", lang:"French, Lingala, Swahili", m:"The DRC is Africa's second-largest nation — home to one of the continent's largest Christian populations, yet dozens of unreached tribal communities in the rainforest interior." },
  { n:"Iraq",             f:"🇮🇶", r:"Asia", cf:"AFC", pop:"42M",  rel:"Islam (Shia/Sunni)", u:12, ug:["Yazidis","Assyrian Christians","Kurds"], cap:"Baghdad", lang:"Arabic, Kurdish", m:"Iraq is home to the ancient Assyrian church and a traumatized Yazidi people — two communities that desperately need the healing only Christ can bring." },
  { n:"Cape Verde",       f:"🇨🇻", r:"Africa", cf:"CAF", pop:"560K", rel:"Christianity", u:3, ug:["Cape Verdean diaspora","West African migrants","Secular urban youth"], cap:"Praia", lang:"Portuguese, Cape Verdean Creole", m:"A small island nation with a large diaspora — Cape Verdean communities in Boston, Lisbon, and Rotterdam represent a diaspora missions opportunity." },
  { n:"Ghana",            f:"🇬🇭", r:"Africa", cf:"CAF", pop:"33M",  rel:"Christianity/Islam", u:8, ug:["Dagomba","Fulani in Ghana","Northern Ghana Muslims"], cap:"Accra", lang:"English, Twi, Akan", m:"Ghana's vibrant church sends missionaries across West Africa — yet its northern Muslim communities remain largely unreached by Ghanaian Christians." },
];

/* ─── PLAYOFF TBD SLOTS ─── */
const TBD_SLOTS = [];

/* ─── SCHEDULE DATA ─── */
// All times are Eastern Time (ET). Schedule based on ESPN/FIFA official fixtures.
// Groups A-L reflect the confirmed December 2025 draw + March 2026 playoff results.
const RAW_SCHEDULE = [
  {
    d:"Jun 11", full:"Thursday, June 11",
    feat:["Mexico","South Africa"],
    dev:"The World Cup opens today at the Estadio Azteca — the same sacred ground where the gospel first took root in the Americas five centuries ago. Every nation on this field is a people for whom Christ died. The tournament isn't merely sport; it's a window into the stunning diversity God is gathering to himself.",
    pray:"Over 95% of South Africans identify as Christian, yet millions in Cape Malay Muslim and Zulu traditionalist communities have never heard a gospel witness in their heart language. Pray with us: • For South African churches to cross the street and engage Muslim neighbors in Cape Town and Durban. • For Mexican believers to see diaspora neighbors — Moroccan, Nigerian, Chinese — as their mission field.",
    matches:[
      {t:"3:00 PM",a:"Mexico",b:"South Africa",g:"A",v:"Estadio Azteca, Mexico City"},
      {t:"10:00 PM",a:"South Korea",b:"Czechia",g:"A",v:"Estadio Akron, Guadalajara"},
    ]
  },
  {
    d:"Jun 12", full:"Friday, June 12",
    feat:["Canada","USA"],
    dev:"Both North American host nations open today. Canada's cities — Toronto, Vancouver, Montreal — are among the world's most diverse, overflowing with diaspora from every unreached region. The United States hosts millions of immigrants from least-reached nations, the largest unreached mission field without a passport.",
    pray:"God is bringing the nations to North America. The question is whether the church will notice. Pray with us: • For Canadian and American believers to see their Muslim, Hindu, and Buddhist neighbors as a divine appointment rather than a cultural inconvenience. • For immigrant churches in both nations to be equipped and empowered for cross-cultural witness.",
    matches:[
      {t:"3:00 PM",a:"Canada",b:"Bosnia & Herzegovina",g:"B",v:"BMO Field, Toronto"},
      {t:"9:00 PM",a:"USA",b:"Paraguay",g:"D",v:"SoFi Stadium, Inglewood"},
    ]
  },
  {
    d:"Jun 13", full:"Saturday, June 13",
    feat:["Brazil","Morocco"],
    dev:"Brazil sends more Protestant missionaries than any other nation in Latin America. Morocco is 99.9% Muslim — yet a growing underground church testifies to transformation no government can stop. Today these two worlds collide on the pitch. The gospel is already at work in Morocco; Brazilian churches are among those sending workers there.",
    pray:"The Amazigh (Berber) people of Morocco have waited centuries for the gospel in their own language and culture. Pray with us: • For Moroccan believers to have courage and protection as they share faith with family and neighbors. • For Brazilian mission agencies to sustain long-term workers in North Africa.",
    matches:[
      {t:"3:00 PM",a:"Qatar",b:"Switzerland",g:"B",v:"Levi's Stadium, Santa Clara"},
      {t:"6:00 PM",a:"Brazil",b:"Morocco",g:"C",v:"MetLife Stadium, East Rutherford"},
      {t:"9:00 PM",a:"Haiti",b:"Scotland",g:"C",v:"Gillette Stadium, Foxborough"},
      {t:"12:00 AM",a:"Australia",b:"Türkiye",g:"D",v:"BC Place, Vancouver"},
    ]
  },
  {
    d:"Jun 14", full:"Sunday, June 14",
    feat:["Germany","Netherlands"],
    dev:"Two post-Christian European giants take the field. Germany and the Netherlands were once missionary-sending nations of the Reformation era — now they are mission fields themselves, with Turkish, Moroccan, and Somali diaspora communities living beside churches that have largely forgotten their missionary calling.",
    pray:"Europe's mission challenge is as urgent as any in the Global South. Pray with us: • For Turkish churches in Berlin and Frankfurt to be bold witnesses among Germany's 4 million Turkish-background residents. • For Dutch churches to engage the growing Moroccan Muslim community in Amsterdam and Rotterdam.",
    matches:[
      {t:"1:00 PM",a:"Germany",b:"Curaçao",g:"E",v:"BMO Field, Toronto"},
      {t:"4:00 PM",a:"Netherlands",b:"Japan",g:"F",v:"AT&T Stadium, Arlington"},
      {t:"7:00 PM",a:"Côte d'Ivoire",b:"Ecuador",g:"E",v:"Lincoln Financial Field, Philadelphia"},
      {t:"10:00 PM",a:"Sweden",b:"Tunisia",g:"F",v:"Estadio Akron, Guadalajara"},
    ]
  },
  {
    d:"Jun 15", full:"Monday, June 15",
    feat:["Iran","Saudi Arabia"],
    dev:"Two of the most spiritually significant Muslim-majority nations play today. Iran is witnessing one of the fastest church growth movements on earth — a quiet revolution happening underground, beyond the reach of any government. Saudi Arabia — the birthplace of Islam — is seeing remarkable numbers of Saudis quietly following Jesus. God is on the move where human strategies could never reach.",
    pray:"The Spirit of God is moving in Iran and across the Arabian Peninsula in ways that would have seemed impossible a generation ago. Pray with us: • For the underground church in Iran to remain protected and multiplying, especially among younger Iranians hungry for truth. • For Saudi seekers studying or working in North America during this World Cup to find a believing friend.",
    matches:[
      {t:"1:00 PM",a:"Spain",b:"Cape Verde",g:"H",v:"Mercedes-Benz Stadium, Atlanta"},
      {t:"6:00 PM",a:"Belgium",b:"Egypt",g:"G",v:"Lumen Field, Seattle"},
      {t:"6:00 PM",a:"Saudi Arabia",b:"Uruguay",g:"H",v:"Hard Rock Stadium, Miami"},
      {t:"12:00 AM",a:"Iran",b:"New Zealand",g:"G",v:"SoFi Stadium, Inglewood"},
    ]
  },
  {
    d:"Jun 16", full:"Tuesday, June 16",
    feat:["France","Argentina"],
    dev:"France hosts Europe's largest Muslim population — millions of Algerian and Tunisian origin, many living in suburban communities largely isolated from the church. Argentina carries a Buenos Aires Jewish community of 200,000 — one of Latin America's most unreached groups. Today both nations play, reminding us that the mission field is not always overseas.",
    pray:"God placed the nations next door to the church — the question is whether the church has eyes to see. Pray with us: • For French churches to mobilize missionally toward banlieue communities where Islam is the primary spiritual framework. • For Argentine believers to engage the Buenos Aires Jewish community with patient, gospel-centered friendship.",
    matches:[
      {t:"3:00 PM",a:"France",b:"Senegal",g:"I",v:"MetLife Stadium, East Rutherford"},
      {t:"6:00 PM",a:"Iraq",b:"Norway",g:"I",v:"Gillette Stadium, Foxborough"},
      {t:"9:00 PM",a:"Argentina",b:"Algeria",g:"J",v:"Arrowhead Stadium, Kansas City"},
      {t:"12:00 AM",a:"Austria",b:"Jordan",g:"J",v:"Levi's Stadium, Santa Clara"},
    ]
  },
  {
    d:"Jun 17", full:"Wednesday, June 17",
    feat:["Portugal","DR Congo"],
    dev:"Portugal — the once-great colonial power that carried Catholicism to Africa and Asia — now faces a post-Christian reckoning at home. DR Congo carries one of the world's largest Christian populations, yet also dozens of unreached tribal peoples in the deep rainforest. Former sender and vibrant receiver stand together today on the same pitch.",
    pray:"The global church is shifting south and east — the majority of the world's Christians now live in Africa, Asia, and Latin America. Pray with us: • For Congolese churches to be equipped and funded to reach unreached tribal communities in their own rainforest backyard. • For Portuguese churches to rediscover the missionary fire of their forebears and engage Muslim immigrants in Lisbon.",
    matches:[
      {t:"1:00 PM",a:"Portugal",b:"DR Congo",g:"K",v:"NRG Stadium, Houston"},
      {t:"4:00 PM",a:"England",b:"Ghana",g:"L",v:"AT&T Stadium, Arlington"},
      {t:"7:00 PM",a:"Colombia",b:"Uzbekistan",g:"K",v:"Estadio Azteca, Mexico City"},
      {t:"10:00 PM",a:"Croatia",b:"Panama",g:"L",v:"Levi's Stadium, Santa Clara"},
    ]
  },
  {
    d:"Jun 18", full:"Thursday, June 18",
    feat:["Jordan","Iraq"],
    dev:"Two nations from the ancient biblical world — Jordan and Iraq, the lands of Abraham, Daniel, and the early church. Jordan hosts more refugees per capita than nearly any nation on earth. Iraq is home to the Yazidis, a persecuted ancient people, and to Assyrian Christians, whose ancestors heard the gospel before Rome did. These are not distant mission fields; they are ancient homelands of the faith.",
    pray:"The people of Iraq and Jordan have known suffering that most of us cannot imagine — and yet the church in both nations endures and grows. Pray with us: • For the Yazidi people of Iraq — survivors of genocide — to find healing and hope in Jesus Christ. • For the Jordanian church to be a generous, welcoming presence to the millions of Syrian and Iraqi refugees in their midst.",
    matches:[
      {t:"12:00 PM",a:"Czechia",b:"South Africa",g:"A",v:"Mercedes-Benz Stadium, Atlanta"},
      {t:"3:00 PM",a:"Switzerland",b:"Bosnia & Herzegovina",g:"B",v:"SoFi Stadium, Inglewood"},
      {t:"6:00 PM",a:"Canada",b:"Qatar",g:"B",v:"BC Place, Vancouver"},
      {t:"11:00 PM",a:"Mexico",b:"South Korea",g:"A",v:"Estadio Akron, Guadalajara"},
    ]
  },
  {
    d:"Jun 19", full:"Friday, June 19",
    feat:["Nigeria","USA"],
    dev:"Juneteenth — America's celebration of freedom. Today Nigeria, home to Africa's most unreached people groups, and the United States, home to the world's most unreached diaspora, both play. The Hausa-Fulani of Nigeria number 30 million. The Muslim communities of Detroit, Minneapolis, and Houston number in the hundreds of thousands. Freedom — the kind that transforms nations — is still needed.",
    pray:"The American church has a staggering mission opportunity among immigrants and diaspora communities in its own cities. Pray with us: • For Nigerian church leaders on the frontier with Hausa-Fulani communities in northern Nigeria to be protected and supplied. • For American believers to be mobilized toward Somali, Yemeni, and Afghan neighbors in their own cities.",
    matches:[
      {t:"3:00 PM",a:"USA",b:"Australia",g:"D",v:"Lumen Field, Seattle"},
      {t:"6:00 PM",a:"Scotland",b:"Morocco",g:"C",v:"Gillette Stadium, Foxborough"},
      {t:"9:00 PM",a:"Brazil",b:"Haiti",g:"C",v:"Lincoln Financial Field, Philadelphia"},
      {t:"12:00 AM",a:"Türkiye",b:"Paraguay",g:"D",v:"Levi's Stadium, Santa Clara"},
    ]
  },
  {
    d:"Jun 20", full:"Saturday, June 20",
    feat:["Egypt","Sweden"],
    dev:"Egypt holds the ancient Coptic Church — one of Christianity's oldest traditions, tracing its roots to the apostle Mark. Yet 90% of Egyptians remain Muslim and largely unreached by their Christian neighbors. Sweden, meanwhile, is one of Europe's most secular nations — yet its cities have become home to tens of thousands of Somali, Iraqi, and Afghan refugees, many of whom have encountered the gospel for the first time in Scandinavia.",
    pray:"God is sovereign over migration — he is moving the unreached to where the church already is. Pray with us: • For Coptic Christians in Egypt to be a missional church to their Muslim neighbors, not merely a cultural minority. • For Swedish churches to see their refugee neighbors as an answer to prayer, not a burden to bear.",
    matches:[
      {t:"1:00 PM",a:"Netherlands",b:"Sweden",g:"F",v:"NRG Stadium, Houston"},
      {t:"4:00 PM",a:"Germany",b:"Côte d'Ivoire",g:"E",v:"BMO Field, Toronto"},
      {t:"8:00 PM",a:"Ecuador",b:"Curaçao",g:"E",v:"Arrowhead Stadium, Kansas City"},
      {t:"10:00 PM",a:"Tunisia",b:"Japan",g:"F",v:"Estadio Akron, Guadalajara"},
    ]
  },
  {
    d:"Jun 21", full:"Sunday, June 21",
    feat:["Bosnia & Herzegovina","Türkiye"],
    dev:"Bosnia and Herzegovina carries Europe's largest indigenous Muslim community — the Bosniaks — shaped by centuries of Ottoman history and wartime trauma. Türkiye bridges two continents, and its Kurdish minority and Alevi communities represent some of the most overlooked gospel frontiers in the world. Both nations play today, asking a quiet question: who is praying for these people?",
    pray:"Europe's Muslim communities are often invisible to the church — living nearby but worlds apart spiritually. Pray with us: • For workers to be raised up among the Bosniaks — a people with deep spiritual hunger and limited gospel access. • For Kurdish believers in Türkiye to be protected and to multiply disciples among their 15 million unreached kin.",
    matches:[
      {t:"1:00 PM",a:"Spain",b:"Saudi Arabia",g:"H",v:"Hard Rock Stadium, Miami"},
      {t:"4:00 PM",a:"Belgium",b:"Iran",g:"G",v:"Lumen Field, Seattle"},
      {t:"6:00 PM",a:"Uruguay",b:"Cape Verde",g:"H",v:"NRG Stadium, Houston"},
      {t:"9:00 PM",a:"New Zealand",b:"Egypt",g:"G",v:"SoFi Stadium, Inglewood"},
    ]
  },
  {
    d:"Jun 22", full:"Monday, June 22",
    feat:["Argentina","Algeria"],
    dev:"Algeria and Argentina — North Africa and South America — face off today. Algeria's Kabyle Berber church is one of Africa's most remarkable revival stories; a people group almost entirely Muslim just twenty years ago is now home to hundreds of thousands of believers. Argentina's Buenos Aires holds one of Latin America's largest Jewish populations. Two mission frontiers. Two stories of God's faithfulness.",
    pray:"No people group is beyond the reach of the gospel — Algeria's church explosion proves it. Pray with us: • For Kabyle Berber church leaders in Algeria who face increasing government pressure to have wisdom, protection, and courage. • For Argentine believers to develop long-term, patient gospel friendships within the Jewish community in Buenos Aires.",
    matches:[
      {t:"1:00 PM",a:"Argentina",b:"Austria",g:"J",v:"AT&T Stadium, Arlington"},
      {t:"4:00 PM",a:"Portugal",b:"Uzbekistan",g:"K",v:"NRG Stadium, Houston"},
      {t:"9:00 PM",a:"France",b:"Iraq",g:"I",v:"Gillette Stadium, Foxborough"},
      {t:"11:00 PM",a:"Jordan",b:"Algeria",g:"J",v:"Levi's Stadium, Santa Clara"},
    ]
  },
  {
    d:"Jun 23", full:"Tuesday, June 23",
    feat:["Norway","Czechia"],
    dev:"Norway — once the land of Viking missionaries — is now one of Europe's most secular post-Christian nations, yet its generosity toward refugees has created a multi-cultural mission field in Oslo and Bergen. Czechia is statistically the most atheist nation in Europe — a place where the spiritual vacuum left by communism has never been filled. The Reformation's heartland needs a new Reformation.",
    pray:"Post-communist spiritual emptiness is one of the most urgent yet overlooked mission frontiers in the world. Pray with us: • For Czech evangelical churches to be equipped with compelling, thoughtful gospel engagement for their deeply skeptical secular neighbors. • For Norwegian churches to see their Afghan, Somali, and Iraqi neighbors as the answer to the Great Commission — brought to their doorstep.",
    matches:[
      {t:"1:00 PM",a:"Portugal",b:"Colombia",g:"K",v:"Hard Rock Stadium, Miami"},
      {t:"1:00 PM",a:"DR Congo",b:"Uzbekistan",g:"K",v:"Mercedes-Benz Stadium, Atlanta"},
      {t:"6:00 PM",a:"Canada",b:"Switzerland",g:"B",v:"BC Place, Vancouver"},
      {t:"6:00 PM",a:"Bosnia & Herzegovina",b:"Qatar",g:"B",v:"SoFi Stadium, Inglewood"},
    ]
  },
  {
    d:"Jun 24", full:"Wednesday, June 24",
    feat:["Haiti","Japan"],
    dev:"Haiti and Japan — two nations at opposite ends of the earth and opposite ends of prosperity. Haiti, scarred by poverty, earthquake, and political chaos, yet overflowing with spiritual vitality and a vibrant church. Japan, prosperous and stable, yet one of the world's hardest mission fields — less than 1% Christian after 150 years of dedicated effort. God is working in unexpected ways in both.",
    pray:"The Holy Spirit moves where the church is present and where it is not — and no nation is beyond his reach. Pray with us: • For the church in Haiti to be a source of healing and hope in a nation that desperately needs both — and for global partners to walk alongside them. • For breakthroughs in Japanese family units, where one family member coming to faith can face enormous pressure to recant.",
    matches:[
      {t:"9:00 PM",a:"Czechia",b:"Mexico",g:"A",v:"Estadio Azteca, Mexico City"},
      {t:"9:00 PM",a:"South Africa",b:"South Korea",g:"A",v:"Estadio BBVA, Monterrey"},
      {t:"3:00 PM",a:"England",b:"Croatia",g:"L",v:"AT&T Stadium, Arlington"},
      {t:"3:00 PM",a:"Ghana",b:"Panama",g:"L",v:"Lincoln Financial Field, Philadelphia"},
    ]
  },
  {
    d:"Jun 25", full:"Thursday, June 25",
    feat:["Senegal","Nigeria"],
    dev:"West Africa's two spiritual giants play today. Senegal is over 95% Muslim — home to Sufi brotherhoods with deep spiritual hunger and a tradition of mystical seeking that the gospel is beginning to meet. Nigeria carries Africa's most unreached people groups. Together these two nations represent one of the greatest unfinished mission tasks on the continent.",
    pray:"The church in West Africa is growing — yet the Muslim-majority north remains a great spiritual frontier. Pray with us: • For the Wolof people of Senegal — the heart of Sufi Islam in West Africa — to encounter Jesus in dreams, through workers, and in community. • For Nigerian church planters crossing north into Hausa-Fulani territory to be sustained, protected, and fruitful.",
    matches:[
      {t:"3:00 PM",a:"France",b:"Norway",g:"I",v:"Gillette Stadium, Foxborough"},
      {t:"3:00 PM",a:"Senegal",b:"Iraq",g:"I",v:"BMO Field, Toronto"},
      {t:"8:00 PM",a:"Cape Verde",b:"Saudi Arabia",g:"H",v:"NRG Stadium, Houston"},
      {t:"8:00 PM",a:"Uruguay",b:"Spain",g:"H",v:"Estadio Akron, Guadalajara"},
    ]
  },
  {
    d:"Jun 26", full:"Friday, June 26",
    feat:["England","Germany"],
    dev:"Two European giants close out the group stage. England's squad reflects London's incredible diversity — players tracing roots to Nigeria, Jamaica, Somalia, and beyond. Germany's team is similarly diverse, carrying players from Turkish and North African backgrounds. The nations are not just in the stands; they are on the pitch. This is the world God loves — and the world the church is called to reach.",
    pray:"Europe's mission challenge is as urgent as the Global South's — and in some ways more complex. Pray with us: • For Turkish-background believers in Germany to be empowered as missionaries to their own community — the most effective witnesses for the 4 million Turkish-heritage people in Germany. • For British churches to engage the British Pakistani, Bangladeshi, and Somali communities who live in their cities but rarely in their congregations.",
    matches:[
      {t:"11:00 PM",a:"Egypt",b:"Iran",g:"G",v:"Lumen Field, Seattle"},
      {t:"11:00 PM",a:"New Zealand",b:"Belgium",g:"G",v:"BC Place, Vancouver"},
      {t:"5:00 PM",a:"England",b:"Panama",g:"L",v:"MetLife Stadium, East Rutherford"},
      {t:"5:00 PM",a:"Croatia",b:"Ghana",g:"L",v:"Lincoln Financial Field, Philadelphia"},
    ]
  },
  {
    d:"Jun 27", full:"Saturday, June 27",
    feat:["All Nations"],
    dev:"The final day. Ten simultaneous matches across North America. Nations from every corner of the earth. We have prayed our way through 48 nations — each one a people loved by God, each one a field for the gospel. The group stage ends today, but the mission doesn't. As teams advance and others go home, let every nation that played here have left knowing that someone, somewhere was praying for them.",
    pray:"Seventeen days of prayer for the nations — but the work is far from done. Pray with us: • For every person from an unreached nation who attended this World Cup to have encountered a believer, a conversation, or a seed of the gospel that will bear fruit. • For the global church to be mobilized, sustained, and sent until every people group has heard the name of Jesus.",
    matches:[
      {t:"10:00 AM",a:"Jordan",b:"Argentina",g:"J",v:"AT&T Stadium, Arlington"},
      {t:"10:00 AM",a:"Algeria",b:"Austria",g:"J",v:"Arrowhead Stadium, Kansas City"},
      {t:"10:00 AM",a:"Colombia",b:"Portugal",g:"K",v:"Hard Rock Stadium, Miami"},
      {t:"10:00 AM",a:"DR Congo",b:"Uzbekistan",g:"K",v:"Mercedes-Benz Stadium, Atlanta"},
      {t:"5:00 PM",a:"Panama",b:"England",g:"L",v:"MetLife Stadium, East Rutherford"},
      {t:"5:00 PM",a:"Ghana",b:"Croatia",g:"L",v:"Lincoln Financial Field, Philadelphia"},
      {t:"9:00 PM",a:"Netherlands",b:"Tunisia",g:"F",v:"NRG Stadium, Houston"},
      {t:"9:00 PM",a:"Japan",b:"Sweden",g:"F",v:"AT&T Stadium, Arlington"},
      {t:"10:00 PM",a:"Germany",b:"Ecuador",g:"E",v:"BMO Field, Toronto"},
      {t:"10:00 PM",a:"Côte d'Ivoire",b:"Curaçao",g:"E",v:"Arrowhead Stadium, Kansas City"},
    ]
  },
];

const REGIONS = ["All","Americas","Europe","Africa","Asia","Oceania"];

function ugBadgeStyle(u) {
  if (u >= 20) return { background: C.orange, color: "#fff" };
  if (u >= 10) return { background: C.blueJeans, color: "#fff" };
  return { background: C.blue, color: "#fff" };
}

/* ─── HOME SCREEN BANNER ─── */
function HomeScreenBanner({ onDismiss }) {
  const [platform, setPlatform] = useState("ios");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/android/i.test(ua)) setPlatform("android");
    else setPlatform("ios");
  }, []);
  return (
    <>
      {/* Compact banner strip */}
      <div style={{
        background: C.orange,
        color: "#fff",
        padding: "11px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>📲</span>
        <button onClick={() => setShowModal(true)} style={{
          flex: 1, background: "none", border: "none", color: "#fff",
          fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14,
          cursor: "pointer", textAlign: "left", padding: 0,
        }}>
          Add to Your Home Screen
          <span style={{ fontWeight: 400, fontSize: 13, opacity: 0.85, marginLeft: 6 }}>— tap to learn how</span>
        </button>
        <button onClick={onDismiss} style={{
          background: "none", border: "none", color: "#fff",
          fontSize: 20, cursor: "pointer", flexShrink: 0,
          padding: "0 2px", lineHeight: 1, opacity: 0.85,
        }} aria-label="Dismiss">✕</button>
      </div>

      {/* Instructions modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(27,45,58,0.7)",
          zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.white, borderRadius: 20, padding: 28, maxWidth: 380, width: "100%",
          }}>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>📲</div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 20, color: C.indigo, textAlign: "center", marginBottom: 16 }}>
              Add to Home Screen
            </div>
            {platform === "ios" ? (
              <div>
                {[
                  { step: "1", text: 'Tap the Share button ⬆️ at the bottom of Safari' },
                  { step: "2", text: 'Scroll down and tap "Add to Home Screen"' },
                  { step: "3", text: 'Tap "Add" — done! Open it like any app.' },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                    <div style={{ background: C.orange, color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{s.step}</div>
                    <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 16, color: C.text, lineHeight: 1.5, paddingTop: 4 }}>{s.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {[
                  { step: "1", text: 'Tap the three dots ⋮ in the top-right corner of Chrome' },
                  { step: "2", text: 'Tap "Add to Home Screen"' },
                  { step: "3", text: 'Tap "Add" — done! Open it like any app.' },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                    <div style={{ background: C.orange, color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{s.step}</div>
                    <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 16, color: C.text, lineHeight: 1.5, paddingTop: 4 }}>{s.text}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowModal(false)} style={{
              display: "block", width: "100%", marginTop: 8,
              background: C.indigo, border: "none", borderRadius: 12,
              padding: 16, fontFamily: "Montserrat, sans-serif", fontWeight: 700,
              fontSize: 16, color: "#fff", cursor: "pointer",
            }}>Got it!</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── NATION MODAL ─── */
function NationModal({ nation, onClose }) {
  if (!nation) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(27,45,58,0.7)",
      zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.white,
        borderRadius: "20px 20px 0 0",
        width: "100%",
        maxWidth: 520,
        maxHeight: "88vh",
        overflowY: "auto",
        padding: "0 0 40px 0",
      }}>
        {/* Header */}
        <div style={{
          background: C.indigo,
          borderRadius: "20px 20px 0 0",
          padding: "20px 20px 20px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}>
          <span style={{ fontSize: 52 }}>{nation.f}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", lineHeight: 1.2 }}>
              {nation.n}
            </div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
              {nation.r} · {nation.cf}
            </div>
          </div>
          {!nation.contenders && (
            <div style={{ ...ugBadgeStyle(nation.u), borderRadius: 20, padding: "6px 12px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{nation.u}</div>
              <div style={{ fontSize: 10, letterSpacing: 0.5 }}>UPGS</div>
            </div>
          )}
        </div>

        <div style={{ padding: "20px 20px 0 20px" }}>
          {nation.contenders ? (
            <div style={{ background: C.brightGray, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: C.indigo, marginBottom: 6 }}>PLAYOFF CONTENDERS</div>
              <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 15, color: C.text }}>{nation.contenders}</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: C.blue, marginTop: 8 }}>Results expected April 1, 2026</div>
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Capital", value: nation.cap },
                  { label: "Population", value: nation.pop },
                  { label: "Religion", value: nation.rel },
                  { label: "Languages", value: nation.lang },
                ].map(item => (
                  <div key={item.label} style={{ background: C.brightGray, borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 10, color: C.blue, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: C.text, fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Unreached Groups */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 12, color: C.blue, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Top Unreached People Groups</div>
                {nation.ug.map((g, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.orange, flexShrink: 0 }} />
                    <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 15, color: C.text }}>{g}</div>
                  </div>
                ))}
              </div>

              {/* Mission Insight */}
              <div style={{ background: `${C.indigo}10`, borderLeft: `4px solid ${C.indigo}`, borderRadius: "0 10px 10px 0", padding: 14, marginBottom: 16 }}>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 11, color: C.indigo, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Mission Insight</div>
                <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 15, lineHeight: 1.6, color: C.text, fontStyle: "italic" }}>{nation.m}</div>
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: 10 }}>
                <a href={`https://joshuaproject.net/countries/${nation.n.replace(/\s/g,"-")}`} target="_blank" rel="noreferrer" style={{
                  flex: 1, background: C.indigo, color: "#fff",
                  borderRadius: 10, padding: "12px 8px", textAlign: "center",
                  fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                  textDecoration: "none", display: "block",
                }}>Joshua Project</a>
                <a href={`https://operationworld.org/locations/`} target="_blank" rel="noreferrer" style={{
                  flex: 1, background: C.orange, color: "#fff",
                  borderRadius: 10, padding: "12px 8px", textAlign: "center",
                  fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13,
                  textDecoration: "none", display: "block",
                }}>Operation World</a>
              </div>
            </>
          )}
        </div>
        <button onClick={onClose} style={{
          display: "block", width: "calc(100% - 40px)", margin: "20px 20px 0 20px",
          background: C.brightGray, border: "none",
          borderRadius: 12, padding: 16,
          fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16,
          color: C.indigo, cursor: "pointer",
        }}>Close</button>
      </div>
    </div>
  );
}

/* ─── DAILY DIGEST TAB ─── */
function DailyDigest() {
  const today = new Date();
  const startOfTournament = new Date("2026-06-11");
  let defaultDay = 0;
  if (today >= startOfTournament) {
    const diff = Math.floor((today - startOfTournament) / 86400000);
    defaultDay = Math.min(diff, RAW_SCHEDULE.length - 1);
  }
  const [dayIdx, setDayIdx] = useState(defaultDay);
  const [selectedNation, setSelectedNation] = useState(null);
  const day = RAW_SCHEDULE[dayIdx];
  const [showAllMatches, setShowAllMatches] = useState(false);

  const matchesToShow = showAllMatches ? day.matches : day.matches.slice(0, 3);

  return (
    <div style={{ paddingBottom: 100 }}>
      <NationModal nation={selectedNation} onClose={() => setSelectedNation(null)} />

      {/* Date heading — clean, simple, no calendar clutter */}
      <div style={{ background: C.indigo, padding: "14px 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => { if (dayIdx > 0) { setDayIdx(dayIdx - 1); setShowAllMatches(false); } }} disabled={dayIdx === 0} style={{
          background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
          borderRadius: 10, padding: "10px 18px", fontSize: 18, cursor: "pointer",
          opacity: dayIdx === 0 ? 0.3 : 1, fontFamily: "Montserrat, sans-serif", fontWeight: 700,
        }}>← Prev</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 17, color: "#fff" }}>{day.full}</div>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Day {dayIdx + 1} of 17</div>
        </div>
        <button onClick={() => { if (dayIdx < RAW_SCHEDULE.length - 1) { setDayIdx(dayIdx + 1); setShowAllMatches(false); } }} disabled={dayIdx === RAW_SCHEDULE.length - 1} style={{
          background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
          borderRadius: 10, padding: "10px 18px", fontSize: 18, cursor: "pointer",
          opacity: dayIdx === RAW_SCHEDULE.length - 1 ? 0.3 : 1, fontFamily: "Montserrat, sans-serif", fontWeight: 700,
        }}>Next →</button>
      </div>

      <div style={{ padding: "16px 16px 0" }}>

        {/* Devotional */}
        <div style={{ background: C.white, borderRadius: 16, padding: 18, marginBottom: 14, border: `1px solid ${C.blue}30` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>📖</span>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16, color: C.indigo }}>Today's Devotional</div>
          </div>
          <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 17, lineHeight: 1.75, color: C.text }}>
            {day.dev}
          </div>
        </div>

        {/* Prayer */}
        <div style={{ background: `${C.blueJeans}15`, borderRadius: 16, padding: 18, marginBottom: 14, border: `2px solid ${C.blueJeans}40` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>🙏</span>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16, color: C.blueJeans }}>Prayer Focus</div>
          </div>
          <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 17, lineHeight: 1.75, color: C.text }}>
            {day.pray}
          </div>
        </div>

        {/* Matches */}
        <div style={{ background: C.white, borderRadius: 16, padding: 18, marginBottom: 14, border: `1px solid ${C.blue}30` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>⚽</span>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16, color: C.indigo }}>Today's Matches</div>
          </div>
          {matchesToShow.map((m, i) => {
            const teamA = [...RAW_COUNTRIES, ...TBD_SLOTS].find(c => c.n === m.a);
            const teamB = [...RAW_COUNTRIES, ...TBD_SLOTS].find(c => c.n === m.b);
            return (
              <div key={i} style={{ marginBottom: i < matchesToShow.length - 1 ? 14 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: C.orange }}>{m.t} ET</div>
                  <div style={{ background: C.brightGray, borderRadius: 6, padding: "3px 8px", fontFamily: "Montserrat, sans-serif", fontSize: 11, fontWeight: 700, color: C.blue }}>Group {m.g}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <button onClick={() => teamA && setSelectedNation(teamA)} style={{
                    flex: 1, background: C.brightGray, border: "none", borderRadius: "10px 0 0 10px",
                    padding: "12px 10px", cursor: "pointer", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 26 }}>{teamA?.f || "🏆"}</div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: C.indigo, marginTop: 4 }}>{m.a}</div>
                  </button>
                  <div style={{ background: C.orange, color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 14, padding: "16px 10px", flexShrink: 0 }}>VS</div>
                  <button onClick={() => teamB && setSelectedNation(teamB)} style={{
                    flex: 1, background: C.brightGray, border: "none", borderRadius: "0 10px 10px 0",
                    padding: "12px 10px", cursor: "pointer", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 26 }}>{teamB?.f || "🏆"}</div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: C.indigo, marginTop: 4 }}>{m.b}</div>
                  </button>
                </div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: C.blue, marginTop: 5, textAlign: "center" }}>📍 {m.v}</div>
              </div>
            );
          })}
          {day.matches.length > 3 && !showAllMatches && (
            <button onClick={() => setShowAllMatches(true)} style={{
              display: "block", width: "100%", marginTop: 14,
              background: "none", border: `2px solid ${C.blue}40`, borderRadius: 10,
              padding: 12, fontFamily: "Montserrat, sans-serif", fontWeight: 700,
              fontSize: 14, color: C.blue, cursor: "pointer",
            }}>Show {day.matches.length - 3} More Matches ▾</button>
          )}
        </div>

        {/* Featured Nations */}
        {day.feat && day.feat[0] !== "All Nations" && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 15, color: C.indigo, marginBottom: 10 }}>
              ⭐ Featured Nations Today
            </div>
            {day.feat.map(fn => {
              const nation = RAW_COUNTRIES.find(c => c.n === fn);
              if (!nation) return null;
              return (
                <button key={fn} onClick={() => setSelectedNation(nation)} style={{
                  display: "flex", alignItems: "center", gap: 14, width: "100%",
                  background: C.white, border: `2px solid ${C.orange}`,
                  borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                  textAlign: "left", marginBottom: 10,
                }}>
                  <span style={{ fontSize: 38 }}>{nation.f}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 17, color: C.indigo }}>{nation.n}</div>
                    <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 14, color: C.text, marginTop: 3, lineHeight: 1.4 }}>{nation.m.substring(0, 70)}…</div>
                  </div>
                  <div style={{ ...ugBadgeStyle(nation.u), borderRadius: 10, padding: "6px 10px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 12, textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{nation.u}</div>
                    <div style={{ fontSize: 10 }}>UPGs</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Calendar — Jump to Any Day */}
        <div style={{ background: C.white, borderRadius: 16, padding: "16px 0 16px", marginBottom: 14, border: `1px solid ${C.blue}30` }}>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 14, color: C.indigo, padding: "0 16px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <span>📅</span> Jump to Any Day
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
            <div style={{ display: "flex", gap: 8, padding: "0 16px", width: "max-content" }}>
              {RAW_SCHEDULE.map((s, i) => (
                <button key={i} onClick={() => { setDayIdx(i); setShowAllMatches(false); window.scrollTo(0,0); }} style={{
                  background: i === dayIdx ? C.indigo : C.brightGray,
                  color: i === dayIdx ? "#fff" : C.indigo,
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  minWidth: 64,
                }}>{s.d}</button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── ALL NATIONS TAB ─── */
function AllNations() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [selectedNation, setSelectedNation] = useState(null);

  const filtered = RAW_COUNTRIES.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.n.toLowerCase().includes(q) || c.ug.some(g => g.toLowerCase().includes(q));
    const matchRegion = region === "All" || c.r === region;
    return matchSearch && matchRegion;
  });

  return (
    <div style={{ paddingBottom: 100 }}>
      <NationModal nation={selectedNation} onClose={() => setSelectedNation(null)} />

      {/* Search & Filter */}
      <div style={{ background: C.indigo, padding: "14px 16px 16px" }}>
        <input
          type="text"
          placeholder="🔍  Search countries or people groups…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "14px 16px",
            fontFamily: "Montserrat, sans-serif", fontSize: 16,
            borderRadius: 12, border: "none",
            background: "rgba(255,255,255,0.95)",
            color: C.text,
            outline: "none",
            marginBottom: 10,
          }}
        />
        <div style={{ display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", paddingBottom: 2 }}>
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)} style={{
              background: r === region ? C.orange : "rgba(255,255,255,0.2)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 16px",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ padding: "12px 16px 6px", fontFamily: "Montserrat, sans-serif", fontSize: 13, color: C.blue, fontWeight: 600 }}>
        {filtered.length} nation{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Nation Cards */}
      <div style={{ padding: "0 16px" }}>
        {filtered.map((c, i) => (
          <button key={c.n} onClick={() => setSelectedNation(c)} style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%",
            background: C.white, border: `1px solid ${C.blue}25`,
            borderRadius: 14, padding: "14px 16px", cursor: "pointer",
            textAlign: "left", marginBottom: 10,
            boxShadow: "0 2px 8px rgba(27,69,106,0.07)",
          }}>
            <span style={{ fontSize: 38, flexShrink: 0 }}>{c.f}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 17, color: C.indigo }}>{c.n}</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: C.blue, marginTop: 2 }}>{c.r} · {c.cf}</div>
              <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 13, color: C.text, marginTop: 4, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {c.ug.join(" · ")}
              </div>
            </div>
            <div style={{ ...ugBadgeStyle(c.u), borderRadius: 10, padding: "8px 10px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 12, textAlign: "center", flexShrink: 0, minWidth: 44 }}>
              <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{c.u}</div>
              <div style={{ fontSize: 10, marginTop: 2 }}>UPGs</div>
            </div>
          </button>
        ))}

        {/* TBD Slots */}
        {(region === "All" || region === "Europe") && !search && (
          <div style={{ marginTop: 6 }}>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: C.blue, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>⏳ Playoff Slots — Results April 1</div>
            {TBD_SLOTS.filter(s => region === "All" || s.r === region).map((s, i) => (
              <button key={i} onClick={() => setSelectedNation(s)} style={{
                display: "flex", alignItems: "center", gap: 14, width: "100%",
                background: "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(62,103,172,0.06) 6px, rgba(62,103,172,0.06) 12px)",
                border: `1px dashed ${C.blue}60`,
                borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                textAlign: "left", marginBottom: 10,
              }}>
                <span style={{ fontSize: 38 }}>{s.f}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16, color: C.indigo }}>{s.n}</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: 13, color: C.blue, marginTop: 3 }}>{s.contenders}</div>
                </div>
                <div style={{ background: C.brightGray, borderRadius: 10, padding: "8px 10px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 11, color: C.blue, textAlign: "center", flexShrink: 0 }}>TBD</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function App() {
  const [tab, setTab] = useState("digest");
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      <style>{FONTS}</style>
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background: ${C.brightGray}; }
        ::-webkit-scrollbar { display: none; }
        button { -webkit-appearance: none; }
        input { -webkit-appearance: none; }
      `}</style>

      <div style={{
        maxWidth: 520,
        margin: "0 auto",
        minHeight: "100vh",
        background: C.brightGray,
        display: "flex",
        flexDirection: "column",
      }}>

        {/* App Header */}
        <div style={{
          background: C.indigo,
          padding: "env(safe-area-inset-top, 12px) 20px 0",
        }}>
          <div style={{ padding: "14px 0 16px" }}>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              Global Gates
            </div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 22, color: C.white, lineHeight: 1.2 }}>
              The Nations Are Coming
            </div>
            <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 5, fontStyle: "italic" }}>
              2026 FIFA World Cup Missions Resource
            </div>
          </div>
        </div>

        {/* Home Screen Banner */}
        {showBanner && <HomeScreenBanner onDismiss={() => setShowBanner(false)} />}

        {/* Tab Bar */}
        <div style={{ background: C.indigo, padding: "0 16px 0" }}>
          <div style={{ display: "flex", borderBottom: `2px solid rgba(255,255,255,0.15)` }}>
            {[
              { id: "digest", label: "📅  Daily Digest" },
              { id: "nations", label: "🌍  All Nations" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1,
                background: "none",
                border: "none",
                borderBottom: tab === t.id ? `3px solid ${C.orange}` : "3px solid transparent",
                padding: "14px 8px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: tab === t.id ? C.white : "rgba(255,255,255,0.6)",
                cursor: "pointer",
                textAlign: "center",
                marginBottom: -2,
                letterSpacing: 0.2,
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tab === "digest" ? <DailyDigest /> : <AllNations />}
        </div>

        {/* Footer */}
        <div style={{
          background: C.indigo,
          padding: "14px 20px calc(14px + env(safe-area-inset-bottom, 0px))",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "Libre Baskerville, serif", fontSize: 13, color: "rgba(255,255,255,0.7)", fontStyle: "italic", marginBottom: 4 }}>
            "Ask of me, and I will make the nations your heritage." — Ps. 2:8
          </div>
          <a href="https://globalgates.info" target="_blank" rel="noreferrer" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontWeight: 600 }}>
            globalgates.info
          </a>
        </div>
      </div>
    </>
  );
}
