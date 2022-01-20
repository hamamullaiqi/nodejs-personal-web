const express = require('express')
const db = require('./connection/db')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const upload = require('./middlewares/fileUpload')
const fs = require('fs')
const { user } = require('pg/lib/defaults')
const { log } = require('console')


const app = express()
const PORT = process.env.PORT || 4000

//set hbs view engine
app.set('view engine', 'hbs')

//set public folder/path
app.use('/public', express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'))


//untuk merubah inputan menjadi string
app.use(express.urlencoded({ extended : false }))

app.use(
    session({
        cookie :  {
            maxAge : 2 * 60 * 60 * 1000, //session max 2 jam
            secure : false,
            httpOnly : true
        },
        store : new session.MemoryStore(),
        saveUninitialized : true,
        resave: false,
        secret: 'secretValue'
    })
)

app.use(flash())

let isLogin = false


let blogs = [
    {
        title : 'Pasar Coding di Indonesia Dinilai Masih Menjanjikan',
        content : 'Ketimpangan sumber daya manusia (SDM) di sektor digital masih menjadi isu yang belum terpecahkan',
        image : '12 Jul 2021 22:30 WIB ',
        author : 'Ichsan Emrald Alamsyah',
        postAt : getFullTime(new Date()),
        // distance : new Date()

    }
]

// console.log(blogs);

function getFullTime (time) {
    let mouth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'november', 'Desember']
  
    let date = time.getDate()
    let mouthIndex = time.getMonth()//hanya mengembalikan index
    let yaer = time.getFullYear()
    let hours = time.getHours()
    let minutes = time.getMinutes()
  
  
    let fullTime = `${date} ${mouth[mouthIndex]} ${yaer} ${hours}: ${minutes} WIB `
  
    return fullTime
  
  }

function getDistanceTime(time){

    let timePost = time //waktu ketika membuat postingan
    let timeNow = new Date() // waktu sekarang 
  
    
    //untuk mencari jarak waktu post dengan waktu sekarang
    let distance = timeNow - timePost 
    
    
  
  
  
  
    //inisialisasi melisecond, detik  dalam satu jam, dan jam dalam satuhari
    let milisecond = 1000 // dalam 1 detik
    let secondInHouse = 3600 //dalam 1  jam
    let hoursInDay = 23  // jam dalam 1 hari 
  
    //inisialisasi menit dan second
    let minutes = 60
    let second = 60
  
    
    let distanceDay =  Math.floor((distance) / (milisecond * secondInHouse * hoursInDay))
  
    
  
  //variable penampung dan menconversi 
  // jam
  let distanceHours = Math.floor(distance / (milisecond * minutes * second)) //milisecond*detik*menit
  
  //menit
  let distanceMinutes = Math.floor(distance / (milisecond * minutes))
  
  //detik
  let distanceSeconds = Math.floor(distance / (milisecond))
  
  
  
  
    // kondisi untuk menampilkan hari , jam, menit dan detik
    if (distanceDay >= 1) {
      return `${distanceDay} Day ago`
    } else if  (distanceHours >= 1 ) {
        return`${distanceHours} Hourse ago`
    } else if (distanceMinutes >= 1){
        return`${distanceMinutes} Minutes ago`
    } else {
        (distanceSeconds >= 1)
        return` ${distanceSeconds} Second ago`
      }
          
        }
  

//routing halaman

app.get('/register', function(req, res){
    res.render('register')
})

app.post('/register', function(req, res){
    
    const {inputName, inputEmail, inputPassword} = req.body

    const hashedPassword = bcrypt.hashSync(inputPassword, 10)

    let query = `INSERT INTO tb_user(name, email, password) values ('${inputName}', '${inputEmail}', '${hashedPassword}') `;

    db.connect(function(err, client, done){
        if(err) throw err

        client.query(query, function(err, result){
            if(err) {
                throw err
            } else {
                req.flash('success', 'registrasi account berhasil, Silahkan login')
            }

        

            

        res.redirect('/login')
        })
    })

})
app.get('/login', function(req, res){
    res.render('login')
})

app.post('/login', function(req, res){

    const { inputEmail, inputPassword} = req.body

   

    let query = `SELECT * FROM tb_user WHERE email = '${inputEmail}' `;

    db.connect(function(err, client, done){
        if(err) throw err

        client.query(query, function(err, result){
            if(err) throw err
            // console.log(result.rows);

            if (result.rows.length == 0 ) {
                req.flash('danger', 'email atau password salah!')
                return res.redirect('/login')
            } 

            const isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password)

            // console.log(isMatch);

            let name = result.rows[0].name
            
            if (isMatch) {
                req.session.isLogin = true
                req.session.user = {
                    id : result.rows[0].id,
                    name : result.rows[0].name,
                    email : result.rows[0].email,
                }
                req.flash('success', `Hallo ${name} ,SELAMAT DATANG KEMBALI! `)
                res.redirect('/blog')
            }else {
                req.flash('danger', 'email atau password salah!')
                res.redirect('/login')
            }
        })
    })
})

