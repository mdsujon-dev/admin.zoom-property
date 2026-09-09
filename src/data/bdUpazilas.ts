/**
 * Upazilas (thanas) by district.
 *
 * The address form offered a plain text box for the thana, with a note saying a
 * half-complete dropdown would be worse than none — because a thana missing
 * from a closed list cannot be entered at all. That reasoning is right about a
 * `Select`, and wrong about the field: an `AutoComplete` suggests without
 * refusing, so a list that is 95% right helps 95% of the time and never blocks
 * the other 5%.
 *
 * ⚠️ Written from general knowledge, not from an official gazette. It is close
 * but it will have gaps and a few stale names — upazilas are created and
 * renamed by administrative order. Check it against the current list when you
 * get the chance; the form works either way, because anything typed is kept
 * whether it appears here or not.
 *
 * Metropolitan districts list their surrounding upazilas rather than their city
 * thanas: somebody registering a Dhaka address writes "Dhanmondi", which the
 * form accepts as free text, while "Savar" and "Keraniganj" are the ones worth
 * offering.
 */
export const BD_UPAZILAS: Record<string, string[]> = {
  /* ── Barishal ──────────────────────────────────────────────────────── */
  Barguna: ["Amtali", "Bamna", "Barguna Sadar", "Betagi", "Patharghata", "Taltali"],
  Barishal: [
    "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Barishal Sadar",
    "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur",
  ],
  Bhola: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
  Jhalokati: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"],
  Patuakhali: ["Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Patuakhali Sadar", "Rangabali"],
  Pirojpur: ["Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Pirojpur Sadar", "Zianagar"],

  /* ── Chattogram ────────────────────────────────────────────────────── */
  Bandarban: ["Alikadam", "Bandarban Sadar", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"],
  Brahmanbaria: [
    "Akhaura", "Ashuganj", "Bancharampur", "Bijoynagar", "Brahmanbaria Sadar",
    "Kasba", "Nabinagar", "Nasirnagar", "Sarail",
  ],
  Chandpur: ["Chandpur Sadar", "Faridganj", "Haimchar", "Hajiganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
  Chattogram: [
    "Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari",
    "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip",
    "Satkania", "Sitakunda",
  ],
  Cumilla: [
    "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Cumilla Adarsha Sadar",
    "Cumilla Sadar Dakshin", "Daudkandi", "Debidwar", "Homna", "Laksam",
    "Meghna", "Monohorgonj", "Muradnagar", "Nangalkot", "Titas",
  ],
  "Cox's Bazar": ["Chakaria", "Cox's Bazar Sadar", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia"],
  Feni: ["Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Fulgazi", "Parshuram", "Sonagazi"],
  Khagrachhari: ["Dighinala", "Khagrachhari Sadar", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"],
  Lakshmipur: ["Kamalnagar", "Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati"],
  Noakhali: ["Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat", "Noakhali Sadar", "Senbagh", "Sonaimuri", "Subarnachar"],
  Rangamati: [
    "Baghaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai", "Kawkhali",
    "Langadu", "Naniarchar", "Rajasthali", "Rangamati Sadar",
  ],

  /* ── Dhaka ─────────────────────────────────────────────────────────── */
  Dhaka: ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar"],
  Faridpur: ["Alfadanga", "Bhanga", "Boalmari", "Charbhadrasan", "Faridpur Sadar", "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha"],
  Gazipur: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
  Gopalganj: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
  Kishoreganj: [
    "Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj",
    "Katiadi", "Kishoreganj Sadar", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail",
  ],
  Madaripur: ["Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar"],
  Manikganj: ["Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar", "Saturia", "Shibalaya", "Singair"],
  Munshiganj: ["Gazaria", "Lohajang", "Munshiganj Sadar", "Sirajdikhan", "Sreenagar", "Tongibari"],
  Narayanganj: ["Araihazar", "Bandar", "Narayanganj Sadar", "Rupganj", "Sonargaon"],
  Narsingdi: ["Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur"],
  Rajbari: ["Baliakandi", "Goalandaghat", "Kalukhali", "Pangsha", "Rajbari Sadar"],
  Shariatpur: ["Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zanjira"],
  Tangail: [
    "Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail", "Gopalpur",
    "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Tangail Sadar",
  ],

  /* ── Khulna ────────────────────────────────────────────────────────── */
  Bagerhat: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
  Chuadanga: ["Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar"],
  Jashore: ["Abhaynagar", "Bagherpara", "Chaugachha", "Jashore Sadar", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
  Jhenaidah: ["Harinakunda", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
  Khulna: ["Batiaghata", "Dacope", "Dighalia", "Dumuria", "Koyra", "Paikgachha", "Phultala", "Rupsha", "Terokhada"],
  Kushtia: ["Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Kushtia Sadar", "Mirpur"],
  Magura: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
  Meherpur: ["Gangni", "Meherpur Sadar", "Mujibnagar"],
  Narail: ["Kalia", "Lohagara", "Narail Sadar"],
  Satkhira: ["Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar", "Shyamnagar", "Tala"],

  /* ── Mymensingh ────────────────────────────────────────────────────── */
  Jamalpur: ["Baksiganj", "Dewanganj", "Islampur", "Jamalpur Sadar", "Madarganj", "Melandaha", "Sarishabari"],
  Mymensingh: [
    "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat",
    "Ishwarganj", "Muktagachha", "Mymensingh Sadar", "Nandail", "Phulpur",
    "Tarakanda", "Trishal",
  ],
  Netrokona: ["Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Netrokona Sadar", "Purbadhala"],
  Sherpur: ["Jhenaigati", "Nakla", "Nalitabari", "Sherpur Sadar", "Sreebardi"],

  /* ── Rajshahi ──────────────────────────────────────────────────────── */
  Bogura: [
    "Adamdighi", "Bogura Sadar", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo",
    "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala",
  ],
  Chapainawabganj: ["Bholahat", "Chapainawabganj Sadar", "Gomastapur", "Nachole", "Shibganj"],
  Joypurhat: ["Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi"],
  Naogaon: [
    "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur", "Naogaon Sadar",
    "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar",
  ],
  Natore: ["Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Naldanga", "Natore Sadar", "Singra"],
  Pabna: ["Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar"],
  Rajshahi: ["Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"],
  Sirajganj: [
    "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur",
    "Sirajganj Sadar", "Tarash", "Ullapara",
  ],

  /* ── Rangpur ───────────────────────────────────────────────────────── */
  Dinajpur: [
    "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Dinajpur Sadar",
    "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur", "Phulbari",
  ],
  Gaibandha: ["Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
  Kurigram: [
    "Bhurungamari", "Char Rajibpur", "Chilmari", "Kurigram Sadar", "Nageshwari",
    "Phulbari", "Rajarhat", "Raumari", "Ulipur",
  ],
  Lalmonirhat: ["Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram"],
  Nilphamari: ["Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Nilphamari Sadar", "Saidpur"],
  Panchagarh: ["Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia"],
  Rangpur: ["Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Rangpur Sadar", "Taraganj"],
  Thakurgaon: ["Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar"],

  /* ── Sylhet ────────────────────────────────────────────────────────── */
  Habiganj: [
    "Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Habiganj Sadar",
    "Lakhai", "Madhabpur", "Nabiganj", "Shayestaganj",
  ],
  Moulvibazar: ["Barlekha", "Juri", "Kamalganj", "Kulaura", "Moulvibazar Sadar", "Rajnagar", "Sreemangal"],
  Sunamganj: [
    "Bishwambarpur", "Chhatak", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur",
    "Jamalganj", "Sullah", "Sunamganj Sadar", "Tahirpur", "Madhyanagar",
  ],
  Sylhet: [
    "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Dakshin Surma",
    "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat",
    "Osmani Nagar", "Sylhet Sadar", "Zakiganj",
  ],
};

/** The upazilas of a district; empty when none is chosen or none are known. */
export const upazilasOf = (district?: string): string[] =>
  (district && BD_UPAZILAS[district]) || [];
