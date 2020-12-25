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
  }, [])

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
    return colours.map((colour, key) => {
      return (
        <div className="text-center col-md-3 mb-3" key={key}>
          <div className="token" style={{ backgroundColor: colour }}></div>
          <div>{colour}</div>
        </div>
      )
    })
  }

  function doStuff(e) {
    e.preventDefault();
    window.alert('wee');
  }

  const [mintInput, setMintInput] = useState('')
  
  function handleMintInput(e) {
    setMintInput(e.target.value);
  }

  async function mintTokenThenSetColours(e) {
    e.preventDefault();
    console.log(account);
    await contract.methods.mint(mintInput).send({ from: account, gas: 5000000 })
      .once('receipt', (receipt) => {
        setColours([...colours, mintInput])
      })
    setMintInput('')
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
        <ul className="navbar-nav px-3">
          <li className="nav-item d-none d-sm-none d-sm-block p-1">
            <small><span className="text-white">{account}</span></small>
          </li>
        </ul>
      </nav>
      
      <div className="container-fluid mt-5">
      <button className="btn btn-primary" onClick={loadWeb3ForMetamask}>Connect</button>
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>Issue Token</h1>
              <form onSubmit={mintTokenThenSetColours}>
                <input 
                  onChange={handleMintInput} 
                  className="form-control mb-1" 
                  value={mintInput} 
                  type="text" 
                  placeholder="e.g. #FFFFFF"
                />
                <button type="submit" className="btn btn-block btn-primary mb-1">Mint</button>
              </form>
            </div>
          </main>
          <hr/>
          {mapColours()}
        </div>
      </div>
    </div>
  );
};

export default App;