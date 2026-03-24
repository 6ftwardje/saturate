-- Saturete Academy – alleen content seed (geen DDL)
-- Verwacht bestaande tabellen: modules, lessons, exams, exam_questions (zoals in je Supabase-project).
-- Niet dubbel uitvoeren: check eerst of modules met slug sales-voor-videografen (etc.) al bestaan.
--
-- Let op: unieke constraints (modules.slug, modules.order_index, lessons.slug, exams.module_id, …).
-- Bij conflicten eerst oude curriculumdata verwijderen in FK-volgorde, bv.:
--   delete from public.exam_questions;
--   delete from public.exams;
--   delete from public.lessons;
--   delete from public.modules;
-- (of alleen de rijen die je slugs/order_index blokkeren.)

-- =============================================================================
-- SATURETE CONTENT
-- =============================================================================

insert into public.modules (title, slug, short_description, description, order_index, thumbnail_url, is_published) values
  (
    'Sales voor Videografen',
    'sales-voor-videografen',
    'Van losse aanvragen naar een voorspelbaar verkoopproces voor creatieve ondernemers.',
    'Leer hoe je leads opvolgt, gesprekken structureren en deals sluiten zonder “salesy” te worden — specifiek voor videografen die omzet willen stabiliseren.',
    1,
    null,
    true
  ),
  (
    'Videografie Workflow & Kwaliteit',
    'videografie-workflow-kwaliteit',
    'Sneller leveren met een strakke workflow en consistente beeldkwaliteit.',
    'Optimaliseer je productie: van import tot export, met slim gebruik van presets, LUTs en sound design — praktisch en zonder overcompliceren.',
    2,
    null,
    true
  ),
  (
    'Mindset & Positionering',
    'mindset-positionering',
    'Premium uitstralen en rust in je hoofd als ondernemer-videograaf.',
    'Stop met reactief werken: positioneer jezelf als strategische partner, niet alleen als “camera-huur”.',
    3,
    null,
    true
  ),
  (
    'Business, Pricing & Closing',
    'business-pricing-closing',
    'Pakketten, prijzen en gesprekken die leiden tot high-ticket opdrachten.',
    'Bouw een helder aanbod, structureer offertes met vertrouwen en voer closing-gesprekken die passen bij creatief ondernemerschap.',
    4,
    null,
    true
  );

insert into public.lessons (module_id, title, slug, description, video_url, video_provider, thumbnail_url, order_index, is_published) values
  (
    (select id from public.modules where slug = 'sales-voor-videografen'),
    'Waarom goede videografen nog geen stabiele business bouwen',
    'waarom-goede-videografen-geen-stabiele-business',
    'Herken de valkuilen: prijsdruk, willekeurige pipeline en geen duidelijke volgende stap voor de klant.',
    'https://vimeo.com/100000101',
    'vimeo',
    null,
    1,
    true
  ),
  (
    (select id from public.modules where slug = 'sales-voor-videografen'),
    'Van losse aanvragen naar een voorspelbaar salesproces',
    'van-losse-aanvragen-naar-voorspelbaar-salesproces',
    'Bouw een eenvoudige funnel: intake → call → voorstel → follow-up, meetbaar en herhaalbaar.',
    'https://vimeo.com/100000102',
    'vimeo',
    null,
    2,
    true
  ),
  (
    (select id from public.modules where slug = 'sales-voor-videografen'),
    'Hoe je klanten aanspreekt zonder pushy te verkopen',
    'klanten-aanspreken-zonder-pushy-te-verkopen',
    'Taal, timing en follow-up die vertrouwen bouwen — passend bij creatieve merken en MKB.',
    'https://vimeo.com/100000103',
    'vimeo',
    null,
    3,
    true
  ),
  (
    (select id from public.modules where slug = 'videografie-workflow-kwaliteit'),
    'Een efficiënte workflow die tijd en stress bespaart',
    'efficiente-workflow-tijd-stress-besparen',
    'Templates, mapstructuur en review-rondes zodat je sneller levert zonder kwaliteit te verliezen.',
    'https://vimeo.com/100000201',
    'vimeo',
    null,
    1,
    true
  ),
  (
    (select id from public.modules where slug = 'videografie-workflow-kwaliteit'),
    'Slim werken met presets, LUTs en sound design',
    'presets-luts-sound-design',
    'Gebruik tools om snel te itereren — met smaak en zonder “alles op één LUT”.',
    'https://vimeo.com/100000202',
    'vimeo',
    null,
    2,
    true
  ),
  (
    (select id from public.modules where slug = 'videografie-workflow-kwaliteit'),
    'Consistente kwaliteit leveren zonder alles te overcompliceren',
    'consistente-kwaliteit-zonder-overcompliceren',
    'Kies je standaarden, guardrails en kwaliteitschecks die bij jouw stijl passen.',
    'https://vimeo.com/100000203',
    'vimeo',
    null,
    3,
    true
  ),
  (
    (select id from public.modules where slug = 'mindset-positionering'),
    'Weg van onzekerheid en reactief werken',
    'weg-van-onzekerheid-reactief-werken',
    'Van “alles voor iedereen” naar duidelijke grenzen, planning en focus.',
    'https://vimeo.com/100000301',
    'vimeo',
    null,
    1,
    true
  ),
  (
    (select id from public.modules where slug = 'mindset-positionering'),
    'Hoe je jezelf positioneert als premium creatieve partner',
    'positioneren-als-premium-creatieve-partner',
    'Portfolio, tone of voice en gesprekstechnieken die premium uitstralen — zonder arrogantie.',
    'https://vimeo.com/100000302',
    'vimeo',
    null,
    2,
    true
  ),
  (
    (select id from public.modules where slug = 'mindset-positionering'),
    'Van uitvoerder naar strategische videopartner',
    'van-uitvoerder-naar-strategische-videopartner',
    'Stel betere vragen, denk mee met doelen en verkoop het resultaat, niet alleen uren.',
    'https://vimeo.com/100000303',
    'vimeo',
    null,
    3,
    true
  ),
  (
    (select id from public.modules where slug = 'business-pricing-closing'),
    'Je aanbod en pakketten helder opbouwen',
    'aanbod-en-pakketten-helder-opbouwen',
    '3 pakketten, duidelijke deliverables en upsells die logisch aanvoelen voor de klant.',
    'https://vimeo.com/100000401',
    'vimeo',
    null,
    1,
    true
  ),
  (
    (select id from public.modules where slug = 'business-pricing-closing'),
    'Prijzen en offertes structureren met vertrouwen',
    'prijzen-offertes-structureren',
    'Scope, revisies, betalingen en voorwaarden — strak genoeg om scherp te zijn, helder genoeg om vertrouwen te winnen.',
    'https://vimeo.com/100000402',
    'vimeo',
    null,
    2,
    true
  ),
  (
    (select id from public.modules where slug = 'business-pricing-closing'),
    'Gesprekken voeren die leiden tot high-ticket klanten',
    'gesprekken-high-ticket-closing',
    'Discovery, bezwaren en closing zonder druk — met oog voor lange termijn relaties.',
    'https://vimeo.com/100000403',
    'vimeo',
    null,
    3,
    true
  );

