var data, table,countryList,prevLocation;
window.onload = ()=>{


    var searchInput = document.getElementById("search-textbox");
    table = document.getElementById('GlobalData');
    var specificData = document.getElementById('table');
    var previousBtn = document.querySelector('.previou-btn i');
    var allDataPage = document.querySelector('main');
    var tablePage =document.querySelector('.section-country-wise');
    var nameOfCountey = document.querySelector('.code-title--sec--1');
    tablePage.classList.toggle('section-country-wise--deactive');
    allDataPage.classList.toggle('main-deactive');
    
    setTimeout(() => {
        document.querySelector('.loader').remove();
        allDataPage.classList.toggle('main-deactive');
    }, 6000);

      setTimeout(function(){
          countryList = document.querySelectorAll('.country .country__item');
          addEventOpen(countryList);
      },2000);

    searchInput.addEventListener("keyup", function(event) {
        event.preventDefault();
        search(searchInput.value);
    });

    fetch('https://pomber.github.io/covid19/timeseries.json')
        .then(response => response.json())
        .then(data => {

        this.data = data;

        for (x in data) {
            table.innerHTML +=  UICotainer(x);
        }

    })
     .catch(error => console.error(error))




     function getNameCountary(str){

        var cityName = "";

        if(str.length > 12){
          for( i=0 ; i < 12 ; i++){
            cityName += str[i];
          }

        }else{
          return str;
        }

        return cityName + '..';
     }


    
    function getTotal(data, cityName){

        let recoveredValue = 0 , deathValue = 0 , confirmValue = 0;

        data[cityName].forEach(value => {

            if(value.recovered !==null)
                recoveredValue = value.recovered;

            if(value.deaths !==null)
                deathValue = value.deaths;

            if(value.confirmed !==null)
                  confirmValue = value.confirmed;

        });

        return {
            confirmed:confirmValue,
            deaths:deathValue,
            recover:recoveredValue
        }

    }

    function search(country){
        var results="";
        var regexp = new RegExp('^'+country.toLowerCase()+'.*$');
        for(x in data){
            if (x.toLowerCase().match(regexp)) { 
                results += UICotainer(x);
            }
        }
        table.innerHTML = results;
        countryList ='';
        countryList = document.querySelectorAll('.country .country__item');
        addEventOpen((countryList));
    
    }


    function UICotainer(x){

        casesData = getTotal(this.data,x);

        return  `<div class="country__item">
                    <h1 class="country__name">${getNameCountary(x)}</h1>
                    <div class="country__item__data">
                        <div class="country__item__data__item">
                            <h1 class="country__text-1">${casesData.confirmed}</h1>
                            <h1 class="country__text-1">Confirmed</h1>
                        </div>
                        <div class="country__item__data__item">
                            <h1 class="country__text-1">${casesData.deaths}</h1>
                            <h1 class="country__text-1">Deaths</h1>
                        </div>
                        <div class="country__item__data__item">
                            <h1 class="country__text-1">${casesData.recover}</h1>
                            <h1 class="country__text-1">Recovered</h1>
                        </div>
                    </div>
                    <span class="country__name--full">${x}</span>
                </div>`;

    }



    function addEventOpen(countryList){

                countryList.forEach(element => {
            
                    element.addEventListener('click',(event)=>{  
                        document.getElementById('innerPageToatalAlys--confirm').innerHTML = element.children[1].children[0].children[0].textContent ;
                        document.getElementById('innerPageToatalAlys--deaths').innerHTML = element.children[1].children[1].children[0].textContent ;
                        document.getElementById('innerPageToatalAlys--recover').innerHTML = element.children[1].children[2].children[0].textContent ;
                        getDataSpecificData(element.children[2].textContent);
                        event.preventDefault();
                    });
            
                });
    
    }




  

  

  function getDataSpecificData(cityName){

    allDataPage.classList.toggle('main-deactive');
    tablePage.classList.toggle('section-country-wise--deactive');
    
    prevLocation = allDataPage.pageYOffset;
    tablePage.scrollTop = 0;
    nameOfCountey.innerHTML = cityName;
    specificData.innerHTML=`
                            <div class="specfic-List__grid">
                            <div class="specfic-List__item">Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                            <div class="specfic-List__item">Confirmed</div>
                            <div class="specfic-List__item">Deaths</div>
                            <div class="specfic-List__item">Recovered</div>
                        </div>
                      `;
    
    for( x of data[cityName]){

    specificData.innerHTML +=`  <div class="specfic-List__grid">
                                <div class="specfic-List__item">${getDate(x.date)}</div>
                                <div class="specfic-List__item">${x.confirmed}</div>
                                <div class="specfic-List__item">${x.deaths}</div>
                                <div class="specfic-List__item">${x.recovered}</div>
                                </div>
                                `

      }


  }

  function getDate(date){
    const d = new Date(date)
    const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }) 
    const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(d) 
      return ''+da+'-'+mo+'-'+ye;
  }
    
  previousBtn.addEventListener('click',()=>{
    allDataPage.classList.toggle('main-deactive');
    tablePage.classList.toggle('section-country-wise--deactive');
    allDataPage.scrollTop = 0;
  })




};
