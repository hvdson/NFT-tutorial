import React, { useState, useEffect} from 'react';
import './App.css';
import Web3 from 'web3';
import Colour from '../abis/Colour.json'

const App = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const web3 = new Web3('ws://localhost:7545');
  
  useEffect(() => {
    loadWeb3ForMetamask();
  },[window.ethereum]);

  async function loadWeb3ForMetamask() {
    // @dev breaking change - no more web3.window injection
    if (window.ethereum) {
      await window.ethereum.request({method: "eth_requestAccounts"})
      .catch(err => console.error(err))
    } else {
      window.alert("Non ETH browser detected - try MetaMask!")
    }
  }

  const [account, setAccount] = useState('');
  useEffect(() => {
    getAccountAndSetState();
  },[])

  async function getAccountAndSetState() {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }

  function checkIfDataExists(data) {
     return data !== null && data !== undefined;
  }

  const [contract, setContract] = useState(null);
  useEffect(() => {
    createContractFromNetworkData();
  }, [account])

  async function createContractFromNetworkData() {
    const networkId = await web3.eth.net.getId();
    const networkData = Colour.networks[networkId]
    if (checkIfDataExists(networkData)) {
      const address = networkData.address;
      const abi = Colour.abi;
      const newContract = await new web3.eth.Contract(abi, address);
      setContract(newContract)
    }
  }

  
  const [colours, setColours] = useState([]);
  useEffect(() => {
    if (contract) {
      loadColourData();
    }
  }, [contract])
  
  async function loadColourData() {
    // part of ERC721
    const totalSupply = await contract.methods.totalSupply().call();
    setTotalSupply(totalSupply);
    let colourState = [];
    for (let i = 0; i < totalSupply; i++) {
      let colour = await contract.methods.colours(i).call();
      colourState.push(colour);
    }
    setColours([...colourState]);
  }

  // it works!
  // todo: refactor and clean up
  const mapColours = () => {
    return colours.map((item) => {
      return <span>{item}</span>
    })
  }

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <span
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          NFT Tutorial
        </span>
        <ul className="navbar-nav">
          <li className="nav-item d-none d-sm-none d-sm-block p-1">
            <span className="text-white">{account}</span>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>yooo this some NFT shit</h1>
              <hr/>
              <button className="btn btn-primary" onClick={loadWeb3ForMetamask}>Connect</button>
            </div>
          </main>
          {mapColours()}
        </div>
      </div>
    </div>
  );
};

export default App;