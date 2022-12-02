const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");
const Files = require("../models/files");
const Path = require("path");
const Queue = require("async-await-queue");
const path = require("path");
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
    const local1 = await (`${domain}/` +
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
    const dateNow = Date.now();

    const downloadImage = async (url, filename) => {
      const path = Path.resolve("./media/images", filename);
      const writer = fs.createWriteStream(path);

      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });
      response.data.pipe(writer);
      writer.on("finish", () => {
        writer.close();
      });
      return {
        filename: filename,
      };
    };
    var url = req.query.url;
    if (!url) return res.json({ status: false, msg: "parameter not found" });
    var link = `https://www.tikwm.com/api/?url=${url}&count=0&cursor=0&web=0&hd=0 `;
    const request = await axios.get(link);
    var play = request.data.data.play;
    var music = request.data.data.music;

    const down = async (server, type) => {
      const createFile = await fs.createWriteStream(
        `./media/PegaSnap_${request.data.data.author.unique_id.replace(
          " ",
          "-"
        )}_${dateNow}${type === "wm" || type === "nowm" ? ".mp4" : ".mp3"}`
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
        fileName: `PegaSnap_${request.data.data.author.unique_id.replace(
          " ",
          "-"
        )}_${dateNow}${type === "wm" || type === "nowm" ? ".mp4" : ".mp3"}`,
      };
    };
    const randStr = (length) => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = " ";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    };

    const regFile = async (filename, size) => {
      try {
        const token = await randStr(84).replace(" ", "");
        await Files.create({
          filename: filename,
          token: token,
          filesize: size + "mb",
          isTrending: false,
        });
        return { size, token };
      } catch (err) {
        res.json({ status: 0, error: err });
      }
    };
    const metaPlay = await down(play, "nowm").then((el) => {
      return regFile(el.fileName, el.size);
    });
    const metaMusic = await down(music, "music").then((el) => {
      return regFile(el.fileName, el.size);
    });
    const getCover = await downloadImage(
      request.data.data.cover,
      `PegaSnap_Cover_${request.data.data.author.unique_id.replace(
        " ",
        "-"
      )}_${dateNow}.jpg`
    );
    const getAvatar = await downloadImage(
      request.data.data.author.avatar,
      `PegaSnap_Avatar_${request.data.data.author.unique_id.replace(
        " ",
        "-"
      )}_${dateNow}.jpg`
    );
    const NumToTime = (num) => {
      var hours = Math.floor(num / 60);
      var minutes = num % 60;

      minutes = String(minutes).length === 1 ? "0" + minutes : minutes;
      hours = String(hours).length === 1 ? "0" + hours : hours;
      return hours + ":" + minutes;
    };
    return res.json({
      status: "true",
      data: {
        title: request.data.data.title,
        play: `${
          process.env.HOSTNAME
        }/tiktok/download?token=${metaPlay.token.replace(" ", "")}`,
        size: `${metaPlay.size}`,

        duration: NumToTime(request.data.data.duration),
        cover: `${process.env.HOSTNAME}/tiktok/images/cover/${getCover.filename}`,
        play_count: request.data.data.play_count,
        like_count: request.data.data.digg_count,
        comment_count: request.data.data.comment_count,
        share_count: request.data.data.share_count,
        download_count: request.data.data.download_count,
        author: {
          fullname: request.data.data.author.unique_id,
          nickname: request.data.data.author.nickname,
          avatar: `${process.env.HOSTNAME}/tiktok/images/cover/${getAvatar.filename}`,
        },
        music: {
          play: `${
            process.env.HOSTNAME
          }/tiktok/download?token=${metaMusic.token.replace(" ", "")}`,
          size: `${metaMusic.size}`,
          title: request.data.data.music_info.title,
          duration: NumToTime(request.data.data.music_info.duration),
          author: request.data.data.music_info.author,
          original: request.data.data.music_info.original,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: false, msg: "something went wrong" });
  }
};

