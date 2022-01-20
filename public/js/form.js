

function submitData() {
    let name = document.getElementById('input-name').value
    let email = document.getElementById('input-email').value
    let phoneNumber = document.getElementById('input-phoneNumber').value
    
    
    let skills1 = document.getElementById('input-checkbox1').checked
    let skills2 = document.getElementById('input-checkbox2').checked
    

        if (skills1) {
            skills1 = (document.getElementById('input-checkbox1').value)
        } else {
            skills1 = "";
            

        }if (skills2) {
            skills2 = (document.getElementById('input-checkbox2').value)
            
        } else  {
            skills2 = "";
            
        }
    
        
    let subject = document.getElementById('input-subject').value
    let massage = document.getElementById('input-massage').value
    

    


    console.log(name);
    console.log(email);
    console.log(phoneNumber);
    console.log(skills1);
    console.log(skills2);
    
    console.log(subject);
    console.log(massage);


    if (name == ""){
        return alert("Nama tidak boleh kosong")
    } else if (email == ""){
        return alert("Email tidak boleh kosong") 

    } else if (phoneNumber == ""){
        return alert("Nomor Telpon tidak boleh kosong") 

    }  else if (subject == ""){
        return alert("Subject tidak boleh kosong") 

    } else if (massage == ""){
        return alert("massage tidak boleh kosong") 

    }

    let emailReciver = 'hamamullaiqi@mail.com'

    let a = document.createElement('a')

    a.href = `mailto: ${emailReciver}?subject=${subject}&body=Hallo my name is ${name} ${massage}, contact me ${phoneNumber}, send CV to ${email}, requirment skill ${skills1} ${skills2} `

    a.click()


    let dataObject = {
        name : name,
        email : email,
        phoneNumber : phoneNumber,
        subject : subject,
        massage : massage,
        skills1 : skills1,
        skills2 : skills2,
        
    }
    console.log(dataObject);



    
}