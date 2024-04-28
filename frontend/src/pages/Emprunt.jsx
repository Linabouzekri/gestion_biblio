import React, { useEffect, useState } from 'react'
import TableData from '../components/TableData'

// icons 
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdOutlineAssignmentReturn } from "react-icons/md";

import { API_CLIENT, API_EMPRUNT, API_LIVRE, API_NOTIFICATION } from '../Api/api';
import { format } from 'date-fns'
import { BiShowAlt } from 'react-icons/bi';

const Emprunt = () => {
  // data ajoute Emprunt : 
  const [clientEmprunt , setClientEmprunt] = useState("") 
  const [livreEmprunt , setLivreEmprunt] =useState("")

  const [idClientEmprunt , setIdClientEmprunt] = useState(null)
  const [idLivreEmprunt , setIdLivreEmprunt] =useState(null)
  // data Demande Emprunt 

  const [clientDemandeEmprunt , setClientDemandeEmprunt] = useState("")
  const [livreDemandeEmprunt , setLivreDemandeEmprunt] =useState("")

  const [idClientDemandeEmprunt , setIdClientDemandeEmprunt] = useState(null)
  const [idLivreDemandeEmprunt , setIdLivreDemandeEmprunt] =useState(null)

  const [search , setSearch] = useState("")
  const [searchSelectClient , setSearchSelectClient] = useState("")
  const [searchSelectLivre , setSearchSelectLivre] = useState("")


  const [filterData , setFilterDate] = useState([])
  const [filterDataClient , setFilterDateClient] = useState([])
  const [filterDataLivre , setFilterDataLivre] =useState([])
  const [filterDataDemandeLivre , setFilterDataDemandeLivre] =useState([])

  const [clients , setClients] = useState([])
  const [emprunts , setEmprunts] = useState([])
  const [livres , setLivres] = useState([])
  const [allLivres , setAllLivres] = useState([])

  const [empruntDelete , setEmpruntDelete]= useState(null)
  const [empruntDetails, setEmruntDetails] = useState(null)

  // dropdown 
  const [dropDownClient , setDropDownClient] = useState(false)
  const [dropDownLivre , setDropDownLivre] =useState(false)

  // Emprunt Update


   // les erreur 
   const [ errorUpdate , setErrorUpdate] = useState("")
   const [ errorAdd , setErrorAdd] = useState("")
   const [erreurDemande , setErrorDemande] = useState("")


   const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
   const [isModalDeleteOpen , setIsModalDeleteOpen] = useState(false)
   const [isModalAddOpen , setIsModalAddOpen] = useState(false)
   const [isModalDetailsEmprunt , setIsModalDetaisEmprunt]= useState(false)
   const [isModelDemandeLivre , setIsModelDemandeLivre] = useState(false)

// get Data
   useEffect(()=>{
    const fetchEmprints = async ()=>{
        const response = await fetch(API_EMPRUNT +'/api/v1/emprunt' )
        const json = await response.json()

        if(response.ok){
            setEmprunts(json)
            setFilterDate(json)
        }
    }

    const fetchClients = async ()=>{
      const response = await fetch(API_CLIENT +'/api/v1/client' )
      const json = await response.json()

      if(response.ok){
          setClients(json)
          setFilterDateClient(json)
      }
  }

    const fetchLivres = async ()=>{
      const response = await fetch(API_LIVRE +'/api/v1/livre/allNonEmrunts' )
      const json = await response.json()

      if(response.ok){
        setLivres(json)
        setFilterDataLivre(json)
      }
  }

  const fetchAllLivres = async ()=>{
    const response = await fetch(API_LIVRE +'/api/v1/livre' )
    const json = await response.json()

    if(response.ok){
      setAllLivres(json)
      setFilterDataDemandeLivre(json)
    }
}


    fetchAllLivres()
    fetchEmprints()
    fetchLivres()
    fetchClients()
 

} , [])

// filtre les emprunts
useEffect(()=>{
  
  const result = emprunts.filter((emprunt)=>{
    return JSON.stringify(emprunt)
    .toLowerCase()
    .indexOf(search.toLowerCase()) !== -1
   
  });

  console.log(result);
  setFilterDate(result)

} , [search , emprunts ])


// filter input select clients 

useEffect(()=>{
  
  const result = clients.filter((client)=>{
    return JSON.stringify(client)
    .toLowerCase()
    .indexOf(searchSelectClient.toLowerCase()) !== -1
   
  });

  setFilterDateClient(result)

} , [searchSelectClient , clients ])

// filter input Livres

useEffect(()=>{
  
  const result = livres.filter((livre)=>{
    return JSON.stringify(livre)
    .toLowerCase()
    .indexOf(searchSelectLivre.toLowerCase()) !== -1
  });


  setFilterDataLivre(result)

} , [searchSelectLivre , livres ])


const toggleModalUpdate = () => {
  setIsModalUpdateOpen(!isModalUpdateOpen);
};

const toggleModalDelete = () => {
  setIsModalDeleteOpen(!isModalDeleteOpen);
};

const toggleModalAdd = () => {
  setIsModalAddOpen(!isModalAddOpen);
};

const toggleDropDownClient = ()=>{
  setDropDownClient(!dropDownClient)
}

const toggleDropDownLivre = ()=>{
  setDropDownLivre(!dropDownLivre)
}

const deleteEmprunt= async(id) =>{
  const emprunt = emprunts.filter(C=> C._id === id)[0]
  setEmpruntDelete(emprunt)
  setIsModalDeleteOpen(true)

}

// reoutrne livre 
const returnEmprunt = async(id)=>{
  const emprunt = emprunts.filter(C=> C._id === id)[0]
  const code = emprunt.livre.code 
  const email = emprunt.client.email

  const requestData = {
    "code" : code,
    "email" :  email
  };

  const response = await fetch( API_EMPRUNT+ "/api/v1/emprunt", {
    method : 'PUT' , 
    headers : {"Content-type" : 'application/json'},
    body:  JSON.stringify(requestData)
  })

  const res = await response.json()
  const index = emprunts.findIndex((item) => item._id === id);

  let newEmprunts =  emprunts.filter(item=>item._id !== res._id);
  newEmprunts.splice(index,0,res);


  const nouveau_livres = livres.filter(item=>item._id !== res.livre._id)
  setLivres([res.livre, ...nouveau_livres])

  setEmprunts(newEmprunts)

  // notification 
  const responseNotification = await fetch(API_NOTIFICATION +'/api/v1/notification/retournLivre/' +res.livre._id)

  // change status demande
  const responsechangesatus= await fetch(API_EMPRUNT +'/api/v1/emprunt/demande/changestatus/' +res.livre._id)

}

   const columns = [
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
    {
      name : "Actions",
      cell : (row) => <div className='flex items-center justify-center'>
            <MdDelete onClick={()=> { deleteEmprunt(row._id )} } className="w-7 h-7 text-red-500 hover:text-red-700 cursor-pointer mr-3" />
            <MdOutlineAssignmentReturn onClick={()=> {returnEmprunt(row._id)}}  className="w-6 h-6 text-blue-400 hover:text-blue-700 cursor-pointer mr-3"/>
            <BiShowAlt onClick={()=>{detailsEmprunts(row._id) }}  className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mr-3" />

      </div>
    }
  
  ] 
  

const AjouterEmprunt = ()=>{
  setClientEmprunt("")
  setLivreEmprunt("")
  setIdClientEmprunt(null)
  setIdLivreEmprunt(null)
  setIsModalAddOpen(true)

  // 
  setDropDownClient(false)
  setDropDownLivre(false)
  setSearchSelectClient("")
  setSearchSelectLivre("")
}

// Ajouter Emprint
const handleEmruntSubmit = async(e) =>{
  e.preventDefault();

 
  const requestData = {
    "id_client" : idClientEmprunt,
    "id_livre" :  idLivreEmprunt
  };

  const response = await fetch( API_EMPRUNT+ "/api/v1/emprunt", {
    method : 'POST' , 
    headers : {"Content-type" : 'application/json'},
    body:  JSON.stringify(requestData)
})

  const res = await response.json() 
  if(!response.ok){
    setErrorAdd(res.error)
  }


  if(response.ok){
  
    setEmprunts([res , ...emprunts])
    setIsModalAddOpen(false)
    
    const result = livres.filter((livre)=>{
      return  livre._id !==  idLivreEmprunt
     
    });
    
    setLivres(result)
    setClientEmprunt("")
    setLivreEmprunt("")
    setIdClientEmprunt(null)
    setIdLivreEmprunt(null)

  }
  
}

// suprimmer Emprunt 

const handleDeleteEmpruntSubmit = async(e)=>{
  e.preventDefault();


  const response = await fetch( API_EMPRUNT+ "/api/v1/emprunt/" + empruntDelete._id , {
    method : 'DELETE' , 
  })

  let json = await response.json()

  if(response.ok){
    setEmprunts(emprunts.filter(C=> C._id !== empruntDelete._id ))
    setIsModalDeleteOpen(false)

    const nouveau_livres = livres.filter(item=>item._id !== json.livre._id)
    setLivres([json.livre, ...nouveau_livres])


  } 

  
}


// ############ details Emprunts 
const detailsEmprunts = async(id)=>{
  const emprunt = emprunts.filter(C=> C._id === id)[0]
  setEmruntDetails(emprunt)
 
 setIsModalDetaisEmprunt(true)

}

const toogleModalEmpruntDetails = ()=>{
  setIsModalDetaisEmprunt(!isModalDetailsEmprunt)
}


// ################## demande Emprunt 
const toggleModalDemandeLivre = ()=>{
  setIsModelDemandeLivre(!isModelDemandeLivre)
}

const AjouteDemandeLivre = ()=>{
  setErrorDemande("")
  setClientDemandeEmprunt("")
  setLivreDemandeEmprunt("")
  setIsModelDemandeLivre(true)


  // 
  setDropDownClient(false)
  setDropDownLivre(false)
  setIdClientDemandeEmprunt(null)
  setIdLivreDemandeEmprunt(null)
  setSearchSelectClient("")
  setSearchSelectLivre("")
}

const handleDemandeEmruntSubmit = async(e)=>{
  e.preventDefault();


  const requestData = {
    "id_client" : idClientDemandeEmprunt,
    "id_livre" :  idLivreDemandeEmprunt
  };

  const response = await fetch( API_EMPRUNT+ "/api/v1/emprunt/demande", {
    method : 'POST' , 
    headers : {"Content-type" : 'application/json'},
    body:  JSON.stringify(requestData)
})

  const res = await response.json() 

  if(!response.ok){
    setErrorDemande(res.error)
  }

  if(response.ok){
  
    setIsModalAddOpen(false)
   
    setClientDemandeEmprunt("")
    setLivreDemandeEmprunt("")

    setIdClientDemandeEmprunt(null)
    setIdLivreDemandeEmprunt(null)
    setIsModelDemandeLivre(false)

  }
}

  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700">
           
            <div className="container mx-auto px-4 mt-4">

              <TableData 
                dataTab={filterData} 
                columns={columns} 
                title={"List Emprunts"}  
                addActions={AjouterEmprunt} 
                search={search} 
                setSearch={setSearch}
                transactions={true}  
                demande = {true}
                AjouteDemandeLivre ={AjouteDemandeLivre}
              />

            </div>

        </div>
      </div>


       {/* Delete Emprunt Modal */}

       {isModalDeleteOpen &&

<div id="deleteModal" className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50">
    <div className="relative p-4 w-full max-w-md">
        <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <button onClick={toggleModalDelete} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
            </button>
            <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
            <div className="flex justify-center items-center space-x-4">
                <button onClick={toggleModalDelete} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                    No, cancel
                </button>
                <button onClick={handleDeleteEmpruntSubmit} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
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
                                    Ajoutre Emprunt
                                </h3>
                                <button onClick={toggleModalAdd} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <form className="p-4 md:p-5" onSubmit={handleEmruntSubmit} encType="multipart/form-data">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                    
                                </div>

                                <div>


                                <div className="flex">
                                    <div>
                                      <button onClick={toggleDropDownClient} id="dropdownUsersButton" data-dropdown-toggle="dropdownUsers" data-dropdown-placement="bottom" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                        liste Clients 
                                        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="ml-3 col-span-2 sm:col-span-1">
                                    <input value={clientEmprunt} type="email" name="client" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="email de Client Emprunt" required readOnly /> 
                                    </div>
                                </div>
                                    { dropDownClient && 
                                        <div id="dropdownUsers" className="z-10  bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                                          
                                        <div className="p-3">
                                              <label htmlFor="input-group-search" className="sr-only">Search</label>
                                              <div className="relative">
                                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                  </svg>
                                                </div>
                                                <input value={searchSelectClient}  onChange={(e) => setSearchSelectClient(e.target.value)} type="text" id="input-group-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Client" />
                                              </div>
                                        </div>
                                          <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">

                                          { filterDataClient && filterDataClient.map((item, index) => (

                                            <li key={index}>
                                            <a onClick={()=> { 
                                              setClientEmprunt(item.email );
                                              setIdClientEmprunt(item._id)
                                              setDropDownClient(false)
                                              
                                              } }  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                               {item.email}
                                            </a>
                                          </li>
                                          ))}
                                           
                                          
                                          </ul>
                                        
                                        </div>
                                    }

                                <div className="flex mt-4">
                                    <div>
                                      <button onClick={toggleDropDownLivre} id="dropdownUsersButton" data-dropdown-toggle="dropdownUsers" data-dropdown-placement="bottom" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                        liste Livres 
                                        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="ml-3 col-span-2 sm:col-span-1">
                                    <input value={livreEmprunt} type="text" name="livre" id="livre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Livre Emprunt" required readOnly /> 
                                    </div>
                                </div>

                                    { dropDownLivre && 
                                        <div id="dropdownUsers" className="z-10  bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                                          
                                        <div className="p-3">
                                              <label htmlFor="input-group-search" className="sr-only">Search</label>
                                              <div className="relative">
                                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                  </svg>
                                                </div>
                                                <input value={searchSelectLivre}  onChange={(e) => setSearchSelectLivre(e.target.value)} type="text" id="input-group-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Client" />
                                              </div>
                                        </div>
                                          <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">

                                          { filterDataLivre && filterDataLivre.map((item, index) => (

                                            <li key={index}>
                                            <a onClick={()=> { 
                                              setLivreEmprunt(item.code );
                                              setIdLivreEmprunt(item._id)
                                              setDropDownLivre(false)
                                              
                                              
                                              } }  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                               {item.code}
                                            </a>
                                          </li>
                                          ))}
                                           
                                          
                                          </ul>
                                        
                                        </div>
                                    }



                                </div>

                               
                                <button  type="submit" className="mt-3 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Ajouter
                                </button>

                                {errorAdd && <div className='text-red-700'> {errorAdd}</div>}

                      
                            </form>
                        </div>
                    </div>
      )}

      {/* details Emprunt */}
     
      { isModalDetailsEmprunt &&
      <div id="default-modal" tabindex="-1" aria-hidden="true" className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden'  >
          <div class="relative p-4 w-full max-w-4xl max-h-full">
          
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                          Details Client
                      </h3>
                      <button onClick={toogleModalEmpruntDetails} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span class="sr-only">Close modal</span>
                      </button>
                  </div>

                    {empruntDetails &&
                      <div class="p-4 md:p-5 space-y-2">

                
                      <div class="flex flex-row pb-1">
                          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Full Name : </dt>
                          <dd class="text-lg font-semibold ml-3"> {empruntDetails.client.fname + " " + empruntDetails.client.lname} </dd>
                      </div>

                      <div class="flex flex-row pb-1">
                          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Email : </dt>
                          <dd class="text-lg font-semibold ml-3"> {empruntDetails.client.email}</dd>
                      </div>

                      <div class="flex flex-col pb-1">
                          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Livre : </dt>
                          <div class="flex flex-row pb-1 ml-4">
                              <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Code : </dt>
                              <dd class="text-lg font-semibold ml-3"> {empruntDetails.livre.code} </dd>
                          </div>
                          <div class="flex flex-row pb-1 ml-4">
                              <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Title : </dt>
                              <dd class="text-lg font-semibold ml-3"> {empruntDetails.livre.title} </dd>
                          </div>
                          
                          <div class="flex flex-row pb-1 ml-4">
                              <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Auteur : </dt>
                              <dd class="text-lg font-semibold ml-3"> {empruntDetails.livre.auteur} </dd>
                          </div>

                          
                          
                      </div>
                    
                      <div class="flex flex-row pb-1">
                          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Date Emprunt : </dt>
                          <dd class="text-lg font-semibold ml-3"> { format( new Date(empruntDetails.date_emprunt), "dd MMMM yyyy, HH:mm:ss")}</dd>
                      </div>

                      <div class="flex flex-row pb-1">
                          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Date Retour : </dt>
                          <dd class="text-lg font-semibold ml-3"> { format( new Date( empruntDetails.date_retour), "dd MMMM yyyy, HH:mm:ss")}</dd>
                      </div>
                      
                        
                      </div>
                    }
                  </div>
          </div>
      </div>
    }

    {/* demande Livre */}
    
    {isModelDemandeLivre && 
      <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
      <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Demande Emprunt
              </h3>
              <button onClick={toggleModalDemandeLivre} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
              </button>
          </div>
          {erreurDemande && <div className='text-red-700 text-center'>{erreurDemande}</div>}
          <form className="p-4 md:p-5" onSubmit={handleDemandeEmruntSubmit} encType="multipart/form-data">
              <div className="grid gap-4 mb-4 grid-cols-2">
  
              </div>

              <div>


              <div className="flex">
                  <div>
                    <button onClick={toggleDropDownClient} id="dropdownUsersButton" data-dropdown-toggle="dropdownUsers" data-dropdown-placement="bottom" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                      liste Clients 
                      <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                      </svg>
                    </button>
                  </div>
                  <div className="ml-3 col-span-2 sm:col-span-1">
                  <input value={clientDemandeEmprunt} type="email" name="client" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="email de Client Emprunt" required readOnly /> 
                  </div>
              </div>
                  { dropDownClient && 
                      <div id="dropdownUsers" className="z-10  bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                        
                      <div className="p-3">
                            <label htmlFor="input-group-search" className="sr-only">Search</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                              </div>
                              <input value={searchSelectClient}  onChange={(e) => setSearchSelectClient(e.target.value)} type="text" id="input-group-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Client" />
                            </div>
                      </div>
                        <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">

                        { filterDataClient && filterDataClient.map((item, index) => (

                          <li key={index}>
                          <a onClick={()=> { 
                            setClientDemandeEmprunt(item.email );
                            setIdClientDemandeEmprunt(item._id)
                            setDropDownClient(false)
                            
                            } }  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                             {item.email}
                          </a>
                        </li>
                        ))}
                         
                        
                        </ul>
                      
                      </div>
                  }

              <div className="flex mt-4">
                  <div>
                    <button onClick={toggleDropDownLivre} id="dropdownUsersButton" data-dropdown-toggle="dropdownUsers" data-dropdown-placement="bottom" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                      liste Livres 
                      <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                      </svg>
                    </button>
                  </div>
                  <div className="ml-3 col-span-2 sm:col-span-1">
                  <input value={livreDemandeEmprunt} type="text" name="livre" id="livre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Livre Emprunt" required readOnly /> 
                  </div>
              </div>

                  { dropDownLivre && 
                      <div id="dropdownUsers" className="z-10  bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                        
                      <div className="p-3">
                            <label htmlFor="input-group-search" className="sr-only">Search</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                              </div>
                              <input value={searchSelectLivre}  onChange={(e) => setSearchSelectLivre(e.target.value)} type="text" id="input-group-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Client" />
                            </div>
                      </div>
                        <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">

                        { filterDataDemandeLivre && filterDataDemandeLivre.map((item, index) => (

                          <li key={index}>
                          <a onClick={()=> { 
                            setLivreDemandeEmprunt(item.title );
                            setIdLivreDemandeEmprunt(item._id)
                            setDropDownLivre(false)
                            
                            
                            } }  className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                             {item.title}
                          </a>
                        </li>
                        ))}
                         
                        
                        </ul>
                      
                      </div>
                  }



              </div>

             
              <button  type="submit" className="mt-3 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                   Ajouter
              </button>

              {errorAdd && <div className='text-red-700'> {errorAdd}</div>}

    
          </form>
      </div>
  </div>
    }

    </>
  )
}

export default Emprunt