app.get('/logout', function(req, res){
    req.session.destroy()
    res.redirect('blog')
})
app.get('/', function(req,res){

    db.connect(function(err, client, done){
        if(err) throw err

        client.query('SELECT * FROM tb_experience', function(err, result){
            if(err) throw err

            let dataExperience= result.rows

            

           

            res.render('index', {dataExperience:dataExperience, user: req.session.user, isLogin: req.session.isLogin})
        })
    })
    
})

app.get('/blog', function(req, res){

    db.connect(function(err, client, done){
        if(err) throw err

        client.query(`SELECT tb_blog.id, tb_blog.title, tb_blog.content, tb_blog.image, tb_blog.post_at, tb_user.name AS author , tb_blog.author_id 
        FROM tb_blog LEFT JOIN tb_user ON tb_blog.author_id = tb_user.id`, function(err, result){
            if(err) throw err

            let dataBlogs= result.rows

            let data = dataBlogs.map(function(data){
                return {
                    ...data,
                    isLogin : req.session.isLogin,
                    postAt : getFullTime(new Date()),
                    distance : getDistanceTime(data.post_at)
                }
            })

            

            res.render('blog', {isLogin:req.session.isLogin, user:req.session.user, blogs:data})
        })
    })

})

app.get('/delete-blog/:id', function(req, res) {
    let id = req.params.id
    

   

    if(!req.session.isLogin){
        req.flash('danger', 'Please Login')
        return res.redirect('/login')
    }
    
    let query = `DELETE FROM tb_blog WHERE id=${id}`
    db.connect(function(err, client, done){
        if(err) throw err

        client.query(query, function(err, result){
            if(err) throw err

        
            
            
            
        
        res.redirect('/blog')
        })
    })
    
})

app.get('/blog-detail/(:id)', function(req, res){
    

    let id = req.params.id


    db.connect(function(err, client, done){
        if(err) throw err

        client.query(`SELECT * FROM tb_blog WHERE id=${id}`, function(err, result){
            if(err) throw err

            
            let data = result.rows[0]
            let postAt = getFullTime(new Date())

            

            // console.log(data);

            

            res.render('blog-detail', {id:id, blogs:data, postAt:postAt})
        })
    })

    // let dataBlogs = blogs[index]

    // let postAt = getFullTime(blogs[index].postAt)
    // console.log(dataBlogs);

    // res.render('blog-detail', {index : index, dataBlogs:dataBlogs })
})

app.get('/contact', function(req, res){



    res.render('contact')
})
app.get('/add-blog', function(req,res){
    if(!req.session.isLogin){
        req.flash('danger', 'Please Login')
        return res.redirect('login')
    }
    res.render('add-blog', {user: req.session.user, isLogin: req.session.isLogin})
})

app.get('/edit-blog/:id', function(req, res){

    let id = req.params.id

    if(!req.session.isLogin){
        req.flash('danger', 'Please Login')
        return res.redirect('/login')
    }


    let query = `SELECT * FROM tb_blog WHERE id=${id}`

   
    db.connect(function(err, client, done){
        if(err) throw err

        client.query(query, function(err, result){
            if(err) throw err

            
            let data = result.rows[0]
            

            

            // console.log(data);

            

            res.render('edit-blog', {id:id, blogs:data, })
        })
    })
    // res.render('edit-blog', {dataEdit : dataEdit, index:index} )

})

app.post('/blog', upload.single('inputImage'), function(req, res){


    if(!req.session.isLogin){
        req.flash('danger', 'Please Login')
        return res.redirect('login')
    }
    
    let data = req.body
    let authorId = req.session.user.id
    let image = req.file.filename

    let query = `INSERT INTO tb_blog(title, content, image, author_id) values ('${data.inputTitle}', '${data.inputContent}', '${image}', '${authorId}') `;

    db.connect(function(err, client, done){
        if(err) throw err

        client.query(query, function(err, result){
            if(err) throw err

            

            if (result.rows.length !== 0 ) {
                req.flash('danger', 'Add Blog gagal!')
            } else {
                req.flash('success', 'Add Blog Berhasil')
                return res.redirect('/blog')
            }

             

        
        })
    })
})


app.post('/edit-blog/:id', upload.single('inputImage'), function(req, res){
    if(!req.session.isLogin){
        req.flash('danger', 'Please Login')
        return res.redirect('login')
    }


    let id = req.params.id
    let data = req.body
    let authorId = req.session.user.id
    let image = req.file.filename
    

    let query = `UPDATE tb_blog SET title='${data.inputTitle}', content='${data.inputContent}', image='${image}', author_id=${authorId} WHERE id=${id}`

   
    db.connect(function(err, client, done){
        if(err) throw err

        client.query(query, function(err, result){
            if(err) throw err

            
            if (result.rows.length !== 0 ) {
                req.flash('danger', 'Update Blog gagal!')
            } else {
                req.flash('success', 'Update Blog Berhasil')
                return res.redirect('/blog')
            }
            

            

            res.redirect('/blog')
        })
    })
    
    // res.redirect('/blog')
})


app.listen(PORT, function(){
    console.log(`Server Starting on PORT ${PORT}`);
})
