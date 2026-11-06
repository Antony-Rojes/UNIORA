/* ==========================================================================
   UNIORA — ASK UNIORA RULE-BASED INTELLIGENCE ENGINE
   File: features/02_ask_uniora/frontend/rule_engine.js
   Architecture: Pure client-side rule-based model (NO external AI API, NO ML model).
   Data Source: Google Sheet CSV (577+ Central & Tamil Nadu Schemes) + Fallback Catalog.
   Standards: Professional tone, zero emojis, structured column-based outputs.
   ========================================================================== */

// Exact public Google Sheet source used across UNIORA (Feature 01)
export const SHEET_ID = '1MTWk1hOKSt3ZEl-mPiQAYZzmpRg3HgLD5BYA3M5VhXI';
export const SHEET_TAB_GIDS = ['1493062875'];
export const CACHE_STORAGE_KEY = 'uniora_schemes_cache_v2';
export const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---------------------------------------------------------------------------
// 1. COMPREHENSIVE OFFLINE FALLBACK CATALOG (Central & Tamil Nadu Schemes)
// ---------------------------------------------------------------------------
export const FALLBACK_SCHEMES = [
  {
    scheme_id: 'TN-HE-001',
    scheme_name: 'Tamil Pudhalvan Scheme',
    category_type: 'Tamil Nadu',
    sector_category: 'Education & Learning',
    sub_sector: 'Higher Education',
    issuing_department: 'Department of Higher Education, Government of Tamil Nadu',
    min_age: 17,
    max_age: 25,
    income_limit_annual: 300000,
    is_estimate: false,
    gender: 'Male',
    gender_notes: 'Exclusively for male students who studied in Tamil Nadu Government schools (classes 6 to 12).',
    social_category: 'All',
    occupation_criteria: 'Student',
    residency_requirement: 'Resident of Tamil Nadu',
    eligibility_state: 'Tamil Nadu',
    other_conditions: 'Must have studied in Tamil Nadu Government schools from class 6 to 12; currently enrolled in recognized ITI, Diploma, or Undergraduate degree programs.',
    description: 'A flagship higher education financial aid scheme by the Government of Tamil Nadu providing monthly financial assistance to young men from government schools pursuing higher education.',
    benefits: 'Rs. 1,000 per month direct bank transfer (DBT) directly credited to student bank accounts until completion of graduation or diploma.',
    application_mode: 'Online / Institution-led',
    application_process: '1. Contact college or institution Nodal Officer. 2. Verify EMIS (Education Management Information System) ID. 3. Submit Aadhaar and Bank Passbook copy. 4. Institution verifies and approves on the official portal.',
    application_url: 'https://www.tn.gov.in',
    required_documents: 'Aadhaar Card; School Transfer Certificate (showing 6-12 Govt School study); College Bonafide Certificate; Bank Passbook with linked Aadhaar; 12th Standard Marksheet',
    mandatory_documents: 'Aadhaar Card; Govt School 6-12 Study Proof; College Bonafide; Bank Account Details',
    official_source_url: 'https://www.tn.gov.in',
    source_platform: 'TN Govt Higher Education Portal',
    last_verified_date: '2026-08-01',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'TN-SW-002',
    scheme_name: 'Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar Higher Education Assurance)',
    category_type: 'Tamil Nadu',
    sector_category: 'Education & Learning',
    sub_sector: 'Girl Child Welfare & Higher Education',
    issuing_department: 'Department of Social Welfare and Women Rights, Tamil Nadu',
    min_age: 17,
    max_age: 26,
    income_limit_annual: null,
    is_estimate: false,
    gender: 'Female',
    gender_notes: 'Exclusively for female students who studied classes 6 to 12 in Tamil Nadu Government schools.',
    social_category: 'All',
    occupation_criteria: 'Student',
    residency_requirement: 'Resident of Tamil Nadu',
    eligibility_state: 'Tamil Nadu',
    other_conditions: 'Girl students who passed 6th to 12th standard in Tamil Nadu Govt schools and entered undergraduate degree, diploma, or ITI programs.',
    description: 'Provides monthly monetary incentive to girl students who studied in government schools to encourage enrollment in higher education, curb child marriage, and achieve gender equality.',
    benefits: 'Rs. 1,000 per month direct bank transfer throughout the entire duration of the UG Degree, Polytechnic Diploma, or ITI course.',
    application_mode: 'Online through Pen Kalvi Portal',
    application_process: '1. Visit penkalvi.tn.gov.in or apply through the college coordinator. 2. Log in using student EMIS registration number. 3. Validate Aadhaar OTP. 4. College Principal confirms attendance and bank account. 5. Approved for monthly DBT.',
    application_url: 'https://www.penkalvi.tn.gov.in',
    required_documents: 'Aadhaar Card; EMIS Number; 10th and 12th Marksheets; Govt School Transfer Certificate (Classes 6-12); College Admission / Bonafide Slip; Bank Passbook copy',
    mandatory_documents: 'Aadhaar Card; EMIS ID; School TC; Active Bank Account Details',
    official_source_url: 'https://www.penkalvi.tn.gov.in',
    source_platform: 'Pen Kalvi Portal',
    last_verified_date: '2026-08-10',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'TN-SW-004',
    scheme_name: 'Kalaignar Magalir Urimai Thogai (KMUT)',
    category_type: 'Tamil Nadu',
    sector_category: 'Women & Child',
    sub_sector: 'Universal Basic Income & Women Empowerment',
    issuing_department: 'Special Programme Implementation Department, Tamil Nadu',
    min_age: 21,
    max_age: 65,
    income_limit_annual: 250000,
    is_estimate: false,
    gender: 'Female',
    gender_notes: 'Woman head of the family as recorded in the Tamil Nadu Smart Family Ration Card.',
    social_category: 'All',
    occupation_criteria: 'Housewife, Unorganized Worker, Small Farmer',
    residency_requirement: 'Resident of Tamil Nadu',
    eligibility_state: 'Tamil Nadu',
    other_conditions: 'Annual family income under Rs. 2.5 Lakh; family should hold less than 5 acres of wet land or 10 acres of dry land; annual electricity consumption under 3,600 units; no family member paying income tax or holding government employment.',
    description: 'Historical basic income guarantee initiative of the Tamil Nadu Government providing unconditional monthly financial support to recognized female heads of households.',
    benefits: 'Rs. 1,000 per month directly credited to the beneficiary bank account on the 15th of every month without interruption.',
    application_mode: 'Special e-Sevai / Ration Shop Camps',
    application_process: '1. Obtain application token from designated Fair Price Shop (Ration Shop). 2. Attend localized biometric registration camp with Smart Ration Card and Aadhaar. 3. Field verification by Revenue officials. 4. SMS approval and monthly DBT.',
    application_url: 'https://kmut.tn.gov.in',
    required_documents: 'Tamil Nadu Smart Ration Card (Family Card); Aadhaar Card of female head; Aadhaar cards of family members; Electricity Consumer Number / Bill; Bank Passbook copy',
    mandatory_documents: 'Smart Family Ration Card; Aadhaar Card; Bank Account Details',
    official_source_url: 'https://kmut.tn.gov.in',
    source_platform: 'KMUT Portal / TN e-Sevai',
    last_verified_date: '2026-09-01',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'CEN-AG-001',
    scheme_name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category_type: 'Central',
    sector_category: 'Agriculture',
    sub_sector: 'Direct Income Support to Farmers',
    issuing_department: 'Ministry of Agriculture & Farmers Welfare, Government of India',
    min_age: 18,
    max_age: 75,
    income_limit_annual: null,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'Open to both male and female farmers holding cultivable land.',
    social_category: 'All',
    occupation_criteria: 'Farmer / Cultivator',
    residency_requirement: 'Resident of India',
    eligibility_state: 'All',
    other_conditions: 'All landholding farmer families with cultivable land in their names. Exclusions apply to institutional landholders, income-tax payers, and government employees/pensioners receiving > Rs. 10,000/month.',
    description: 'Central sector scheme with 100% funding from Government of India to supplement the financial needs of landholding farmers for procuring inputs related to agriculture and domestic needs.',
    benefits: 'Rs. 6,000 per year paid in three equal installments of Rs. 2,000 each every four months directly into the farmer bank account via DBT.',
    application_mode: 'Online / Common Service Centre (CSC)',
    application_process: '1. Visit pmkisan.gov.in and click New Farmer Registration. 2. Enter Aadhaar and state selection. 3. Fill rural/urban details, land ownership patta/khasra numbers. 4. Complete e-KYC using Aadhaar OTP. 5. District agriculture officer verifies records.',
    application_url: 'https://pmkisan.gov.in',
    required_documents: 'Aadhaar Card; Land Ownership Proof (Patta / Chitta / Revenue Record / Khasra); Active Bank Passbook linked to Aadhaar (NPCI mapped); Mobile number linked with Aadhaar',
    mandatory_documents: 'Aadhaar Card; Land Patta/Chitta; Aadhaar-linked Bank Account',
    official_source_url: 'https://pmkisan.gov.in',
    source_platform: 'PM-KISAN Portal',
    last_verified_date: '2026-09-15',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'CEN-HL-001',
    scheme_name: 'Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)',
    category_type: 'Central',
    sector_category: 'Health & Wellness',
    sub_sector: 'Universal Health Protection',
    issuing_department: 'National Health Authority (NHA), Ministry of Health and Family Welfare',
    min_age: null,
    max_age: null,
    income_limit_annual: null,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'Entire family covered without restriction on age or gender.',
    social_category: 'All',
    occupation_criteria: 'Deprived / Vulnerable Families / Unorganized',
    residency_requirement: 'Resident of India',
    eligibility_state: 'All',
    other_conditions: 'Families identified based on deprivation and occupational criteria of Socio-Economic Caste Census (SECC 2011) and recent state expansions. In Tamil Nadu, integrated with CMCHIS.',
    description: 'The world largest government-funded health assurance scheme providing comprehensive secondary and tertiary care hospitalization coverage to vulnerable citizens.',
    benefits: 'Cashless and paperless health insurance coverage of up to Rs. 5,00,000 per family per year for secondary and tertiary care hospitalization across empanelled public and private hospitals.',
    application_mode: 'e-Sevai / Empanelled Hospital Ayushman Kiosk',
    application_process: '1. Check eligibility at beneficiary.nha.gov.in with Aadhaar or Ration card. 2. Visit nearest empanelled hospital or e-Sevai / CSC. 3. Undergo biometric authentication. 4. Download Ayushman Gold Card instantly.',
    application_url: 'https://beneficiary.nha.gov.in',
    required_documents: 'Aadhaar Card; Smart Ration Card / Family Card; Active Mobile Number',
    mandatory_documents: 'Aadhaar Card; Ration Card',
    official_source_url: 'https://pmjay.gov.in',
    source_platform: 'National Health Authority',
    last_verified_date: '2026-09-10',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'TN-HL-001',
    scheme_name: 'Chief Minister Comprehensive Health Insurance Scheme (CMCHIS)',
    category_type: 'Tamil Nadu',
    sector_category: 'Health & Wellness',
    sub_sector: 'State Health Insurance',
    issuing_department: 'Health and Family Welfare Department, Tamil Nadu',
    min_age: null,
    max_age: null,
    income_limit_annual: 120000,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'All members enrolled in the family Smart Card.',
    social_category: 'All',
    occupation_criteria: 'All',
    residency_requirement: 'Resident of Tamil Nadu',
    eligibility_state: 'Tamil Nadu',
    other_conditions: 'Family annual income less than Rs. 1,20,000 per annum as certified by VAO/Revenue authorities, or holding a valid Smart Family Ration Card in eligible categories.',
    description: 'Flagship medical insurance program of Tamil Nadu covering specialized surgical procedures, diagnostics, and critical medical treatments across empanelled government and private hospitals.',
    benefits: 'Up to Rs. 5,00,000 per family per year for 1,513+ listed surgical procedures and treatments with zero out-of-pocket costs at empanelled hospitals.',
    application_mode: 'District Kiosk / e-Sevai',
    application_process: '1. Obtain Income Certificate from VAO/Tahsildar. 2. Visit District Collectorate CMCHIS Kiosk or designated e-Sevai. 3. Provide Smart Ration Card and Aadhaar for family biometrics. 4. Receive CMCHIS smart card.',
    application_url: 'https://www.cmchistn.com',
    required_documents: 'Smart Family Ration Card; Income Certificate (annual income < Rs. 1.2L); Aadhaar Cards of all family members; Address proof in Tamil Nadu',
    mandatory_documents: 'Smart Ration Card; Income Certificate; Aadhaar Card',
    official_source_url: 'https://www.cmchistn.com',
    source_platform: 'CMCHIS Official Portal',
    last_verified_date: '2026-08-20',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'TN-SD-003',
    scheme_name: 'Naan Mudhalvan Scheme',
    category_type: 'Tamil Nadu',
    sector_category: 'Employment & Skills',
    sub_sector: 'Skill Enhancement & Career Guidance',
    issuing_department: 'Tamil Nadu Skill Development Corporation (TNSDC)',
    min_age: 17,
    max_age: 29,
    income_limit_annual: null,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'Open to all youth irrespective of gender.',
    social_category: 'All',
    occupation_criteria: 'Student / Unemployed Youth',
    residency_requirement: 'Resident of Tamil Nadu',
    eligibility_state: 'Tamil Nadu',
    other_conditions: 'Students studying in colleges, polytechnics, ITIs, or universities in Tamil Nadu; or recent graduates seeking career upskilling.',
    description: 'A transformative youth development initiative by the Tamil Nadu Government equipping over 10 lakh youth annually with industry-grade skills in AI, robotics, coding, foreign languages, and civil services.',
    benefits: 'Free industry-certified courses (Google, Microsoft, IBM, AWS), mock interviews, mentorship from corporate leaders, hackathons, and direct campus placement drives.',
    application_mode: 'Online Portal / College Integration',
    application_process: '1. Register at naanmudhalvan.tn.gov.in using college registration number or email. 2. Select track (Engineering, Arts & Science, or Competitive Exams). 3. Enroll in courses and attend placement sessions.',
    application_url: 'https://www.naanmudhalvan.tn.gov.in',
    required_documents: 'College ID Card / Enrollment Proof; Aadhaar Card; Academic Marksheets',
    mandatory_documents: 'College ID / Registration Number; Aadhaar Card',
    official_source_url: 'https://www.naanmudhalvan.tn.gov.in',
    source_platform: 'Naan Mudhalvan Portal',
    last_verified_date: '2026-08-15',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'CEN-ED-001',
    scheme_name: 'Post Matric Scholarship for Students with Disabilities',
    category_type: 'Central',
    sector_category: 'Education & Learning',
    sub_sector: 'Special Needs & Disability Support',
    issuing_department: 'Department of Empowerment of Persons with Disabilities, MoSJE',
    min_age: null,
    max_age: null,
    income_limit_annual: 250000,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'All genders covered.',
    social_category: 'All',
    occupation_criteria: 'Student',
    residency_requirement: 'Resident of India',
    eligibility_state: 'All',
    other_conditions: 'Students with benchmark disability of 40% or above pursuing post-matric courses (Class 11, 12, Diploma, UG, PG) from recognized institutions. Annual parental income must not exceed Rs. 2.5 Lakh.',
    description: 'Empowers students with benchmark disabilities to pursue secondary and post-secondary education by covering tuition fees, maintenance allowance, and assistive book allowances.',
    benefits: 'Monthly maintenance allowance (up to Rs. 1,600/month for hostellers), disability allowances (Rs. 2,000 to Rs. 4,000/yr), book allowance of Rs. 1,500/yr, and full tuition fee reimbursement.',
    application_mode: 'Online via National Scholarship Portal (NSP)',
    application_process: '1. Register on National Scholarships Portal (scholarships.gov.in). 2. Complete OTR (One Time Registration) with Aadhaar. 3. Select scheme and fill academic & disability details. 4. Institute verification followed by State Nodal Officer approval.',
    application_url: 'https://scholarships.gov.in',
    required_documents: 'Disability Certificate (minimum 40% under RPwD Act); Income Certificate (<= Rs. 2.5L); Aadhaar Card; Last Qualification Marksheet; Fee Receipt; Bank Passbook',
    mandatory_documents: 'Disability Certificate; Income Certificate; Aadhaar Card; Bank Details',
    official_source_url: 'https://disabilityaffairs.gov.in',
    source_platform: 'National Scholarships Portal',
    last_verified_date: '2026-07-05',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'CEN-MS-001',
    scheme_name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    category_type: 'Central',
    sector_category: 'Banking, Financial Services & Insurance',
    sub_sector: 'Micro & Small Enterprise Credit',
    issuing_department: 'Department of Financial Services, Ministry of Finance',
    min_age: 18,
    max_age: 65,
    income_limit_annual: null,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'Special emphasis on women entrepreneurs.',
    social_category: 'All',
    occupation_criteria: 'Artisan, Small Business Owner, Shopkeeper, Trader',
    residency_requirement: 'Resident of India',
    eligibility_state: 'All',
    other_conditions: 'Any Indian citizen who has a business plan for a non-farm sector income-generating activity such as manufacturing, processing, trading, or service sector.',
    description: 'Provides collateral-free institutional credit up to Rs. 10 to 20 Lakh to micro and small enterprises to foster self-employment and grassroots entrepreneurship.',
    benefits: 'Collateral-free loans in three categories: Shishu (up to Rs. 50,000), Kishore (Rs. 50,000 to Rs. 5,00,000), and Tarun (Rs. 5,00,000 to Rs. 10,00,000 - recently expanded up to Rs. 20 Lakh). Competitive interest rates.',
    application_mode: 'Online (Udyamimitra) / Any Commercial Bank or NBFC',
    application_process: '1. Formulate business proposal. 2. Visit udyamimitra.in or walk into nearest bank branch. 3. Fill Mudra application form with identity and business proofs. 4. Loan sanctioned without any mortgage collateral.',
    application_url: 'https://www.mudra.org.in',
    required_documents: 'Aadhaar Card; PAN Card; Proof of business address; Quotation of machinery/items to be purchased; Bank statement for last 6 months',
    mandatory_documents: 'Aadhaar Card; PAN Card; Business Proposal / Address Proof',
    official_source_url: 'https://www.mudra.org.in',
    source_platform: 'Mudra Portal / Udyamimitra',
    last_verified_date: '2026-08-12',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'TN-AG-002',
    scheme_name: 'Chief Minister Solar Powered Pump Sets Scheme',
    category_type: 'Tamil Nadu',
    sector_category: 'Agriculture',
    sub_sector: 'Renewable Energy & Farm Irrigation',
    issuing_department: 'Agricultural Engineering Department, Government of Tamil Nadu',
    min_age: 18,
    max_age: 70,
    income_limit_annual: null,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'All farmers.',
    social_category: 'All',
    occupation_criteria: 'Farmer',
    residency_requirement: 'Resident of Tamil Nadu',
    eligibility_state: 'Tamil Nadu',
    other_conditions: 'Individual farmers having cultivable land with borewell/openwell and reliable groundwater source. Must not have free electricity farm connection for the same survey number.',
    description: 'Promotes green energy in agriculture by providing heavy subsidies on solar-powered pump sets for sustainable irrigation.',
    benefits: '70% capital subsidy (40% State + 30% Central PM-KUSUM) for installation of 5 HP to 10 HP standalone AC/DC solar pump sets. Farmer pays only 30%.',
    application_mode: 'Online via Uzhavan App / AED Portal',
    application_process: '1. Register on Uzhavan App or contact Assistant Executive Engineer (AED). 2. Submit Patta, Chitta, and well certificate. 3. Site inspection and feasibility clearance. 4. Pay 30% farmer share. 5. Installation completed.',
    application_url: 'https://aed.tn.gov.in',
    required_documents: 'Patta and Chitta copy; VAO Well & Water Source Certificate; Aadhaar Card; Bank Passbook copy; Passport size photo',
    mandatory_documents: 'Patta/Chitta; Well Certificate; Aadhaar Card; Bank Details',
    official_source_url: 'https://aed.tn.gov.in',
    source_platform: 'Uzhavan App / TN Agriculture',
    last_verified_date: '2026-07-28',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'CEN-HS-001',
    scheme_name: 'PM Awas Yojana - Gramin & Urban (PMAY)',
    category_type: 'Central',
    sector_category: 'Housing & Shelter',
    sub_sector: 'Affordable Housing for All',
    issuing_department: 'Ministry of Rural Development / Housing & Urban Affairs',
    min_age: 18,
    max_age: 70,
    income_limit_annual: 300000,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'Ownership preferably in the name of the female head or joint ownership.',
    social_category: 'All',
    occupation_criteria: 'Homeless / Kutcha House Dwellers',
    residency_requirement: 'Resident of India',
    eligibility_state: 'All',
    other_conditions: 'Beneficiary family must not own a pucca house in their name anywhere in India. Selected through SECC/Awas+ list.',
    description: 'Central flagship program aimed at providing a pucca house with basic amenities to all houseless families and those living in kutcha/dilapidated houses.',
    benefits: 'Financial assistance of Rs. 1.20 Lakh in plains and Rs. 1.30 Lakh in hilly areas, plus 90 to 95 days of unskilled labor wages under MGNREGA (~Rs. 25,000) and Rs. 12,000 for toilet construction.',
    application_mode: 'Gram Panchayat / Urban Local Body / PMAY Portal',
    application_process: '1. Village Gram Sabha finalizes priority list based on SECC 2011/Awas+. 2. Geo-tagging of existing house. 3. Sanction letter issued. 4. Direct cash transferred in 4 construction stages.',
    application_url: 'https://pmayg.nic.in',
    required_documents: 'Aadhaar Card; Bank Account details; MGNREGA Job Card number; Swachh Bharat Mission (SBM) registration number; Land/site ownership documents',
    mandatory_documents: 'Aadhaar Card; Bank Details; Land Site Document',
    official_source_url: 'https://pmayg.nic.in',
    source_platform: 'PMAY-G / PMAY-U Portal',
    last_verified_date: '2026-08-30',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'CEN-VK-001',
    scheme_name: 'PM Vishwakarma Scheme',
    category_type: 'Central',
    sector_category: 'Social Welfare & Empowerment',
    sub_sector: 'Traditional Artisans & Craftspeople Support',
    issuing_department: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    min_age: 18,
    max_age: null,
    income_limit_annual: null,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'All traditional craftspeople.',
    social_category: 'All',
    occupation_criteria: 'Artisans & Craftspeople in 18 Traditional Trades',
    residency_requirement: 'Resident of India',
    eligibility_state: 'All',
    other_conditions: 'Practicing one of 18 family-based traditional trades (carpenter, blacksmith, goldsmith, potter, sculptor, cobbler, mason, weaver, tailor, etc.) on self-employment basis. One family member only.',
    description: 'Holistic scheme to provide end-to-end support to traditional artisans and craftspeople through skill training, modern toolkit incentive, subsidized collateral-free credit, and market linkages.',
    benefits: 'Free 5 to 7 day basic skill training with Rs. 500/day stipend; Rs. 15,000 modern toolkit grant; collateral-free enterprise loan up to Rs. 3,00,000 (Tranche 1: Rs. 1L, Tranche 2: Rs. 2L) at concessional 5% interest rate.',
    application_mode: 'Online through Common Service Centre (CSC)',
    application_process: '1. Visit nearest CSC with Aadhaar and bank details. 2. Biometric authentication and trade selection. 3. Gram Panchayat / Urban local body verification. 4. Receive PM Vishwakarma Digital Certificate and ID.',
    application_url: 'https://pmvishwakarma.gov.in',
    required_documents: 'Aadhaar Card; Mobile Number linked to Aadhaar; Bank Passbook; Ration Card; Proof of practicing traditional trade',
    mandatory_documents: 'Aadhaar Card; Bank Account; Active Mobile Number',
    official_source_url: 'https://pmvishwakarma.gov.in',
    source_platform: 'PM Vishwakarma Portal',
    last_verified_date: '2026-09-05',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'TN-SC-001',
    scheme_name: 'Chief Minister Uzhavar Pathukappu Thittam (Farmers Social Security)',
    category_type: 'Tamil Nadu',
    sector_category: 'Social Welfare & Empowerment',
    sub_sector: 'Comprehensive Social Security for Farmers & Agricultural Laborers',
    issuing_department: 'Revenue and Disaster Management Department, Government of Tamil Nadu',
    min_age: 18,
    max_age: 65,
    income_limit_annual: 120000,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'All agricultural laborers and small farmers.',
    social_category: 'All',
    occupation_criteria: 'Farmer / Agricultural Laborer',
    residency_requirement: 'Resident of Tamil Nadu',
    eligibility_state: 'Tamil Nadu',
    other_conditions: 'Small and marginal farmers owning up to 2.5 acres of wetland or 5 acres of dry land, and landless agricultural laborers engaged in farming activities in Tamil Nadu.',
    description: 'Comprehensive welfare net providing pension, education aid, marriage assistance, maternity benefits, and accidental death relief for farming families in Tamil Nadu.',
    benefits: 'Old age pension of Rs. 1,000/month after age 60; natural death assistance of Rs. 20,000; accidental death relief of Rs. 1,00,000; marriage aid up to Rs. 10,000; educational scholarships for children up to Rs. 6,750/yr.',
    application_mode: 'e-Sevai / Taluk Special Tahsildar Office',
    application_process: '1. Apply through e-Sevai or Special Tahsildar (Uzhavar Pathukappu Thittam). 2. Submit Village Administrative Officer (VAO) certificate confirming agricultural labor/landholding. 3. Member identity card issued. 4. Benefits claimed as per event.',
    application_url: 'https://www.tn.gov.in/scheme/data_view/6857',
    required_documents: 'Uzhavar Pathukappu Thittam Member Card; Aadhaar Card; Smart Ration Card; VAO Agricultural Land/Labor Certificate; Bank Passbook',
    mandatory_documents: 'Member Card / VAO Certificate; Aadhaar Card; Bank Details',
    official_source_url: 'https://www.tn.gov.in',
    source_platform: 'TN Revenue Department',
    last_verified_date: '2026-08-25',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'CEN-WM-001',
    scheme_name: 'Sukanya Samriddhi Yojana (SSY)',
    category_type: 'Central',
    sector_category: 'Women & Child',
    sub_sector: 'Financial Security for Girl Child',
    issuing_department: 'Department of Posts / Ministry of Finance',
    min_age: 0,
    max_age: 10,
    income_limit_annual: null,
    is_estimate: false,
    gender: 'Female',
    gender_notes: 'Girl child up to 10 years of age.',
    social_category: 'All',
    occupation_criteria: 'Child / Student',
    residency_requirement: 'Resident of India',
    eligibility_state: 'All',
    other_conditions: 'Account opened by parents/legal guardian in the name of a girl child from her birth up to age 10. Maximum 2 accounts per family (except twins/triplets).',
    description: 'Small savings deposit scheme under Beti Bachao Beti Padhao initiative offering guaranteed interest rates and triple tax exemptions to secure the higher education and marriage expenses of girl children.',
    benefits: 'Government guaranteed interest rate (8.2% p.a.), Section 80C tax deduction up to Rs. 1.5 Lakh/year, tax-free interest, and tax-free maturity payout at 21 years.',
    application_mode: 'Post Office / Public & Private Bank Branches',
    application_process: '1. Obtain SSY form from any Post Office or bank. 2. Attach girl birth certificate and parents KYC. 3. Deposit initial minimum amount of Rs. 250. 4. Passbook issued.',
    application_url: 'https://www.indiapost.gov.in',
    required_documents: 'Birth Certificate of the girl child; Aadhaar Card and PAN card of parent/guardian; Address proof; Passport size photos',
    mandatory_documents: 'Girl Birth Certificate; Guardian Aadhaar; Guardian PAN',
    official_source_url: 'https://www.indiapost.gov.in',
    source_platform: 'India Post / RBI',
    last_verified_date: '2026-09-01',
    scheme_status: 'Active'
  },
  {
    scheme_id: 'TN-SC-002',
    scheme_name: 'Free Laptop Scheme for Students (Tamil Nadu)',
    category_type: 'Tamil Nadu',
    sector_category: 'Education & Learning',
    sub_sector: 'Digital Inclusion for Students',
    issuing_department: 'Special Programme Implementation / School & Higher Education Department',
    min_age: 15,
    max_age: 22,
    income_limit_annual: null,
    is_estimate: false,
    gender: 'All',
    gender_notes: 'All eligible students.',
    social_category: 'All',
    occupation_criteria: 'Student',
    residency_requirement: 'Resident of Tamil Nadu',
    eligibility_state: 'Tamil Nadu',
    other_conditions: 'Students studying in Tamil Nadu Government and Government-aided higher secondary schools (Class 12) or polytechnic/arts & science colleges.',
    description: 'Equips government school and college students with modern portable computers to facilitate digital learning and bridge the digital divide.',
    benefits: 'Free branded laptop preloaded with educational software, operating system, and digital curriculum resources with zero cost to the student.',
    application_mode: 'Institution-based Automatic Distribution',
    application_process: '1. Handled directly by school Headmaster or College Principal via ELCOT procurement. 2. Students verified through EMIS database. 3. Laptops distributed at official school ceremonies.',
    application_url: 'https://elcot.in',
    required_documents: 'School / College Identity Card; EMIS registration number; Aadhaar Card copy',
    mandatory_documents: 'School ID; EMIS Record',
    official_source_url: 'https://www.tnschools.gov.in',
    source_platform: 'ELCOT / TN School Education',
    last_verified_date: '2026-07-20',
    scheme_status: 'Active'
  }
];

