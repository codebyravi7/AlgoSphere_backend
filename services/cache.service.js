import { getAtcoderContests } from "./atcoder.service.js";
import { getCodechefContests } from "./codechef.service.js";
import { getCodeforcesContests } from "./codeforces.service.js";
import { getCodingNinjaContests } from "./codingninja.service.js";
import { getGfgContests } from "./geeksforgeeks.service.js";
import { getLeetcodeContests } from "./leetcode.service.js";

let cache = {
  atcoder: [],
  codechef: [],
  codeforces: [],
  codingninja: [],
  geeksforgeeks: [],
  leetcode: [],
};

export const refreshCache = async () => {
  cache.atcoder = await getAtcoderContests();
  cache.codechef = await getCodechefContests();
  cache.codeforces = await getCodeforcesContests();
  cache.codingninja = await getCodingNinjaContests();
  cache.geeksforgeeks = await getGfgContests();
  cache.leetcode = await getLeetcodeContests();
};

export const atcoderContests = () => cache.atcoder;
export const codechefContests = () => cache.codechef;
export const codeforcesContests = () => cache.codeforces;
export const codingninjaContests = () => cache.codingninja;
export const gfgContests = () => cache.geeksforgeeks;
export const leetcodeContests = () => cache.leetcode;