insert into public.exams (module_id, title, description, passing_score, is_published) values
  (
    (select id from public.modules where slug = 'sales-voor-videografen'),
    'Examen: Sales voor Videografen',
    'Toets je begrip van voorspelbare sales, follow-up en klantgesprekken in de videografie-context.',
    70,
    true
  ),
  (
    (select id from public.modules where slug = 'videografie-workflow-kwaliteit'),
    'Examen: Videografie Workflow & Kwaliteit',
    'Toets je begrip van workflow-efficiëntie, tools en consistente output.',
    70,
    true
  ),
  (
    (select id from public.modules where slug = 'mindset-positionering'),
    'Examen: Mindset & Positionering',
    'Toets je begrip van positionering, premium uitstraling en strategische rol.',
    70,
    true
  ),
  (
    (select id from public.modules where slug = 'business-pricing-closing'),
    'Examen: Business, Pricing & Closing',
    'Toets je begrip van aanbod, prijzen en closing in creatieve trajecten.',
    70,
    true
  );

insert into public.exam_questions (exam_id, question, options, correct_answer, order_index) values
  (
    (select id from public.exams where title = 'Examen: Sales voor Videografen'),
    'Wat is de meest praktische eerste stap om van “af en toe aanvragen” naar voorspelbare inkomsten te gaan?',
    '["Nog harder posten op social media", "Een vaste intake + vervolgstappen (call/voorstel) die je elke week uitvoert", "Je prijs verlagen voor meer volume", "Alleen reageren wie het eerst betaalt"]'::jsonb,
    'Een vaste intake + vervolgstappen (call/voorstel) die je elke week uitvoert',
    1
  ),
  (
    (select id from public.exams where title = 'Examen: Sales voor Videografen'),
    'Een goede sales follow-up voor creatieve diensten is vooral:',
    '["Elke dag automatisch spammen", "Duidelijk, vriendelijk en tijdig — met een concrete volgende stap", "Wachten tot de klant terugkomt", "Alleen mailen als je korting geeft"]'::jsonb,
    'Duidelijk, vriendelijk en tijdig — met een concrete volgende stap',
    2
  ),
  (
    (select id from public.exams where title = 'Examen: Sales voor Videografen'),
    'Hoe voorkom je dat je “pushy” overkomt in een verkoopgesprek?',
    '["Door vooral te praten over jezelf", "Door eerst doelen en context te begrijpen en pas daarna een passend voorstel te doen", "Door meteen te eisen dat ze vandaag tekenen", "Door angst te gebruiken als drukmiddel"]'::jsonb,
    'Door eerst doelen en context te begrijpen en pas daarna een passend voorstel te doen',
    3
  ),
  (
    (select id from public.exams where title = 'Examen: Videografie Workflow & Kwaliteit'),
    'Waarom helpt een vaste workflow je als videograaf het meest?',
    '["Omdat je nooit meer hoeft na te denken", "Omdat je minder fouten maakt, sneller levert en rust houdt in je planning", "Omdat klanten altijd minder willen betalen", "Omdat je geen creativiteit meer nodig hebt"]'::jsonb,
    'Omdat je minder fouten maakt, sneller levert en rust houdt in je planning',
    1
  ),
  (
    (select id from public.exams where title = 'Examen: Videografie Workflow & Kwaliteit'),
    'Hoe gebruik je LUTs en presets het slimst?',
    '["Als vervanging voor belichting en kleur op locatie", "Als startpunt voor consistentie en snelheid — met correcte basis-exposure en kleur", "Als excuus om elke clip identiek te maken zonder smaak", "Alleen als je geen tijd hebt voor kleurcorrectie"]'::jsonb,
    'Als startpunt voor consistentie en snelheid — met correcte basis-exposure en kleur',
    2
  ),
  (
    (select id from public.exams where title = 'Examen: Videografie Workflow & Kwaliteit'),
    'Wat is een gezonde manier om “consistente kwaliteit” te definiëren voor je klanten?',
    '["Alles moet identiek zijn aan je concurrent", "Duidelijke standaarden (kleur, audio, deliverables) die passen bij jouw merk en pakketten", "Zo veel mogelijk gratis revisies", "Alleen werken met de duurste camera"]'::jsonb,
    'Duidelijke standaarden (kleur, audio, deliverables) die passen bij jouw merk en pakketten',
    3
  ),
  (
    (select id from public.exams where title = 'Examen: Mindset & Positionering'),
    'Wat beschrijft het best een premium positionering voor een videograaf?',
    '["De laagste prijs in de regio", "Duidelijke niche/expertise, sterke voorbeelden en een proces dat vertrouwen geeft", "Zoveel mogelijk diensten tegelijk aanbieden", "Alleen werken met grote merken"]'::jsonb,
    'Duidelijke niche/expertise, sterke voorbeelden en een proces dat vertrouwen geeft',
    1
  ),
  (
    (select id from public.exams where title = 'Examen: Mindset & Positionering'),
    'Hoe ga je het beste om met onzekerheid over je prijs?',
    '["Altijd onder de markt zitten", "Je waarde koppelen aan uitkomsten en proces, en je pakketten helder maken", "Nooit offertes sturen", "Alleen werken voor exposure"]'::jsonb,
    'Je waarde koppelen aan uitkomsten en proces, en je pakketten helder maken',
    2
  ),
  (
    (select id from public.exams where title = 'Examen: Mindset & Positionering'),
    'Wat betekent “strategische videopartner” in de praktijk?',
    '["Je gebruikt meer jargon in e-mails", "Je helpt de klant doelen scherp te krijgen en vertaalt dat naar video die resultaat dient", "Je doet alleen wat er gevraagd wordt, zonder vragen", "Je levert alleen ruwe beelden"]'::jsonb,
    'Je helpt de klant doelen scherp te krijgen en vertaalt dat naar video die resultaat dient',
    3
  ),
  (
    (select id from public.exams where title = 'Examen: Business, Pricing & Closing'),
    'Wat is een sterk beginpunt voor je aanbod als videograaf?',
    '["Eén pakket met alles erin voor iedereen", "2–3 duidelijke pakketten met verschillende scope en deliverables", "Alleen uurtarieven zonder scope", "Alleen maatwerk zonder voorbeelden"]'::jsonb,
    '2–3 duidelijke pakketten met verschillende scope en deliverables',
    1
  ),
  (
    (select id from public.exams where title = 'Examen: Business, Pricing & Closing'),
    'Wat hoort minimaal in een offerte om vertrouwen te winnen (en scope drift te voorkomen)?',
    '["Alleen een totaalbedrag", "Deliverables, revisies, planning, betalingsvoorwaarden en wat niet inbegrepen is", "Alleen je IBAN", "Een belofte van “snel klaar”"]'::jsonb,
    'Deliverables, revisies, planning, betalingsvoorwaarden en wat niet inbegrepen is',
    2
  ),
  (
    (select id from public.exams where title = 'Examen: Business, Pricing & Closing'),
    'Wat is een effectieve closing-houding in een high-ticket creatief traject?',
    '["Hard drukken tot ze tekenen", "Samenvatten van fit, risico’s wegnemen, duidelijke volgende stap en timing afspreken", "Geen prijs noemen tot het allerlaatst", "Direct korting geven bij twijfel"]'::jsonb,
    'Samenvatten van fit, risico’s wegnemen, duidelijke volgende stap en timing afspreken',
    3
  );
