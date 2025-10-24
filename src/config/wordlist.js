/**
 * Prohibited Words & Illegal Content Filter
 * 
 * This list contains keywords that indicate illegal services or inappropriate content.
 * Used in combination with bad-words library for content filtering.
 */

const PROHIBITED_WORDS = [
  // Illegale Substanzen
  'drug', 'drugs', 'cocaine', 'heroin', 'methamphetamine', 'crystal meth',
  'fentanyl', 'opioid', 'lsd', 'ecstasy', 'mdma', 'marijuana', 'cannabis',
  'hashish', 'psychedelic',

  // Deutsche Schimpfwörter & Beleidigungen
  'fick', 'ficken', 'fick dich', 'scheiße', 'scheiß', 'scheißen',
  'arsch', 'arschloch', 'hurensohn', 'hure', 'fotze', 'wichser',
  'spasti', 'behinderte', 'behindert', 'schwuchtel', 'schwul',
  'dummkopf', 'idiot', 'trottel', 'depp', 'vollidiot', 'blödmann',
  'sau', 'schwein', 'hund', 'hundesohn', 'miststück', 'bitch',
  'nutte', 'schlampe', 'hure', 'dirne', 'flittchen', 'trampel',
  'klotz', 'holzkopf', 'dödel', 'penner', 'asozial', 'abartig',
  'ekelhaft', 'widerlich', 'abscheulich', 'verabscheuungswürdig',
  'fotzen', 'fotzenloch', 'muschi', 'pussy', 'cunt', 'cunts',
  'wichsen', 'masturbieren', 'onanieren', 'wixxer', 'wixxen',
  'fotzenficker', 'arschficker', 'schwanzlutscher', 'schwanz', 'penis',
  'pimmel', 'eier', 'balls', 'hoden', 'titten', 'tits', 'boobs',
  'brüste', 'nippel', 'nips', 'busen', 'hintern', 'backside', 'butt',
  'buttocks', 'pisse', 'pissen', 'pisser', 'pissers', 'pisskopf',
  'bastard', 'bastards', 'bitch', 'bitches', 'whore', 'whores',
  'slut', 'sluts', 'slutty', 'tramp', 'tramps', 'trampy',
  'skank', 'skanks', 'skanky', 'ho', 'hos', 'hoe', 'hoes',
  'hooker', 'hookers', 'prostitute', 'prostitutes', 'escort',
  'escorts', 'call girl', 'call girls', 'stripper', 'strippers',
  'porn star', 'porn stars', 'pornstar', 'pornstars',

  // Waffen & Gewalt (Deutsch)
  'waffe', 'waffen', 'pistole', 'gewehr', 'revolver', 'schrotflinte',
  'granate', 'bombe', 'sprengstoff', 'munition', 'illegale waffen',
  'waffenhandel', 'waffenverkauf', 'waffenhändler', 'sturmgewehr',
  'messer', 'dolch', 'machete', 'keule', 'knüppel', 'schlagstock',

  // Waffen & Gewalt (Englisch)
  'weapon', 'weapons', 'gun', 'rifle', 'pistol', 'revolver', 'shotgun',
  'grenade', 'bomb', 'explosive', 'ammunition', 'illegal arms', 'arms deal',
  'gun sale', 'gun dealer', 'assault rifle',

  // Gestohlene & Gefälschte Gegenstände (Deutsch)
  'gestohlen', 'gestohlenes auto', 'gestohlene ware', 'raub', 'diebstahl',
  'gefälscht', 'fake ausweis', 'gefälschter ausweis', 'fake diplom',
  'gefälschtes diplom', 'fälschung', 'gefälschte dokumente',
  'gefälschter reisepass', 'betrug', 'betrügerisch',

  // Gestohlene & Gefälschte Gegenstände (Englisch)
  'stolen', 'stolen car', 'stolen goods', 'robbery', 'theft',
  'fake', 'fake id', 'fake diploma', 'counterfeit', 'forged',
  'forged documents', 'forged passport',

  // Finanzielle Betrügereien (Deutsch)
  'betrug', 'betrüger', 'schwindel', 'pyramidensystem', 'ponzi-schema',
  'geldwäsche', 'steuerhinterziehung', 'kreditbetrug', 'identitätsdiebstahl',
  'kreditkartenbetrug', 'scheckbetrug', 'überweisungsbetrug', 'finanzbetrug',
  'anlagebetrug', 'investmentbetrug', 'schneeballsystem',

  // Finanzielle Betrügereien (Englisch)
  'fraud', 'scam', 'pyramid scheme', 'ponzi', 'money laundering',
  'tax evasion', 'loan fraud', 'identity theft', 'credit card fraud',
  'check fraud', 'wire fraud',

  // Sexuelle / Ausbeutungs-Inhalte (Deutsch)
  'menschenhandel', 'sexhandel', 'prostitution', 'prostituierte', 'hure',
  'escort service', 'begleitdienst', 'kinderausbeutung', 'kindesmissbrauch',
  'kindeswohlgefährdung', 'sexueller missbrauch', 'vergewaltigung',
  'sexuelle nötigung', 'pädophilie', 'kinderpornografie',

  // Sexuelle / Ausbeutungs-Inhalte (Englisch)
  'sex trafficking', 'human trafficking', 'prostitution', 'prostitute',
  'escort service', 'child exploitation', 'child abuse', 'child endangerment',

  // Dokumente & Identität (Deutsch)
  'gefälschtes diplom', 'diplomfabrik', 'abschlussfabrik', 'aufsatzfabrik',
  'hausaufgabenhilfe', 'aufsatzschreiben', 'universitätszulassung hilfe',
  'betrug', 'plagiat', 'gefälschtes zertifikat', 'fake zertifikat',
  'gefälschter abschluss', 'fake abschluss', 'spickzettel', 'abschreiben',

  // Dokumente & Identität (Englisch)
  'fake diploma', 'diploma mill', 'degree mill', 'essay mill',
  'homework help', 'essay writing', 'university admission help',
  'cheating', 'plagiarism', 'fake certificate',

  // Hasstaten & Diskriminierung (Deutsch)
  'hassrede', 'hass', 'rassismus', 'rassistisch', 'rassist',
  'sexismus', 'sexistisch', 'sexist', 'homophob', 'homophobie',
  'fremdenfeindlichkeit', 'xenophobie', 'diskriminierung', 'diskriminierend',
  'antisemitismus', 'antisemitisch', 'islamophobie', 'islamfeindlich',
  'fremdenhass', 'ausländerfeindlich', 'rechtsradikal', 'extremistisch',
  'ausländer', 'ausländerin', 'flüchtling', 'flüchtlinge', 'flüchtlingsfeindlich',
  'nur für deutsche', 'keine ausländer', 'deutsche zuerst', 'ausländer raus',
  'fremde raus', 'deutschland den deutschen', 'weiße zuerst', 'keine farbigen',
  'nur für weiße', 'keine schwarzen', 'keine muslime', 'islam gehört nicht hierher',
  'junge mädchen', 'junge frauen', 'junge damen', 'junge weiber', 'junge schlampen',
  'junge nutten', 'junge huren', 'junge fotzen', 'junge schlampen', 'junge weiber',
  'junge mädchen verfügbar', 'junge mädchen zum verkauf', 'junge mädchen service',
  'junge mädchen escort', 'junge mädchen prostitution', 'junge mädchen sex',
  'junge mädchen porn', 'junge mädchen nackt', 'junge mädchen nacktbilder',
  'junge mädchen videos', 'junge mädchen cam', 'junge mädchen webcam',

  // Hasstaten & Diskriminierung (Englisch)
  'hate speech', 'racism', 'racist', 'sexism', 'sexist',
  'homophobic', 'xenophobia', 'discrimination',

  // Umwelt & Tierschutz (Deutsch)
  'tierquälerei', 'tierquäler', 'wilderei', 'wildern', 'bedrohte arten',
  'illegale jagd', 'elfenbeinhandel', 'tierhandel', 'wildtierhandel',
  'artenschmuggel', 'illegaler tierhandel', 'tierschutzverletzung',
  'umweltverbrechen', 'illegale entsorgung', 'giftmüll',

  // Umwelt & Tierschutz (Englisch)
  'animal abuse', 'poaching', 'endangered species', 'illegal hunting',
  'ivory trading', 'animal trafficking',

  // Andere illegale Aktivitäten (Deutsch)
  'hacking', 'hacker', 'exploit', 'malware', 'ransomware',
  'ddos', 'cyberkriminalität', 'cybercrime', 'fälschung', 'fälschen',
  'unterschlagung', 'bestechung', 'erpressung', 'erpresser',
  'illegales glücksspiel', 'wettsystem', 'sanktionsverletzung', 'embargo',
  'computerbetrug', 'internetbetrug', 'online-betrug', 'phishing',
  'trojaner', 'virus', 'wurm', 'keylogger', 'spyware',

  // Andere illegale Aktivitäten (Englisch)
  'hacking', 'hacker', 'exploit', 'malware', 'ransomware',
  'ddos', 'cybercrime', 'counterfeiting', 'forgery',
  'embezzlement', 'bribery', 'extortion', 'blackmail',
  'illegal gambling', 'betting scheme', 'sanctions violation', 'embargo',

  // Drogen & Suchtmittel (Deutsch)
  'drogen', 'droge', 'cannabis', 'marihuana', 'haschisch', 'koks', 'kokain',
  'heroin', 'crystal meth', 'amphetamin', 'speed', 'ecstasy', 'xtc', 'lsd',
  'pilze', 'magic mushrooms', 'spice', 'kräutermischung', 'badesalz',
  'synthetische drogen', 'designer drogen', 'legal highs', 'drogenhandel',
  'drogenschmuggel', 'drogenlabor', 'drogenküche', 'drogenproduktion',

  // Gewalt & Mord (Deutsch)
  'mord', 'mörder', 'töten', 'umbringen', 'ermorden', 'massaker',
  'amoklauf', 'terroranschlag', 'anschlag', 'bombenanschlag', 'selbstmord',
  'selbstmordattentat', 'geiselnahme', 'entführung', 'folter', 'foltern',
  'vergewaltigen', 'vergewaltiger', 'mörderisch', 'tödlich', 'lebensgefährlich',

  // Extremismus & Terrorismus (Deutsch)
  'terrorismus', 'terrorist', 'terroristisch', 'islamistisch', 'islamist',
  'radikal', 'extremist', 'extremistisch', 'nazi', 'nationalsozialist',
  'rechtsradikal', 'linksradikal', 'faschist', 'faschistisch', 'antisemit',
  'holocaust leugner', 'revisionist', 'neonazi', 'skinhead', 'hooligan',

  // Organisierte Kriminalität (Deutsch)
  'mafia', 'clan', 'clan kriminalität', 'bande', 'verbrecherbande',
  'schutzgeld', 'erpressung', 'wucher', 'wucherer', 'kredithai',
  'illegale geschäfte', 'schwarzarbeit', 'steuerhinterziehung',
  'schmuggel', 'schmuggler', 'hehler', 'hehlerei', 'räuber', 'raub',

  // Sexuelle Inhalte (Deutsch)
  'pornografie', 'porno', 'hardcore', 'softcore', 'fetisch', 'bdsm',
  'sadomasochismus', 'voyeurismus', 'exhibitionismus', 'zoophilie',
  'nekrophilie', 'pädophilie', 'kinderpornografie', 'jugendpornografie',
  'vergewaltigung', 'sexuelle nötigung', 'sexueller missbrauch',

  // Beleidigungen & Schimpfwörter (Erweitert)
  'wichser', 'fotze', 'hure', 'nutte', 'schlampe', 'bitch', 'fotze',
  'arschloch', 'hurensohn', 'bastard', 'schwuchtel', 'schwul', 'lesbe',
  'trans', 'behindert', 'spasti', 'mongoloid', 'retard', 'idiot',
  'trottel', 'depp', 'vollidiot', 'blödmann', 'dummkopf', 'holzkopf',
  'klotz', 'trampel', 'penner', 'asozial', 'abartig', 'ekelhaft',
  'widerlich', 'abscheulich', 'verabscheuungswürdig', 'sau', 'schwein',
  'hund', 'hundesohn', 'miststück', 'flittchen', 'dirne', 'trampel',
  'holzkopf', 'dödel', 'klotz', 'penner', 'asozial', 'abartig',

  // Gefährliche Substanzen & Chemikalien (Deutsch)
  'gift', 'giftig', 'vergiftung', 'vergiften', 'cyanid', 'arsen',
  'strychnin', 'ricin', 'sarin', 'tabun', 'soman', 'vx', 'novichok',
  'chlor', 'phosgen', 'mustard gas', 'senfgas', 'tränengas', 'cs gas',
  'explosiv', 'sprengstoff', 'tnt', 'dynamit', 'c4', 'semtex',
  'nitroglycerin', 'ammoniumnitrat', 'bomben', 'sprengkörper',

  // Waffen & Munition (Erweitert)
  'ak47', 'kalaschnikow', 'uzi', 'mp5', 'glock', 'beretta', 'colt',
  'magnum', 'sniper', 'scharfschütze', 'sniper rifle', 'scharfschützengewehr',
  'granatwerfer', 'mörser', 'panzerfaust', 'rpg', 'raketenwerfer',
  'minen', 'landminen', 'handgranaten', 'sprengkörper', 'bomben',
  'selbstmordattentäter', 'bombengürtel', 'sprengstoffgürtel',

  // Cyberkriminalität & Hacking (Erweitert)
  'phishing', 'phishing mail', 'trojaner', 'virus', 'wurm', 'malware',
  'ransomware', 'cryptolocker', 'wannacry', 'petya', 'notpetya',
  'keylogger', 'spyware', 'adware', 'rootkit', 'backdoor', 'hintertür',
  'ddos attack', 'botnet', 'zombie computer', 'cryptocurrency mining',
  'bitcoin mining', 'cryptocurrency', 'darknet', 'tor', 'anonymizer',
  'identity theft', 'identitätsdiebstahl', 'credit card fraud',
  'banking trojan', 'banking malware', 'online banking betrug',

  // Menschenhandel & Sklaverei (Deutsch)
  'menschenhandel', 'sklaverei', 'versklavung', 'zwangsarbeit',
  'zwangsprostitution', 'kinderhandel', 'organhandel', 'organhandel',
  'leichenhandel', 'körperteile', 'organe', 'niere', 'leber', 'herz',
  'zwangsheirat', 'ehehandel', 'bräutigam', 'bräutigamhandel',

  // Terrorismus & Anschläge (Erweitert)
  'anschlag', 'terroranschlag', 'bombenanschlag', 'selbstmordattentat',
  'selbstmordattentäter', 'bombengürtel', 'sprengstoffgürtel',
  'geiselnahme', 'entführung', 'flugzeugentführung', 'hijacking',
  'sabotage', 'sabotageakt', 'infrastruktur', 'kritische infrastruktur',
  'wasserwerk', 'kraftwerk', 'atomkraftwerk', 'chemieanlage',
  'biowaffe', 'chemiewaffe', 'atomwaffe', 'nuklearwaffe',

  // Extremismus & Hassgruppen (Erweitert)
  'nazi', 'nationalsozialist', 'hitler', 'adolf hitler', 'holocaust',
  'holocaust leugner', 'revisionist', 'neonazi', 'skinhead',
  'hooligan', 'ultras', 'hooligans', 'rechtsradikal', 'linksradikal',
  'antifa', 'antifaschist', 'faschist', 'faschistisch', 'kommunist',
  'kommunistisch', 'anarchist', 'anarchistisch', 'islamist', 'islamistisch',
  'salafist', 'salafistisch', 'wahhabist', 'wahhabistisch', 'jihadist',
  'jihadistisch', 'mudschahedin', 'taliban', 'al qaida', 'isis', 'isil',
  'daesh', 'boko haram', 'al shabaab', 'hamas', 'hisbollah',

  // Sexuelle Straftaten (Erweitert)
  'vergewaltigung', 'vergewaltiger', 'sexueller missbrauch',
  'kindesmissbrauch', 'pädophilie', 'pädophiler', 'kinderpornografie',
  'jugendpornografie', 'kinderprostitution', 'jugendprostitution',
  'sexuelle nötigung', 'sexuelle belästigung', 'stalking', 'stalker',
  'voyeurismus', 'voyeur', 'exhibitionismus', 'exhibitionist',
  'zoophilie', 'bestialität', 'nekrophilie', 'nekrophil',
  'sadomasochismus', 'bdsm', 'fetisch', 'fetischist', 'paraphilie',

  // Organisierte Kriminalität (Erweitert)
  'mafia', 'cosa nostra', 'camorra', 'ndrangheta', 'sacra corona unita',
  'yakuza', 'triaden', 'triade', 'kartell', 'drogenkartell',
  'medellin kartell', 'sinaloa kartell', 'gulf kartell', 'zetas',
  'clan', 'clan kriminalität', 'arabische clans', 'türkische clans',
  'kurdische clans', 'libanesische clans', 'schutzgeld', 'pizzo',
  'racketeering', 'wucher', 'wucherer', 'kredithai', 'kredithaie',
  'illegale geschäfte', 'schwarzarbeit', 'steuerhinterziehung',
  'schmuggel', 'schmuggler', 'hehler', 'hehlerei', 'räuber', 'raub',
  'überfall', 'überfälle', 'einbruch', 'einbrüche', 'diebstahl',

  // Gefährliche Ideologien & Verschwörungstheorien
  'verschwörungstheorie', 'verschwörung', 'illuminaten', 'freimaurer',
  'reptilien', 'reptiloiden', 'flache erde', 'flat earth', 'chemtrails',
  'impfgegner', 'impfgegner', 'anti vaxxer', 'qanon', 'q anon',
  'pizzagate', 'adrenochrome', 'satanisten', 'satanistisch',
  'ritualmord', 'blutopfer', 'menschliches opfer', 'kinderopfer',

  // Gefährliche Substanzen & Drogen (Erweitert)
  'fentanyl', 'carfentanil', 'heroin', 'morphin', 'opium', 'opiate',
  'methadon', 'subutex', 'suboxone', 'oxycodon', 'hydrocodon',
  'fentanyl patches', 'fentanyl pflaster', 'crystal meth', 'meth',
  'amphetamine', 'speed', 'ecstasy', 'mdma', 'molly', 'xtc',
  'lsd', 'acid', 'psilocybin', 'magic mushrooms', 'pilze', 'psilocybin',
  'ketamin', 'keta', 'ghb', 'liquid ecstasy', 'rohypnol', 'roofies',
  'date rape drug', 'vergewaltigungsdroge', 'spice', 'kräutermischung',
  'synthetische cannabinoide', 'badesalz', 'mephedrone', 'mcat',
  'krokodil', 'desomorphine', 'crocodile', 'flakka', 'alpha pvp',
  'n-bomb', '25i nbome', '2cb', '2ci', '2ce', 'dmt', 'ayahuasca',
  'ibogain', 'kratom', 'kava', 'salvia', 'dmt', 'bufotenin',

  // Gefährliche Aktivitäten & Straftaten
  'mord', 'mörder', 'töten', 'umbringen', 'ermorden', 'massaker',
  'amoklauf', 'school shooting', 'schulmassaker', 'workplace violence',
  'arbeitsplatzgewalt', 'familienmord', 'familientragödie', 'mordserie',
  'serienmörder', 'psychopath', 'soziopath', 'antisozial',
  'selbstmord', 'selbstmordattentat', 'selbstmordattentäter',
  'geiselnahme', 'entführung', 'kidnapping', 'folter', 'foltern',
  'verstümmelung', 'amputation', 'kastration', 'verstümmeln',
  'brandstiftung', 'arson', 'sabotage', 'sabotageakt', 'vandalismus',
  'terrorismus', 'terrorist', 'terroristisch', 'anschlag', 'attentat',
  'bombenanschlag', 'selbstmordattentat', 'selbstmordattentäter',
  'bombengürtel', 'sprengstoffgürtel', 'sprengkörper', 'bombe',
  'granate', 'handgranate', 'sprengstoff', 'explosiv', 'dynamit',
  'tnt', 'c4', 'semtex', 'nitroglycerin', 'ammoniumnitrat',
  'bombenbau', 'sprengstoffherstellung', 'bombenbastler', 'bombenbauer',

  // Weitere deutsche Schimpfwörter
  'fotze', 'fotzen', 'fotzenloch', 'muschi', 'pussy', 'cunt', 'cunts',
  'wichser', 'wichsen', 'masturbieren', 'onanieren', 'wixxer', 'wixxen',
  'fotzenficker', 'arschficker', 'schwanzlutscher', 'schwanz', 'penis',
  'cock', 'dick', 'pimmel', 'schwanz', 'eier', 'balls', 'hoden',
  'titten', 'tits', 'boobs', 'brüste', 'nippel', 'nips', 'busen',
  'arsch', 'ass', 'po', 'hintern', 'backside', 'butt', 'buttocks',
  'ficken', 'fuck', 'fucking', 'fucked', 'fucker', 'fuckers',
  'scheiße', 'shit', 'shitting', 'shitted', 'shitter', 'shitters',
  'piss', 'pissing', 'pissed', 'pisser', 'pissers', 'pisse', 'pissen',
  'pisser', 'pissers', 'pisskopf', 'pisskopf', 'pisskopf',

  // Weitere Beleidigungen
  'bastard', 'bastards', 'bitch', 'bitches', 'whore', 'whores',
  'slut', 'sluts', 'slutty', 'tramp', 'tramps', 'trampy',
  'skank', 'skanks', 'skanky', 'ho', 'hos', 'hoe', 'hoes',
  'hooker', 'hookers', 'prostitute', 'prostitutes', 'escort',
  'escorts', 'call girl', 'call girls', 'stripper', 'strippers',
  'porn star', 'porn stars', 'pornstar', 'pornstars',

  // Rassistische Beleidigungen
  'nigger', 'niggers', 'nigga', 'niggas', 'niggah', 'niggahs',
  'chink', 'chinks', 'chinky', 'gook', 'gooks', 'gooky',
  'spic', 'spics', 'spicky', 'wetback', 'wetbacks',
  'towelhead', 'towelheads', 'sand nigger', 'sand niggers',
  'camel jockey', 'camel jockeys', 'raghead', 'ragheads',
  'kike', 'kikes', 'kyke', 'kykes', 'heeb', 'heebs',
  'yid', 'yids', 'yiddish', 'jew', 'jews', 'jewish',
  'muslim', 'muslims', 'islamic', 'islam', 'mohammedan',
  'mohammedans', 'arab', 'arabs', 'arabic', 'persian',
  'persians', 'iranian', 'iranians', 'iraqi', 'iraqis',
  'afghan', 'afghans', 'afghanistani', 'afghanistanis',
  'pakistani', 'pakistanis', 'indian', 'indians', 'native',
  'natives', 'redskin', 'redskins', 'red man', 'red men',
  'squaw', 'squaws', 'injun', 'injuns', 'chief', 'chiefs',

  // Homophobe Beleidigungen
  'fag', 'fags', 'faggot', 'faggots', 'faggy', 'faggoty',
  'faggy', 'faggoty', 'faggy', 'faggoty', 'faggy', 'faggoty',
  'queer', 'queers', 'queerly', 'queerish', 'queerish',
  'dyke', 'dykes', 'dike', 'dikes', 'dikey', 'dikey',
  'lesbian', 'lesbians', 'lesbo', 'lesbos', 'lesboish',
  'tranny', 'trannies', 'trannie', 'trannies', 'shemale',
  'shemales', 'ladyboy', 'ladyboys', 'chick with dick',
  'chicks with dicks', 'dickgirl', 'dickgirls', 'dick girl',
  'dick girls', 'trap', 'traps', 'trappy', 'trappy',

  // Behinderungsbezogene Beleidigungen
  'retard', 'retards', 'retarded', 'retardation', 'retardation',
  'spastic', 'spastics', 'spaz', 'spazz', 'spazzes', 'spazzy',
  'cripple', 'cripples', 'crippled', 'crippling', 'crippling',
  'lame', 'lamer', 'lamest', 'lamely', 'lameness', 'lameness',
  'dumb', 'dumber', 'dumbest', 'dumbly', 'dumbness', 'dumbness',
  'stupid', 'stupider', 'stupidest', 'stupidly', 'stupidity',
  'moron', 'morons', 'moronic', 'moronically', 'moronically',
  'idiot', 'idiots', 'idiotic', 'idiotically', 'idiotically',
  'imbecile', 'imbeciles', 'imbecilic', 'imbecilically',
  'cretin', 'cretins', 'cretinous', 'cretinously', 'cretinously',
  'mongoloid', 'mongoloids', 'mongoloidic', 'mongoloidically',
  'down syndrome', 'downs syndrome', 'trisomy 21', 'trisomy 21',
  'autistic', 'autism', 'asperger', 'aspergers', 'asperger syndrome',
  'aspergers syndrome', 'adhd', 'add', 'attention deficit',
  'hyperactive', 'hyperactivity', 'learning disability',
  'learning disabled', 'mentally retarded', 'mentally handicapped',
  'mentally challenged', 'developmentally disabled', 'special needs',
  'special ed', 'special education', 'wheelchair bound',
  'wheelchair user', 'paraplegic', 'paraplegics', 'quadriplegic',
  'quadriplegics', 'amputee', 'amputees', 'blind', 'blindness',
  'deaf', 'deafness', 'mute', 'muteness', 'dumb', 'dumbness',
  'stutter', 'stuttering', 'stammer', 'stammering', 'lisp',
  'lisping', 'stutterer', 'stutterers', 'stammerer', 'stammerers',
  'lisper', 'lispers', 'stuttery', 'stuttery', 'stammery',
  'stammery', 'lispy', 'lispy', 'stuttery', 'stuttery',
  'stammery', 'stammery', 'lispy', 'lispy', 'stuttery',
  'stuttery', 'stammery', 'stammery', 'lispy', 'lispy',
];

