var watchList = [];
var divArray = {};
var userInfo = {};
var loggedIn = localStorage.getItem("loggedIn");
var popOut = false;
var loggedInUser=localStorage.getItem("loggedInUser");
var data;
var error_status;
var internet_err;

const omdb_url = "https://www.omdbapi.com/?apikey=64407bbe&t=";

function updatelogin(){
    loggedIn = localStorage['loggedIn'];
    loggedInUser = localStorage['loggedInUser']
    console.log(loggedIn)
    if(loggedIn==="true"){
        var obj_11 = JSON.parse(localStorage[loggedInUser])
        document.getElementById("loggin").innerText=obj_11['fname']
        document.getElementById("arrowdown").style.display="flex"

    }
    else{
        document.getElementById("loggin").innerText="Login/Sign Up" 
        document.getElementById("arrowdown").style.display="none"
    }
}
document.getElementById("searchbar").addEventListener("keyup",(event)=>{
    if(event.keyCode===13){
        
        const title = document.getElementById("searchbar").value
        if(title===""){
            document.getElementById("searchbar").style.boxShadow="0px 0px 20px 0px red"
            setTimeout(() => {
                document.getElementById("searchbar").style.boxShadow="0 1px 6px 0 rgba(32, 33, 36, .28)" 
            }, 1000);
        }
        else{
        document.querySelector(".home").style.display="none"
        document.querySelector(".titleheader").style.display="none"
        document.querySelector(".searchResult").style.display="none"
        document.querySelector(".MyWatchList").style.display="none"
        document.querySelector(".searchFail").style.display="none"
        document.querySelector(".internetErr").style.display="none"
            api_call(title)
        }
    
        internet_err=false
        error_status=false
        
    }
})
function displayCorrection(){
    document.querySelector(".loading").style.display="block"
        
        setTimeout(() => {
            document.querySelector(".loading").style.display="none"
            if(!error_status){
                
            document.querySelector(".titleheader").style.display="block"
        document.querySelector(".searchResult").style.display="flex"
        document.querySelector(".MyWatchList").style.display="none"
        document.querySelector(".home").style.display="none"
        document.querySelector(".internetErr").style.display="none"
        document.querySelector(".searchFail").style.display="none"
            }
        }, 2000);
}
function searchaction(id){
    document.querySelector(".home").style.display="none"
    document.querySelector(".titleheader").style.display="none"
    document.querySelector(".searchResult").style.display="none"
    document.querySelector(".MyWatchList").style.display="none"
    document.querySelector(".searchFail").style.display="none"
    document.querySelector(".internetErr").style.display="none"
    const title = document.getElementById(id).textContent
    api_call(title)
        /*document.querySelector(".titleheader").style.display="block"
        document.querySelector(".searchResult").style.display="flex"
        document.querySelector(".MyWatchList").style.display="none"
        document.querySelector(".internetErr").style.display="none"
        document.querySelector(".searchFail").style.display="none"*/
        internet_err=false
        error_status=false
        
}

