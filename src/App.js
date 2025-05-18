import React, { useState, useEffect } from 'react';

const checklist = [
  {
    title: 'JavaScript Fundamentals',
    items: [
      'Variables, let, const, var',
      'Data Types: string, number, boolean, null, undefined, object, array',
      'Functions: declaration, expression, arrow function',
      'Loops: for, while, do-while',
      'Conditionals: if, else, switch',
      'Operators: arithmetic, comparison, logical',
      'Arrays & Methods: push, pop, shift, unshift, map, filter, reduce',
      'Objects: create, access, modify, loop'
    ]
  },
  {
    title: 'Async/Await + API Calls',
    items: [
      'Understanding callbacks & promises',
      'fetch and using .then()',
      'Refactor to async/await',
      'Handle API error with try-catch',
      'Use public API & render data to DOM'
    ]
  },
  {
    title: 'Solidity Basics',
    items: [
      'Understand what is EVM',
      'Smart contract structure: pragma, contract, functions',
      'Data types: uint, string, bool, address',
      'Storage vs Memory',
      'Visibility: public, private, internal, external',
      'Deploy simple contract in Remix'
    ]
  },
  {
    title: 'Smart Contract Deployment',
    items: [
      'Install & init Hardhat project',
      'Create & compile contract',
      'Write deployment script',
      'Test deploy on local Hardhat network',
      'Deploy to testnet (e.g., Sepolia)'
    ]
  },
  {
    title: 'Frontend-Contract Integration',
    items: [
      'Connect MetaMask to website',
      'Import ABI and Contract Address',
      'Call read function (view)',
      'Call write function (send transaction)',
      'Display on frontend (HTML/React)'
    ]
  }
];

export default function Web3Roadmap() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('web3-progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('web3-progress', JSON.stringify(progress));
  }, [progress]);

  const toggle = (section, item) => {
    const key = `${section}-${item}`;
    setProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Web3 Roadmap</h1>
      {checklist.map((section, sIdx) => (
        <div key={sIdx} style={{ marginBottom: 20 }}>
          <h2>{section.title}</h2>
          <ul>
            {section.items.map((item, iIdx) => {
              const key = `${section.title}-${item}`;
              return (
                <li key={iIdx}>
                  <label>
                    <input
                      type="checkbox"
                      checked={progress[key] || false}
                      onChange={() => toggle(section.title, item)}
                    />
                    {item}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
