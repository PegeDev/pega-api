const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");
const { trace } = require("console");
const firstMethod = async (req, res) => {
  try {
    const dateNow = Date.now();
    const url = req.query.u;
    if (!url) return res.status(500).json({ status: false, msg: "Forbidden" });
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
      ignoreHTTPSErrors: false,
    });
    const pages = await browser.pages();
    const snaptik = await browser.newPage();
    const tiktok = await browser.newPage();
    await tiktok.setDefaultNavigationTimeout(0);
    await tiktok.goto(url, { waitUntil: "domcontentloaded" });
    await snaptik.bringToFront();

    await snaptik.setDefaultNavigationTimeout(0);
    await snaptik.goto("https://snaptik.app/en", {
      waitUntil: "domcontentloaded",
    });

    await snaptik.waitForSelector("#url");
    await snaptik.type("#url", url, { delay: 50 });
    await snaptik.click(
      "#hero > div > div.hero-form > form > div > div.hero-input-right > button",
      { delay: 1000 }
    );
    await snaptik.waitForSelector(
      "#download > div > div > div.col-12.col-md-4.offset-md-2 > div > a.btn.btn-main.active.mb-2",
      { timeout: 0 }
    );

    let server1 = await snaptik.$eval(
      "#download > div > div > div.col-12.col-md-4.offset-md-2 > div > a.btn.btn-main.active.mb-2",
      (el) => {
        return el.href;
      }
    );
    await snaptik.waitForSelector(
      "#download > div > div > div.col-12.col-md-4.offset-md-2 > div > a.btn.btn-main.btn-secon.mb-2",
      { timeout: 0 }
    );
    let server2 = await snaptik.$eval(
      "#download > div > div > div.col-12.col-md-4.offset-md-2 > div > a.btn.btn-main.btn-secon.mb-2",
      (el) => {
        return el.href;
      }
    );
    await snaptik.waitForSelector(
      "#download > div > div > div.col-12.col-md-6 > div > div.user-avatar > img",
      { timeout: 0 }
    );
    const thumb = await snaptik.$eval(
      "#download > div > div > div.col-12.col-md-6 > div > div.user-avatar > img",
      (el) => {
        return el.src;
      }
    );
    await snaptik.close();
    // GET AUTHOR IN TIKTOK
    // GET FULLNAME
    await tiktok.bringToFront();
    await tiktok.waitForSelector(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-phmoj-DivAuthorContainer.ege8lhx8 > div > a.tiktok-1b6v967-StyledLink.e17fzhrb3 > span.tiktok-1r8gltq-SpanUniqueId.e17fzhrb1",
      { timeout: 0 }
    );
    const fullname = await tiktok.$eval(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-phmoj-DivAuthorContainer.ege8lhx8 > div > a.tiktok-1b6v967-StyledLink.e17fzhrb3 > span.tiktok-1r8gltq-SpanUniqueId.e17fzhrb1",
      (el) => {
        return el.textContent;
      }
    );
    // GET NICKNAME
    await tiktok.waitForSelector(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-phmoj-DivAuthorContainer.ege8lhx8 > div > a.tiktok-1b6v967-StyledLink.e17fzhrb3 > span.tiktok-lh6ok5-SpanOtherInfos.e17fzhrb2",
      { timeout: 0 }
    );
    const nickname = await tiktok.$eval(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-phmoj-DivAuthorContainer.ege8lhx8 > div > a.tiktok-1b6v967-StyledLink.e17fzhrb3 > span.tiktok-lh6ok5-SpanOtherInfos.e17fzhrb2",
      (el) => {
        return el.childNodes[0].textContent;
      }
    );
    // GET CAPTION
    await tiktok.waitForSelector(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-aixzci-DivVideoInfoContainer.eqrezik2 > div > span:nth-child(1)",
      { timeout: 0 }
    );
    const caption = await tiktok.$eval(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-aixzci-DivVideoInfoContainer.eqrezik2 > div > span:nth-child(1)",
      (el) => {
        return el ? el.textContent : "none";
      }
    );
    // GET TAG VIDEOS
    await tiktok.waitForSelector(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-aixzci-DivVideoInfoContainer.eqrezik2 > div > a > strong",
      { timeout: 0 }
    );
    const tagging = await tiktok.$eval(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-aixzci-DivVideoInfoContainer.eqrezik2 > div > a > strong",
      (el) => {
        return el ? el.textContent : "none";
      }
    );
    // GET LIKES COUNT
    await tiktok.waitForSelector(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-ln2tr4-DivActionItemContainer.ean6quk0 > button:nth-child(1) > strong",
      { timeout: 0 }
    );
    const likes = await tiktok.$eval(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-ln2tr4-DivActionItemContainer.ean6quk0 > button:nth-child(1) > strong",
      (el) => {
        return el.textContent;
      }
    );
    // GET COMMENTS COUNT
    await tiktok.waitForSelector(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-ln2tr4-DivActionItemContainer.ean6quk0 > button:nth-child(2) > strong",
      { timeout: 0 }
    );
    const comment = await tiktok.$eval(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-ln2tr4-DivActionItemContainer.ean6quk0 > button:nth-child(2) > strong",
      (el) => {
        return el.textContent;
      }
    );

    // GET SHARE COUNT
    await tiktok.waitForSelector(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-ln2tr4-DivActionItemContainer.ean6quk0 > button:nth-child(3) > strong",
      { timeout: 0 }
    );
    const share = await tiktok.$eval(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-ln2tr4-DivActionItemContainer.ean6quk0 > button:nth-child(3) > strong",
      (el) => {
        return el.textContent;
      }
    );
    // GET THUMBNAIL VIDEO
    await tiktok.waitForSelector(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-quuc0v-DivVideoContainer.eqrezik6 > div.tiktok-xq54tb-DivVideoWrapper.eqrezik5 > div > img",
      { timeout: 0 }
    );
    const thumbVideo = await tiktok.$eval(
      "#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-2vzllv-DivMainContainer.elnrzms0 > div.tiktok-19j62s8-DivVideoDetailContainer.ege8lhx0 > div.tiktok-12kupwv-DivContentContainer.ege8lhx6 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx7 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-quuc0v-DivVideoContainer.eqrezik6 > div.tiktok-xq54tb-DivVideoWrapper.eqrezik5 > div > img",
      (el) => {
        return el.src;
      }
    );
    const request = async (server) => {
      const createFile = await fs.createWriteStream(
        "./media/" +
          "PegaSnap" +
          "-" +
          fullname.replace(" ", "-") +
          "-" +
          dateNow +
          ".mp4"
      );
      const req = await axios
        .get(server, {
          responseType: "stream",
        })
        .then((res) => {
          res.data.pipe(createFile);
          createFile.on("finish", () => {
            createFile.close();
          });
          return res.headers["content-length"];
        });
      return (req / 1024 ** 2).toFixed(2);
    };
    const local1 = await (`https://cdn.pegadev.xyz/` +
      "download/" +
      "PegaSnap" +
      "-" +
      fullname.replace(" ", "-") +
      "-" +
      dateNow +
      ".mp4");

    const CekSizeFiles = await request(server1);
    if (!CekSizeFiles)
      return res.status(500).json({ msg: "Something went wrong!", error: err });
    await res.status(200).json({
      status: "true",
      data: {
        video_info: {
          url: local1,
          size: CekSizeFiles + " mb",
          thumb: thumbVideo,
          likes: likes,
          comments: comment,
          shares: share,
          caption: caption + tagging,
        },
        user_info: {
          thumb: thumb,
          fullname: fullname,
          nickname: nickname,
        },
      },
    });
    await browser.close();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ msg: "Something went wrong!", error: err });
  }
};