async function api_call(title){
    try
    {
    const response = await fetch(omdb_url+title).catch(()=>{
        setTimeout(() => {
            document.querySelector(".internetErr").style.display="block"
        }, 2000);
        internet_err=true
    })
    data = await response.json();
    console.log(data)
    var mov_object = JSON.parse(localStorage.getItem("moviesTable"))
    mov_object[data.Title]=data
    localStorage.setItem("moviesTable",JSON.stringify(mov_object))
    //getting image
    const img_resp = await fetch(data.Poster);
    const img = await img_resp.blob();
    document.getElementById("image").src = URL.createObjectURL(img);

    document.getElementById("movie_title").textContent = data.Title
    if(loggedInUser!=="none"){
    var moviewatchlistobj = JSON.parse(localStorage[loggedInUser])
    var movieArray = moviewatchlistobj['watchList']
    for(var i=0;i<movieArray.length;i++) {
        if (movieArray[i]===data.Title){
            document.getElementById("watchlist").style.display="none"
            document.getElementById("remwatchlist").style.display="flex"  
            console.log("true")
            break
        }
        else{
            document.getElementById("remwatchlist").style.display="none"
            document.getElementById("watchlist").style.display="flex"
        }
    };
    }
    
    var rating_value = (data.Ratings[0].Value).split('/')
    document.getElementById("ratingPoint").textContent=rating_value[0]
    document.getElementById("totalrating").textContent="/10"
    document.getElementById("type").textContent="| "+data.Type+" |"
    document.getElementById("rating").textContent=data.Rated+" |"
    document.getElementById("runtime").textContent=data.Runtime+" |"
    document.getElementById("genre").textContent=data.Genre+" |"
    document.getElementById("date").textContent=data.Released+" |"
    document.getElementById("lang").textContent=data.Language+" |"
    document.getElementById("country").textContent=data.Country+" |"
    document.getElementById("plot").textContent=data.Plot
    document.getElementById("director").textContent=data.Director
    document.getElementById("Writers").textContent=data.Writer
    document.getElementById("Actors").textContent=data.Actors
    document.getElementById("Production").textContent=data.Production
    document.getElementById("Boxofc").textContent=data.BoxOffice
    document.getElementById("awards").textContent=data.Awards
    document.getElementById("MetaScore").textContent=data.Metascore
    document.getElementById("imdbId").textContent=data.imdbID
    //addWatchListDiv()
    displayCorrection()
    }
    catch(err){
        console.log(err)
        if(!internet_err){
        setTimeout(() => {
            document.querySelector(".searchFail").style.display="block"
        }, 1500);
        }
        
        error_status=true
    }
}
document.getElementById("watchlist").addEventListener("click",()=>{
    if(loggedIn==="true"){
        //addWatchListDiv()
        watchList.push((document.getElementById("movie_title").textContent))
        var userInfo1 = JSON.parse(localStorage.getItem(loggedInUser))
        console.log(userInfo1)
        //console.log(userInfo1[loggedInUser])
        //console.log(userInfo[loggedInUser['watchList']])
        userInfo1['watchList'].push(document.getElementById("movie_title").textContent)
        localStorage.setItem(loggedInUser,JSON.stringify(userInfo1))
        //localStorage.setItem("watchList",watchList)
        updateWatchlist()
        var div1 = document.querySelector(".MyWatchList")
        var div2 = document.querySelector(".watchListItems")
        div1.removeChild(div2)
        var div3 = document.createElement("div")
        div3.setAttribute("class","watchListItems")
        div1.appendChild(div3)
        addWatchListtemp()
        document.getElementById("watchlist").style.display="none"
        document.getElementById("remwatchlist").style.display="flex"
        console.log(watchList);
    }
    else{
        displayLogin()
    }

})
document.getElementById("remwatchlist").addEventListener("click",()=>{
    console.log(document.getElementById("movie_title").textContent)
    removeElementfromWatchList(document.getElementById("movie_title").textContent)
    updateWatchlist()
    
    console.log(watchList);

})

function updateWatchlist(){
    if(loggedIn==="true")
    {
     var moviewatchlistobj = JSON.parse(localStorage.getItem(loggedInUser))
    var movieArray = moviewatchlistobj['watchList']
    console.log(movieArray.length)
    if (movieArray.length===0){
        document.getElementById("listlen").style.display="none"
    }
    else{
        document.getElementById("listlen").style.display="block"
        document.getElementById("listlen").textContent=movieArray.length
    }
}
else{
    document.getElementById("listlen").style.display="none"
}
}

function removeElementfromWatchList(title){
    //var id = watchList.indexOf(title);

    for(var i=0;i<watchList.length;i++){
        if (watchList[i]===title){
            watchList.splice(i,1)
            //localStorage.setItem("watchList",watchList)
        }
    }
    var obj_rem = JSON.parse(localStorage.getItem(loggedInUser))
    watlstArray = obj_rem['watchList']
    for(var i=0;i<watlstArray.length;i++){
        if (watlstArray[i]===title){
            watlstArray.splice(i,1)
            //localStorage.setItem("watchList",watchList)
        }
    }
    obj_rem['watchList']=watlstArray
    localStorage.setItem(loggedInUser,JSON.stringify(obj_rem))
    restorebtn()
}
function restorebtn(){
    document.getElementById("remwatchlist").style.display="none"
    document.getElementById("watchlist").style.display="flex"
}
function removeItemdiv(id){
    var title = document.getElementById("wl-title-"+id[5]).textContent
    for(var i=0;i<watchList.length;i++){
        if (watchList[i]===title){
            watchList.splice(i,1)
            //localStorage.setItem("watchList",watchList)
        }
    }
    var obj_rem = JSON.parse(localStorage.getItem(loggedInUser))
    watlstArray = obj_rem['watchList']
    for(var i=0;i<watlstArray.length;i++){
        if (watlstArray[i]===title){
            watlstArray.splice(i,1)
            //localStorage.setItem("watchList",watchList)
        }
    }
    obj_rem['watchList']=watlstArray
    localStorage.setItem(loggedInUser,JSON.stringify(obj_rem))
    console.log(title)
    var div_to_remove = document.getElementById(id);
    document.querySelector(".watchListItems").removeChild(div_to_remove)
    //divArray.pop(div_to_remove);
    //localStorage.setItem("divArray",JSON.stringify(divArray))
    if (title===document.getElementById("movie_title").textContent){
        restorebtn()
    }
    updateWatchlist()
    displayItems()
    displayWatchlist()
    if(obj_rem['watchList'].length===0){
        document.getElementById("wl-warning").style.display="flex"
    }
    
}

