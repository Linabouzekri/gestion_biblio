import React, { useEffect, useState } from 'react'
import TableData from '../components/TableData'
import { API_CLIENT, API_EMPRUNT, API_NOTIFICATION } from '../Api/api'
import { format } from 'date-fns'
// icons 
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BiShowAlt } from "react-icons/bi";



const Client = () => {
  const [search , setSearch] = useState("")
  const [searchDetailsClient , setSearchDetailsClient ] =useState("")
  
  const [filterData , setFilterDate] = useState([])
  const [filterDataDetailsClient , setFilterDataDetailsClient] = useState([])

  const [empruntsClient , setEmruntsClient] = useState([])

  const [clients , setClients] = useState([])
  const [clientUpdate , setClientUpdate] = useState(null)
  const [clientDelete , setCleintDelete]= useState(null)
  const [clientDetails , setClientDetails] = useState(null)

  // client updta 
  const [fnameUpdate , setFnameUpdate] = useState("")
  const [lnameUpdate , setLnameUpdate] = useState("")
  const [emailUpdate , setEmailUpdate] = useState("")

  // end client update

  // les erreur 
  const [ errorUpdate , setErrorUpdate] = useState("")
  const [ errorAdd , setErrorAdd] = useState("")
  const [errorDelete ,  setErrorDelete] = useState("")

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalDeleteOpen , setIsModalDeleteOpen] = useState(false)
  const [isModalAddOpen , setIsModalAddOpen] = useState(false)
  const [isModalDetaisClient , setIsModelDetailsClient] = useState(false)

  useEffect(()=>{
    const fetchClients = async ()=>{
        const response = await fetch(API_CLIENT +'/api/v1/client' )
        const json = await response.json()

        if(response.ok){
            setClients(json)
            setFilterDate(json)
        }
    }

    fetchClients()

} , [])


useEffect(()=>{
  
  const result = clients.filter((client)=>{
    return JSON.stringify(client)
    .toLowerCase()
    .indexOf(search.toLowerCase()) !== -1
   
  });

  console.log(result);

  setFilterDate(result)

} , [search , clients ])



const deleteClient= async(id) =>{
  setErrorDelete("")
  //setClients(clients.filter(C=> C._id !== id));
  const client = clients.filter(C=> C._id === id)[0]
  setCleintDelete(client)
  setIsModalDeleteOpen(true)

}

const modifierClient= async(id) =>{
  setErrorUpdate("")
  const client = clients.filter(C=> C._id === id)[0]
  setClientUpdate(client)
  setIsModalUpdateOpen(true)
  setFnameUpdate(client.fname)
  setLnameUpdate(client.lname)
  setEmailUpdate(client.email)
}

const toggleModalUpdate = () => {
  setIsModalUpdateOpen(!isModalUpdateOpen);
};

const toggleModalDelete = () => {
  setIsModalDeleteOpen(!isModalDeleteOpen);
};

const toggleModalAdd = () => {
  setIsModalAddOpen(!isModalAddOpen);
};


const handleUpdateFname = (e)=>{
  setFnameUpdate(e.target.value)
}

const handleUpdateLname = (e)=>{
  setLnameUpdate(e.target.value)
}

const handleUpdateEmail = (e)=>{
  setEmailUpdate(e.target.value)
}

const columns = [
  {
    name : "First Name",
    selector : (row) => row.fname,
    sortable: true
  },
  {
    name : "Last Name",
    selector : (row) => row.lname,
    sortable: true
  },
  {
    name : "Email",
    selector : (row) => row.email,
    sortable: true
  },
  {
    name : "Actions",
    cell : (row) => <div className='flex items-center justify-center'>
          <MdDelete onClick={()=> { deleteClient(row._id )} } className="w-7 h-7 text-red-500 hover:text-red-700 cursor-pointer mr-3" />
          <FaEdit onClick={()=> {modifierClient(row._id)}} className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mr-3" />
          <BiShowAlt onClick={()=>{datilsClient(row._id) }}  className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mr-3" />

    </div>
  }

] 