// ---------------------------------------------------------------------------
// 2. CSV PARSING & DATA LOADER
// ---------------------------------------------------------------------------
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\r') {
      // ignore
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function isHeaderRow(cells) {
  const normalized = cells.map((c) => String(c || '').trim().toLowerCase());
  return normalized.includes('scheme_name') && normalized.includes('description');
}

export function toNumberOrNull(value) {
  if (!value) return null;
  const num = Number(String(value).replace(/[^\d.-]/g, ''));
  return Number.isNaN(num) ? null : num;
}

export function schemesFromCsvRows(rows) {
  let headerMap = null;
  const schemes = [];

  for (const cells of rows) {
    if (isHeaderRow(cells)) {
      headerMap = {};
      cells.forEach((cell, idx) => {
        const key = String(cell || '').trim().toLowerCase();
        if (key) headerMap[key] = idx;
      });
      continue;
    }

    if (!headerMap) continue;

    const get = (field) => {
      const idx = headerMap[field];
      if (idx === undefined) return '';
      return (cells[idx] || '').trim();
    };

    const schemeId = get('scheme_id');
    const schemeName = get('scheme_name');
    if (!schemeId || !schemeName) continue;

    schemes.push({
      scheme_id: schemeId,
      scheme_name: schemeName,
      category_type: get('category_type') || 'Central',
      sector_category: get('sector_category') || 'Social Welfare',
      sub_sector: get('sub_sector') || null,
      issuing_department: get('issuing_department') || null,
      min_age: toNumberOrNull(get('min_age')),
      max_age: toNumberOrNull(get('max_age')),
      income_limit_annual: toNumberOrNull(get('income_limit_annual')),
      is_estimate: /yes|true/i.test(get('is_estimate')),
      gender: get('gender') || 'All',
      gender_notes: get('gender_notes') || null,
      social_category: get('social_category') || 'All',
      occupation_criteria: get('occupation_criteria') || 'All',
      residency_requirement: get('residency_requirement') || null,
      eligibility_state: get('eligibility_state') || null,
      other_conditions: get('other_conditions') || null,
      description: get('description') || null,
      benefits: get('benefits') || null,
      application_mode: get('application_mode') || 'Online',
      application_process: get('application_process') || null,
      application_url: get('application_url') || null,
      required_documents: get('required_documents') || get('mandatory_documents') || null,
      mandatory_documents: get('mandatory_documents') || null,
      official_source_url: get('official_source_url') || null,
      source_platform: get('source_platform') || null,
      last_verified_date: get('last_verified_date') || null,
      scheme_status: get('scheme_status') || 'Active'
    });
  }

  return schemes;
}