function updateID(){
    const watchlistArray = document.querySelectorAll(".MyWatchList .watchListItems .itemcontainer")
    var num = Number((watchlistArray[watchlistArray.length-1].getAttribute("id"))[5])
    console.log(num)
}
function displayWatchlist(){
    //location.reload()
    init()
    document.querySelector(".home").style.display="none"
    displayItems()
    document.getElementById("searchbar").value=""
    document.querySelector(".MyWatchList").style.display="block"
    if(localStorage['loggedIn']==="true")
    {
    var objj = JSON.parse(localStorage[localStorage['loggedInUser']])
    if(objj['watchList'].length>2){
        document.querySelector(".watchListItems").style.height="500px"
    }
    else{
        document.querySelector(".watchListItems").style.height="100%"
    }
    }
}
function addWatchListtemp(){
    //init()
    //document.querySelector(".home").style.display="none"
    //displayItems()
    //document.getElementById("searchbar").value=""
    //console.log(loggedIn+"ee")
    if(loggedIn==="true")
    {
    var obj_mov=JSON.parse(localStorage[loggedInUser])
    var movArr = obj_mov['watchList']
    var movDetObj = JSON.parse(localStorage.getItem("moviesTable"))
    if(movArr.length)
    {
        for(var k=0;k<movArr.length;k++){
        //create itemcontainer
    var main_div = document.createElement("div")
    main_div.setAttribute("class","itemcontainer")
    main_div.setAttribute("id","item-"+k)
    console.log(k)

    //create wl-imagecontainer
    var wl_image = document.createElement("div")
    wl_image.setAttribute("class","wl-image")
    console.log(k+1)
    //create img element
    var wl_img = document.createElement("img")
    wl_img.setAttribute("src","")
    wl_img.setAttribute("id","wl-img-"+k)
    //add img element to wl-image-container
    wl_image.appendChild(wl_img)
    console.log(k+2)
    //Preparing wl-details div
    var wl_details = document.createElement("div")
    wl_details.setAttribute("class","wl-details")

    var wl_titlecontainer = document.createElement("div")
    wl_titlecontainer.setAttribute("class","wl-titlecontainer")
    wl_titlecontainer.setAttribute("id","wl-titlecontainer")

    var wl_title = document.createElement("button")
    wl_title.setAttribute("class","wl-title")
    wl_title.setAttribute("id","wl-title-"+k)
    wl_title.setAttribute("onclick","searchaction('wl-title-"+k+"')")

    var wl_rembtn = document.createElement("div")
    wl_rembtn.setAttribute("id","wl-removebutton")
    var btn = document.createElement("button")
    btn.setAttribute("id","wl-remove")
    btn.setAttribute("onclick","removeItemdiv('item-"+k+"')")
    btn.textContent="Remove"
    wl_rembtn.appendChild(btn)

    wl_titlecontainer.appendChild(wl_title)
    wl_titlecontainer.appendChild(wl_rembtn)

    //Preparing wl-subdetails div
    var wl_subdetails = document.createElement("div")
    wl_subdetails.setAttribute("class","wl-subdetails")
    wl_subdetails.setAttribute("id","wl-subdetails")

    var wl_genre = document.createElement("span")
    wl_genre.setAttribute("id","wl-genre-"+k)

    var wl_runtime = document.createElement("span")
    wl_runtime.setAttribute("id","wl-runtime-"+k)

    var wl_releasedate = document.createElement("span")
    wl_releasedate.setAttribute("id","wl-releasedate-"+k)

    wl_subdetails.appendChild(wl_genre)
    wl_subdetails.appendChild(wl_runtime)
    wl_subdetails.appendChild(wl_releasedate)

    //Preparing rating & plot div
    var wl_rating = document.createElement("div")
    wl_rating.setAttribute("class","wl-rating")
    wl_rating.setAttribute("id","wl-rating-"+k)

    var wl_plot = document.createElement("div")
    wl_plot.setAttribute("class","wl-plot")
    wl_plot.setAttribute("id","wl-plot-"+k)

    //appending child to wl-details div
    wl_details.appendChild(wl_titlecontainer)
    wl_details.appendChild(wl_subdetails)
    wl_details.appendChild(wl_rating)
    wl_details.appendChild(wl_plot)

    //final appending into main_div(itemcontainer div)
    main_div.appendChild(wl_image)
    main_div.appendChild(wl_details)
    console.log(k+3)
    document.querySelector(".watchListItems").appendChild(main_div)
    console.log(k+4)
    document.getElementById("wl-img-"+k).src=movDetObj[movArr[k]].Poster 
    document.getElementById("wl-title-"+k).textContent=movDetObj[movArr[k]].Title
    document.getElementById("wl-genre-"+k).textContent=movDetObj[movArr[k]].Genre+" |"
    document.getElementById("wl-runtime-"+k).textContent=movDetObj[movArr[k]].Runtime+" |"
    document.getElementById("wl-releasedate-"+k).textContent=movDetObj[movArr[k]].Released
    document.getElementById("wl-rating-"+k).textContent=movDetObj[movArr[k]].imdbRating+"/10"
    document.getElementById("wl-plot-"+k).textContent=movDetObj[movArr[k]].Plot
    console.log(k+5)
    }
    //document.querySelector(".MyWatchList").style.display="block"
    //document.querySelector(".watchListItems").style.display="block"
    //document.querySelector(".wl-warning").style.display="none"

}
    
    
    else{
        //document.querySelector(".MyWatchList").style.display="block"
        //document.querySelector(".wl-warning").style.display="block"
        //console.log("entered")
    }
}
else{
    //document.querySelector(".MyWatchList").style.display="block"
    //document.querySelector(".wl-warning").style.display="block"
}
}
function displayHome(){
    init()
    document.querySelector(".home").style.display="grid"
    document.getElementById("searchbar").value=""
}
function displayItems(){
    const watchlistArray = document.querySelectorAll(".MyWatchList .watchListItems .itemcontainer")
    if(watchlistArray.length===0){
        document.querySelector(".watchListItems").style.display="none"
        document.getElementById("wl-warning").style.display="flex"
    }
    else{
        document.querySelector(".watchListItems").style.display="block"
        document.getElementById("wl-warning").style.display="none"
    }
}
function clickSearch(){
    document.getElementById("searchbar").click()
}