// Whitelist für harmlose Wörter, die nicht blockiert werden sollen
const WHITELIST_WORDS = [
  'personal', 'fachkräften', 'fachkraft', 'fachkräfte', 'personalbereich',
  'personalabteilung', 'personalmanagement', 'personalwesen', 'personalchef',
  'personalberatung', 'personalentwicklung', 'personalplanung', 'personalverwaltung',
  'junge', 'junger', 'jungen', 'jünger', 'jüngere', 'jüngster', 'jüngste',
  'junge leute', 'junge menschen', 'junge generation', 'junge generationen',
  'junge unternehmer', 'junge künstler', 'junge musiker', 'junge sportler',
  'junge wissenschaftler', 'junge forscher', 'junge entwickler', 'junge programmierer',
  'junge designer', 'junge architekten', 'junge ärzte', 'junge lehrer',
  'junge studenten', 'junge schüler', 'junge kinder', 'junge erwachsene',
  'junge familie', 'junge eltern', 'junge paare', 'junge liebende',
  'junge freunde', 'junge kollegen', 'junge mitarbeiter', 'junge team',
  'junge gruppe', 'junge gemeinschaft', 'junge gesellschaft', 'junge welt',
  'junge zukunft', 'junge hoffnung', 'junge träume', 'junge ideen',
  'junge projekte', 'junge unternehmen', 'junge startups', 'junge innovationen',
  'junge technologien', 'junge lösungen', 'junge ansätze', 'junge methoden',
  'junge konzepte', 'junge strategien', 'junge pläne', 'junge ziele',
  'junge visionen', 'junge missionen', 'junge aufgaben', 'junge verantwortung',
  'junge führung', 'junge leitung', 'junge management', 'junge organisation',
  'junge struktur', 'junge systeme', 'junge prozesse', 'junge abläufe',
  'junge entwicklungen', 'junge trends', 'junge richtungen', 'junge wege',
  'junge möglichkeiten', 'junge chancen', 'junge gelegenheiten', 'junge potentiale',
  'junge talente', 'junge begabungen', 'junge fähigkeiten', 'junge kompetenzen',
  'junge erfahrungen', 'junge kenntnisse', 'junge wissen', 'junge bildung',
  'junge ausbildung', 'junge qualifikation', 'junge spezialisierung', 'junge expertise',
  'junge profession', 'junge beruf', 'junge karriere', 'junge erfolg',
  'junge leistung', 'junge arbeit', 'junge tätigkeit', 'junge beschäftigung',
  'junge job', 'junge position', 'junge rolle', 'junge funktion',
  'junge aufgabe', 'junge verantwortung', 'junge pflicht', 'junge engagement',
  'junge begeisterung', 'junge motivation', 'junge energie', 'junge kraft',
  'junge stärke', 'junge mut', 'junge entschlossenheit', 'junge entschlossenheit',
  'junge entschlossenheit', 'junge entschlossenheit', 'junge entschlossenheit'
];

