import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";

const root = process.cwd();
const contentDir = process.env.CONTENT_DIR || path.resolve(root, "..", "content");
const sourceDataDir = path.join(root, "data");
const mediaDir = path.join(contentDir, "media");

const videoSeed = {
  title: "관람 후기 및 출연 소감",
  sections: [
    {
      id: "dawn",
      title: "한국 오페라의 여명",
      videos: [
        {
          id: "1",
          name: "신갑순",
          thumbnail: "/media/videoThumb/1.jpg",
          video: "/media/video/1.mp4",
          enabled: true,
        },
      ],
    },
    {
      id: "birth",
      title: "한국 오페라의 태동",
      videos: [
        {
          id: "2",
          name: "이인숙",
          thumbnail: "/media/videoThumb/2.jpg",
          video: "/media/video/2.mp4",
          enabled: true,
        },
        {
          id: "3",
          name: "김용분",
          thumbnail: "/media/videoThumb/3.jpg",
          video: "/media/video/3.mp4",
          enabled: true,
        },
        {
          id: "4",
          name: "박성원",
          thumbnail: "/media/videoThumb/4.jpg",
          video: "/media/video/4.mp4",
          enabled: true,
        },
      ],
    },
    {
      id: "leap",
      title: "한국 오페라의 도약",
      videos: [
        {
          id: "5",
          name: "박수길",
          thumbnail: "/media/videoThumb/5.jpg",
          video: "/media/video/5.mp4",
          enabled: true,
        },
        {
          id: "6",
          name: "이건용",
          thumbnail: "/media/videoThumb/6.jpg",
          video: "/media/video/6.mp4",
          enabled: true,
        },
      ],
    },
  ],
};

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(sourceDataDir, fileName), "utf8"));
}

function writeYamlIfMissing(fileName, getData) {
  const target = path.join(contentDir, fileName);
  if (fs.existsSync(target)) return false;

  const data = getData();
  fs.writeFileSync(
    target,
    yaml.dump(data, {
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    }),
  );
  return true;
}

fs.mkdirSync(contentDir, { recursive: true });
fs.mkdirSync(path.join(mediaDir, "flowImg"), { recursive: true });
fs.mkdirSync(path.join(mediaDir, "figures"), { recursive: true });
fs.mkdirSync(path.join(mediaDir, "video"), { recursive: true });
fs.mkdirSync(path.join(mediaDir, "videoThumb"), { recursive: true });

writeYamlIfMissing("collect.yml", () => ({ items: readJson("collectData.json") }));
writeYamlIfMissing("figures.yml", () => ({ items: readJson("figData.json") }));
writeYamlIfMissing("videos.yml", () => videoSeed);

console.log(`Content initialized at ${contentDir}`);
