import axios from "axios";
import { PLATFORM } from "../types.js";

const CODEFORCES_BASE_URL = "https://codeforces.com/contest/";
const CODEFORCES_API = "https://codeforces.com/api/contest.list";

const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get(CODEFORCES_API);
    const data = response.data;
    return data.result || [];
  } catch (error) {
    return [];
  }
};

const parseCodeforcesContests = (data) => {
  const contests = [];

  data.forEach((element) => {
    if (element.phase == "BEFORE" || element.phase == "CODING") {
      const contest_name = element?.name || "Codeforces contest";
      const url = CODEFORCES_BASE_URL + element?.id;

      const startMs = element?.startTimeSeconds * 1000;
      const duration = element?.durationSeconds / 60 || 120;
      const endMs = startMs + duration * 60 * 1000;

      const contest = {
        site: PLATFORM.CODEFORCES,
        title: contest_name,
        startTime: startMs,
        endTime: endMs,
        duration,
        url,
      };

      contests.push(contest);
    }
  });

  return contests;
};

export const getCodeforcesContests = async () => {
  const data = await fetchCodeforcesContests();
  const parsedData = parseCodeforcesContests(data);
  // console.log("Fetched data from codeforces!", parsedData.length);
  return parsedData;
};