function displayLogin(){
    if(document.getElementById("loggin").innerText==="Login/Sign Up"){
        init()
        document.querySelector(".home").style.filter="blur(10px)"
        document.querySelector(".home").style.pointerEvents="none"
        document.querySelector(".navbar").style.filter="blur(10px)"
        document.querySelector(".navbar").style.pointerEvents="none"
        document.querySelector(".searchcontainer").style.filter="blur(10px)"
        document.querySelector(".searchcontainer").style.pointerEvents="none"
        //document.querySelector("logincont").style.backdropFilter="blur(10px)"
        document.getElementById("logincont").style.display="block"
    }
    else{
        if(popOut){
            document.getElementById("logout").style.display="none" 
            popOut=false   
        }
        else{
            document.getElementById("logout").style.display="block"
            popOut=true
        }
        
    }
    
}

function closeLogin(){
    document.getElementById("logincont").style.display="none"
    //init()
    document.querySelector(".home").style.filter="blur(0px)"
    document.querySelector(".home").style.pointerEvents="all"
    document.querySelector(".navbar").style.filter="blur(0px)"
    document.querySelector(".navbar").style.pointerEvents="all"
    document.querySelector(".searchcontainer").style.filter="blur(0px)"
    document.querySelector(".searchcontainer").style.pointerEvents="all"
    document.getElementById("email").style.boxShadow="0px 0px 0px 0px red"
    document.getElementById("pwd").style.boxShadow="0px 0px 0px 0px red"
    displayHome()
}

