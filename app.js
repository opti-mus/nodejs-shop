let express = require('express')
// const bcrypt = require('bcryptjs')
// const uuidv4 = require('uuid/v4')
let app = express()
let pid = process.pid
app.use(express.static('public'))
const nodemailer = require('nodemailer')
app.set('view engine', 'pug')

let mysql = require('mysql')
app.use(express.json())
let con = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '280197max',
  database: 'market',
})

app.listen(3000, function () {
  console.log(`work on ${pid}`)
})

app.get('/', function (req, res) {
  let goods = new Promise(function (res, rej) {
    con.query(
      "select id,name, cost, image, category from (select id,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 5",
      function (error, result) {
        if (error) rej(error)
        res(result)
      }
    )
  })
  let catDescr = new Promise(function (res, rej) {
    con.query('SELECT * FROM category', function (error, result) {
      if (error) rej(error)
      res(result)
    })
  })
  Promise.all([goods, catDescr]).then(function (value) {
    res.render('main', {
      goods: JSON.parse(JSON.stringify(value[0])),
      cat: JSON.parse(JSON.stringify(value[1])),
    })
  })
})

app.get('/cat', function (req, res) {
  let catId = req.query.id
  let cat = new Promise(function (resolve, reject) {
    con.query(
      'SELECT * FROM category WHERE id =' + catId,
      function (error, result) {
        if (error) reject(error)
        resolve(result)
      }
    )
  })
  let goods = new Promise(function (resolve, reject) {
    con.query(
      'SELECT * FROM goods WHERE category =' + catId,
      function (error, result) {
        if (error) reject(error)
        resolve(result)
      }
    )
  })

  Promise.all([cat, goods]).then(function (value) {
    res.render('category', {
      cat: JSON.parse(JSON.stringify(value[0])),
      goods: JSON.parse(JSON.stringify(value[1])),
    })
  })
})

app.get('/goods', function (req, res) {
  let catId = req.query.id
  con.query(
    'SELECT * FROM goods WHERE id=' + catId,
    function (error, result, fields) {
      if (error) throw error
      res.render('goods', {
        goods: JSON.parse(JSON.stringify(result)),
      })
    }
  )
})

app.get('/about', function (req, res) {
  con.query('SELECT * FROM about', function (error, result) {
    if (error) throw error
    res.render('about', {
      about: JSON.parse(JSON.stringify(result)),
    })
  })
})
app.get('/reg', function (req, res) {
  res.render('reg')
})
app.post('/finish-reg', function (req, res) {
  let data = req.body
  con.query(
    `SELECT username,email,id FROM users WHERE email = '${data.email}'`,
    function (error, result) {
      if (error) throw error
      res.json(result)
    }
  )
})
app.post('/reg-user', function (req, res) {
  let data = req.body
  con.query(
    `INSERT INTO users(username,password,email) VALUES ("${data.username}","${data.password}","${data.email}")`,
    function (err, result) {
      if (err) throw err
      res.json(result)
    }
  )
})
app.post('/search-goods', (req, res) => {
  let data = req.body.name
  con.query(
    `SELECT id,name FROM goods WHERE name LIKE '%${data}%'`,
    (err, result) => {
      if (err) throw err
      res.json(result)
    }
  )
})
app.post('/get-category-list', function (req, res) {
  con.query('SELECT id,category FROM category', function (error, result) {
    if (error) throw error
    res.json(result)
  })
})
app.post('/get-all-goods', function (req, res) {
  con.query('SELECT id,name FROM goods', function (error, result) {
    if (error) throw error
    res.json(result)
  })
})
app.post('/get-all-rating', function (req, res) {
  con.query('SELECT id,rating FROM goods', function (error, result) {
    if (error) throw error
    res.json(result)
  })
})
app.post('/get-goods-info', function (req, res) {
  let keyId = req.body.key.join(',')
  if (req.body.key.length != 0) {
    con.query(
      'SELECT id,name,cost,image FROM goods WHERE id IN (' + keyId + ')',
      function (error, result) {
        if (error) throw error
        let goods = {}
        for (let i = 0; i < result.length; i++) {
          goods[result[i]['id']] = result[i]
        }
        res.json(goods)
      }
    )
  } else res.send('0')
})

app.get('/order', function (req, res) {
  res.render('order')
})
app.post('/compare', (req, res) => {
  if (req.body.length != 0) {
    con.query(
      'SELECT description,id,name,image FROM goods',
      function (error, result) {
        if (error) throw error
        res.json(result)
      }
    )
  }
})
app.post('/finish-order', function (req, res) {
  if (req.body.cart.length != 0) {
    let key = Object.keys(req.body.cart)
    con.query(
      'SELECT id,name,cost,image FROM goods WHERE id IN (' +
        key.join(',') +
        ')',
      function (error, result) {
        if (error) throw error
        sMail(req.body, result).catch(console.error)
        res.send('1')
      }
    )
  } else {
    res.send('0')
  }
})

async function sMail(data, result) {
  let res = '<h2> Order in lite shop</h2>'
  let total = 0
  for (let i = 0; i < result.length; i++) {
    res += `<p>${result[i]['name']} - ${data.cart[result[i]['id']]}шт - ${
      result[i]['cost'] * data.cart[result[i]['id']]
    } грн </p>`
    total += result[i]['cost'] * data.cart[result[i]['id']]
  }
  res += '<hr>'
  res += `Total : ${total} грн`
  res += `<hr>Username: ${data.username}`
  res += `<hr>Email: ${data.email}`
  res += `<hr>Address: ${data.address}`

  let testAccount = await nodemailer.createTestAccount()
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  })
  let info = await transporter.sendMail({
    from: '"Max" <foo@example.com>', // sender address
    to: 'maax.kool@gmail.com', // list of receivers
    subject: 'Lite shop', // Subject line
    text: 'Hello world?', // plain text body
    html: res, // html body
  })
  console.log('Message sent: %s', info.messageId)
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}

app.post('/sort', function (req, res) {
  console.log(req.body)
  con.query('SELECT * FROM goods', function (error, result) {
    if (error) throw error
    console.log(result[0]['cost'])
    res.send('1')
  })
})
