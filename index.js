import { google } from "googleapis";
import mysql from "mysql2/promise";

const HOST =
  "svc-951caa23-f449-4987-b064-a28c4edc2fa1-dml.aws-virginia-6.svc.singlestore.com";
const USER = "admin";
const PASSWORD = "u16djseCy8hjByKIKB8da7xOvLMXiNjj";
const DATABASE = "singlestore";

const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyAzVCmgXVNXpvvkFXK6K7VcehdgfVuTBMM",
});

async function create({ singleStoreConnection, comment }) {
  const [results] = await singleStoreConnection.execute(
    "INSERT INTO comments (commentid, commenter, comment, gpt, flag, respond) VALUES (?,?,?,?,?,?)",
    [
      comment.commentid,
      comment.commenter,
      comment.comment,
      comment.gpt,
      comment.flag,
      comment.respond,
    ]
  );
  return results.insertId;
}

async function getYoutubeComments() {
  return new Promise((resolve, reject) => {
    youtube.commentThreads.list(
      {
        part: "snippet",
        videoId: "g8r0--NLQnU",
        maxResults: 100,
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data.data.items);
        // console.log(data);
        // console.log(data.data.items);
        // let json = JSON.stringify(data.data.items);
        // fs.writeFile("./comments/comments.json", json, "utf8", (err) => {
        //   if (err) throw err;
        //   console.log(
        //     "File has been saved in the comments.json present in the comments folder"
        //   );
        // });
      }
    );
  });
}

async function main() {
  let singleStoreConnection;
  try {
    singleStoreConnection = await mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
    });

    console.log("You have successfully connected to SingleStore.");

    let comments = await getYoutubeComments();

    for (let i = 0; i < comments.length; i++) {
      const id = await create({
        singleStoreConnection,
        comment: {
          commentid: comments[i].id,
          commenter:
            comments[i].snippet.topLevelComment.snippet.authorDisplayName,
          comment: comments[i].snippet.topLevelComment.snippet.textOriginal,
          gpt: "",
          flag: 0,
          respond: 0,
        },
      });
      console.log(`Inserted row id is: ${id}`);
    }
  } catch (err) {
    console.error("ERROR", err);
    process.exit(1);
  } finally {
    if (singleStoreConnection) {
      await singleStoreConnection.end();
    }
  }
}

main();