const secondMethod = async (req, res) => {
  try {
    var url = req.query.url;
    if (!url) return res.json({ status: false, msg: "parameter not found" });
    var link = `https://www.tikwm.com/api/?url=${url}&count=0&cursor=0&web=0&hd=0 `;
    const request = await axios.get(link);
    var play = request.data.play;
    var wmplay = request.data.wmplay;
    var music = request.data.music;

    const down = async (server, type) => {
      let types;
      if (type === "nowm") return (types = "No-Watermark");
      if (type === "wm") return (types = "With-Watermark");
      if (type === "music") return (types = "Music");
      const createFile = await fs.createWriteStream(
        `./media/PegaSnap_${fullname.replace(" ", "-")}_${dateNow}_${types}${
          type === "wm" || type === "nowm" ? ".mp4" : ".mp3"
        }`
      );
      const req = await axios
        .get(server, {
          responseType: "stream",
        })
        .then((res) => {
          res.data.pipe(createFile);
          createFile.on("finish", () => {
            createFile.close();
          });
          return res.headers["content-length"];
        });
      return {
        size: (req / 1024 ** 2).toFixed(2),
        fileName: `PegaSnap_${fullname.replace(" ", "-")}_${dateNow}_${types}${
          type === "wm" || type === "nowm" ? ".mp4" : ".mp3"
        }`,
      };
    };

    const metaPlay = await down(play, "nowm");
    const metaWmPlay = await down(play, "wm");
    const metaMusic = await down(music, "music");
    const NumToTime = (num) => {
      var hours = Math.floor(num / 60);
      var minutes = num % 60;

      minutes = String(minutes).length === 1 ? "0" + minutes : minutes;
      hours = String(hours).length === 1 ? "0" + hours : hours;
      return hours + ":" + minutes;
    };
    await res.json({
      status: "true",
      data: {
        title: request.data.title,
        nowm: {
          play: `https://cdn.pegadev.xyz/download/${metaPlay.fileName}`,
          size: `${metaPlay.size}mb`,
        },
        wm: {
          play: `https://cdn.pegadev.xyz/download/${metaWmPlay.fileName}`,
          size: `${metaWmPlay.size}mb`,
        },
        music: {
          play: `https://cdn.pegadev.xyz/download/${metaMusic.fileName}`,
          size: metaMusic.size,
          title: request.data.music_info.title,
          duration: request.data.music_info.duration,
          author: request.data.music_info.author,
          original: request.data.music_info.original,
        },
        duration: NumToTime(request.data.duration),
        cover: request.data.cover,
        origin_cover: request.data.origin_cover,
        play_count: request.data.play_count,
        comment_count: request.data.comment_count,
        share_count: request.data.share_count,
        download_count: request.data.download_count,
        author: {
          fullname: request.data.author.unique_id,
          nickname: request.data.author.nickname,
          avatar: request.data.author.avatar,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ status: false, msg: "something went wrong" });
  }
};
module.exports = { firstMethod, secondMethod };
