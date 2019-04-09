/*
*
© Copyright 2019 Sergey Kiskin
*
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*
*/


function onOpen(e) {
  
  SpreadsheetApp.getUi()
   .createMenu('Distance and time')
   .addItem('Estimate distance', 'getReply')
   .addToUi();
  
}


function getReply(){
  
  'use strict;'
  
  //Считывание первоначальных данных
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var values = sheet.getSheetValues(2, 1, lastRow-1, 2);
  var valuesInsertRange  = sheet.getRange(2, 3, lastRow-1, 2); 
   
  var valuesInsert = values.map(function (d){
    
  var url = "https://maps.googleapis.com/maps/api/directions/json?origin="
  url+=d[0]
  url+="&destination="
  url+=d[1]
  //Добавление ключа сервера (должен быть своим)
  url+="&YOUR_API_KEY_HERE";
  
  var response = UrlFetchApp.fetch(url);

  if (response.getResponseCode() == 200){
    
    //Получение ответа от серверов Google
    var data = JSON.parse(response.getContentText());
    
    //Вычисление расстояния между точками
    var lenght = data.routes[0].legs[0].distance.value/1000;
    lenght = lenght.toFixed(1).replace(".",",");
     
    //Вычисление времени в пути 
    var duration = data.routes[0].legs[0].duration.value/3600;
    duration = duration.toFixed(1).replace(".",",");
        
    return [lenght, duration];

  };
    
  
  });
  
  //Запись полученных данных на лист
  valuesInsertRange.setValues(valuesInsert);
  
}



