import axios from "axios";
import { PLATFORM } from "../types.js";

const CODECHEF_BASE_URL = "https://www.codechef.com/";
const CODECHEF_API =
  "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all";

const fetchCodechefContests = async () => {
  try {
    const response = await axios.get(CODECHEF_API);
    const data = response.data;
    let result = [];
    if (data?.present_contests) result = data?.present_contests;
    if (data?.future_contests) result = [...result, ...data.future_contests];
    return result;
  } catch (error) {
    return [];
  }
};

const parseCodechefContests = (data) => {
  const contests = [];

  data.forEach((element) => {
    const contest_name = element?.contest_name || "Codechef contest";
    const url = CODECHEF_BASE_URL + element?.contest_code;
    const startMs = new Date(element?.contest_start_date_iso).getTime();
    const endMs = new Date(element?.contest_end_date_iso).getTime();
    const duration = element?.duration || 120;

    const contest = {
      site: PLATFORM.CODECHEF,
      title: contest_name,
      startTime: startMs,
      endTime: endMs,
      duration,
      url,
    };

    contests.push(contest);
  });
  return contests;
};

export const getCodechefContests = async () => {
  const data = await fetchCodechefContests();
  const parsedData = parseCodechefContests(data);
  // console.log("Fetched data from codechef!", parsedData.length);
  return parsedData;
};