/**
 * Check if text contains prohibited words
 * @param {string} text - Text to check
 * @returns {boolean} - True if prohibited content found
 */
function containsProhibitedWords(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const lowerText = text.toLowerCase();
  
  // Check if text contains any whitelisted words first
  const containsWhitelistedWord = WHITELIST_WORDS.some(word => lowerText.includes(word));
  
  // If text contains whitelisted words, be more careful with detection
  if (containsWhitelistedWord) {
    // Only check for exact word matches or very specific phrases
    const exactMatches = [
      'junge mädchen', 'junge frauen', 'junge damen', 'junge weiber', 'junge schlampen',
      'junge nutten', 'junge huren', 'junge fotzen', 'junge schlampen', 'junge weiber',
      'junge mädchen verfügbar', 'junge mädchen zum verkauf', 'junge mädchen service',
      'junge mädchen escort', 'junge mädchen prostitution', 'junge mädchen sex',
      'junge mädchen porn', 'junge mädchen nackt', 'junge mädchen nacktbilder',
      'junge mädchen videos', 'junge mädchen cam', 'junge mädchen webcam'
    ];
    
    // Check for exact matches only
    const hasExactMatch = exactMatches.some(phrase => lowerText.includes(phrase));
    if (hasExactMatch) {
      return true;
    }
    
    // For other prohibited words, check if they appear as whole words
    const words = lowerText.split(/\s+/);
    const hasProhibitedWord = PROHIBITED_WORDS.some(prohibitedWord => {
      // Skip the "junge mädchen" related words as they're handled above
      if (prohibitedWord.includes('junge mädchen')) {
        return false;
      }
      
      // Check if the prohibited word appears as a whole word
      return words.some(word => word === prohibitedWord);
    });
    
    return hasProhibitedWord;
  }
  
  // If no whitelisted words, use normal detection
  return PROHIBITED_WORDS.some(word => lowerText.includes(word));
}

module.exports = {
  PROHIBITED_WORDS,
  containsProhibitedWords,
};