function signinFunc(){
    var email = document.getElementById("email").value
    var password = document.getElementById("pwd").value
    document.getElementById("email").style.boxShadow="0px 0px 0px 0px red"
    document.getElementById("pwd").style.boxShadow="0px 0px 0px 0px red"
    if (email==="" && password !== ""){
        document.getElementById("email").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (email!=="" && password===""){
        document.getElementById("pwd").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (email==="" && password===""){
        document.getElementById("email").style.boxShadow="0px 0px 20px 0px red"
        document.getElementById("pwd").style.boxShadow="0px 0px 20px 0px red"
    }
    else if(email!=="" && password!==""){
        if(typeof(localStorage[email])==="undefined"){
            alert("UserEmail does not exist! Register as user to continue...")
            document.getElementById("email").value=""
            document.getElementById("pwd").value=""
        }
        else{
        var obj = JSON.parse(localStorage[email])

        if(password===obj["pwd"]){
            console.log("Sucessfull")
            localStorage.setItem('loggedIn','true')
            localStorage.setItem('loggedInUser',email)
            closeLogin()
            document.getElementById("loggin").innerText=obj["fname"]
            document.getElementById("arrowdown").style.display="flex"
            location.reload()
            addWatchListtemp()
            document.getElementById("email").value=""
            document.getElementById("pwd").value=""
        }
        else{
            alert("Wrong Password!")
            document.getElementById("pwd").value=""
        }
        }   
    }

}
function logoutFunc(){
    localStorage.setItem('loggedIn','false')
    localStorage.setItem('loggedInUser','none')
    location.reload()
}
function displayReg(){
        init()
        document.getElementById('email').value=""
        document.getElementById('pwd').value=""
        document.querySelector(".home").style.filter="blur(10px)"
        document.querySelector(".home").style.pointerEvents="none"
        document.querySelector(".navbar").style.filter="blur(10px)"
        document.querySelector(".navbar").style.pointerEvents="none"
        document.querySelector(".searchcontainer").style.filter="blur(10px)"
        document.querySelector(".searchcontainer").style.pointerEvents="none"
        //document.querySelector("logincont").style.backdropFilter="blur(10px)"
        document.getElementById("regcont").style.display="block"
    
}
function closeReg(){
    document.getElementById("regcont").style.display="none"
    //init()
    document.querySelector(".home").style.filter="blur(0px)"
    document.querySelector(".home").style.pointerEvents="all"
    document.querySelector(".navbar").style.filter="blur(0px)"
    document.querySelector(".navbar").style.pointerEvents="all"
    document.querySelector(".searchcontainer").style.filter="blur(0px)"
    document.querySelector(".searchcontainer").style.pointerEvents="all"
    displayLogin()
    document.getElementById("fname").value=""
    document.getElementById("lname").value=""
    document.getElementById("email1").value=""
    document.getElementById("pwd1").value=""
}
function regFunc(){
    var fname = document.getElementById("fname").value
    var lname = document.getElementById("lname").value
    var email = document.getElementById("email1").value
    var pwd = document.getElementById("pwd1").value
    document.getElementById("email1").style.boxShadow="0px 0px 0px 0px red"
    document.getElementById("pwd1").style.boxShadow="0px 0px 0px 0px red"
    document.getElementById("fname").style.boxShadow="0px 0px 0px 0px red"
    if (email==="" && pwd !== "" && fname!==""){
        document.getElementById("email1").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (email!=="" && pwd==="" && fname!==""){
        document.getElementById("pwd1").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (email!=="" && pwd!=="" && fname===""){
        document.getElementById("fname").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (email==="" && pwd==="" && fname!==""){
        document.getElementById("email1").style.boxShadow="0px 0px 20px 0px red"
        document.getElementById("pwd1").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (email==="" && pwd!=="" && fname===""){
        document.getElementById("email1").style.boxShadow="0px 0px 20px 0px red"
        document.getElementById("fname").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (email!=="" && pwd==="" && fname===""){
        document.getElementById("fname").style.boxShadow="0px 0px 20px 0px red"
        document.getElementById("pwd1").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (email==="" && pwd==="" && fname===""){
        document.getElementById("email1").style.boxShadow="0px 0px 20px 0px red"
        document.getElementById("pwd1").style.boxShadow="0px 0px 20px 0px red"
        document.getElementById("fname").style.boxShadow="0px 0px 20px 0px red"
    }
    else if(email!=="" && pwd!=="" && fname!==""){
        if(typeof(localStorage[email])==="undefined")
    {
    var object = {"fname":fname,"lname":lname,"email":email,"pwd":pwd,"watchList":[]}

    localStorage.setItem(email,JSON.stringify(object))

    userInfo[email]=object

    alert("Registration Successful!")
    document.getElementById("fname").value=""
    document.getElementById("lname").value=""
    document.getElementById("email1").value=""
    document.getElementById("pwd1").value=""
    closeReg()
    }
    else{
        alert("UserEmail alredy exists. Try logging in!")
       }
    }   
    
}
function displayforgot(){
        init()
        var useremmail = document.getElementById("email").value
        document.getElementById('email').value=""
        document.getElementById('pwd').value=""
        document.querySelector(".home").style.filter="blur(10px)"
        document.querySelector(".home").style.pointerEvents="none"
        document.querySelector(".navbar").style.filter="blur(10px)"
        document.querySelector(".navbar").style.pointerEvents="none"
        document.querySelector(".searchcontainer").style.filter="blur(10px)"
        document.querySelector(".searchcontainer").style.pointerEvents="none"
        //document.querySelector("logincont").style.backdropFilter="blur(10px)"
        document.getElementById("frgtpwd").style.display="block"
        document.getElementById("email2").value=useremmail
}
function ChangePassword(){
    var emmail = document.getElementById("email2").value
    var new_pwd = document.getElementById("npwd").value
    document.getElementById("email2").style.boxShadow="0px 0px 0px 0px red"
    document.getElementById("npwd").style.boxShadow="0px 0px 0px 0px red"
    if (emmail==="" && new_pwd !== ""){
        document.getElementById("email2").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (emmail!=="" && new_pwd===""){
        document.getElementById("npwd").style.boxShadow="0px 0px 20px 0px red"
    }
    else if (emmail==="" && new_pwd===""){
        document.getElementById("email2").style.boxShadow="0px 0px 20px 0px red"
        document.getElementById("npwd").style.boxShadow="0px 0px 20px 0px red"
    }
    else if(emmail!=="" && new_pwd!==""){
        if(typeof(localStorage[emmail])==="undefined"){
            alert("UserEmail does not exist! Register as user to continue...")
            document.getElementById("email2").value=""
            document.getElementById("npwd").value=""
        }
        else{
            var pwdobj = JSON.parse(localStorage[emmail])
            pwdobj['pwd']=new_pwd
            localStorage[emmail]=JSON.stringify(pwdobj)
            alert("Password Changed Successfully!")
            document.getElementById("email2").value=""
            document.getElementById("npwd").value=""
            closefrgt()
        }
    }

    
}
function closefrgt(){
    document.getElementById("frgtpwd").style.display="none"
    //init()
    document.querySelector(".home").style.filter="blur(0px)"
    document.querySelector(".home").style.pointerEvents="all"
    document.querySelector(".navbar").style.filter="blur(0px)"
    document.querySelector(".navbar").style.pointerEvents="all"
    document.querySelector(".searchcontainer").style.filter="blur(0px)"
    document.querySelector(".searchcontainer").style.pointerEvents="all"
    displayLogin()
    document.getElementById("fname").value=""
    document.getElementById("lname").value=""
    document.getElementById("email1").value=""
    document.getElementById("pwd1").value=""
    document.getElementById("email2").style.boxShadow="0px 0px 0px 0px red"
    document.getElementById("npwd").style.boxShadow="0px 0px 0px 0px red"

}

function init(){
    document.querySelector(".titleheader").style.display="none"
    document.querySelector(".searchResult").style.display="none"
    document.getElementById("remwatchlist").style.display="none"
    document.querySelector(".MyWatchList").style.display="none"
    document.getElementById("logincont").style.display="none"
    document.getElementById("regcont").style.display="none"
    document.querySelector(".searchFail").style.display="none"
    document.querySelector(".internetErr").style.display="none"
    document.getElementById("frgtpwd").style.display="none"
    
}
function createMoviesTable(){
    var loc_obj = localStorage.getItem("asmdfaksgjbklg")
    if(loc_obj===null){
        localStorage.setItem("moviesTable","{}")
    }
}

init()
updatelogin()
updateWatchlist()
addWatchListtemp()
createMoviesTable()
//updateID()
//console.log(localStorage.getItem("divArray"))
//api_call('96');
//console.log(poster);
