///////////////////////////////////////
/// DECLARATION OF VARIABLES
///////////////////////////////////////
let selector=document.getElementById("Selector"),
    calcular=document.getElementById("calcular"),
    materiales='cuero,piedra,ebano,hueso,universales'.split(','),
    contenedor=document.getElementsByClassName('container')[0],
    profiles=document.getElementById("Profiles"),
    closeProfile=document.getElementById("Close-Profile"),
    addProfile=document.getElementById("Add-Profile");

///////////////////////////////////////
/// END OF DECLARATION OF VARIABLES
///////////////////////////////////////
///////////////////////////////////////
///COOKIES
///////////////////////////////////////
function createCookie(cookieName,cookieValue,cookieExpiryDays=30){
    // Calculate the expiry date
    // const expiryDate = new Date();
    // expiryDate.setTime(expiryDate.getTime() + (cookieExpiryDays * 24 * 60 * 60 * 1000));

    // Set the cookie
    // document.cookie = `${cookieName}=${cookieValue};expires=${expiryDate.toUTCString()};path=/;`;
    document.cookie = `${cookieName}=${cookieValue};path=/;`;
}
function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${cookieName}=`)) {
        return cookie.substring(`${cookieName}=`.length);
        }
    }
    return null;
}
function removeCookie(cookieName) {
    document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}
function getUsers(){
    return JSON.parse((getCookieValue("users") || "[]"))
}
///////////////////////////////////////
/// END COOKIES
///////////////////////////////////////
///////////////////////////////////////
/// SETTING OF THE PAGE
///////////////////////////////////////
function createGroup(MaterialName){   
    return '<section class="Row-Flex Group-of-Material"><h3 class="name">'+MaterialName+':</h3>'+
    '<div class="Row-Flex fillable"><input type="number" class="normal"><input type="number" class="advanced"><input type="number" class="elite"><input type="number" class="epic"><input type="number" class="legendary"></div>'
    +'<div class="result Row-Flex"><input type="number" class="legendary" disabled placeholder="Total Legendarios"><input type="number" class="epic" disabled placeholder="Total Epicos"><div>'
    +'</section>'
}
function creattMaterialColumns (){
    materiales.map(e=>{
        contenedor.innerHTML+=createGroup(e)
    })
}
///////////////////////////////////////
/// END OF SETTING OF THE PAGE
///////////////////////////////////////
///////////////////////////////////////
/// CALCULATION OF MATERIALS
///////////////////////////////////////
function fixInput(input){
    if(input.value==""){
        input.value=0
        return 0
    }
    return parseInt(input.value)
}
function getMaterialCount(sectionOfMaterials){
    // console.log(sectionOfMaterials)
    let materials=sectionOfMaterials.querySelectorAll(".fillable input")
    let resultBoxes=sectionOfMaterials.querySelectorAll(".result input")
    let index=4;
    let result=0;
    for(let material of materials){
        // console.log(index)
        let value=fixInput(material);
        
        result+=value
        
        if(index<2){
            //entra en los bucles 1 (epico) y 0(legendario) 
            resultBoxes[index].value=result
        }
        result=result/4
        index-=1;
    }
}
///////////////////////////////////////
/// END OF CALCULATION OF MATERIALS
///////////////////////////////////////
///////////////////////////////////////
/// ADMINISTRATION OF USERS
///////////////////////////////////////
function getUsers(){
    return JSON.parse((getCookieValue("users") || "[]"))
}
function setCurrentUser(userName){
    createCookie("current-User",userName)
    selector.children[0].innerText=userName
}
function changeUser(userName){
    if(!getUsers().includes(userName)){
        //its a trap
        alert("USUARIO NO EXISTE")
        return
    }
    setCurrentUser(userName)
    setCurrentUserInPage(userName)
}
///////////////////////////////////////
/// END OF ADMINISTRATION OF USERS
///////////////////////////////////////
function createUserOption(userName){
    let option=document.createElement("li")
    option.classList.add("user-Option")
    option.innerText=userName
    return option
}
function setUsersInPage(){
    getUsers().forEach(user=>{
        profiles.appendChild(createUserOption(user))
        // profiles.innerHTML+='<li class="user-Option">'+user+'</li>'
    })
    profiles.style.height="0px"
}
function setCurrentUserInPage(user){
    let current_User=user || getCookieValue("current-User")
    console.log("currentUSER:",current_User)
    if(current_User!=null){
        selector.children[0].innerText=current_User
    }
}

///////////////////////////////////////
/// SETING OF EVENTS
///////////////////////////////////////

calcular.addEventListener("click",event=>{
    event.preventDefault();
    document.querySelectorAll(".Group-of-Material").forEach(material=>{
        // console.log("mat=",material)
        getMaterialCount(material)
    })
})
document.querySelectorAll("input").forEach(input=>{
    input.addEventListener("change",e=>{
        e.preventDefault()
        document.getElementById("calcular").dispatchEvent(new Event("click"))      
    })
})        
selector.addEventListener("click",(e,target=e.target)=>{
    // const list=e.target.parentNode.children[1]
    // console.log(e.target)
    const height=profiles.style.height
    if(height=="0px"){
        console.log("EXPANDIR DE PROFILeS")
        profiles.style.height=profiles.scrollHeight+"px"
    }else{
        console.log("CONTRAER")
        profiles.style.height="0px"
    }
})

addProfile.addEventListener("click",e=>{
    let ProfileName=prompt("NOMBRE DEL PERFIL")

    // createCookie("current-User",ProfileName)
    let users=getUsers()

    if(users.includes(ProfileName)){
        alert("USUARIO YA EXISTE")
        return 
    }
    users.push(ProfileName)

    createCookie("users",JSON.stringify(users))
    let option=createUserOption(ProfileName)
    option.addEventListener("click",userOptionEvent)
    profiles.appendChild(option)

    profiles.style.height=profiles.scrollHeight+"px"
})
closeProfile.addEventListener("click",e=>{
    removeCookie("current-User")
    setCurrentUserInPage("Seleccione \nun perfil")
})
function userOptionEvent(event,user=event.target){
    console.log("user ",user.innerText,"presionado")
    setCurrentUser(user.innerText)
}
function setEventToUserOption(){
    document.querySelectorAll(".user-Option").forEach(user=>{
        user.addEventListener("click",userOptionEvent)
    })
}
///////////////////////////////////////
/// END OF SETING OF EVENTS
///////////////////////////////////////
///////////////////////////////////////
/// PROCEDURES AND CALLING OF FUNCTIONS
///////////////////////////////////////
creattMaterialColumns()
// let close=document.getElementById("Close-Profile")
setUsersInPage();
setCurrentUserInPage();
setEventToUserOption()
///////////////////////////////////////
/// END OF PROCEDURES AND CALLING OF FUNCTIONS
///////////////////////////////////////

