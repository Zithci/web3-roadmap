import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://zithcis-project.supabase.co', 'YOUR_SUPABASE_PUBLIC_ANON_KEY');

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
];

export default function App() {
  const [progress, setProgress] = useState({});
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem('uid') || crypto.randomUUID();
    localStorage.setItem('uid', uid);

    const fetchData = async () => {
      const { data, error } = await supabase.from('progress').select('*').eq('user_id', uid).single();
      if (data && data.value) {
        setProgress(data.value);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    if (!uid) return;

    const saveData = async () => {
      await supabase.from('progress').upsert({ user_id: uid, value: progress });
    };
    saveData();
  }, [progress]);

  const toggle = (section, item) => {
    const key = `${section}-${item}`;
    setProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const total = checklist.reduce((acc, sec) => acc + sec.items.length, 0);
  const done = Object.values(progress).filter(v => v).length;
  const percentage = Math.round((done / total) * 100);

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <div className="header">
        <h1>Web3 Roadmap</h1>
        <button onClick={() => setDark(!dark)}>{dark ? '☀️ Light' : '🌙 Dark'}</button>
      </div>
      <div className="progress">
        <div className="bar" style={{ width: `${percentage}%` }} />
        <span>{done}/{total} complete</span>
      </div>
      {checklist.map((section, sIdx) => (
        <div key={sIdx} className="section">
          <h2>{section.title}</h2>
          <ul>
            {section.items.map((item, iIdx) => {
              const key = `${section.title}-${item}`;
              return (
                <motion.li
                  key={iIdx}
                  className="item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: iIdx * 0.05 }}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={progress[key] || false}
                      onChange={() => toggle(section.title, item)}
                    />
                    <span>{item}</span>
                  </label>
                </motion.li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
