import axios from "axios";

const LEETCODE_BASE_URL = "https://leetcode.com/contest/"; // used for generating contest links
const LEETCODE_API = "https://leetcode.com/graphql";

const fetchLeetcodeContests = async () => {
  try {
    const response = await axios.post(LEETCODE_API, {
      headers: {
        "Content-Type": "application/json",
      },
      query: `{
        topTwoContests{
          title
          startTime
          duration
          cardImg
          titleSlug
        }
      }`,
    });
    const data = response.data;

    return data.data.topTwoContests || [];
  } catch (error) {
    return [];
  }
};

const parseLeetcodeContests = (data) => {
  const contests = [];

  data.forEach((element) => {
    const contest_name = element?.title || "Leetcode contest";
    const url = LEETCODE_BASE_URL + element?.titleSlug;

    const startMs = element?.startTime * 1000;
    const duration = element?.duration / 60 || 90; // minutes
    const endMs = startMs + duration * 60 * 1000;

    const contest = {
      site: "LEETCODE",
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

export const getLeetcodeContests = async () => {
  const data = await fetchLeetcodeContests();
  const parsedData = parseLeetcodeContests(data);

  // console.log("Fetched data from leetcode!", parsedData.length);

  return parsedData;
};
