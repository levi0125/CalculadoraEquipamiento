import {module} from './database.js'
// console.log(await module.readData({mode:"all"}))











///////////////////////////////////////
/// DECLARATION OF VARIABLES
///////////////////////////////////////
let selector=document.getElementById("Selector"),
    calcular=document.getElementById("calcular"),
    materiales='Universales,Cuero,Piedra,Ebano,Hueso'.split(','),
    contenedor=document.getElementsByClassName('container')[0],
    profiles=document.getElementById("Profiles"),
    closeProfile=document.getElementById("Close-Profile"),
    addProfile=document.getElementById("Add-Profile"),
    equipmentSelector=document.querySelector(".equiment-Selector");

///////////////////////////////////////
/// END OF DECLARATION OF VARIABLES
///////////////////////////////////////

class equipmentSet{
    constructor(NameOfSet){}
}
class Pieza{
    constructor(name="",NameOfSet,level="",materials={"leather":0,"iron_stone":0,"ebony":0,"bones":0} ){
        this.name=name;
        this.set=NameOfSet;
        this.level=level
        this.materials=materials;
    }
}
let piezas= [
    new Pieza("Greaves of the ","Glorious Goddess","legendary",
        {"leather":10, "iron_stone":15,"ebony":15}),
    new Pieza("CHausses of the Glorious Goddess","Glorious Goddess","legendary",
        {"leather":20, "iron_stone":20,"ebony":20}),
    new Pieza("Guantlets of the Glorious Goddess","Glorious Goddess","legendary",
        {"leather":15, "iron_stone":15,"ebony":10}),
    new Pieza("Plate of the Glorious Goddess","Glorious Goddess","legendary",
        {"leather":20, "iron_stone":20,"ebony":20}),
    new Pieza("Diadem of the Glorious Goddess","Glorious Goddess","legendary",
        {"leather":20, "iron_stone":20,"ebony":20}),
    new Pieza("Scepter of the Glorious Goddess","Glorious Goddess","legendary",
        {"leather":30, "iron_stone":30,"ebony":30})
]
// Pieza("","","",{})


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



///////////////////////////////////////
/// END COOKIES
///////////////////////////////////////
///////////////////////////////////////
/// SETTING OF THE PAGE
///////////////////////////////////////
function createGroup(MaterialName){   
    return '<section class="Row-Flex Group-of-Material"><h3 class="name">'+MaterialName+':</h3>'+
    '<div class="Row-Flex fillable"><input type="number" class="normal"><input type="number" class="advanced"><input type="number" class="elite"><input type="number" class="epic"><input type="number" class="legendary"></div>'
    +'<div class="result Row-Flex"><input type="number" class="legendary" disabled placeholder="Total Legendarios"><input type="number" class="epic" disabled placeholder="Total Epicos"><input type="number" class="elite" disabled placeholder="Total Elites"><div>'
    +'</section>'
}
function createMaterialColumns (){
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
        
        if(index<=2){
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
async function getUsers(){
    // return JSON.parse((getCookieValue("users") || "[]"))

    // readData(mode="all")
    return await module.readData({mode:"all"});
}
async function setCurrentUser(userName){
    if(await module.readData({key:userName})==null){
        alert("EL USUARIO NO EXISTE")
        return 
    }
    createCookie("current-User",userName)
    selector.children[0].innerText=userName
}
// async function changeUser(userName){
//     if(!getUsers().includes(userName)){
//         //its a trap
//         alert("USUARIO NO EXISTE")
//         return
//     }
//     await setCurrentUser(userName)
//     setCurrentUserInPage(userName)
// }
///////////////////////////////////////
/// END OF ADMINISTRATION OF USERS
///////////////////////////////////////
function createUserOption(user){
    let option=document.createElement("li")
    option.classList.add("user-Option")
    let children = [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div")]
    children[0].classList.add("name")
    children[1].classList.add("update")
    children[2].classList.add("delete")
    
    children[0].innerText=user.name
    children[0].dataset["date"]=user.date
    
    children.forEach(child=>{
        option.appendChild(child)
    })
    option.addEventListener("click",userOptionEvent)

    return option
}
async function setUsersInPage(){
    for(let user of await getUsers()){
        profiles.appendChild(createUserOption(user))
        // profiles.innerHTML+='<li class="user-Option">'+user+'</li>'
    }
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
function giveEventChangeOfInputs(){
    let inputs=document.querySelectorAll(".fillable input");
    inputs.forEach(input=>{
        input.addEventListener("change",e=>{
            e.preventDefault()

            console.log("DEBE CALCULAR")
            document.getElementById("calcular").dispatchEvent(new Event("click"))      
        })
    })   
}     
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

addProfile.addEventListener("click",async e=>{
    let ProfileName=prompt("NOMBRE DEL PERFIL")

    // createCookie("current-User",ProfileName)
    
    // let users=await getUsers()

    // if(users.includes(ProfileName)){
    if(await module.readData({key:ProfileName})){
        alert("USUARIO YA EXISTE")
        return 
    }
    //date now
    // new Date().toLocaleDateString().replaceAll("/","-")
    let dateNow=new Date().toLocaleDateString().replaceAll("/","-");
    let user={name:ProfileName, date:dateNow}
    module.addData(user)
    // users.push(ProfileName)

    // createCookie("users",JSON.stringify(users))
    let option=createUserOption(user)
    profiles.appendChild(option)

    profiles.style.height=profiles.scrollHeight+"px"
})
closeProfile.addEventListener("click",e=>{
    removeCookie("current-User")
    setCurrentUserInPage("Seleccione \nun perfil")
})
document.querySelectorAll(".row-equipment .slot").forEach(slot=>{
    slot.addEventListener("click",e=>{
        console.log(e.target)
    })
})
async function userOptionEvent(event,user=event.target){
    console.log("user ",user.innerText,"presionado")
    await setCurrentUser(user.innerText)
}
// function setEventToUserOption(){
//     document.querySelectorAll(".user-Option").forEach(user=>{
//         user.addEventListener("click",userOptionEvent)
//     })
// }

function setEventOfSlotEquipment(){
    document.querySelectorAll(".row-equipment .slot").forEach(slot=>{
        slot.addEventListener("click",e=>{
            if(equipmentSelector.checkVisibility()){
                
            }
        })
    })
}
///////////////////////////////////////
/// END OF SETING OF EVENTS
///////////////////////////////////////
///////////////////////////////////////
/// PROCEDURES AND CALLING OF FUNCTIONS
///////////////////////////////////////
createMaterialColumns();
// let close=document.getElementById("Close-Profile")
giveEventChangeOfInputs();
setUsersInPage();
setCurrentUserInPage();
// setEventToUserOption();
///////////////////////////////////////
/// END OF PROCEDURES AND CALLING OF FUNCTIONS
///////////////////////////////////////

