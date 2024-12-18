const form_name = document.getElementById("name");
const form_email = document.getElementById("e-mail");
const form_message = document.getElementById("message");
const submitBtn = document.getElementById("send");

submitBtn.addEventListener("click",()=>isFormReady());

const isFormReady =()=>{
    if(form_name.value!==""||form_email.value!==""||form_message!=="")
    {
        console.log("El formulario se envio correctamente");
    }
}