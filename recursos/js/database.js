let  request,db;
async function openDB(){
    request= indexedDB.open("Profile_Data",1)
    db;

    return new Promise((resolve,reject)=>{
        request.onsuccess=(event)=>{
            db=event.target.result;
            console.log("Base de datos abierta")
            resolve(db,request)
        };
        request.onupgradeneeded= (event)=>{
            db=event.target.result;
            console.log("ACTUUALIZANDO")
            db.createObjectStore("profiles",{keyPath:"name"})
            db.createObjectStore("backpack",{keyPath:"id"})
            resolve(db,request)
        };
        request.onerror=(event)=>{
            console.error("Error al abrir la base de datos")
            reject(event.target.error)
        }
        
    })
}

await openDB();

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
function addData(data={},object="profiles"){
    const [transaction,store]=startTransaction(object) 
    store.add(data);
    // store.add({id:1,name:"Prueba",edad:25});
    transaction.oncomplete=()=>console.log("Datos agregados");
    transaction.onerror=(event)=>console.log("Error ",event);
}
    
//leer datos
async function readData({key,mode="key",object="profiles"}){
    return new Promise((resolve,reject)=>{

        const [transaction,store]=startTransaction(object,"readonly")
        
        // console.log("store=",store)
        const data_request=(mode!="all")?store.get(key): store.getAll();
        data_request.onsuccess=(event)=> {
            // console.log("Data:", result)
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


export const module = {
    addData,
    readData,
    updateData,
    deleteData
}