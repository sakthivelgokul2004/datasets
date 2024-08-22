import puppeteer from "puppeteer";
import { parentPort } from "worker_threads";

parentPort.on('message', (work) => {
    parentPort.postMessage('done')
    recusiveCall(work)
})
async function recusiveCall(jobs) {
    if (jobs.length == 1) return
    let job = jobs.shift()
    console.log(job)
    await run(job).then((val) => recusiveCall(jobs))
}




async function run(data) {
    let bowser;
    bowser = await puppeteer.launch({ headless: 'new' })
    let page = await bowser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000)
    console.log(data)
    page.goto(data.Dataset_Link)
    let selector = "#site-content > div:nth-child(2) > div > div > div.sc-kriKqB.bdptWe > div.sc-jIXSKn.bdYZfJ > div > a > button"
    page.waitForSelector(selector)
    await page.waitForSelector(selector)
    let element = await page.evaluate(() => {
        let selector = "#site-content > div:nth-child(2) > div > div > div.sc-kriKqB.bdptWe > div.sc-jIXSKn.bdYZfJ > div > a"
        let el = document.querySelector(selector).getAttribute('href')
        return el
    })

    // console.log(element)
    await page.goto(`https://www.kaggle.com${element}`)

    await page.waitForSelector('.sc-hjsqBZ.deYQsq:nth-child(2)')
    await page.click('.sc-hjsqBZ.deYQsq:nth-child(2)')
    // console.log('login')
    let inputselector = '.mdc-text-field__input'
    await page.waitForSelector(inputselector)
    await page.type('[name=email]', 'k.sakthivel805697@gmail.com')
    await page.type('[name=password]', '8tunQmLPfMG5t25')
    const signInButtonSelector = ' button.duyVtl';
    await page.click(signInButtonSelector);

    // console.log('downloading')
    await page.waitForNavigation()
    await page.waitForSelector("#site-content > div:nth-child(2) > div > div > div.sc-kriKqB.bdptWe > div.sc-jIXSKn.bdYZfJ > div > a > button > i")
    // await page.screenshot({path: 'bots.jpg'})
    await page._client().send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: data.path
    });
    await page.click("#site-content > div:nth-child(2) > div > div > div.sc-kriKqB.bdptWe > div.sc-jIXSKn.bdYZfJ > div > a > button > i")
    // await waitForDownload(bowser);
    await waitUntilDownload(page, './/archive.zip');
    await bowser.close()

    // parentPort.postMessage('done')
    return "done"
}
// async function waitForDownload(browser) {
//     const dmPage = await browser.newPage();
//     await dmPage.goto("chrome://downloads/");

//     await dmPage.bringToFront();
//     await dmPage.waitForFunction(() => {
//         try {
//             const donePath = document
//                 .querySelector("downloads-manager")
//                 .shadowRoot.querySelector("#frb0")
//                 .shadowRoot.querySelector("#pauseOrResume");

//             if (donePath.innerText !== "Pause") {
//                 return true;
//             }
//         } catch (error) {
//             // Handle the error, if needed
//         }
//     }, { timeout: 0 });

//     console.log("Download finished");
//     return
// }
//option
async function waitUntilDownload(page, fileName = '') {
    return new Promise((resolve, reject) => {
        page._client().on('Page.downloadProgress', e => { // or 'Browser.downloadProgress'
            if (e.state === 'completed') {
                resolve(fileName);
            } else if (e.state === 'canceled') {
                reject();
            }
        });
    });
}

