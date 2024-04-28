
import React, { useEffect, useState } from 'react';

import {Chart as ChartJS} from "chart.js/auto"
import {Bar , Doughnut , Line} from "react-chartjs-2"
import { API_CLIENT, API_EMPRUNT, API_LIVRE } from '../Api/api';




function Home() {
 
const [dataLivres , setDataLivre] = useState([])
const [dataClient , setDataClient] = useState([])
const [nbEmrunt , setNbEmprunt] = useState(0)
const [nbClient, setNbClient] = useState(0)
const [nbLivre, setNbLivre] = useState(0)

useEffect(()=>{
   const fetchEmpruntStatistic = async ()=>{
       const response = await fetch(API_EMPRUNT +'/api/v1/emprunt/statistic' )
       const json = await response.json()

       if(response.ok){
         setNbEmprunt(json.nbEmprunt);
         setDataLivre(json.livre)
         setDataClient(json.client)
       }
   }

   const fetchClientStatistic = async ()=>{
      const response = await fetch(API_CLIENT +'/api/v1/client/statistic' )
      const json = await response.json()

      if(response.ok){
         setNbClient(json)
      }
  }

  const fetchLivreStatistic = async ()=>{
   const response = await fetch(API_LIVRE +'/api/v1/livre/statistic' )
   const json = await response.json()

   if(response.ok){
      setNbLivre(json)
   }
}


  fetchEmpruntStatistic()
  fetchClientStatistic()
  fetchLivreStatistic()

} , [])
  return (

<div className="p-4 sm:ml-64">
   <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
      <div className="grid grid-cols-3 gap-4 mb-4">

         <div className="flex items-center justify-center h-24 rounded bg-blue-500 dark:bg-gray-800">
            <p  className="text-2xl text-black" >
              TotalClient : {nbClient}
            </p>
         </div>

         <div className="flex items-center justify-center h-24 rounded bg-yellow-400 dark:bg-gray-800">
            <p className="text-2xl text-black ">
              Total Livre : {nbLivre}
            </p>
         </div>

         <div className="flex items-center justify-center h-24 rounded bg-green-400 dark:bg-gray-800">
            <p className="text-2xl text-black ">
              Total Emprunt : {nbEmrunt}
            </p>
         </div>
         
         
        

      </div>

     
      <div className="grid grid-cols-2 gap-4 mb-4">
         <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800">
            
                     <Bar 
                        data={
                            {
                            labels: dataLivres.map((data)=> data.label),
                            datasets : [
                              {
                                label : "Count", 
                                data : dataLivres.map((data)=> data.value),
                                backgroundColor :[
                                 "rgba(255, 152, 0, 0.8)",
                                 "rgba(76, 175, 80, 0.8)",
                                 "rgba(43, 63, 229, 0.8)",
                                 "rgba(250, 192, 135, 0.8)",
                                 "rgba(156, 39, 176, 0.8)",
                                 "rgba(33, 150, 243, 0.8)",
                                 "rgba(255, 87, 34, 0.8)",
                                 "rgba(63, 81, 181, 0.8)",
                                 "rgba(255, 193, 7, 0.8)",
                                 "rgba(233, 30, 99, 0.8)",
                              
                                ],
                                borderRadius : 5,
                              
                              }, 
                            ],
                            

                          }
                        }
                     />
            
         </div>
         <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800">
                <Doughnut
                      data={
                          {
                          labels: dataClient.map((data)=> data.label),
                          datasets : [
                            {
                              label : "Count", 
                              data : dataClient.map((data)=> data.value),
                              backgroundColor :[
                                 "rgba(255, 152, 0, 0.8)",
                                 "rgba(76, 175, 80, 0.8)",
                                 "rgba(43, 63, 229, 0.8)",
                                 "rgba(250, 192, 135, 0.8)",
                                 "rgba(156, 39, 176, 0.8)",
                                 "rgba(33, 150, 243, 0.8)",
                                 "rgba(255, 87, 34, 0.8)",
                                 "rgba(63, 81, 181, 0.8)",
                                 
                                 "rgba(255, 193, 7, 0.8)",
                                 "rgba(233, 30, 99, 0.8)",
                              ],
                              borderRadius : 5,
                            
                            }, 
                          ],
                          

                        }
                      }
                  />
         </div>
         
      </div>      
   </div>
</div>
  


    // <div className="p-4 sm:ml-64">
    //   <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700">
    //         <Bar 
    //           data={
    //               {
    //               labels: sourceData.map((data)=> data.label),
    //               datasets : [
    //                 {
    //                   label : "Count", 
    //                   data : sourceData.map((data)=> data.value),
    //                   backgroundColor :[
    //                     "rgba(43 , 63 , 229 ,0.8)",
    //                     "rgba(250 , 192 , 135 ,0.8)",
    //                   ],
    //                   borderRadius : 5,
                     
    //                 }, 
    //               ],
                  

    //             }
    //           }
    //         />

          

    //   </div>
    // </div>
  )
}

export default Home