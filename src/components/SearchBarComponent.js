import React from "react";

function SearchBar({dispatch}){
    async function filterData(){
        let searchQuery = document.querySelector("#searchbar").value;
        if (searchQuery){
            let val = await fetch(`http://localhost:5000/filter?query=${searchQuery}`);
            let data = await val.json();
            console.log("Data: ", data);
            dispatch({type: "ASSIGNMENT", payload: data.result});
        }else{
            window.location.reload();
        }

    }
    return(
        <div className="searchbar-div">
            <form className="form" style={{minWidth: "100%"}}>
                <div className="form-group row">
                    <input className="form-control mr-sm-4 search-input col-lg-6 col-8" type="search" placeholder="Search" aria-label="Search" id="searchbar" style={{border: "1px solid black", borderRightWidth: "0px"}}/>
                    <button className="btn btn-outline-light my-2 my-sm-0 search-btn pl-3 pr-3 search-btn" type="button" onClick={filterData}> <i className="fas fa-search"></i> </button>
                </div>
            </form>
        </div>
        
    )
}

export {SearchBar}