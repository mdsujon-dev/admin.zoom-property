/**
 * Bangladesh's divisions and districts, kept here rather than fetched.
 *
 * These used to come from bdapis.com. That is a free third-party service, and
 * when it stopped answering every address dropdown in the software went empty
 * with no explanation — a client could not be registered because somebody
 * else's server was down.
 *
 * The list is 8 divisions and 64 districts. It is fixed by administrative
 * order and changes about once a decade, which is not a reason to make a
 * network call on every form open. Shipping it means the form works offline,
 * opens instantly, and cannot be broken from outside.
 */

export const BD_DIVISIONS: Record<string, string[]> = {
  Barishal: [
    "Barguna",
    "Barishal",
    "Bhola",
    "Jhalokati",
    "Patuakhali",
    "Pirojpur",
  ],
  Chattogram: [
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Chattogram",
    "Cumilla",
    "Cox's Bazar",
    "Feni",
    "Khagrachhari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati",
  ],
  Dhaka: [
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",
  ],
  Khulna: [
    "Bagerhat",
    "Chuadanga",
    "Jashore",
    "Jhenaidah",
    "Khulna",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira",
  ],
  Mymensingh: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
  Rajshahi: [
    "Bogura",
    "Chapainawabganj",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Pabna",
    "Rajshahi",
    "Sirajganj",
  ],
  Rangpur: [
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Rangpur",
    "Thakurgaon",
  ],
  Sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
};

/** Division names, in the order they are conventionally listed. */
export const divisionNames = Object.keys(BD_DIVISIONS);

/** The districts of one division; an empty list if the division is unknown. */
export const districtsOf = (division?: string): string[] =>
  (division && BD_DIVISIONS[division]) || [];
