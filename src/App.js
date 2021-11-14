import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';


function App() {

  const [algName,setAlgName] = useState("Bubble Sort");
  const [elements, setElements] = useState([]);
  const [nrElements, setNrElements] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [maxValue, setMaxValue] = useState(-9999999);
  const [minValue, setMinValue] = useState(9999999);
  const [history, setHistory] = useState(-1);
  const [sorting, setSorting] = useState(false);
  const firstUpdate = useRef(true);

  React.useEffect(() => {
    if(firstUpdate.current === true) {
      firstUpdate.current = false;
      handleRandom();
      return;
    }
    console.log(speed);
    if(sorting === true) {
      let interval = setInterval(() => {
        let newElements = [...(history[0].elements)];
        let newHistory = [];
        for(let i = 1; i < history.length; i++)
          newHistory.push({elements:[...history[i].elements], selectedIndex1: history[i].selectedIndex1, selectedIndex2: history[i].selectedIndex2});
        setElements(newElements);
        if(history.length !== 1)
          setHistory(newHistory);
        else {
          setHistory(-1);
          setSorting(false);
        }
      }, 8*(101-speed));
      return () => clearInterval(interval);
    }
    else
      setSorting(false);
  }, [elements, sorting]);
 

  function handleAlgorithmChange() {
    setAlgName(document.getElementsByClassName("algorithmSelector")[0].value);
    console.log(algName);
  }

  function handleSpeedChange() {
    setSpeed(parseInt(document.getElementById("speedSlider").value));
  }

  function handleNrChange() {
    setNrElements(parseInt(document.getElementById("randomSlider").value));
    console.log(nrElements);
  }

  function handleElements() {
    let newElements = [...elements];
    let newElement = parseInt(document.getElementsByClassName("elementInput")[0].value);
    if(newElements.indexOf(newElement) > -1)
      return;
    newElements.push(newElement);
    setElements(newElements);
    if(newElements[newElements.length-1] > maxValue)
      setMaxValue(newElements[newElements.length-1]);
    if(newElements[newElements.length-1] < minValue)
      setMinValue(newElements[newElements.length-1]);
    document.getElementsByClassName("elementInput")[0].value = "";
    console.log(elements);
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  
  function handleRandom() {
    let newElements = [];
    let newMaxValue = -999999999;
    let newMinValue = 999999999;
    let i = 0;
    while(i < nrElements) {
      let newElement = getRandomInt(100); 
      while(newElements.includes(newElement))
        newElement = getRandomInt(100);
      newElements.push(newElement);
      newMaxValue = newMaxValue < newElements[i]? newElements[i]: newMaxValue;
      newMinValue = newMinValue > newElements[i]? newElements[i]: newMinValue;
      i += 1;
    }
    setElements(newElements);
    setMaxValue(newMaxValue);
    setMinValue(newMinValue);
  }

  function handleClear() {
    setSorting(false);
    setHistory(-1);
    setElements([]);
    setMinValue(9999999);
    setMaxValue(-9999999);
  }
  function handleSort() {
    setSorting(true);
    getHistory();
    console.log(history);
  }

  function handleStop() {
    setSorting(!sorting);
  }

  function getHistory() {
    if(algName === "Bubble Sort") 
      bubbleSort();
    else if(algName === "Selection Sort")
      selectionSort();
    else if(algName === "Quick Sort")
      quickSort();
    else if(algName === "Merge Sort")
      mergeSort();
    else if(algName === "Radix Sort")
      radixSort();
    else if(algName === "Heap Sort")
      heapSort();
  }

  function bubbleSort() {
    let i = 0, j = 0;
    let newElements = [...elements];
    let history = [{elements: [...elements], selectedIndex1: 0, selectedIndex2: 0}];
    while(i < nrElements) {
      while(j < nrElements - i - 1) {
        if(newElements[j] > newElements[j+1]) {
          let temp = newElements[j];
          newElements[j] = newElements[j+1];
          newElements[j+1] = temp;
        }
        history.push({elements: [...newElements], selectedIndex1: i, selectedIndex2: j});
        j++;
      }
      j = 0;
      i++;
    }
    setHistory(history);
  }

  function selectionSort() {
    let newElements = [...elements];
    let history = [{elements: [...elements], selectedIndex1: 0, selectedIndex2: 0}];
    for(let i = 0; i < elements.length; i++)
      for(let j = i + 1; j < elements.length; j++) {
        if(newElements[i] > newElements[j]) {
          let temp = newElements[i];
          newElements[i] = newElements[j];
          newElements[j] = temp;
        }
        history.push({elements: [...newElements], selectedIndex1: i, selectedIndex2: j});
      }
    setHistory(history);
  }

  function quickSort() {
    let newElements = [...elements];
    let newHistory = [{elements: [...elements], selectedIndex1: 0, selectedIndex2: 0}];
    function partition(a, b) {
      let pivotIndex = a;
      let pivot = newElements[pivotIndex];
      while(a < b){
        while(a < newElements.length && newElements[a] <= pivot){
          newHistory.push({elements: [...newElements], selectedIndex1: a, selectedIndex2: b});
          a++;
        }
        while(newElements[b] > pivot){
          newHistory.push({elements: [...newElements], selectedIndex1: a, selectedIndex2: b});
          b--;
        }
        if(a < b){
          newHistory.push({elements: [...newElements], selectedIndex1: a, selectedIndex2: b});
          let temp = newElements[a];
          newElements[a] = newElements[b];
          newElements[b] = temp;
        }
        newHistory.push({elements: [...newElements], selectedIndex1: a, selectedIndex2: b});
      }
      let temp = newElements[pivotIndex];
      newElements[pivotIndex] = newElements[b];
      newElements[b] = temp;
      newHistory.push({elements: [...newElements], selectedIndex1: pivotIndex, selectedIndex2: b});
      return b;
    }

    function quickSortAlg(a,b) {
      if(a < b) {
        console.log(a,b);
        let pi = partition(a,b);
        quickSortAlg(a, pi-1);
        quickSortAlg(pi+1,b);
      }
    }

    quickSortAlg(0,newElements.length-1);
    console.log(newHistory);
    setHistory(newHistory);
  }

  function mergeSort() {
    let newElements = [...elements];
    let newHistory = [{elements: [...elements], selectedIndex1: 0, selectedIndex2: 0}];

    function merge(a, b) {
      if(a==b)
        return;

      let mij = Math.floor((a+b)/2);
      merge(a, mij);
      merge(mij+1,b);
      let i = a, j = mij+1;

      while(i < j) {
        if(newElements[j] < newElements[i]) {
          let temp = newElements[i];
          newElements[i] = newElements[j];
          newElements[j] = temp;
          newHistory.push({elements: [...newElements], selectedIndex1: i, selectedIndex2: j});
          let k = j;
          while(newElements[k] > newElements[k+1] && k != b){
            let temp = newElements[k];
            newElements[k] = newElements[k+1];
            newElements[k+1] = temp;
            k++;
          }
          newHistory.push({elements: [...newElements], selectedIndex1: j, selectedIndex2: k});
        }
        newHistory.push({elements: [...newElements], selectedIndex1: i, selectedIndex2: j});
        i++;
      }

      while(j < b) {
        if(newElements[j] > newElements[j+1]) {
            let temp = newElements[j];
            newElements[j] = newElements[j+1];
            newElements[j+1] = temp;
            newHistory.push({elements: [...newElements], selectedIndex1: j, selectedIndex2: j+1});
        }
        newHistory.push({elements: [...newElements], selectedIndex1: j, selectedIndex2: j+1});
        j++;
      }
      console.log(a,b);
      console.log(newElements);
    }

    merge(0,newElements.length-1);
    console.log(newHistory);
    setHistory(newHistory);
  }

  function radixSort() {
    let newElements = [...elements];
    let newHistory = [{elements: [...elements], selectedIndex1: 0, selectedIndex2: 0}];

    let nrDigits = 0;
    let maxNr = Math.max(...newElements);
    while(maxNr != 0) {
      maxNr = Math.floor(maxNr/10);
      nrDigits += 1;
    }
    console.log("lmao");
    let p = 1;
    for(let i = 0; i < nrDigits; i++) {
      let buckets = [];
      let dictionary = {};
  
      for(let i = 0; i < 11; i++)
        buckets.push([]);

      for(let i = 0; i < newElements.length; i++) {
        dictionary[newElements[i]] = i;
        newHistory.push({elements: [...newElements], selectedIndex1: i, selectedIndex2: -1});
      }

      for(let i = 0; i < newElements.length; i++) {
        let digit = Math.floor(newElements[i]/p) % 10;
        buckets[digit].push(newElements[i]);
      }

      let k = 0;
      for(let i = 0; i < 11; i++) 
        for(let j = 0; j < buckets[i].length; j++) {
          let temp = buckets[i][j];
          newElements[dictionary[buckets[i][j]]] = newElements[k];
          newElements[k] = temp;
          newHistory.push({elements: [...newElements], selectedIndex1: k, selectedIndex2: dictionary[newElements[k]]});
          dictionary[newElements[dictionary[newElements[k]]]] = dictionary[newElements[k]]; 
          dictionary[newElements[k]] = k;
          k += 1;
        }
      p *= 10;
    }

    setHistory(newHistory);
  }

  function heapSort() {
    let newElements = [...elements];
    let newHistory = [{elements: [...elements], selectedIndex1: 0, selectedIndex2: 0}];
    let n = newElements.length;

    function heapify(n,i) {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;

      if(l < n && newElements[l] > newElements[largest]) 
        largest = l;
      
      if(r < n && newElements[r] > newElements[largest])
        largest = r;
      
      if(largest != i) {
        let temp = newElements[i];
        newElements[i] = newElements[largest];
        newElements[largest] = temp;
        newHistory.push({elements: [...newElements], selectedIndex1: i, selectedIndex2: largest});
        heapify(n,largest);
      }
      else {
        newHistory.push({elements: [...newElements], selectedIndex1: i, selectedIndex2: -1});
      }
    }

    for(let i = n/2 - 1; i >= 0; i--)
      heapify(n,i);

    for(let i = n - 1; i > 0; i--) {
      let temp = newElements[0];
      newElements[0] = newElements[i];
      newElements[i] = temp;
      newHistory.push({elements: [...newElements], selectedIndex1: 0, selectedIndex2: i});
      heapify(i, 0);
    }

    setHistory(newHistory);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className = "algorithmSelectorWrapper">
          <label htmlFor="algorithmName">Choose an algorithm:</label>
          <select name = "algorithmName" className = "algorithmSelector" onChange={handleAlgorithmChange}>
            <option value = "Bubble Sort">Bubble Sort</option>
            <option value = "Selection Sort">Selection Sort</option>
            <option value = "Quick Sort">Quick Sort</option>
            <option value = "Merge Sort">Merge Sort</option>
            <option value = "Radix Sort">Radix Sort</option>
            <option value = "Heap Sort"> Heap Sort</option>
          </select>
        </div>
      </header>
      <div className = "body flexbox">
        <Parameters speed = {speed} nrElements = {nrElements} handleSpeedChange = {handleSpeedChange} handleNrChange = {handleNrChange} handleElements = {handleElements} handleRandom = {handleRandom} handleSort = {handleSort} handleStop = {handleStop} handleClear = {handleClear} sorting = {sorting}/>
        <Visualization elements = {elements} maxValue = {maxValue} minValue = {minValue} selectedIndex1 = {history !== -1? history[0].selectedIndex1: -1} selectedIndex2 = {history !== -1? history[0].selectedIndex2: -1}/>
      </div>
    </div>
  );
}

function Slider(props) {

  return (
      <div className="sliderContainer flexbox">
          <input type="range" min={props.min} max={props.max} defaultValue = {props.value} step = {props.step} className="slider" id={props.inputId} onChange = {props.handleChange} />
          <output className = "output">{props.value}</output>
      </div>
  )
}

function Parameters(props) {

  return (
    <div className = "parametersTable flexbox">
      <p className = "parametersTitle">Parameters</p>
      <label htmlFor = "speedSlider"> Simulation Speed </label>
      <Slider name = "speedSlider" inputId = "speedSlider" min = {1} max = {100} step = {1} value = {props.speed} handleChange = {props.handleSpeedChange} />
      <label htmlFor = "elementInput"> Add an element </label>
      <button onClick = {props.handleElements}> Add </button>
      <input name = "elementInput" type = "text" className = "elementInput" autocomplete="off"/>
      <label htmlFor = "randomButton"> Or generate a random set of numbers </label>
      <button onClick = {props.handleRandom}> Randomize </button>
      <label htmlFor = "randomSlider"> Number of Elements </label>
      <Slider name = "randomSlider" inputId = "randomSlider" min = {2} max = {100} step = {1} value = {props.nrElements} handleChange = {props.handleNrChange} />
      <div className = "buttonsWrapper flexbox"> 
        <button onClick = {props.handleSort}>Sort</button>
        <button onClick = {props.handleStop}>{props.sorting?"Stop":"Continue"}</button>
        <button onClick = {props.handleClear}>Clear</button>
      </div>
    </div>
  )
}

function Visualization(props) {
  return (
    <div className = "visualization flexbox">
      {props.elements.map((element,index) => <ElementBlock key = {element} value = {element} maxValue = {props.maxValue} minValue = {props.minValue} selectedValue = {(props.selectedIndex1 === index)?1:((props.selectedIndex2 === index)?2:0)} nrElements = {props.elements.length}/>)}
    </div>
  )
}

function ElementBlock(props) {
  return (
    <div onClick = {() => console.log(props.isSelected)} className = "elementBlock" style = {{      
    backgroundColor: props.selectedValue === 1?'#a75656':(props.selectedValue === 2)?'green':'#4c4f55',
    width: '1000px',
    height: ((props.value - props.minValue)/(props.maxValue-props.minValue) * 100 + 5) + '%'}}>
      {props.nrElements > 60? '':props.value}
    </div>
  )
}

export default App;
