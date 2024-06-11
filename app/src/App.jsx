import styled from "styled-components";
import {useState,useEffect} from "react";
import SearchResult from "./components/SearchResults/SearchResult";
export const BASE_URL="http://localhost:9000";

const App=()=>{

  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);//you know when we open the page there is spinner.
  const [error,setError]=useState(null); 
  const [filtered,setFiltered]=useState(null);
  const [selectedBtn,setSelectedBtn]=useState("all");



  //network call
  useEffect(()=>{
    const fetchFoodData=async()=>{
      setLoading(true);
      try{
        const response=await fetch(BASE_URL); 
        const json=await response.json(); //if you not write await then info takes time so write it so that the all info first comes then display.
        // console.log(json);
        
        setData(json);
        setFiltered(json);
        setLoading(false);
      }
      catch(error){
        setError("unable to fetch data");
      }
        
    };
    fetchFoodData();
  },[]);
  // console.log(data);
  //if we run it then there is a infinite loop bcz this function calls at every render so here,we use useEffect 
  //and we put all the fetchFoodData inside the useEffect and also call inside the useEffect.
  //to run one time we pass the dependencies empty array in useEffect. 

  //Note: remember always first fetch data before use it, call the network first then bulid the UI .
  //---------



  //for searching food.
  const searchFood=(event)=>{
    const searchValue=event.target.value;
    // console.log(searchValue);
    if(searchValue==""){
      setFiltered(null);
    }
    //here filter method create new array filled with elements that pass by the function.
    //includes will check food.name have the same value or not.
    const filter=data?.filter((food)=>
    food.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  setFiltered(filter);
  }




//callback function if type is same then it will filter acc. to type.
  const filterFood=(type)=>{
    if(type==="all"){
      setFiltered(data);
      setSelectedBtn("all");
      return;
    }
    const filter=data?.filter((food)=>
      food.type.toLowerCase().includes(type.toLowerCase())
    );
    setFiltered(filter);
      setSelectedBtn(type);
  }




  //here we make array to save multiple buttons.
  const filterBtns=[
    {
      name:"All",
      type:"all"
    },
    {
      name:"Breakfast",
      type:"breakfast"
    },
    {
      name:"Lunch",
      type:"lunch"
    },
    {
      name:"Dinner",
      type:"dinner"
    }
   
  ]



  if(error)return <div>{error}</div>
  if(loading)return <div>loading......</div>



  return(
    <>
      <Container>
    <TopContainer>
      <div className="logo">
        <img src="/logo.svg" alt="logo"></img>
      </div>
      <div className="search">
        <input onChange={searchFood} placeholder="Search For"></input>
      </div>
    </TopContainer>
    <FilterContainer>
      {
        filterBtns.map((value)=>(
          <Button key={value.name} isSelected={selectedBtn===value.type} onClick={()=>filterFood(value.type) }>{value.name}</Button>
        ))
      }
      {/* selectedbtn is used to make button dark */}
      {/* <Button>All</Button>
      <Button>Breakfast</Button>
      <Button>Lunch</Button>
      <Button>Dinner</Button> */}
    </FilterContainer>
   
  </Container>
  {/* here we pass the filtered value if we not search anything then whole api pass. */}
  <SearchResult data={filtered}/>
    </>
  ); 
};
export default App;

export const Container=styled.div`
max-width:1200px;
margin:0 auto;
`;

const TopContainer=styled.section` 
  min-height:120px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:16px; 
  /* margin-left:7px;
  margin-right:7px;
  margin-bottom:-7px; */
  .search{
    input{
      background-color:transparent;
      border:1px solid red;
      color:white;
      border-radius:5px;
      height:40px;
      font-size:16px;
      padding:0 10px;
      &::placeholder{
        color:white;
      }
    }
  }
  //we use latest media query to handle for responsiness for small devices.
  @media (0<width<600px){
    flex-direction:column;
    height:120px;
  }
`;
const FilterContainer=styled.section`
  display:flex;
  justify-content: center;
  align-items: center;
  gap:7px;
  padding-bottom:30px;
`;

export const Button=styled.section`
//here we use props={isSelected} as (props)=>().
background:${({isSelected})=>(isSelected?"#f22f2f" : "#ff4343")};
outline:1px solid ${({isSelected})=>(isSelected? "white" : "#ff4343")};
border-radius: 5px;
padding:6px 12px;
border:none;
color:white;
cursor:pointer;
&:hover{
  background-color:#f22f2f;
}
`;

