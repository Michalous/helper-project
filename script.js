document.addEventListener('DOMContentLoaded', function() {
    var API_Key_Earthquake =  'f6bae715e6msha6463b347ed58d4p1c02a9jsndfe297d44900' //earthquake     
    var API_key = '45c2707f89d16318fbaddd18663434b4'
    
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_Key_Earthquake,
            'X-RapidAPI-Host': 'everyearthquake.p.rapidapi.com'
        }
    }

    const nums = document.querySelectorAll('.nums span')
const counter = document.querySelector('.counter')
const finalMessage = document.querySelector('.final')
const replay = document.querySelector('#replay')


function resetDOM() {
    counter.classList.remove('hide')
    finalMessage.classList.remove('show')

    nums.forEach((num) => {
        num.classList.value = ''
    })

    nums[0].classList.add('in')
}

function runAnimation() {
    nums.forEach((num, idx) => {
        const nextToLast = nums.length - 1

        num.addEventListener('animationend', (e) => {
            if(e.animationName === 'goIn' && idx !== nextToLast) {
                num.classList.remove('in')
                num.classList.add('out')
            } else if (e.animationName === 'goOut' && num.nextElementSibling) {
                num.nextElementSibling.classList.add('in')
            } else {
                counter.classList.add('hide')
                finalMessage.classList.add('show')
            }
         })
    })
}


    $(document).ready(function() {
        
        $('#lucky').click(function() {
            $('.modal').modal('show')
            runAnimation()
        })

        $('#search_btn').click(function() {
            $('#inputFieldResults').empty()
            var location = document.getElementById('inputField')
            
            // requests the coordinates of a city typed in by user
            $.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location.value}&limit=5&appid=${API_key}`, function(data, status) {
            // if no result returned notifies user 
            if (data.length == 0) {
                var noResults = $('<div class="red">No result!</div>')
                $('#inputFieldResults').append(noResults) 
            }
            // displays options returned by request (up to 5)
            console.log(data)
            for (var i = 0; i < data.length; i++) {
                    var item = $(`<div class="result" data-country="${data[i].country}" data-name="${data[i].name}" data-location='["${data[i].lat}", "${data[i].lon}", "${data[i].name}"]'></div>`).text(`${data[i].name}, ${data[i].country}, ${data[i].state}`)
                    $('#inputFieldResults').append(item)
                }
                // specifies what happens when user clicks on one of the options
                $('.result').click(function() {
                    $('#earthquake_results').append('<div class="kinetic"></div>')
                    $('#facts_results').append('<div class="kinetic"></div>')
                    location.value = "" // clears input field
                    var locData = $(this).data('location')
                    var name = $(this).data('name')
                    var country = $(this).data('country')
                    console.log(locData)
                    console.log(name)
                    console.log(country)
                    $('#inputFieldResults').empty()
                    for (var i = 0; i < listOfCountryObjects.length; i++) {
                        if (listOfCountryObjects[i]['ISO2'] == country) {
                            var slug = listOfCountryObjects[i]['Slug']
                            var countryName = listOfCountryObjects[i]['Country']
                        }
                    }

                    // const row = document.getElementById("row");
                    document.getElementById('row').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
                    
                    fetch(`https://everyearthquake.p.rapidapi.com/latestEarthquakeNearMe?latitude=${locData[0]}&longitude=${locData[1]}`, options)
                        .then(response => response.json())
                        .then(response => 
                            showEarthQuakeData(response, countryName, name)
                            // console.log(response['data'][0]['date']) 
                            // $('#earthquake_results').text(response.data[0]['title'])
                        )
                        .catch(err => console.error(err));
                    
                    fetch(`https://restcountries.com/v3.1/alpha?codes=${country}`)
                        .then(response => response.json())
                        .then(response => 
                            // console.log(response)
                            // $('#covid_data').text(response[0]['capital'])
                            showCountryData(response, countryName, name)
                        )
                        .catch(err => console.error(err))
                })
            
            })    
        })
    })
    function showCountryData(response, countryName, name) {
        var flag = $(`<img id="flag" src="${response[0]['flags']['png']}" alt="flag">`)
        $('#facts_results').empty()
        $('#facts_results').append(flag)
        var string_to_display = `${name} is a city in ${countryName} which is a country in ${response[0]['continents'][0]} that has borders with ${response[0]['borders']}. ${countryName} covers the area of ${response[0]['area']} square kilometers, its capital is ${response[0]['capital']} and is home to ${response[0]['population']} people.`
        $('#facts_results').append(string_to_display)
    }

    function showEarthQuakeData(response, countryName, name) {
        $('#earthquake_results').empty()
        var last_earthquake = `The last earthquake close to ${name} happened on ${response['data'][0]['date']}`
        $('#earthquake_results').append(last_earthquake)
    }
})