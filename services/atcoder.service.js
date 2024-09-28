import axios from "axios";
import * as cheerio from "cheerio";
import { PLATFORM } from "../types.js";

const ATCODER_BASE_URL = "https://atcoder.jp";
const ATCODER_CONTESTS_PAGE = "https://atcoder.jp/contests/";

// Helper function to format start time
const formatStartTimeIso = (startTimeHref) => {
  if (!startTimeHref) return "";

  const startTimeIso = startTimeHref.split("=")[1].split("&")[0];
  return `${startTimeIso.substring(0, 4)}-${startTimeIso.substring(
    4,
    6
  )}-${startTimeIso.substring(6, 8)}T${startTimeIso.substring(
    9,
    11
  )}:${startTimeIso.substring(11)}`;
};

// Function to parse contest table
const parseTable = ($, tbody) => {
  const contests = [];

  tbody.find("tr").each((index, element) => {
    const trElement = $(element);
    const startTimeHref = trElement.find("td").eq(0).find("a").attr("href");
    const formattedStartTimeIso = formatStartTimeIso(startTimeHref); // Change: Using helper function

    const contestLink = trElement.find("td").eq(1).find("a").attr("href");
    const contestName = trElement
      .find("td")
      .eq(1)
      .text()
      .replace(/Ⓐ|◉|Ⓗ/g, "")
      .trim(); // Change: Using regex for cleaner replacement
    const duration = trElement.find("td").eq(2).text().trim();

    const [hours, minutes] = duration.split(":").map(Number);
    const durationMinutes = hours * 60 + minutes;

    const startTimeJST = new Date(formattedStartTimeIso);
    const startTime = startTimeJST.getTime() - 9 * 60 * 60 * 1000; // Adjusting for JST
    const endTime = startTime + durationMinutes * 60 * 1000;

    contests.push({
      site: PLATFORM.ATCODER,
      title: contestName,
      startTime,
      endTime,
      duration: durationMinutes,
      url: ATCODER_BASE_URL + (contestLink || ""),
    });
  });

  return contests;
};

// Main function to fetch contests from AtCoder
export const getAtcoderContests = async () => {
  try {
    const { data: markup } = await axios.get(ATCODER_CONTESTS_PAGE);
    const $ = cheerio.load(markup);

    const contests = [
      ...parseTable($, $("#contest-table-action").find("tbody")),
      ...parseTable($, $("#contest-table-upcoming").find("tbody")),
    ]; // Change: Combine contests in one step for readability

    console.log("Fetched data from Atcoder!", contests.length);
    return contests;
  } catch (error) {
    console.error(`Error fetching contests: ${error.message}`); // Change: Log error message
    return [];
  }
};
