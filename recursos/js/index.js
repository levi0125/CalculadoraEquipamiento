// console.log("INDeX:JS")
import {module} from './database.js'
///////////////////////////////////////
/// DECLARATION OF VARIABLES
///////////////////////////////////////
let selector=document.getElementById("Selector"),
    calcular=document.getElementById("calcular"),
    materiales='Universales,Cuero,Hierro,Ebano,Hueso'.split(','),
    englishMaterials={
        "Universales:":"universal",
        "Cuero:":"leather",
        "Hierro:":"iron_stone",
        "Ebano:":"ebony",
        "Hueso:":"bones"},
    currentUser=getCookieValue("current-User"),
    contenedor=document.getElementsByClassName('container')[0],
    profiles=document.getElementById("Profiles"),
    closeProfile=document.getElementById("Close-Profile"),
    addProfile=document.getElementById("Add-Profile"),
    equipmentSelector=document.querySelector(".equiment-Selector"),
    guardarCalculo=document.getElementById("guardar-Calculo"),
    dateSelector=document.getElementById("date");

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
    return '<section class="Row-Flex Group-of-Material"><h3 class="name">'+MaterialName+':</h3>'
    +'<div class="close-Fillable"></div>' 
    +'<div class="Row-Flex fillable"><input type="number" class="normal"><input type="number" class="advanced"><input type="number" class="elite"><input type="number" class="epic"><input type="number" class="legendary"></div>'
    +'<div class="result Row-Flex"><input type="number" class="legendary" disabled placeholder="Total Legendarios"><input type="number" class="epic" disabled placeholder="Total Epicos"><input type="number" class="elite" disabled placeholder="Total Elites"><div>'
    +'</section>'
}
function createMaterialColumns (){
    materiales.map(e=>{
        contenedor.innerHTML+=createGroup(e)
    })
}

function refreshDateSelector(){
    if(currentUser){
        dateSelector.innerHTML='<option>Fecha</option>'
        module.readData({index:"ByUser",mode:"all",key:currentUser,object:"backpack"}).then(result=>{
            // console.log("LARGO:",result.length)
            result?.forEach(date=>{
                let option =document.createElement("option")
                option.innerText+= date.date_time
                // console.error(date)
                dateSelector.appendChild(option)
            })
        })
    }
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
function today(){
    let date=new Date();
    return [
        date.toLocaleString().split(",",1)[0].split("/").reverse().join("-"),
        date.toTimeString().split(" ")[0]
    ]
}
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
    setCurrentUserInPage(userName,true,true)

    // currentUser=userName;
    // selector.children[0].innerText=userName
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
function setCurrentUserInPage(user,saveUser=true,creatingCookie){
    currentUser=user || currentUser
    console.log("currentUSER:",currentUser)
    if(currentUser!=null){
        selector.children[0].innerText=currentUser
    }
    if(creatingCookie && user){
        createCookie("current-User",user)
    }
    if(saveUser!=true ){
        console.log("BORRA EL USUAIO")
        currentUser=null;
    }
    refreshDateSelector()
}

///////////////////////////////////////
/// SETING OF EVENTS
///////////////////////////////////////

calcular.addEventListener("click",event=>{
    event.preventDefault();
    if(guardarCalculo.matches(".guardado")){
        guardarCalculo.classList.remove("guardado")
        guardarCalculo.src="recursos/imgs/guardar.webp"
    }
    document.querySelectorAll(".Group-of-Material").forEach(material=>{
        // console.log("mat=",material)
        getMaterialCount(material)
    })
    guardarCalculo.style.display="block"
})
function giveEventChangeOfInputs(){
    let inputs=document.querySelectorAll(".fillable input");
    inputs.forEach(input=>{
        // input
        input.addEventListener("keydown",e=>{
            // e.preventDefault()
            // console.error(e.key)
            if(e.key=="Enter"){
                
                console.log("DEBE CALCULAR")
                document.getElementById("calcular").dispatchEvent(new Event("click"))      
            }
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
    setCurrentUserInPage("Seleccione \nun perfil",false)
})
document.querySelectorAll(".row-equipment .slot").forEach(slot=>{
    slot.addEventListener("click",e=>{
        console.log(e.target)
    })
})
// console.log("GUArDAR :",guardarCalculo)
guardarCalculo.addEventListener("click",async (e,target=e.target)=>{
    console.log("guardar Calculo")
    if(!target.classList.contains("guardado")){
        //user wants to save
        console.log("CU:",currentUser)
        if(currentUser==null){
            alert("DEBES SELECCIONAR UN PERFIL")
            return 
        }
        let date=today()
        let backpack={
            "profile":currentUser,
            "date_time":date[0]+" "+date[1]
        };
        document.querySelectorAll(".Group-of-Material").forEach(group=>{
            const name= englishMaterials[ group.querySelector(".name").innerText];
            let values=[]
            group.querySelectorAll("input").forEach(input=>{
                values.push(fixInput(input))
            })
            backpack[name]=values; 
        })

        console.log("MOCHILA:"+JSON.stringify(backpack))

        const result=await module.addData(backpack,"backpack")
        console.log(result)
        refreshDateSelector()
        if(result==true){
            target.classList.add("guardado");
            target.src="recursos/imgs/guardado.webp"
            target.title="Guardado"
        }else{
            alert("HUBO UN FALLO AL GUARDAR HISTORIAL")
        }
        return 
    }
    alert("YA HAS GUARDADO")
})
dateSelector.addEventListener("change",e=>{
    // console.log(e.target)
    // console.log(e.target.value)
    module.readData({key:e.target.value ,object:"backpack"})
    .then(data=>{
        console.log(data)
        if(data==null){
            return
        }
        document.querySelectorAll(".Group-of-Material").forEach(group=>{
            const materials=data[englishMaterials[group.children[0].innerText]];

            console.log(materials)
            group.querySelectorAll("input").forEach((input,index)=>{
                input.value=materials[index]
            })
        })
    })
})
async function userOptionEvent(event,user=event.target){
    console.log("user ",user.innerText,"presionado")
    await setCurrentUser(user.innerText)
}
function setHoverInFillable(){
    document.querySelectorAll(".close-Fillable").forEach(fillable=>{
        fillable.addEventListener("mouseover",e=> {
            // console.log("hover")
            contenedor.style.setProperty("--fillable_tick","8px");
            contenedor.style.setProperty("--fillable_color","#407f38");
        })
        fillable.addEventListener("mouseleave",e=> {
            // console.log("leave")
            contenedor.style.setProperty("--fillable_tick","5px")
            contenedor.style.setProperty("--fillable_color","black");
        })
        // fillable.addEventListener("mouseleave",e=> getComputedStyle(contenedor).getPropertyValue("--fillable_tick"))
    })
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
refreshDateSelector()
createMaterialColumns();
// let close=document.getElementById("Close-Profile")
giveEventChangeOfInputs();
setHoverInFillable();
setUsersInPage();
setCurrentUserInPage();
// setEventToUserOption();
///////////////////////////////////////
/// END OF PROCEDURES AND CALLING OF FUNCTIONS
///////////////////////////////////////