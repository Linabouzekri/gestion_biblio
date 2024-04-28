import React, { useEffect, useState } from 'react'
import TableData from '../components/TableData'

//icons 
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { API_EMPRUNT, API_LIVRE, API_NOTIFICATION } from '../Api/api';
import { BiShowAlt } from 'react-icons/bi';

const Livre = () => {
  const [search , setSearch] = useState("")
  const [filterData , setFilterDate] = useState([])

  const [livres , setLivres] = useState([])
  const [livreUpdate , setLivreUpdate] = useState(null)
  const [livreDelete , setLivreDelete]= useState(null)
  const [livreDetails , setLivreDetails] = useState(null)


   // les erreur 
   const [ errorUpdate , setErrorUpdate] = useState("")
   const [ errorAdd , setErrorAdd] = useState("")
   const [errorDelete , setErrorDelete] = useState("")
 
   const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
   const [isModalDeleteOpen , setIsModalDeleteOpen] = useState(false)
   const [isModalAddOpen , setIsModalAddOpen] = useState(false)
   const [isModalDetaisLivre , setIsModalDetaisLivre] = useState(false)

   // client Livre
  const [codeUpdate , setCodeUpdate] = useState("")
  const [auteurUpdate , setAuteurUpdate] = useState("")
  const [titleUpdate , setTitleUpdate] = useState("")
  const [descriptionUpdate , setDescriptionUpdate] = useState("")
  


  useEffect(()=>{
    const fetchLivres = async ()=>{
        const response = await fetch(API_LIVRE +'/api/v1/livre' )
        const json = await response.json()

        if(response.ok){
          setLivres(json)
            setFilterDate(json)
        }
    }

    fetchLivres()

} , [])


useEffect(()=>{
  
  const result = livres.filter((livre)=>{
    return JSON.stringify(livre)
    .toLowerCase()
    .indexOf(search.toLowerCase()) !== -1
   
  });

  console.log(result);

  setFilterDate(result)

} , [search , livres ])


const toggleModalUpdate = () => {
  setIsModalUpdateOpen(!isModalUpdateOpen);
};

const toggleModalDelete = () => {
  setIsModalDeleteOpen(!isModalDeleteOpen);
};

const toggleModalAdd = () => {
  setIsModalAddOpen(!isModalAddOpen);
};

const handleUpdateCode = (e)=>{
  setCodeUpdate(e.target.value)
}

const handleUpdateTitle = (e)=>{
  setTitleUpdate(e.target.value)
}
const handleUpdateAuteur = (e)=>{
  setAuteurUpdate(e.target.value)
}
const handleUpdateDescription = (e)=>{
  setDescriptionUpdate(e.target.value)
}


const deleteLivre= async(id) =>{
  setErrorDelete("")

  const livre = livres.filter(C=> C._id === id)[0]
  setLivreDelete(livre)
  setIsModalDeleteOpen(true)

}

const modifierLivre= async(id) =>{
  setErrorUpdate("")
  const livre = livres.filter(C=> C._id === id)[0]
  setLivreUpdate(livre)
  setIsModalUpdateOpen(true)

  setCodeUpdate(livre.code)
  setDescriptionUpdate(livre.description)
  setAuteurUpdate(livre.auteur)
  setTitleUpdate(livre.title)
}


const AjouterLivre = ()=>{
  setErrorAdd("")
  setCodeUpdate("")
  setAuteurUpdate("")
  setTitleUpdate("")
  setDescriptionUpdate("")
setIsModalAddOpen(true)
}

// ajouter Livre

const handleAddLivreSubmit = async(e) =>{
  e.preventDefault();

  const requestData = {
    code: codeUpdate,
    description: descriptionUpdate,
    title: titleUpdate , 
    auteur : auteurUpdate
  };

  const response = await fetch( API_LIVRE+ "/api/v1/livre", {
    method : 'POST' , 
    headers : {"Content-type" : 'application/json'},
    body:  JSON.stringify(requestData)
})

  const res = await response.json() 
  if(!response.ok){
    setErrorAdd(res.error)
  }


  if(response.ok){
    // send notification to user 
    const responseNotification = await fetch( API_NOTIFICATION+ "/api/v1/notification/nouveaulivre", {
      method : 'POST' , 
      headers : {"Content-type" : 'application/json'},
      body:  JSON.stringify({title : res.title})
  })

  
    setLivres([res , ...livres])
    setIsModalAddOpen(false)

    setCodeUpdate("")
    setAuteurUpdate("")
    setTitleUpdate("")
    setDescriptionUpdate("")

  }
}


//supprimer Livre

const handleDeleteLivreSubmit = async(e)=>{
  e.preventDefault();

  const response = await fetch( API_LIVRE+ "/api/v1/livre/" + livreDelete._id , {
    method : 'DELETE' , 
})


  if(response.ok){
    // supprimer Livre Dans Service Emprunt 
    const responseLivre = await fetch( API_EMPRUNT+ "/api/v1/emprunt/livre/" + livreDelete._id , {
      method : 'DELETE' , 
    })

    setLivres(livres.filter(C=> C._id !== livreDelete._id ))
    setIsModalDeleteOpen(false)

  }else{
    setErrorDelete("Livre Deja Empunter")
  }

}


// modifier Livre
const handleUpdateLivreSubmit = async(e) =>{
  e.preventDefault();

  const requestData = {
    code: codeUpdate,
    description: descriptionUpdate,
    title: titleUpdate , 
    auteur : auteurUpdate
  };
   //console.log(emailUpdate , fnameUpdate , lnameUpdate);

  const response = await fetch( API_LIVRE+ "/api/v1/livre/" + livreUpdate._id , {
      method : 'PUT' , 
      headers : {"Content-type" : 'application/json'},
      body:  JSON.stringify(requestData)
  })

  const res = await response.json()

  if(!response.ok){
      setErrorUpdate(res.error)
  }

  if(response.ok){
    const index = livres.findIndex((item) => item._id === livreUpdate._id);

    let newLivres =  livres.filter(C=>C._id !== res._id);
    newLivres.splice(index,0,res);

    setLivres(newLivres)
    setIsModalUpdateOpen(false)

    setCodeUpdate("")
    setAuteurUpdate("")
    setTitleUpdate("")
    setDescriptionUpdate("")

  }

}



  const columns = [
    {
      name : "Code",
      selector : (row) => row.code,
      sortable: true
    },
    {
      name : "Titre",
      selector : (row) => row.title,
      sortable: true
    },
    {
      name : "auteur",
      selector : (row) => row.auteur,
      sortable: true
    },
    {
      name : "Actions",
      cell : (row) => <div className='flex items-center justify-center'>
            <MdDelete onClick={()=> { deleteLivre(row._id )} } className="w-7 h-7 text-red-500 hover:text-red-700 cursor-pointer mr-3" />
            <FaEdit onClick={()=> {modifierLivre(row._id)}} className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mr-3" />
            <BiShowAlt onClick={()=>{detailsLivre(row._id) }}  className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mr-3" />

      </div>
    }
  
  ] 


// ####################  details Livres ################################ 
const detailsLivre = async(id)=>{

   const livre = livres.filter(C=> C._id === id)[0]
   setLivreDetails(livre)
  
  setIsModalDetaisLivre(true)
}


const toogleModalLivreDetails = ()=>{
  setIsModalDetaisLivre(!isModalDetaisLivre)
}

  return (
    <>
      <div className="p-4 sm:ml-64">
         <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700">     
            <div className="container mx-auto px-4 mt-4">

              <TableData 
                dataTab={filterData} 
                columns={columns} 
                title={"List Livres"}  
                addActions={AjouterLivre} 
                search={search} 
                setSearch={setSearch}
                transactions={true}  
              />

            </div>
         </div>
      </div>


  {/* update Livre Modal */}
  {isModalUpdateOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Update Livre
                                </h3>
                                <button onClick={toggleModalUpdate} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {errorUpdate && <div className='text-red-700'> {errorUpdate}</div>}
                            <form className="p-4 md:p-5" onSubmit={handleUpdateLivreSubmit} encType="multipart/form-data">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                    

                              <div className="col-span-2">
                                      <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
                                      <input type="text" name="code" id="code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateCode} 
                                        value={codeUpdate} />  
                              </div>


                              <div className="col-span-2">
                                      <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Titre</label>
                                      <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateTitle} 
                                        value={titleUpdate} />  
                              </div>

                              <div className="col-span-2">
                                      <label htmlFor="auteur" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Auteur</label>
                                      <input type="test" name="auteur" id="auteur" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateAuteur} 
                                        value={auteurUpdate} />  
                              </div>

                              <div className="col-span-2">
                                      <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                      <input type="test" name="description" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateDescription} 
                                        value={descriptionUpdate} />  
                              </div>

                          </div>

                               
                                <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Update
                                </button>

                               

                      
                            </form>
                        </div>
                    </div>
      )}


       {/* Delete Livre Modal */}

       {isModalDeleteOpen &&

          <div id="deleteModal" className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50">
              <div className="relative p-4 w-full max-w-md">
                  <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                      <button onClick={toggleModalDelete} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                          <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                          <span className="sr-only">Close modal</span>
                      </button>
                      {errorDelete && <div className='text-red-700'>{errorDelete}</div>}
                      <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                      <p className="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
                      <div className="flex justify-center items-center space-x-4">
                          <button onClick={toggleModalDelete} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                              No, cancel
                          </button>
                          <button onClick={handleDeleteLivreSubmit} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                              Yes, I'm sure
                          </button>
                      </div>
                  </div>
              </div>
          </div>

        }

      {/* Ajouter Livre */}

      {isModalAddOpen && (
                    <div id="crud-modal" tabIndex="2" aria-hidden="true" className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Ajoutre Livre
                                </h3>
                                <button onClick={toggleModalAdd} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {errorAdd && <div className='text-red-700 text-center mt-2'> {errorAdd}</div>}
                            <form className="p-4 md:p-5" onSubmit={handleAddLivreSubmit} encType="multipart/form-data">
                                <div className="grid gap-4 mb-4 grid-cols-2">
                    

                                <div className="col-span-2">
                                        <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
                                        <input type="text" name="code" id="code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateCode} 
                                           value={codeUpdate} />  
                                </div>


                                <div className="col-span-2">
                                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Titre</label>
                                        <input type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateTitle} 
                                           value={titleUpdate} />  
                                </div>

                                <div className="col-span-2">
                                        <label htmlFor="auteur" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Auteur</label>
                                        <input type="test" name="auteur" id="auteur" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateAuteur} 
                                           value={auteurUpdate} />  
                                </div>

                                <div className="col-span-2">
                                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                        <input type="test" name="description" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"  onChange={handleUpdateDescription} 
                                           value={descriptionUpdate} />  
                                </div>




                                </div>

                               
                                <button  type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                     Ajouter
                                </button>

                               

                      
                            </form>
                        </div>
                    </div>
      )}


