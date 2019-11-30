const mysql = require('mysql');
const bcyrpt = require('bcrypt');

var exports = module.exports = {};

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'flex',
  password: 'flex',
  database: 'flex'
});

module.exports.findId = (id, cb) => {
  pool.query('SELECT id FROM user WHERE id=?', [id], (error, results, fields) => {
    if (error) {
      cb(error, null);
      return;
    }
    if (!results[0]) {
      cb(null, false);
      return;
    }
    const length = Object.keys(results[0]).length;
    if (length == 1) {
      cb(null, true)
    }
    else {
      cb(null, false)
    }
  });
};

module.exports.findPw = (id, pw, cb) => {
  pool.query('SELECT * FROM user WHERE id=?', [id], (error, results, fields) => {
    if (error) cb(error, null);
    const user = results[0];
    bcyrpt.compare(pw, user['pw'], (err, same) => {
      if (same == true) {
        cb(true, user);
      }
      else {
        cb(false, null);
      }
    });
  });
};

module.exports.signUp = (id, pw) => {
  pool.query('INSERT INTO user VALUES (?, ?)', [id, pw], (error, results, fields) => {
    if (error) throw error;
  });
};

module.exports.idCheck = (id, cb) => {
  pool.query('SELECT id FROM user WHERE id=?', [id], (error, results, fields) => {
    if (error) throw error;
    const length = results.length;
    if (length == 1) {
      return cb(true);
    }
    else {
      return cb(false);
    }
  });
}

module.exports.getAssets = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM assets where id=? ORDER BY created_date DESC', [id], (error, results, fields) => {
      resolve(results);
    });
  });
}
module.exports.addAsset = (id, type, title, money) => {
  let date = new Date();
  let datetime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  console.log("id:", id, "type:", type, "title:", title, "money:", money);
  pool.query('INSERT INTO assets VALUES (?, ?, ?, ?, ?)', [id, type, title, money, datetime]);
}
module.exports.deleteAsset = (id, title) => {
  pool.query('DELETE FROM assets WHERE id=? AND title=?', [id, title]);
}