const getTrending = async (req, res) => {
  try {
    const dateNow = Date.now();
    const randStr = (length) => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = " ";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    };
    const NumToTime = (num) => {
      var hours = Math.floor(num / 60);
      var minutes = num % 60;

      minutes = String(minutes).length === 1 ? "0" + minutes : minutes;
      hours = String(hours).length === 1 ? "0" + hours : hours;
      return hours + ":" + minutes;
    };
    const regFile = async (filename, size) => {
      try {
        const token = randStr(84).replace(" ", "");
        await Files.create({
          filename: filename,
          token: token,
          filesize: size + "mb",
          isTrending: true,
        });
        return { size, token };
      } catch (err) {
        console.log(err);
      }
    };
    const down = async (server, type, numb) => {
      var paths;
      var filename;
      if (type === "video") {
        filename = `${dateNow}${numb}.mp4`;
        paths = `./media/trending/${dateNow}${numb}.mp4`;
      } else if (type === "img") {
        filename = `${dateNow}${numb}.jpg`;
        paths = `./media/trending/images/${dateNow}${numb}.jpg`;
      } else if (type === "avatar") {
        filename = `${dateNow}${numb}.jpg`;
        paths = `./media/trending/images/avatar/${dateNow}${numb}.jpg`;
      } else if (type === "music") {
        filename = `${dateNow}${numb}.mp3`;
        paths = `./media/trending/music/${dateNow}${numb}.mp3`;
      } else {
        filename = `${dateNow}${numb}.mp4`;
        paths = `./media/trending/${dateNow}${numb}.mp4`;
      }

      const createFile = fs.createWriteStream(paths);
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
        fileName: filename,
      };
    };
    const read = fs.readFileSync(
      path.resolve("./media/trending/data/data.json")
    );
    if (!read) {
      await fs.writeFile(
        "./media/trending/data/data.json",
        JSON.stringify({ time: 0, data: [] }),
        "utf8",
        function (err) {
          if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
          }
        }
      );
    }
    const readParse = JSON.parse(read);
    const dateObject = new Date(readParse.time);
    const currObject = new Date(dateNow);
    const currTime = currObject.getDate();
    const timeToDate = dateObject.getDate();
    const deleteFiles = (dirs) => {
      if (fs.existsSync(dirs)) {
        const readExistDir = fs.readdirSync(dirs);
        if (readExistDir.length > 0) {
          for (const file of readExistDir) {
            console.log(readExistDir);
            Files.destroy({
              where: {
                fileName: file,
              },
            });

            return fs.unlink(dirs, (err) => {
              if (err) console.log(err);
              return true;
            });
          }
        }
      }
    };
    const call = async (playsArr) => {
      const resDown = [];
      for (let i = 0; i < playsArr.length; i++) {
        const res = await playsArr[i];
        const resPlay = await playsArr[i].play;
        const resCover = await playsArr[i].cover;
        const resAvatar = await playsArr[i].author.avatar;
        const resMusic = await playsArr[i].music_info.play;
        const playVideo = await down(resPlay, "video", i).then((el) => {
          return regFile((fileName = el.fileName), (size = el.size));
        });
        const playMusic = await down(resMusic, "music", i).then((el) => {
          return regFile(el.fileName, el.size);
        });
        const cover = await down(resCover, "img", i).then((el) => {
          return { fileName: el.fileName, size: el.size };
        });
        const avatar = await down(resAvatar, "avatar", i).then((el) => {
          return { fileName: el.fileName, size: el.size };
        });
        const hostname = `${process.env.HOSTNAME}/tiktok`;
        await resDown.push({
          title: res.title,
          cover: `${hostname}/images/cover/${cover.fileName}?trending=1`,
          play: `${hostname}/download/?token=${playVideo.token}`,
          size: `${playVideo.size} mb`,
          duration: NumToTime(res.duration),
          play_count: res.play_count,
          share_count: res.share_count,
          comment_count: res.comment_count,
          like_count: res.digg_count,
          download_count: res.download_count,
          author: {
            fullname: res.author.unique_id,
            nickname: res.author.nickname,
            avatar: `${hostname}/images/cover/${avatar.fileName}?trending=1&avatar=1`,
          },
          music: {
            title: res.music_info.title,
            play: `${hostname}/download/?token=${playMusic.token}`,
            duration: NumToTime(res.music_info.duration),
          },
        });
      }
      var jsonContent = JSON.stringify({
        time: dateNow,
        data: resDown,
      });
      fs.writeFile(
        "./media/trending/data/data.json",
        jsonContent,
        "utf8",
        function (err) {
          if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
          }
        }
      );
      return {
        resDown,
      };
    };
    if (timeToDate !== currTime) {
      deleteFiles("./media/trending/images");
      deleteFiles("./media/trending/images/avatar");
      deleteFiles("./media/trending/music");
      deleteFiles("./media/trending/");
      const callApi = await axios.get(
        `https://www.tikwm.com/api/feed/list?region=ID&count=16`
      );
      const playsArr = await callApi.data.data;
      const resDown = [];
      await call(playsArr).then(() => {
        resDown.push(resDown);
      });
      res.set("Content-Type", "application/json");
      return res.status(200).json({
        status: true,
        data: resDown,
      });
    } else {
      res.set("Content-Type", "application/json");
      return res.status(200).json({
        status: true,
        data: readParse.data,
      });
    }
  } catch (err) {
    // await console.log(err);
    await res.status(500).json({ msg: err });
  }
};
module.exports = { firstMethod, secondMethod, getTrending };