// ---------------------------------------------------------------------------
// 3. RULE-BASED ENGINE STATE & KNOWLEDGE BASE
// ---------------------------------------------------------------------------
export class AskUnioraRuleEngine {
  constructor() {
    this.schemes = [];
    this.isLoaded = false;
    this.dataSource = 'Initializing...';
    this.schemeIndex = new Map();
    this.context = {
      lastScheme: null,
      lastSector: null,
      lastCategory: null,
      conversationTurn: 0
    };
  }

  async loadSchemesData() {
    // 1. Check local storage cache
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        const cached = window.localStorage.getItem(CACHE_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.timestamp && (Date.now() - parsed.timestamp < CACHE_EXPIRY_MS) && Array.isArray(parsed.schemes) && parsed.schemes.length > 0) {
            this.setCatalog(parsed.schemes, `Cached Data (${parsed.schemes.length} Schemes)`);
          }
        }
      }
    } catch (e) {
      console.warn('[AskUniora] Local storage cache read failed:', e);
    }

    // 2. Fetch fresh live Google Sheet data
    try {
      const allRows = [];
      for (const gid of SHEET_TAB_GIDS) {
        const gidParam = gid ? `&gid=${encodeURIComponent(gid)}` : '';
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv${gidParam}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Google Sheet fetch error HTTP ${response.status}`);
        }
        const csvText = await response.text();
        allRows.push(...parseCSV(csvText));
      }

      const liveSchemes = schemesFromCsvRows(allRows);
      if (liveSchemes.length > 0) {
        const merged = this.mergeWithFallback(liveSchemes);
        this.setCatalog(merged, `Live Catalog (${merged.length} Schemes)`);

        try {
          if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            window.localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify({
              timestamp: Date.now(),
              schemes: merged
            }));
          }
        } catch (e) {
          // Ignore quota
        }
        return this.schemes;
      }
    } catch (err) {
      console.warn('[AskUniora] Live Google Sheets fetch fallback:', err);
    }

    if (!this.schemes || this.schemes.length === 0) {
      this.setCatalog(FALLBACK_SCHEMES, `Verified Catalog (${FALLBACK_SCHEMES.length} Schemes)`);
    }

    return this.schemes;
  }

  mergeWithFallback(liveSchemes) {
    const map = new Map();
    liveSchemes.forEach(s => map.set(this.normalizeName(s.scheme_name), s));
    FALLBACK_SCHEMES.forEach(f => {
      const key = this.normalizeName(f.scheme_name);
      if (map.has(key)) {
        const existing = map.get(key);
        map.set(key, { ...existing, ...f });
      } else {
        map.set(key, f);
      }
    });
    return Array.from(map.values());
  }

  setCatalog(schemesList, sourceLabel) {
    this.schemes = schemesList;
    this.dataSource = sourceLabel;
    this.isLoaded = true;
    this.schemeIndex.clear();

    schemesList.forEach(s => {
      if (s.scheme_name) {
        this.schemeIndex.set(this.normalizeName(s.scheme_name), s);
      }
      if (s.scheme_id) {
        this.schemeIndex.set(s.scheme_id.toLowerCase().trim(), s);
      }
    });
  }

  normalizeName(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // ---------------------------------------------------------------------------
  // 4. RULE-BASED INTENT AND ENTITY PARSER (ZERO EMOJIS, CLEAN OUTPUT)
  // ---------------------------------------------------------------------------
  processQuery(rawInput) {
    this.context.conversationTurn++;
    const input = String(rawInput || '').trim();
    const lower = input.toLowerCase();
    const cleanWords = lower.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);

    // Rule 1: Empty input
    if (!input || cleanWords.length === 0) {
      return {
        intent: 'EMPTY',
        text: "Please type a question or select one of the suggested topics below to explore Central and Tamil Nadu welfare schemes.",
        followUps: this.getDefaultFollowUps()
      };
    }

    // Rule 2: Greetings
    if (this.isGreeting(lower, cleanWords)) {
      return {
        intent: 'GREETING',
        text: `**Vanakkam and Welcome to Ask UNIORA.**\n\nI am your rule-based welfare guide for the **UNIORA Platform**. I can help you search, verify eligibility criteria, check required documents, and guide you through application procedures for **${this.schemes.length}+ Central and Tamil Nadu Government welfare schemes**.\n\nSelect a topic below or type your question:`,
        followUps: [
          { label: 'Student Scholarships', query: 'Show me scholarship schemes for students' },
          { label: 'Farmer Subsidies', query: 'What schemes are available for farmers?' },
          { label: 'Women Welfare (KMUT)', query: 'Schemes for women in Tamil Nadu' },
          { label: 'Healthcare & Insurance', query: 'Tell me about medical and health schemes' },
          { label: 'Tamil Nadu State Schemes', query: 'Show all Tamil Nadu state schemes' },
          { label: 'About UNIORA Platform', query: 'What is UNIORA and how does it work?' }
        ]
      };
    }

    // Rule 3: Courtesy / Thank you
    if (this.isGratitudeOrBye(lower)) {
      return {
        intent: 'COURTESY',
        text: "You are welcome. If you require further information regarding government schemes, criteria, certificates, or subsidies, feel free to ask anytime.",
        followUps: [
          { label: 'Search More Schemes', query: 'Explore welfare schemes' },
          { label: 'Required Documents Guide', query: 'What documents are generally needed?' }
        ]
      };
    }

    // Rule 4: About UNIORA
    if (this.isAboutUniora(lower)) {
      return {
        intent: 'ABOUT_UNIORA',
        text: `**About UNIORA Welfare Platform:**\n\n**UNIORA** is a unified, accessible digital portal designed for citizens of India and Tamil Nadu to bridge the gap between government welfare programs and beneficiaries.\n\n### Core Platform Features:\n1. **Scheme Discovery (Feature 01):** Browse 577+ active schemes with real-time sector and demographic filters.\n2. **Ask Uniora (Feature 02):** Instant rule-based answers on benefits, eligibility, and documents.\n3. **Document Verification (Feature 03):** Automated inspection of certificates (Aadhaar, Income, Community, etc.).\n4. **Eligible Schemes (Feature 04):** Personalized match engine based on citizen profile.\n5. **My Readiness Score (Feature 05):** Readiness gauge calculating citizen document preparedness.\n6. **Nearby Government Services (Feature 06):** Geographic discovery of nearest e-Sevai centers and Taluk offices.`,
        followUps: [
          { label: 'Explore Top Schemes', query: 'What are the top welfare schemes?' },
          { label: 'How to Check Eligibility', query: 'How does eligibility matching work?' },
          { label: 'Tamil Nadu State Schemes', query: 'Show Tamil Nadu welfare schemes' }
        ]
      };
    }

    // Rule 5: General Documents
    if (this.isGeneralDocumentQuery(lower)) {
      return this.handleGeneralDocumentsQuery();
    }

    // Rule 6: General Eligibility
    if (this.isGeneralEligibilityQuery(lower)) {
      return this.handleGeneralEligibilityQuery();
    }

    // Rule 7: General Application
    if (this.isGeneralApplyQuery(lower)) {
      return this.handleGeneralApplyQuery();
    }

    // Rule 8: Specific Scheme Identification
    const specificScheme = this.findSpecificScheme(lower);
    if (specificScheme) {
      return this.handleSpecificSchemeQuery(specificScheme, lower);
    }

    // Rule 9: Contextual Scheme Attribute Follow-Up
    if (this.context.lastScheme && this.isAttributeFollowUp(lower)) {
      return this.handleSpecificSchemeQuery(this.context.lastScheme, lower);
    }

    // Rule 10: Column-based Sector / Category Queries
    const sectorMatch = this.detectSectorOrDemographic(lower);
    if (sectorMatch) {
      return this.handleSectorQuery(sectorMatch, lower);
    }

    // Rule 11: Level / Category Filter Queries
    if (lower.includes('tamil nadu') || lower.includes('tn scheme') || lower.includes('state scheme')) {
      return this.handleCategoryQuery('Tamil Nadu', lower);
    }
    if (lower.includes('central scheme') || lower.includes('central govt') || lower.includes('india scheme') || lower.includes('national scheme')) {
      return this.handleCategoryQuery('Central', lower);
    }

    // Rule 12: Keyword Ranking Fallback
    return this.handleFuzzySearch(lower);
  }

  isGreeting(lower, words) {
    const greetings = ['hi', 'hello', 'hey', 'vanakkam', 'namaste', 'namaskaram', 'good morning', 'good afternoon', 'good evening', 'greetings', 'start'];
    if (greetings.includes(lower)) return true;
    return words.length <= 2 && words.some(w => ['hi', 'hello', 'hey', 'vanakkam'].includes(w));
  }

  isGratitudeOrBye(lower) {
    return /\b(thank you|thanks|thx|nandri|bye|goodbye|see you|great thanks|ok thanks|okay thanks)\b/i.test(lower);
  }

  isAboutUniora(lower) {
    return /\b(what is uniora|who are you|about uniora|how does uniora work|what can you do|help me|how to use|features of uniora)\b/i.test(lower);
  }

  isGeneralDocumentQuery(lower) {
    const isGeneral = !this.findSpecificScheme(lower) && !this.context.lastScheme;
    return isGeneral && /\b(documents? (needed|required|list)|what documents|common documents|which certificates|certificates required)\b/i.test(lower);
  }

  isGeneralEligibilityQuery(lower) {
    const isGeneral = !this.findSpecificScheme(lower) && !this.context.lastScheme;
    return isGeneral && /\b(how (to|can i) check (my )?eligibility|am i eligible|eligibility criteria general|how do i know if i qualify)\b/i.test(lower);
  }

  isGeneralApplyQuery(lower) {
    const isGeneral = !this.findSpecificScheme(lower) && !this.context.lastScheme;
    return isGeneral && /\b(how to apply|where to apply|application process general|how do i register|e-sevai application)\b/i.test(lower);
  }

  isAttributeFollowUp(lower) {
    return /\b(benefit|benefits|amount|money|cash|stipend|eligib|criteria|who can apply|age limit|income limit|document|documents|doc|docs|paper|certificate|apply|application|process|step|steps|portal|website|link|source)\b/i.test(lower);
  }

  findSpecificScheme(rawLower) {
    const lower = String(rawLower || '').toLowerCase();
    const cleanSpaced = lower.replace(/[-_./]/g, ' ');
    const cleanMerged = lower.replace(/[^a-z0-9]/g, '');

    const aliases = [
      { keys: ['tamil pudhalvan', 'tamil puthalvan', 'pudhalvan', 'tamilpudhalvan'], id: 'TN-HE-001' },
      { keys: ['pudhumai penn', 'pudumai pen', 'pen kalvi', 'moovalur ramamirtham', 'pudhumaipenn', 'penkalvi'], id: 'TN-SW-002' },
      { keys: ['kalaignar magalir', 'magalir urimai', 'kmut', '1000 rupees women', '1000 scheme', 'magalirurimai'], id: 'TN-SW-004' },
      { keys: ['pm kisan', 'pmkisan', 'kisan samman', 'kisan nidhi', '6000 scheme', 'pm kisan samman'], id: 'CEN-AG-001' },
      { keys: ['ayushman', 'pm-jay', 'pmjay', 'jan arogya', '5 lakh health', 'ayushman bharat'], id: 'CEN-HL-001' },
      { keys: ['cmchis', 'chief minister comprehensive health', 'tn health insurance', 'cm health insurance'], id: 'TN-HL-001' },
      { keys: ['naan mudhalvan', 'naanmudhalvan', 'mudhalvan'], id: 'TN-SD-003' },
      { keys: ['post matric scholarship', 'disabilities scholarship', 'post-dis', 'postdis', 'disability scholarship'], id: 'CEN-ED-001' },
      { keys: ['mudra', 'mudra loan', 'pmmy', 'shishu loan', 'tarun loan', 'kishore loan'], id: 'CEN-MS-001' },
      { keys: ['solar pump', 'solar powered pump', 'uzhavan solar', 'solarpump'], id: 'TN-AG-002' },
      { keys: ['pm awas', 'awas yojana', 'pmay', 'housing scheme', 'pucca house', 'pmawas'], id: 'CEN-HS-001' },
      { keys: ['vishwakarma', 'pm vishwakarma', 'artisan scheme', '15000 toolkit', 'pmvishwakarma'], id: 'CEN-VK-001' },
      { keys: ['uzhavar pathukappu', 'farmer security', 'farmers social security', 'uzhavarpathukappu'], id: 'TN-SC-001' },
      { keys: ['sukanya', 'sukanya samriddhi', 'ssy', 'girl child savings', 'sukanyasamriddhi'], id: 'CEN-WM-001' },
      { keys: ['free laptop', 'laptop scheme', 'tn laptop', 'freelaptop'], id: 'TN-SC-002' }
    ];

    for (const alias of aliases) {
      if (alias.keys.some(k => lower.includes(k) || cleanSpaced.includes(k) || cleanMerged.includes(k.replace(/\s+/g, '')))) {
        const found = this.schemes.find(s => s.scheme_id === alias.id);
        if (found) return found;
      }
    }

    for (const scheme of this.schemes) {
      const sName = scheme.scheme_name.toLowerCase();
      const sNameClean = sName.replace(/[^a-z0-9]/g, '');
      if (sName.length > 5 && (cleanSpaced.includes(sName) || cleanMerged.includes(sNameClean))) {
        return scheme;
      }
    }

    return null;
  }

  handleSpecificSchemeQuery(scheme, lower) {
    this.context.lastScheme = scheme;

    const askingBenefits = /\b(benefit|benefits|amount|money|cash|stipend|financial assistance|payout|subsidy|how much)\b/i.test(lower);
    const askingEligibility = /\b(eligible|eligibility|qualif\w*|criteria|who can|age limit|income limit|caste|social category|gender|requirement|conditions)\b/i.test(lower);
    const askingDocuments = /\b(document|documents|doc|docs|paper|papers|certificate|certificates|proof|proofs|ration card|aadhaar|income cert)\b/i.test(lower);
    const askingApplication = /\b(apply|applying|how to apply|application|process|step|steps|procedure|portal|link|website|online|registration)\b/i.test(lower);

    const followUps = [
      { label: 'Benefits & Amount', query: `What are the benefits of ${scheme.scheme_name}?` },
      { label: 'Eligibility Criteria', query: `What is the eligibility for ${scheme.scheme_name}?` },
      { label: 'Required Documents', query: `What documents are needed for ${scheme.scheme_name}?` },
      { label: 'How to Apply', query: `How to apply for ${scheme.scheme_name}?` },
      { label: 'Similar Schemes', query: `Show more ${scheme.sector_category} schemes` }
    ];

    // Branch 1: Specific question on BENEFITS
    if (askingBenefits && !askingEligibility && !askingDocuments && !askingApplication) {
      return {
        intent: 'SCHEME_BENEFITS',
        text: `### Financial and Welfare Benefits: ${scheme.scheme_name}\n\n` +
          `${scheme.benefits || 'Financial and material assistance as notified by the issuing department.'}\n\n` +
          `**Key Details:**\n` +
          `- **Issuing Department:** ${scheme.issuing_department || 'Government Department'}\n` +
          `- **Scheme Type:** ${scheme.category_type} Welfare Initiative\n` +
          `- **Current Status:** ${scheme.scheme_status || 'Active'}\n\n` +
          `Would you like to check the eligibility criteria or required documents for this scheme?`,
        schemes: [scheme],
        followUps: followUps.filter(f => !f.label.includes('Benefits'))
      };
    }

    // Branch 2: Specific question on ELIGIBILITY
    if (askingEligibility && !askingBenefits && !askingDocuments && !askingApplication) {
      let ageText = 'No specific age limit';
      if (scheme.min_age && scheme.max_age) ageText = `${scheme.min_age} to ${scheme.max_age} years`;
      else if (scheme.min_age) ageText = `Minimum ${scheme.min_age} years`;
      else if (scheme.max_age) ageText = `Maximum ${scheme.max_age} years`;

      const incomeText = scheme.income_limit_annual ? `Family annual income must be <= Rs. ${scheme.income_limit_annual.toLocaleString('en-IN')}` : 'No annual income cap specified';

      return {
        intent: 'SCHEME_ELIGIBILITY',
        text: `### Eligibility Criteria: ${scheme.scheme_name}\n\n` +
          `- **Target Gender:** ${scheme.gender || 'All'}${scheme.gender_notes ? ` (${scheme.gender_notes})` : ''}\n` +
          `- **Age Range:** ${ageText}\n` +
          `- **Income Ceiling:** ${incomeText}\n` +
          `- **Social Category:** ${scheme.social_category || 'All Categories (SC/ST/OBC/General)'}\n` +
          `- **Occupation / Role:** ${scheme.occupation_criteria || 'All Citizens'}\n` +
          `- **Residency / State:** ${scheme.residency_requirement || scheme.eligibility_state || 'Resident of India'}\n` +
          (scheme.other_conditions ? `- **Additional Conditions:** ${scheme.other_conditions}\n` : '') +
          `\nSelect an option below to verify required certificates or application instructions:`,
        schemes: [scheme],
        followUps: followUps.filter(f => !f.label.includes('Eligibility'))
      };
    }

    // Branch 3: Specific question on DOCUMENTS
    if (askingDocuments && !askingBenefits && !askingEligibility && !askingApplication) {
      const docsList = scheme.required_documents || scheme.mandatory_documents || 'Aadhaar Card, Proof of Residence, Bank Passbook, Passport Photo';
      const formattedDocs = docsList.split(/;\s*|\n|,\s*(?=[A-Z])/).filter(Boolean).map(d => `- **${d.trim()}**`).join('\n');

      return {
        intent: 'SCHEME_DOCUMENTS',
        text: `### Required Documents: ${scheme.scheme_name}\n\n` +
          `To submit an application, prepare the following verified documents:\n\n` +
          `${formattedDocs}\n\n` +
          `> Note: You can verify your certificates using the Document Verification feature in UNIORA to prevent application rejection.\n\n` +
          `Would you like step-by-step instructions on how to apply?`,
        schemes: [scheme],
        followUps: followUps.filter(f => !f.label.includes('Documents'))
      };
    }

    // Branch 4: Specific question on APPLICATION PROCESS
    if (askingApplication) {
      const mode = scheme.application_mode || 'Online';
      const process = scheme.application_process || '1. Visit the official government portal.\n2. Complete registration with Aadhaar.\n3. Fill application form and upload documents.\n4. Submit and track acknowledgement number.';
      const url = scheme.application_url || scheme.official_source_url || 'https://www.myscheme.gov.in';

      return {
        intent: 'SCHEME_APPLICATION',
        text: `### How to Apply: ${scheme.scheme_name}\n\n` +
          `- **Application Mode:** ${mode}\n` +
          `- **Official Application Portal:** [${url}](${url})\n` +
          `- **Issuing Department:** ${scheme.issuing_department || 'Government of Tamil Nadu / Central'}\n\n` +
          `#### Step-by-Step Procedure:\n` +
          `${process.replace(/;\s*|\n(?=\d+\.)/g, '\n')}\n\n` +
          `Ensure all required documents are ready before beginning your registration.`,
        schemes: [scheme],
        followUps: followUps.filter(f => !f.label.includes('Apply'))
      };
    }

    // Default Overview Card
    return {
      intent: 'SCHEME_OVERVIEW',
      text: `### ${scheme.scheme_name} (${scheme.category_type} Scheme)\n\n` +
        `**Department:** ${scheme.issuing_department || 'State / Central Government'}\n` +
        `**Sector:** ${scheme.sector_category} ${scheme.sub_sector ? `• ${scheme.sub_sector}` : ''}\n\n` +
        `**Overview:**\n${scheme.description || 'Government welfare initiative providing targeted social and financial support to eligible citizens.'}\n\n` +
        `**Primary Benefit:**\n${scheme.benefits || 'Direct cash benefit / subsidized service.'}\n\n` +
        `Select any option below to view more details regarding this scheme:`,
      schemes: [scheme],
      followUps: followUps
    };
  }

  // ---------------------------------------------------------------------------
  // 5. SECTOR & DEMOGRAPHIC COLUMN-BASED REASONING
  // ---------------------------------------------------------------------------
  detectSectorOrDemographic(lower) {
    const sectors = [
      {
        id: 'education',
        name: 'Education & Learning',
        label: 'Student & Education Schemes',
        keywords: ['student', 'education', 'study', 'college', 'school', 'scholarship', 'scholarships', 'degree', 'polytechnic', 'exam', 'fees', 'hostel', 'stipend student', 'laptop'],
        columnMatcher: (s) => /education|learning|scholarship/i.test(s.sector_category || '') || /student/i.test(s.occupation_criteria || '')
      },
      {
        id: 'agriculture',
        name: 'Agriculture',
        label: 'Farmer & Agriculture Schemes',
        keywords: ['farmer', 'farmers', 'agriculture', 'farming', 'crop', 'tractor', 'kisan', 'irrigation', 'seeds', 'fertilizer', 'harvest', 'cultivator', 'patta', 'uzhavar'],
        columnMatcher: (s) => /agri/i.test(s.sector_category || '') || /farmer/i.test(s.occupation_criteria || '')
      },
      {
        id: 'women',
        name: 'Women & Child',
        label: 'Women Welfare & Empowerment Schemes',
        keywords: ['women', 'woman', 'girl', 'mother', 'maternity', 'female', 'widow', 'magalir', 'urimai', 'daughter', 'ladies'],
        columnMatcher: (s) => /women|child/i.test(s.sector_category || '') || /female/i.test(s.gender || '')
      },
      {
        id: 'health',
        name: 'Health & Wellness',
        label: 'Healthcare & Medical Schemes',
        keywords: ['health', 'hospital', 'medical', 'medicine', 'treatment', 'doctor', 'surgery', 'ayushman', 'cmchis', 'insurance health', 'clinic'],
        columnMatcher: (s) => /health|wellness|medical/i.test(s.sector_category || '')
      },
      {
        id: 'employment',
        name: 'Employment & Skills',
        label: 'Job & Skill Development Schemes',
        keywords: ['job', 'employment', 'unemployed', 'skill', 'training', 'career', 'mudhalvan', 'placement', 'internship', 'youth'],
        columnMatcher: (s) => /employment|skill/i.test(s.sector_category || '') || /unemployed/i.test(s.occupation_criteria || '')
      },
      {
        id: 'business',
        name: 'Banking, Financial Services & Insurance',
        label: 'Business, MSME & Loan Schemes',
        keywords: ['loan', 'business', 'msme', 'shop', 'startup', 'mudra', 'credit', 'subsidy loan', 'trader', 'entrepreneur'],
        columnMatcher: (s) => /banking|financial|business/i.test(s.sector_category || '')
      },
      {
        id: 'disability',
        name: 'Social Welfare & Empowerment',
        label: 'Differently Abled & Special Needs Schemes',
        keywords: ['disability', 'disabled', 'differently abled', 'handicapped', 'pwd', 'special needs', 'wheelchair'],
        columnMatcher: (s) => /disabilit|differently/i.test(s.other_conditions || '') || /disabilit/i.test(s.description || '') || /disabilit/i.test(s.scheme_name || '')
      },
      {
        id: 'housing',
        name: 'Housing & Shelter',
        label: 'Housing & Shelter Schemes',
        keywords: ['house', 'housing', 'shelter', 'awas', 'pucca house', 'home loan', 'patta site'],
        columnMatcher: (s) => /housing|shelter/i.test(s.sector_category || '') || /awas/i.test(s.scheme_name || '')
      }
    ];

    for (const sector of sectors) {
      if (sector.keywords.some(k => lower.includes(k))) {
        return sector;
      }
    }
    return null;
  }

  handleSectorQuery(sectorMatch, lower) {
    this.context.lastSector = sectorMatch.id;

    let matches = this.schemes.filter(sectorMatch.columnMatcher);
    if (matches.length === 0) {
      matches = this.schemes.filter(s => {
        const text = `${s.scheme_name} ${s.description} ${s.sector_category}`.toLowerCase();
        return sectorMatch.keywords.some(k => text.includes(k));
      });
    }

    const tnFilter = lower.includes('tamil nadu') || lower.includes('tn');
    const centralFilter = lower.includes('central') || lower.includes('india');
    if (tnFilter) {
      matches = matches.filter(s => /tamil nadu|state/i.test(s.category_type || '') || /tamil nadu/i.test(s.eligibility_state || ''));
    } else if (centralFilter) {
      matches = matches.filter(s => /central/i.test(s.category_type || ''));
    }

    const topList = matches.slice(0, 4);

    const followUps = [
      { label: `Tamil Nadu ${sectorMatch.label.split(' ')[0]}`, query: `Show Tamil Nadu ${sectorMatch.name} schemes` },
      { label: `Central Govt ${sectorMatch.label.split(' ')[0]}`, query: `Show Central ${sectorMatch.name} schemes` },
      { label: 'Check Financial Benefits', query: `What are the benefits for ${sectorMatch.name} schemes?` },
      { label: 'Required Documents', query: `What documents are needed for ${sectorMatch.name} schemes?` },
      { label: 'Eligibility Rules', query: `Who is eligible for ${sectorMatch.name} schemes?` }
    ];

    let responseText = `### Top ${sectorMatch.label} (${matches.length} Schemes Available)\n\n` +
      `Here are the most popular and verified welfare schemes matching your query:\n\n`;

    topList.forEach((s, idx) => {
      responseText += `${idx + 1}. **${s.scheme_name}** (${s.category_type})\n` +
        `   - **Benefit:** ${s.benefits ? s.benefits.slice(0, 140) + '...' : 'Welfare and subsidy support.'}\n` +
        `   - **Target Group:** ${s.gender !== 'All' ? s.gender + ' • ' : ''}${s.occupation_criteria || 'General'}\n\n`;
    });

    responseText += `Select any option below to view more details by column:`;

    return {
      intent: 'SECTOR_MATCH',
      text: responseText,
      schemes: topList,
      followUps: followUps
    };
  }

  handleCategoryQuery(category, lower) {
    this.context.lastCategory = category;

    const matches = this.schemes.filter(s => {
      if (category === 'Tamil Nadu') {
        return /tamil nadu|state/i.test(s.category_type || '') || /tamil nadu/i.test(s.eligibility_state || '');
      }
      return /central/i.test(s.category_type || '');
    });

    const topList = matches.slice(0, 4);

    const followUps = [
      { label: `${category} Scholarships`, query: `Show ${category} education and student schemes` },
      { label: `${category} Farmer Subsidies`, query: `Show ${category} agriculture and farmer schemes` },
      { label: `${category} Women Schemes`, query: `Show ${category} women welfare schemes` },
      { label: `${category} Healthcare Aid`, query: `Show ${category} health and insurance schemes` },
      { label: category === 'Tamil Nadu' ? 'Switch to Central Schemes' : 'Switch to Tamil Nadu Schemes', query: category === 'Tamil Nadu' ? 'Show Central government schemes' : 'Show Tamil Nadu state schemes' }
    ];

    let responseText = `### ${category} Government Welfare Schemes (${matches.length} Total Schemes)\n\n` +
      `UNIORA monitors all active schemes administered by ${category === 'Tamil Nadu' ? 'Government of Tamil Nadu departments' : 'Central Ministries of India'}.\n\n`;

    topList.forEach((s, idx) => {
      responseText += `${idx + 1}. **${s.scheme_name}**\n` +
        `   - **Department:** ${s.issuing_department || 'State / Central Dept'}\n` +
        `   - **Key Benefit:** ${s.benefits ? s.benefits.slice(0, 130) + '...' : 'Financial & Social Support'}\n\n`;
    });

    responseText += `Which sector would you like to explore in **${category}**? Choose an option below:`;

    return {
      intent: 'CATEGORY_FILTER',
      text: responseText,
      schemes: topList,
      followUps: followUps
    };
  }

  // ---------------------------------------------------------------------------
  // 6. GENERAL FAQ HANDLERS (DOCUMENTS, ELIGIBILITY, APPLICATION)
  // ---------------------------------------------------------------------------
  handleGeneralDocumentsQuery() {
    return {
      intent: 'GENERAL_DOCUMENTS',
      text: `### Standard Documents Required for Welfare Schemes in India & Tamil Nadu\n\n` +
        `Most Central and State schemes require a core set of government-verified certificates:\n\n` +
        `1. **Identity and Age Verification:**\n` +
        `   - **Aadhaar Card** (Mandatory for Direct Benefit Transfer DBT)\n` +
        `   - Birth Certificate / School Leaving Certificate (SSLC Marksheet)\n\n` +
        `2. **Family and Residence Records:**\n` +
        `   - **Tamil Nadu Smart Family Ration Card** (Essential for State welfare and KMUT)\n` +
        `   - Nativity / Domicile Certificate issued by Revenue Tahsildar\n\n` +
        `3. **Financial and Community Status:**\n` +
        `   - **Income Certificate** (Current financial year, issued by Revenue Department)\n` +
        `   - **Community / Caste Certificate** (SC / ST / BC / MBC / Minority)\n\n` +
        `4. **Financial Disbursal:**\n` +
        `   - **Bank Account Passbook** with Aadhaar NPCI seeding for direct bank transfers\n\n` +
        `5. **Occupation-Specific Proofs:**\n` +
        `   - Student: EMIS Number, College Bonafide Certificate, Marksheets\n` +
        `   - Farmer: Land Patta, Chitta, Adangal revenue documents\n` +
        `   - Differently Abled: UDID Card or RPwD Medical Board Certificate (>= 40% benchmark)\n\n` +
        `> Note: You can verify your certificates directly using the Document Verification feature in the navigation menu.`,
      followUps: [
        { label: 'Student Scholarship Documents', query: 'What documents are required for scholarships?' },
        { label: 'Farmer Scheme Documents', query: 'What documents are needed for farmer schemes?' },
        { label: 'Women Scheme Documents', query: 'What documents are required for Kalaignar Magalir Urimai Thogai?' },
        { label: 'How to Check Eligibility', query: 'How to check my eligibility for schemes?' }
      ]
    };
  }

  handleGeneralEligibilityQuery() {
    return {
      intent: 'GENERAL_ELIGIBILITY',
      text: `### How Scheme Eligibility is Determined on UNIORA\n\n` +
        `Every government scheme uses specific rule parameters mapped to demographic columns:\n\n` +
        `1. **Age Limits:** Minimum and maximum age criteria (e.g. Pudhumai Penn: 17 to 26 years, PM-KISAN: 18+).\n` +
        `2. **Annual Family Income:** Ceiling thresholds (e.g. Rs. 2.5 Lakh for scholarships, Rs. 1.2 Lakh for CMCHIS).\n` +
        `3. **Target Gender:** Specific programs for female beneficiaries (Pudhumai Penn, KMUT, Sukanya Samriddhi) or male beneficiaries (Tamil Pudhalvan).\n` +
        `4. **Social Category:** Reservations and waivers for SC, ST, OBC, MBC, and Minority groups.\n` +
        `5. **Occupation:** Specific classifications such as Student, Farmer, Artisan, Small Business Owner, or Unemployed Youth.\n` +
        `6. **State Domicile:** Central schemes cover all Indian states; Tamil Nadu schemes require state domicile or government school study.\n\n` +
        `> Note: Use Eligible Schemes (Feature 04) to automatically evaluate your profile against all 577+ schemes, or use My Readiness (Feature 05) to check your readiness score.`,
      followUps: [
        { label: 'Farmer Eligibility', query: 'Who is eligible for PM Kisan?' },
        { label: 'Women Scheme Eligibility', query: 'Who is eligible for Kalaignar Magalir Urimai Thogai?' },
        { label: 'Student Eligibility', query: 'Who is eligible for Pudhumai Penn and Tamil Pudhalvan?' },
        { label: 'No Income Limit Schemes', query: 'Show schemes with no income limit' }
      ]
    };
  }

  handleGeneralApplyQuery() {
    return {
      intent: 'GENERAL_APPLICATION',
      text: `### How to Apply for Welfare Schemes (Central & Tamil Nadu)\n\n` +
        `Government schemes in Tamil Nadu are primarily applied through two major channels:\n\n` +
        `#### 1. Official Online Portals:\n` +
        `- **Central Schemes:** Apply via [National Scholarships Portal](https://scholarships.gov.in) (students), [PM-KISAN](https://pmkisan.gov.in) (farmers), or [MyScheme.gov.in](https://www.myscheme.gov.in).\n` +
        `- **Tamil Nadu State Schemes:** Apply via [tnesevai.tn.gov.in](https://www.tnesevai.tn.gov.in) or specific department portals (Pen Kalvi, Naan Mudhalvan, KMUT).\n\n` +
        `#### 2. Offline / Assisted Center Application:\n` +
        `- **e-Sevai Centers (CSC / TNeGA):** Located in every Taluk and Village Panchayat to help citizens fill applications, upload certificates, and submit biometrics.\n` +
        `- **Taluk Office / Revenue Inspector / VAO:** For obtaining vital certificates such as Income, Community, and Nativity.\n\n` +
        `> Note: Use Government Services Nearby (Feature 06) in UNIORA to locate the nearest official e-Sevai center.`,
      followUps: [
        { label: 'How to Apply for Pudhumai Penn', query: 'How to apply for Pudhumai Penn Scheme?' },
        { label: 'How to Apply for PM-KISAN', query: 'How to apply for PM-KISAN?' },
        { label: 'Documents Needed First', query: 'What documents do I need to prepare?' }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // 7. FUZZY TOKEN RANKING FALLBACK
  // ---------------------------------------------------------------------------
  handleFuzzySearch(lower) {
    const tokens = lower.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);

    if (tokens.length === 0) {
      return {
        intent: 'UNKNOWN',
        text: "I could not locate an exact match for your query. You can inquire about specific schemes (e.g. PM Kisan, Pudhumai Penn, KMUT) or browse by category:",
        followUps: this.getDefaultFollowUps()
      };
    }

    const scored = this.schemes.map(scheme => {
      let score = 0;
      const name = (scheme.scheme_name || '').toLowerCase();
      const desc = (scheme.description || '').toLowerCase();
      const benefits = (scheme.benefits || '').toLowerCase();
      const sector = (scheme.sector_category || '').toLowerCase();
      const dept = (scheme.issuing_department || '').toLowerCase();

      tokens.forEach(token => {
        if (name.includes(token)) score += 10;
        if (sector.includes(token)) score += 6;
        if (desc.includes(token)) score += 3;
        if (benefits.includes(token)) score += 3;
        if (dept.includes(token)) score += 2;
      });

      return { scheme, score };
    }).filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      const topMatches = scored.slice(0, 3).map(i => i.scheme);
      const top = topMatches[0];
      this.context.lastScheme = top;

      const followUps = topMatches.map(s => ({
        label: `${s.scheme_name.slice(0, 26)}...`,
        query: `Tell me about ${s.scheme_name}`
      }));

      followUps.push({
        label: 'Check Eligibility for Best Match',
        query: `What is the eligibility for ${top.scheme_name}?`
      });

      let responseText = `I found **${scored.length} welfare schemes** matching your query:\n\n`;
      topMatches.forEach((s, idx) => {
        responseText += `${idx + 1}. **${s.scheme_name}** (${s.category_type})\n` +
          `   - **Sector:** ${s.sector_category}\n` +
          `   - **Key Benefit:** ${s.benefits ? s.benefits.slice(0, 110) + '...' : 'Government social and financial assistance'}\n\n`;
      });

      responseText += `Select any option below to view full eligibility, required documents, or application steps:`;

      return {
        intent: 'SEARCH_RESULTS',
        text: responseText,
        schemes: topMatches,
        followUps: followUps
      };
    }

    return {
      intent: 'NO_MATCH',
      text: `No direct scheme was found matching "${lower}".\n\n` +
        `You can explore welfare schemes across the main government sectors:\n` +
        `- **Education & Scholarships** (Students, Higher Education, Hostels)\n` +
        `- **Agriculture & Farming** (Subsidies, Solar Pumps, Crop Insurance)\n` +
        `- **Women & Child Care** (Monthly Income, Maternity, Marriage Aid)\n` +
        `- **Health & Medical Care** (Ayushman Bharat, CMCHIS Cashless Treatment)\n` +
        `- **Employment & Business** (Mudra Loans, Naan Mudhalvan Upskilling)\n\n` +
        `Choose one of the suggestions below to get started:`,
      followUps: this.getDefaultFollowUps()
    };
  }

  getDefaultFollowUps() {
    return [
      { label: 'Student Scholarships', query: 'Show me scholarship schemes for students' },
      { label: 'Farmer Subsidies', query: 'What schemes are available for farmers?' },
      { label: 'Women Welfare (KMUT)', query: 'Tell me about Kalaignar Magalir Urimai Thogai' },
      { label: 'Healthcare & Insurance', query: 'Tell me about CMCHIS and Ayushman Bharat' },
      { label: 'Tamil Nadu State Schemes', query: 'Show Tamil Nadu welfare schemes' },
      { label: 'Common Documents Guide', query: 'What documents are commonly required for welfare schemes?' }
    ];
  }
}
