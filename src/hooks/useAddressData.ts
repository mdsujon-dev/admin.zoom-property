import { useMemo } from "react";

import { districtsOf, divisionNames } from "../data/bdAddress";
import { postOfficesOf } from "../data/bdPostOffices";
import { upazilasOf } from "../data/bdUpazilas";

const asOptions = (names: string[]) =>
  names.map((n) => ({ value: n, label: n }));

/**
 * Division and district options for an address form.
 *
 * This used to fetch from bdapis.com on every mount, and swallow every failure
 * with an empty `.catch(() => {})`. When that service went down the dropdowns
 * simply stayed empty — no error, no message, nothing to tell anyone why an
 * address could not be filled in. The data is now local (`data/bdAddress.ts`),
 * so there is no request to fail and no loading state to wait through.
 *
 * The loading flags are kept, always false, so the forms reading them do not
 * have to change and can go back to a fetch later if a real source appears.
 */
export const useAddressData = (
  selectedDivision?: string,
  selectedDistrict?: string
) => {
  const divisions = useMemo(() => asOptions(divisionNames), []);
  const districts = useMemo(
    () => asOptions(districtsOf(selectedDivision)),
    [selectedDivision]
  );

  const upazilas = useMemo(
    () => asOptions(upazilasOf(selectedDistrict)),
    [selectedDistrict]
  );

  /* Labelled with the code so the list answers both questions at once — the
     office somebody is looking for and the number they were going to have to
     look up next. */
  const postOffices = useMemo(
    () =>
      postOfficesOf(selectedDistrict).map((p) => ({
        value: p.name,
        label: `${p.name} — ${p.code}`,
      })),
    [selectedDistrict]
  );

  return {
    divisions,
    districts,
    /*
     * Thanas for the chosen district.
     *
     * There used to be none, on the argument that a half-complete dropdown is
     * worse than a text box because a missing thana cannot be entered at all.
     * True of a `Select`; not true of the `AutoComplete` the form uses now,
     * which suggests without refusing. The list is close but not official — see
     * `data/bdUpazilas.ts` — and anything typed is kept whether it is in there
     * or not.
     */
    upazilas,
    /** Head offices and the larger cities' branches only — see the data file. */
    postOffices,
    divLoading: false,
    distLoading: false,
    upaLoading: false,
  };
};
