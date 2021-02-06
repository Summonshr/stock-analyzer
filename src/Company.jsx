import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import millify from 'millify';
import Grahams from './Grahams';
import getClassLowerBetter from './getClassLowerBetter';
import getClassHigherBetter from './getClassHigherBetter';

export default function({ company, minEps, maxPe, minBVPS, maxTS }) {


  let [data, setData] = useState('');
  let [latest, setLatest] = useState('');

  useEffect(() => {

    if (localStorage.getItem('ticker-' + company.ticker)) {
      setData(JSON.parse(localStorage.getItem('ticker-' + company.ticker)));
    } else {
      Axios.get('https://bizmandu.com/__stock/tearsheet/summary/?tkr=' + company.ticker).then(response => {
        setData(response.data.message);
        localStorage.setItem('ticker-' + company.ticker, JSON.stringify(response.data.message));
      });
    }

    if (localStorage.getItem('ticker-latest-' + company.ticker)) {
      setLatest(JSON.parse(localStorage.getItem('ticker-latest-' + company.ticker)));
    } else {
      Axios.get('https://bizmandu.com/__stock/tearsheet/header/?tkr=' + company.ticker).then(response => {
        setLatest(response.data.message);
        localStorage.setItem('ticker-latest-' + company.ticker, JSON.stringify(response.data.message));
      });
    }
  }, []);

  let className = [];

  if (latest.latestPrice) {
    if (data && data.keyFinancial && data.keyFinancial.open && Grahams(data.keyFinancial) > data.keyFinancial.open) {
      className.push('bg-green');
    }
  }

  if (['KMFL', 'HAMRO', 'NCDB', 'SHBL', 'LFC'].includes(company.ticker)) {
    return '';
  }

  if (data && data.keyFinancial && data.keyFinancial.data && data.keyFinancial.data[0]) {
    let { eps, bvps } = data.keyFinancial.data[0];
    if (parseInt(minEps, 10) > 0 && parseInt(minEps, 10) > parseInt(eps, 10)) {
      return '';
    }

    if (parseInt(minBVPS, 10) > 0 && parseInt(minBVPS, 10) > parseInt(bvps, 10)) {
      return '';
    }
    let fair_value = Grahams(data.keyFinancial.data[0]);
    let pe = eps ? (latest.latestPrice / eps).toFixed(2) : 0;
    if (parseInt(maxPe, 10) > 0 && parseInt(pe, 10) > parseInt(maxPe, 10)) {
      return '';
    }

    if (data.summary && parseInt(maxTS, 10) < parseInt(data.summary.listedShares, 10)) {
      return '';
    }
    let price = latest.latestPrice;
    let change = (fair_value - price).toFixed();

    return <tr key={company.ticker}><td>{company.ticker}</td><td className="hide-small">{company.companyName}</td>
      {latest && <>
        <td>{latest.latestPrice}</td>
        <td style={{ minWidth: '40px' }}>{latest.pointChange} {latest.pointChange > 0 ? '↑' : '↓'}</td>
      </>}
      {data.keyFinancial && <>
        <td className={getClassHigherBetter(eps, 15, 20, 30, 45)}>{eps.toFixed(2)}</td>
        <td className={getClassLowerBetter(pe, 10, 15, 20, 25)}>{pe}</td>
        <td className={getClassHigherBetter(bvps, 150, 200, 250, 300)}>{bvps}</td>
        <td>{fair_value}</td>
        <td>{millify(data.summary.listedShares)}</td>
        <td className={getClassHigherBetter((change / price).toFixed(2), -0.60, -0.45, -0.30, -0.15)}>{(change / price).toFixed(2)}</td>
      </>}
    </tr>;
  }

  return '';


}
