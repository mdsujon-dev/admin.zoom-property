import axios from "axios";
//@ts-expect-error Module not found 
import { url } from "../network/api";

export const getAllCompanyCategory = async () => {
  const response = await axios.get(`${url}/company-categories`);
  return response.data.data;
};

/*
 * The address and country lookups that used to live here have been removed.
 *
 * They called bdapis.com and restcountries.com directly, and both had gone
 * unreachable — which showed up as address dropdowns that spun forever and
 * then sat empty, with no error anywhere, because the caller swallowed the
 * failure. Divisions and districts now ship with the software in
 * `data/bdAddress.ts`, and countries in `utils/countryOptions.ts`. Neither
 * list changes often enough to be worth a request that can fail.
 */
