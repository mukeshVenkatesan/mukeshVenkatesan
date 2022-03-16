const express=require('express');
const bodyParser=require('body-parser');
const request=require('request');
const app=express()
require("dotenv").config()
//API key
const apiKey=`${process.env.API_KEY}`
//use static files like js,images
app.use(express.static('public'))
//used to load data from url request(extended true-lookin to any datatypes,if false-only arrays and strings)
app.use(bodyParser.urlencoded({extended:true}))
//setting template engine using ejs
app.set("view engine","ejs")
//setting the  endpoint  for get request and linking it into the template engine
app.get("/",function(req,res){
    res.render("index",{weather:null,error:null})
})


//endpoint for post request with the city name and apikey
app.post("/",function(req,res){
    
    let city=req.body.city
    let url=`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`
    
    request(url,function(err,response,body){
        if(err){
            res.render('index',{weather:null,error:"Error,Please try again"})}
        else{
            let weather=JSON.parse(body)

        
        console.log(weather)
        if(weather.main==undefined){
            res.render('index',{weather:null,error:"Error,Please try again"})

        }
        else{
            let place=`${weather.name},${weather.sys.country}`,
            weatherTimeZone=`${new Date(
                weather.dt*1000-weather.timezone*1000
            )}`
            let weatherTemp=`${weather.main.temp}`,
            weatherPressure=`${weather.main.pressure}`,
            weatherIcon=`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`    
            weatherDescription=`${weather.weather[0].description}`,
            humidity=`${weather.main.humidity}`,
            clouds=`${weather.clouds.all}`,
            visibility=`${weather.visiblity}`,
            main=`${weather.weather[0].main}`,
            description=`${weather.weather[0].description}`
            
            weatherFahrenheit=(weatherTemp*9/5+32)
            function roundToTwo(num){
                return+(Math.round(num+"e+2")+"e-2")
            }
            weatherFahrenheit=roundToTwo(weatherFahrenheit);
            res.render("index",{
                weather:weather,
                place:place,
                temp:weatherTemp,
                pressure:weatherPressure,
                icon:weatherIcon,
                description:weatherDescription,
                timezone:weatherTimeZone,
                humidity:humidity,
                fahrenheit:weatherFahrenheit,
                clouds:clouds,
                visibility:visibility,
                main:main,
                description:description,
                error:null
        
            })
        }    
    }
    


    })
})

app.listen(5000,function(){
    console.log("Listening")
})