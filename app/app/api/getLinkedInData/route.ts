/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { Job, Params } from "@/lib/interfaces";
import TurndownService from 'turndown'

export async function POST(request: NextRequest) {
  const { location, jobTitle }: Params = await request.json();

  let urlParam = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Restaurant&location=Delta&geoId=106420447&trk=public_jobs_jobs-search-bar_search-submit&start=1&pageNum=0";
  if (!urlParam) {
    return new NextResponse("Please provide a URL.", { status: 400 });
  }

  // Prepend http:// if missing
  let inputUrl = urlParam.trim();
  if (!/^https?:\/\//i.test(inputUrl)) {
    inputUrl = `http://${inputUrl}`;
  }

  // Validate the URL is a valid HTTP/HTTPS URL
  let parsedUrl: URL = new URL(inputUrl);

  let browser;
  try {
    const isVercel = !!process.env.VERCEL_ENV;
    let puppeteer: any,
      launchOptions: any = {
        headless: true,
      };

    if (isVercel) {
      const chromium = (await import("@sparticuz/chromium")).default;
      puppeteer = await import("puppeteer-core");
      launchOptions = {
        ...launchOptions,
        args: chromium.args,
        executablePath: await chromium.executablePath("https://github.com/Sparticuz/chromium/releases/download/v138.0.2/chromium-v138.0.2-pack.x64.tar"), // Load the executable from github
      };
    } else {
      // If we're running locally then just use puppeteer
      puppeteer = await import("puppeteer");
    }

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
    });

    // page.on('console', (msg) => { console.log(msg.text()) });

    await page.goto(parsedUrl.toString(), { waitUntil: "networkidle2" });

    const jobElements: NodeListOf<Element> = await page.evaluate(() => {
      const jobElements = document.querySelectorAll(".job-search-card")
      return jobElements;
    })

    const jobs: Job[] = await page.$$eval(".job-search-card", elements => {
      let jobsArray: Job[] = []
      for (let job of elements) {
        const link = job.querySelector("a.base-card__full-link");
        const jobEntry: Job = {
          title: job.querySelector(".base-search-card__title")?.textContent.trim(),
          company: job.querySelector("h4.base-search-card__subtitle")?.textContent.trim(),
          link: link?.getAttribute("href") as string,
          id: job.getAttribute("data-entity-urn").split(":").slice(-1)[0],
          description: "placeholder"
        }

        jobsArray.push(jobEntry)
      }
      return jobsArray
    })

    const turndownService = new TurndownService()
    // TODO: Change this from 3 so that you can have more jobs at once
    for (let i = 0; i < 3; ++i) {
      await page.goto(`https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobs[i].id}`)

      const description = await page.evaluate(() => {
        const description = document.querySelector("div.show-more-less-html__markup")?.innerHTML.trim()
        return description;
      })
      jobs[i].description = turndownService.turndown(description);
      await new Promise(r => setTimeout(r, 3000)) // Add a delay to not get blocked
    }

    return new NextResponse(JSON.stringify(jobs));
  } catch (error) {
    console.error(error);
    return new NextResponse(
      "An error occurred while generating the screenshot.",
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
