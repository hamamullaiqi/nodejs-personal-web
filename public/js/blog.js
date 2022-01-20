//variable untuk manampung inputan ketika funtion di jalankan
let blogs = []

function addBlog(event) {
    event.preventDefault()

    //variable untuk menampung nilai pada inputan
    let title = document.getElementById('input-blog-title').value 
    let content = document.getElementById('input-blog-content').value

    //untuk menampung file gambar  dan otomatif akan membuat object file list, index dimulai dari 0 kembali
    let image = document.getElementById('input-blog-image').files


    //untuk mengakses gambar menggunakan url
    image = URL.createObjectURL(image[0])
    


    //variable untuk  menampung isi variable dalam object
    let blog = {
        title: title,
        content: content,
        image: image,
        author : "hamamullaiqi",
        postAt : new Date(),
        
    }
    
    //menambah isi array blogs dengan isi object blog
    blogs.push(blog)
    
    
    
    
    //memanggil function renderblog
    renderBlogs()
    
    
}

//function untuk membuat data post baru dari inputan menggunakan DOM
function renderBlogs() { 
    let contentContainer = document.getElementById('contents')

    //Ketika membuat list post baru ,list post sebelumya tidak hilang
    contentContainer.innerHTML = creatNewBlog()

     for ( let i = 0; i < blogs.length; i++){
        contentContainer.innerHTML += `
        
        
        <div class="blog-list-item mb-3">
        <div class="row">
            <div class="col-md-4 blog-image mb-3" >
                <img src="${blogs[i].image}" alt="img-blog" >
            </div>
                <div class="col-md-8 blog-content">
                    <div class="row">
                        <div class="col detail-blog-content">
                            <h2>${blogs[i].title}</h2>
                            <span> ${getFullTime(blogs[i].postAt)} | ${blogs[i].author}</span>
                        </div>
                            
                            <div class=" my-3" id="blog-content">
                                <p> ${blogs[i].content}</p>   
                                <span>${getDistanceTime(blogs[i].postAt)}</span>
                                <div class="col right-btn ">
                                    <span class="btn btn-danger  "><a href=""></a>Delete</span>
                                    <span class="btn btn-success "><a href=""></a>Edit</span>
                                </div>
                            </div>
                    </div>
                
            </div>
        </div>
      
    </div>

     `
    }

    
    
}


function creatNewBlog (){
  return `<div class="blog-list-item mb-3">
  <div class="row">
      <div class="col-md-4 blog-image" >
          <img src="/assets/blog-img.png" alt="img-blog" >
      </div>
          <div class="col-md-8 blog-content">
              <div class="row">
                  <div class="col detail-blog-content">
                      <h2>judul1</h2>
                      <span>tanggal || author</span>
                  </div>
                      
                      <div class=" my-3" id="blog-content">
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, unde. Ipsum animi voluptate aperiam perspiciatis quod atque! Fuga inventore labore sed. Et exercitationem sequi laborum quas perferendis id perspiciatis inventore!</p>   
                          <span>1 minutes ago</span>
                          <div class="col right-btn ">
                              <span class="btn btn-danger  "><a href=""></a>Delete</span>
                              <span class="btn btn-success "><a href=""></a>Edit</span>
                          </div>
                      </div>
              </div>
          
      </div>
  </div>

</div>`
}

//function Fulltime 

let mouth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'november', 'Desember']

function getFullTime (time) {

let date = time.getDate()
let mouthIndex = time.getMonth()//hanya mengembalikan index
let yaer = time.getFullYear()
let hours = time.getHours()
let minutes = time.getMinutes()


let fullTime = `${date} ${mouth[mouthIndex]} ${yaer} ${hours}: ${minutes} WIB `

return fullTime

}

//membuat fungsi untuk menampilakn jarak waktu post dan waktu sekarang
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
console.log(distanceHours);
//menit
let distanceMinutes = Math.floor(distance / (milisecond * minutes))
console.log(distanceMinutes);
//detik
let distanceSeconds = Math.floor(distance / (milisecond))
console.log(distanceSeconds);



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
    
  setInterval (() => {

    renderBlogs();
    // 1
  }, 3000)
console.log(blogs);

 




