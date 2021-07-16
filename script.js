let rowNumberSection = document.querySelector(".row-number-section");

let formulaBarSelectedCellArea=document.querySelector(".selected-cell-div")

let lastCell;
let dataObj={};

let cellSection = document.querySelector(".cell-section")
let columnTagsSection = document.querySelector(".column-tag-section");

cellSection.addEventListener("scroll",function(e){
  rowNumberSection.style.transform=`translateY(-${e.currentTarget.scrollTop}px)`
  columnTagsSection.style.transform=`translateX(-${e.currentTarget.scrollLeft}px)`
})

for (let i = 1; i <= 100; i++) {
  let div = document.createElement("div");
  div.innerText = i;
  div.classList.add("row-number");
  rowNumberSection.append(div);
}


for (let i = 0; i < 26; i++) {
  let asciiCode = 65 + i;

  let reqAlphabet = String.fromCharCode(asciiCode);

  let div = document.createElement("div");
  div.innerText = reqAlphabet;
  div.classList.add("column-tag");
  columnTagsSection.append(div);
}



for (let i = 1; i <= 100; i++) {
  let rowDiv = document.createElement("div");
  rowDiv.classList.add("row");

  for (let j = 0; j < 26; j++) {       //i = 100   j = 25  asciiCode = 65+25=90  alpha = z  cellAdd = Z100
    // A to Z
    let asciiCode = 65 + j;

    let reqAlphabet = String.fromCharCode(asciiCode);

    let cellAddress = reqAlphabet + i;

    dataObj[cellAddress]={
      value:undefined,
      formulae:undefined,
      upstream: [],
      downstream:[]
    }

    let cellDiv = document.createElement("div");

    //cellDiv.contenEditable=true;
    cellDiv.addEventListener("input",function(e){
      let currCellAddress=e.currentTarget.getAttribute("data-address");
      let currCellobj=dataObj[currCellAddress];

      currCellobj.value=e.currentTarget.innerText;
      console.log(currCellobj.value);
      //case I: value to value

      //case II:fomulae to value
      currCellobj.formulae=undefined;
      
      //change upstream
      currUpstream=currCellobj.upstream;
      for(let i=0;i<currUpstream.length;i++){
        removeFromDownstream( currUpstream[i],currCellAddress);
      }
      currUpstream=[];

      //change Downstream
      let currDownstream=currCellobj["downstream"];
      console.log(currDownstream);
      for(let i=0;i<currDownstream.length;i++){
        updateCell(currDownstream[i]);
      }

    })

    cellDiv.setAttribute("contentEditable",true);

    cellDiv.classList.add("cell");
    cellDiv.setAttribute("data-address",cellAddress);

    cellDiv.addEventListener("click",function(e){
      if(lastCell){
        lastCell.classList.remove("cell-selected");
      }
      e.currentTarget.classList.add("cell-selected");
      lastCell=e.currentTarget;

      let currCellAdress=e.currentTarget.getAttribute("data-address");
      formulaBarSelectedCellArea.innerText=currCellAdress;

    })

    rowDiv.append(cellDiv);
  }

  cellSection.append(rowDiv)

}


//for testing
dataObj["A1"].value = 20;
dataObj["A1"].downstream = ["B1"];
dataObj["B1"].formulae = "2 * A1";
dataObj["B1"].upstream = ["A1"];
dataObj["B1"].value = 40;

let a1cell = document.querySelector("[data-address='A1']")
let b1cell = document.querySelector("[data-address='B1']")

a1cell.innerText = 20
b1cell.innerText = 40


function removeFromDownstream (parentCell ,childCell){
  let currDownstream=dataObj[parentCell].downstream;
  dataObj[parent].downstream=currDownstream.filter(address=> address!=childCell);
}


function updateCell(cellAddress){
  console.log(dataObj[cellAddress]);
let formulae= dataObj[cellAddress].formulae;
let upstream=dataObj[cellAddress].upstream;

console.log(dataObj[cellAddress]);
console.log(formulae);
//re-evaluate formulae
let valueObj={};
for(i in upstream){
  valueObj[upstream[i]] = dataObj[upstream[i]].value;
}

for(key in dataObj){
  formulae=formulae.replace(key,valueObj[key]);
}

dataObj[cellAddress]=eval(formulae);

let currDownstream=dataObj[cellAddress];

for(let i=0;i<currDownstream.length;i++){
  updateCell(currDownstream[i]);
}

}