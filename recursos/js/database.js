// console.log("DATATABSE:JS");
let  request,db;
async function openDB(){
    console.log("OPEN DB");
    db;
    return new Promise((resolve,reject)=>{
        request= indexedDB.open("Profile_Data",3)
        request.onsuccess=(event)=>{
            db=event.target.result;
            console.log("Base de datos abierta")
            resolve(db,request)
        };
        request.onupgradeneeded= (event)=>{
            db=event.target.result;
            console.log("ACTUUALIZANDO")
            if (!db.objectStoreNames.contains("profiles")) {
                db.createObjectStore("profiles",{keyPath:"name"})
            }
            // profiles = { name, date}
            if (db.objectStoreNames.contains("backpack")) {
                db.deleteObjectStore("backpack");
            }

            let backpackStore=db.createObjectStore("backpack",{keyPath:"date_time"})
            // backpack= {
            //      profile:"name", date_time:"yyyy-mm-dd hh:mm", 
            //      ebony:[], leather:[], iron_stone:[], bones:[], universal:[]
            // }
            backpackStore.createIndex("ByUser","profile",{unique:false})
            // backpackStore.createIndex("ByDate","date",{unique:false})
            resolve(db,request)
        };
        request.onerror=(event)=>{
            console.error("Error al abrir la base de datos")
            reject(event.target.error)
        }
        // console.log("PROMESA SETEADA")
    })
}

await openDB();
// console.log("DEBES EXXPORTAR")


// async function usarBaseDeDatos() {
//     try {
//       const db = await openDB();
//     //   console.log("Base de datos abierta con éxito:", db);
//     } catch (error) {
//         return false;
//       console.error("Error al abrir la base de datos:", error);
//     }
//   }
  
// await usarBaseDeDatos();



function startTransaction(object,action="readwrite"){
    // console.log(db)
    const transaction=db.transaction(object,action)
    return [
        transaction,
        transaction.objectStore(object)
    ];
}

//agregar datos
async function addData(data={},object="profiles"){
    const [transaction,store]=startTransaction(object)
    // console.log(store)
    store.add(data);
    // store.add({id:1,name:"Prueba",edad:25});
    return new Promise((resolve,reject)=>{
        transaction.oncomplete=()=>{
            console.log("Datos agregados")
            resolve(true)
        };
        transaction.onerror=(event)=>{
            console.log("Error ",event)
            reject(event.target.error)
        };
    })
}
    
//leer datos
async function readData({key,index,mode="key",object="profiles"}){
    return new Promise((resolve,reject)=>{
        let [transaction,store]=startTransaction(object,"readonly")
        
        // console.log("store=",store)
        if(index!=null){
            // console.log(object," USA EL INDEX ",index)
            store=store.index(index)
        }
        const data_request=(mode!="all")?store.get(key): store.getAll(key);
        data_request.onsuccess=(event)=> {
            // console.log("Data:", result)
            // console.log("OBJECT:=>",object,"\n=>",data_request.result)
            // console.log()
            resolve(event.target.result)
        };
        data_request.onerror= (event)=>{
            console.log("Error al leer ");
            reject(event.target.error)
        }
    })
}

//actuaizar datos
function updateData({data,object="profiles"}){
    const [transaction,store]=startTransaction(object)
    store.put(data);
    transaction.oncomplete=()=>console.log("Datos Acualizados");
}

//eliminar datos
function deleteData({key,object="profiles"}){
    const [transaction,store]=startTransaction(object)
    store.delete(key);
    transaction.oncomplete=()=>console.log("Datos eliminados");
}

// console.log("BACKPACKS=>",await readData({mode:"all",object:"backpack"}))


// readData({key:"2025-13-1 03:25:22",object:"backpack"})
//     .then(data=>{
//         console.log(data)
//     })

export const module = {
    addData,
    readData,
    updateData,
    deleteData
}