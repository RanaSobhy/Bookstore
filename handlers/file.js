const fs = require("fs");

var readFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("books.json", (err, content) => {
      if (err) {
        reject(err);
      }
      try {
        resolve(JSON.parse(content));
      } catch (err) {
        reject(err);
      }
    });
  });
};

var writeFile = content => {
  return new Promise((resolve, reject) => {
    fs.writeFile("books.json", JSON.stringify(content), err => {
      if (err) {
        reject(err);
      }
      resolve("Data has been updated");
    });
  });
};

module.exports = {
  readFile,
  writeFile
};
