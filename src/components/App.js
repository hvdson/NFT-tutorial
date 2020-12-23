import React, { useState, useEffect} from 'react';
import './App.css';
import Web3 from 'web3';

const App = () => {
  const [account, setAccount] = useState('');
  const [tokens, setTokens] = useState([]);
  
  useEffect(() => {
    const web3 = new Web3('ws://localhost:7545');
    async function loadWeb3AndGetAccount() {
      await loadWeb3();
      await loadBlockchainData();
    }
  
    // @dev breaking change - no more window.web3
    async function loadWeb3() {
      if (window.ethereum) {
        await window.ethereum.request({method: "eth_requestAccounts"})
        .catch(err => console.error(err))
      } else {
        window.alert("Non ETH browser detected - try MetaMask!")
      }
    }

    async function loadBlockchainData() {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

    }
    loadWeb3AndGetAccount();
    console.log(account);
  }, [account]);

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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;