// modifier Client 
const handleUpdateClientSubmit = async(e) =>{
  e.preventDefault();

  const requestData = {
    email: emailUpdate,
    fname: fnameUpdate,
    lname: lnameUpdate
  };
   //console.log(emailUpdate , fnameUpdate , lnameUpdate);

  const response = await fetch( API_CLIENT+ "/api/v1/client/" + clientUpdate._id , {
      method : 'PUT' , 
      headers : {"Content-type" : 'application/json'},
      body:  JSON.stringify(requestData)
  })

  const res = await response.json()

  if(!response.ok){
      setErrorUpdate(res.error)
  }

  if(response.ok){
    const index = clients.findIndex((item) => item._id === clientUpdate._id);

    let newClients =  clients.filter(C=>C._id !== res._id);
    newClients.splice(index,0,res);

    setClients(newClients)
    setIsModalUpdateOpen(false)

    setFnameUpdate("")
    setLnameUpdate("")
    setEmailUpdate("")

  }

}


//supprimer Client

const handleDeleteClientSubmit = async(e)=>{
  e.preventDefault();

    try{

      const response = await fetch( API_CLIENT+ "/api/v1/client/" + clientDelete._id , {
        method : 'DELETE' , 
      })


      if(response.ok){
        // supprimer Client from service Notification 
        const responseN = await fetch( API_NOTIFICATION+ "/api/v1/notification/client/" + clientDelete._id , {
          method : 'DELETE' , 
        })

        // supprimer Client from service Emrunts

        const responseEmprunt = await fetch( API_EMPRUNT+ "/api/v1/emprunt/client/" + clientDelete._id , {
          method : 'DELETE' , 
        })

        setClients(clients.filter(C=> C._id !== clientDelete._id ))
        setIsModalDeleteOpen(false)
      }else{
        setErrorDelete("Client a des Impruntes")
      } 

  }catch(error){
    console.log("error" , error);
  }
  

}


// ajouter Client 

const handleAddClientSubmit = async(e) =>{
  e.preventDefault();

  const requestData = {
    email: emailUpdate,
    fname: fnameUpdate,
    lname: lnameUpdate
  };

  const response = await fetch( API_CLIENT+ "/api/v1/client", {
    method : 'POST' , 
    headers : {"Content-type" : 'application/json'},
    body:  JSON.stringify(requestData)
})

  const res = await response.json() 
  if(!response.ok){
    setErrorAdd(res.error)
  }


  if(response.ok){

    // ajouter client dans le service Notification 

    const result = await fetch( API_NOTIFICATION+ "/api/v1/notification/addClient", {
        method : 'POST' , 
        headers : {"Content-type" : 'application/json'},
        body:  JSON.stringify(res)
    })
  
    setClients([res , ...clients])
    setIsModalAddOpen(false)

    setFnameUpdate("")
    setLnameUpdate("")
    setEmailUpdate("")

  }




}

const AjouterClient = ()=>{
  setErrorAdd("")
    setFnameUpdate("")
    setLnameUpdate("")
    setEmailUpdate("")
  
  setIsModalAddOpen(true)
}



///////////// details Client functions  

const toogleModalClientDetails = ()=>{
  setIsModelDetailsClient(!isModalDetaisClient)
}

const datilsClient = async(id)=>{
  const client = clients.filter(C=> C._id === id)[0]

  const fetchEmprints = async ()=>{
    const response = await fetch(API_EMPRUNT +'/api/v1/emprunt/'+id )
    const json = await response.json()

    if(response.ok){
      console.log("emprunts Details" , json);
      setEmruntsClient(json)
      setFilterDataDetailsClient(json)
    }
  }

  fetchEmprints()

  setClientDetails(client)
  setIsModelDetailsClient(true)
}



const columnsDetailsClient = [
  {
    name : "Full Name",
    selector : (row) => row.client.fname + " " + row.client.lname,
    sortable: true
  },
  {
    name : "Email",
    selector : (row) => row.client.email,
    sortable: true
  },
  {
    name : "Livre",
    selector : (row) => row.livre.code,
    sortable: true
  },
  {
    name : "Date emprunt",
    selector : (row) => format( new Date( row.date_emprunt), "dd MMMM yyyy, HH:mm:ss"),
    sortable: true
  },

  {
    name : "Date Roteur",
    selector : (row) => row.date_retour ? format( new Date( row.date_retour), "dd MMMM yyyy, HH:mm:ss") : "" ,
    sortable: true
  },

] 


// filtre les emprunts
useEffect(()=>{
  
  const result = empruntsClient.filter((emprunt)=>{
    return JSON.stringify(emprunt)
    .toLowerCase()
    .indexOf(searchDetailsClient.toLowerCase()) !== -1
   
  });

  console.log(result);
  setFilterDataDetailsClient(result)

} , [searchDetailsClient , empruntsClient ])


