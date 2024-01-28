import mysql from "mysql2/promise";

import OpenAI from "openai";

const openai = new OpenAI({
  organization: "org-9vluaGtKaqSzgKaWYVPfGc6j",
  apiKey: "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",
});

const HOST =
  "svc-951caa23-f449-4987-b064-a28c4edc2fa1-dml.aws-virginia-6.svc.singlestore.com";
const USER = "admin";
const PASSWORD = "u16djseCy8hjByKIKB8da7xOvLMXiNjj";
const DATABASE = "singlestore";

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

// async function main() {
//   let singleStoreConnection;
//   try {
//     singleStoreConnection = await mysql.createConnection({
//       host: HOST,
//       user: USER,
//       password: PASSWORD,
//       database: DATABASE,
//     });

//     console.log("You have successfully connected to SingleStore.");

//     const id = await create({
//       singleStoreConnection,
//       comment: {
//         commentid: 1,
//         commenter: "Priyanshu Bisht",
//         comment: "Inflating table in the db with dummy data",
//         gpt: "",
//         flag: 0,
//         respond: 0,
//       },
//     });
//     console.log(`Inserted row id is: ${id}`);
//   } catch (err) {
//     console.error("ERROR", err);
//     process.exit(1);
//   } finally {
//     if (singleStoreConnection) {
//       await singleStoreConnection.end();
//     }
//   }
// }

// main();

async function readN( singleStoreConnection ) {
  const [rows] = await singleStoreConnection.execute("SELECT * FROM comments");
  return rows;
}

async function updateDatabaseUsingGPT() {
  let singleStoreConnection;
  try {
    singleStoreConnection = await mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
    });

    console.log("You have successfully connected to SingleStore.");
    // console.log(singleStoreConnection);

    const comments = await readN(singleStoreConnection);
    console.log(comments);

    for (var i = 0; i < comments.length; i++) {
      const completion = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt:
          `this tool helps to find out if the youtuber should or should not respond to a youtube comment, question or asking for advices are examples when the reply is needed\n\n` +
          `User: Priyanshu Bisht\n` +
          `Comment: That was a great video! liked it!` +
          `Should reply: No\n\n` +
          `User: Kanika\n` +
          `Comment" Stuck at step-4, how do i do it?` +
          `Should reply: Yes` +
          `User: ${comments[i].commenter}\n` +
          `Comment: ${comments[i].comment}\n` +
          `Should reply:`,
        stop: ["\n", "User:", "Comment:", "Should Reply:"],
        max_tokens: 7,
        temperature: 0,
      });
      console.log(completion.choices[0].text);
      console.log(completion);
    }

    // console.log(`Inserted row id is: ${id}`);
  } catch (err) {
    console.error("ERROR", err);
    process.exit(1);
  } finally {
    if (singleStoreConnection) {
      await singleStoreConnection.end();
    }
  }
}

updateDatabaseUsingGPT();

// `this tool helps to find out if the youtuber should or should not respond to a youtube comment. question or asking for advices are examples when the reply is needed`

// `User: Priyanshu Bisht\n` +
//   `Comment: That was a great video! liked it` +
//   `Should reply: No\n\n` +
// `User: Kanika\n` +
//   `Comment" Stuck at step-4, how do i do it` +
//   `Should reply: Yes`

//   `User: ${comments[i].commenter}`+
//   `Comment: ${comments[i].comment}` +
//   `Should reply:`
