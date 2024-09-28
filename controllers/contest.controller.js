import { PLATFORM } from "../types.js";
import {
  atcoderContests,
  codechefContests,
  codeforcesContests,
  codingninjaContests,
  gfgContests,
  leetcodeContests,
  refreshCache,
} from "../services/cache.service.js";



const defaultArray = Object.values(PLATFORM);
const DURATION_LIMIT = 15 * 24 * 60; // 15 days in minutes

export const UpcomingContestsController = async (req, res) => {


  let platforms;
  const includedPlatforms = [];

  // Parse platforms from query or use default
  try {
    platforms = JSON.parse(req.query.platforms);
    if (!Array.isArray(platforms)) throw new Error();
  } catch (error) {
    platforms = defaultArray; // Default to all platforms
  }

  let contests = [];

  await refreshCache(); // Ensure the cache is refreshed before fetching contests

  
  // Gather contests based on included platforms
  const platformMap = {
    [PLATFORM.CODECHEF]: codechefContests(),
    [PLATFORM.LEETCODE]: leetcodeContests(),
    [PLATFORM.CODEFORCES]: codeforcesContests(),
    [PLATFORM.GEEKSFORGEEKS]: gfgContests(),
    [PLATFORM.ATCODER]: atcoderContests(),
    [PLATFORM.CODINGNINJAS]: codingninjaContests(),
  };



  platforms.forEach((platform) => {
    const contestsFromPlatform = platformMap[platform];

    // Check if contestsFromPlatform is an array
    if (Array.isArray(contestsFromPlatform)) {
      contests = [...contests, ...contestsFromPlatform]; // Combine contests from the platform
      includedPlatforms.push(platform);
    } else {
      console.warn(`No contests found for platform: ${platform}`); // Log warning if not iterable
    }
  });

  // Filter contests by duration limit
  contests = contests.filter((contest) => contest.duration <= DURATION_LIMIT);

  // Sort contests by start time
  contests.sort(
    (contest1, contest2) => contest1.startTime - contest2.startTime
  );

  // Respond with the included platforms and upcoming contests
  res.status(200).json({
    message:"hy ",
    platforms: includedPlatforms,
    upcoming_contests: contests,
  });
};