{ isModalDetaisLivre &&
      <div id="default-modal" tabindex="-1" aria-hidden="true" className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden'  >
          <div class="relative p-4 w-full max-w-7xl max-h-full">
          
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                          Details Client
                      </h3>
                      <button onClick={toogleModalLivreDetails} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span class="sr-only">Close modal</span>
                      </button>
                  </div>
                
                  <div class="p-4 md:p-5 space-y-2">

            
                  <div class="flex flex-row pb-1">
                      <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Code : </dt>
                      <dd class="text-lg font-semibold ml-3"> {livreDetails.code}</dd>
                  </div>

                  <div class="flex flex-row pb-1">
                      <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Title : </dt>
                      <dd class="text-lg font-semibold ml-3"> {livreDetails.title}</dd>
                  </div>

                  <div class="flex flex-row pb-1">
                      <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Auteur : </dt>
                      <dd class="text-lg font-semibold ml-3"> {livreDetails.auteur}</dd>
                  </div>
                 
                  <div class="flex flex-col pb-1">
                      <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Description : </dt>
                      <p class="text-justify text-gray-500 dark:text-gray-400  ml-3"> {livreDetails.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium quo quia excepturi eaque animi saepe tenetur aliquid voluptatibus dolorum natus dolores, tempore ab eligendi necessitatibus, sit eveniet, quasi soluta. Suscipit tempora assumenda minus maxime ullam molestiae pariatur voluptatibus a cum, dignissimos sint odit cumque tempore delectus itaque, deleniti, laudantium excepturi corrupti autem. Amet beatae maiores earum, totam dolore asperiores, eum voluptas tempora sit eos deserunt alias nemo soluta, quas impedit. Dolor qui eius nulla repellendus non consequatur libero officiis illo modi nostrum quibusdam nisi excepturi, tempora assumenda ea aperiam perspiciatis est ducimus exercitationem vero id, explicabo necessitatibus! Voluptate, quis odit.</p>
                  </div>
                     
                  </div>
                
              </div>
          </div>
      </div>
    }
    
    </>
  )
}

export default Livre