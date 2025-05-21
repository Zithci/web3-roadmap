import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fqgzeomlowradzatgjgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxZ3plb21sb3dyYWR6YXRnamdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NzM0NzgsImV4cCI6MjA2MzE0OTQ3OH0.sW38Y2Tf0rJBtzOG2BppYj68-YhYIPoPmxWEMzzMtIM'
);

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
      'Objects: create, access, modify, loop',
    ],
  },
  {
    title: 'Async/Await + API Calls',
    items: [
      'Understanding callbacks & promises',
      'fetch and using .then()',
      'Refactor to async/await',
      'Handle API error with try-catch',
      'Use public API & render data to DOM',
    ],
  },
  {
    title: 'Solidity Basics',
    items: [
      'Understand what is EVM',
      'Smart contract structure: pragma, contract, functions',
      'Data types: uint, string, bool, address',
      'Storage vs Memory',
      'Visibility: public, private, internal, external',
      'Deploy simple contract in Remix',
    ],
  },
  {
    title: 'Smart Contract Deployment',
    items: [
      'Install & init Hardhat project',
      'Create & compile contract',
      'Write deployment script',
      'Test deploy on local Hardhat network',
      'Deploy to testnet (e.g., Sepolia)',
    ],
  },
];

export default function App() {
  const [progress, setProgress] = useState({});
  const [dark, setDark] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const uid = localStorage.getItem('uid') || crypto.randomUUID();
    localStorage.setItem('uid', uid);

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', uid)
        .maybeSingle();

      console.log("FETCH RESULT:", data, error);

      if (data && data.value) {
        try {
          const parsed = JSON.parse(data.value);
          console.log("PARSED DATA:", parsed);
          setProgress(parsed);
        } catch (err) {
          console.error('JSON parse error:', err);
        }
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const uid = localStorage.getItem('uid');
    if (!uid) return;

    await supabase.from('progress').upsert({
      user_id: uid,
      value: JSON.stringify(progress),
    });

    setMessage('✅ Progress saved!');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleReset = async () => {
    const uid = localStorage.getItem('uid');
    if (!uid) return;

    await supabase.from('progress').delete().eq('user_id', uid);
    setProgress({});
    setMessage('🗑 Progress cleared!');
    setTimeout(() => setMessage(''), 2000);
  };

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
        <div>
          <button onClick={handleSave}>💾 Save</button>
          <button onClick={handleReset}>🗑 Reset</button>
          <button onClick={() => setDark(!dark)}>
            {dark ? '☀ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {message && <div className="alert">{message}</div>}

      <div className="progress">
        <div className="bar" style={{ width: `${percentage}%` }} />
        <span>
          {done}/{total} complete
        </span>
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