const AjouterEmpruntDetailsClient = ()=>{

}
 
 
  return (
    <>
      <div className="p-4 sm:ml-64">
         <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700">
    
            <div className="container mx-auto px-4 mt-4">


              <TableData 
                dataTab={filterData} 
                columns={columns} 
                title={"List Clients"}  
                addActions={AjouterClient} 
                search={search} 
                setSearch={setSearch}
                transactions={true}
              />
                
            </div>

        </div>
      </div>

      {/* update Client  Modal */}
      {isModalUpdateOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Update Client
                                </h3>
                                <button onClick={toggleModalUpdate} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {errorUpdate && <div className='text-red-700 text-center mt-2'> {errorUpdate}</div>}
                            <form className="p-4 md:p-5" onSubmit={handleUpdateClientSubmit} encType="multipart/form-data">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                    

                                <div className="col-span-2">
                                        <label htmlFor="fname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                        <input type="text" name="fname" id="fname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateFname} 
                                           value={fnameUpdate} />  
                                </div>


                                <div className="col-span-2">
                                        <label htmlFor="lname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                        <input type="text" name="lname" id="lname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateLname} 
                                           value={lnameUpdate} />  
                                </div>

                                <div className="col-span-2">
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateEmail} 
                                           value={emailUpdate} />  
                                </div>




                                </div>

                               
                                <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Update
                                </button>

                               

                      
                            </form>
                        </div>
                    </div>
      )}


      {/* Delete client Modal */}

      {isModalDeleteOpen &&

        <div id="deleteModal" className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50">
            <div className="relative p-4 w-full max-w-md">
                <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <button onClick={toggleModalDelete} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    { errorDelete && <div className='text-red-700'>{errorDelete}</div>}
                    <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
                    <div className="flex justify-center items-center space-x-4">
                        <button onClick={toggleModalDelete} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                            No, cancel
                        </button>
                        <button onClick={handleDeleteClientSubmit} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            Yes, I'm sure
                        </button>
                    </div>
                </div>
            </div>
        </div>

      }


      {/* Ajouter Client */}

      {isModalAddOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Ajoutre Client
                                </h3>
                                <button onClick={toggleModalAdd} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {errorAdd && <div className='text-red-700 text-center mt-2'> {errorAdd}</div>}

                            <form className="p-4 md:p-5" onSubmit={handleAddClientSubmit} encType="multipart/form-data">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                    

                                <div className="col-span-2">
                                        <label htmlFor="fname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                        <input type="text" name="fname" id="fname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateFname} 
                                           value={fnameUpdate} />  
                                </div>


                                <div className="col-span-2">
                                        <label htmlFor="lname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                        <input type="text" name="lname" id="lname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateLname} 
                                           value={lnameUpdate} />  
                                </div>

                                <div className="col-span-2">
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateEmail} 
                                           value={emailUpdate} />  
                                </div>




                                </div>

                               
                                <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Ajouter
                                </button>

                               

                      
                            </form>
                        </div>
                    </div>
      )}


      {/* show Client */}

    { isModalDetaisClient &&
      <div id="default-modal" tabindex="-1" aria-hidden="true" className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden'  >
          <div class="relative p-4 w-full max-w-7xl max-h-full">
          
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                          Details Client
                      </h3>
                      <button onClick={toogleModalClientDetails} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span class="sr-only">Close modal</span>
                      </button>
                  </div>
                
                  <div class="p-4 md:p-5 space-y-4">

                  <ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                    <li class="pb-3 sm:pb-4">
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                          
                          <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                {clientDetails.fname + " " + clientDetails.lname} 
                              </p>
                              <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                {clientDetails.email}
                              </p>
                          </div>
                          <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                             
                          </div>
                        </div>
                    </li>
                  </ul>
                      {/* datils emprunts Client */}
                      <div className="container mx-auto px-4 mt-4">

                      <TableData 
                        dataTab={filterDataDetailsClient} 
                        columns={columnsDetailsClient} 
                        title={"List Emprunts Clients"}  
                        addActions={AjouterEmpruntDetailsClient} 
                        search={searchDetailsClient} 
                        setSearch={setSearchDetailsClient}
                        transactions={false}
                      />

                      </div>
                  </div>
                
              </div>
          </div>
      </div>
    }
    
    </>
  )
}

export default Client