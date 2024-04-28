import React from 'react'
import DataTable from "react-data-table-component"

const TableData = ({dataTab , columns , title ,addActions , search  , setSearch , transactions ,demande , AjouteDemandeLivre } ) => {





  return (
    <>
      <DataTable  
        title={title}
        columns={columns}
        data={dataTab} 
        pagination
        selectableRows
        selectableRowsHighlight
        highlightOnHover

        actions={ transactions &&  <div><button onClick={addActions} type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Ajouter</button> {demande && <button onClick={AjouteDemandeLivre} className='text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800' > Demande</button>} </div>}
        subHeader
        subHeaderComponent={ <input type="text" id="search" className="max-w-md bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Her" value={search} onChange={(e) => setSearch(e.target.value)}        />}
        //
        subHeaderAlign='center'
      />

    </>
  )
}

export default TableData