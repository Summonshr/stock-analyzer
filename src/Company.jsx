import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import millify from 'millify';
import Grahams from './Grahams';
import getClassLowerBetter from './getClassLowerBetter';
import getClassHigherBetter from './getClassHigherBetter';

export default function ({ company, minEps, maxPe, minBVPS, maxTS, checkChange }) {


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

    if (!data.summary.listedShares) {
      data.summary.listedShares = data.summary.mktCap / (latest.latestPrice || 1)
    }

    if (data.summary && parseInt(maxTS, 10) < parseInt(data.summary.listedShares, 10)) {
      return '';
    }

    let price = latest.latestPrice;
    let change = (fair_value - price).toFixed();

    if (!latest.timestamp || (new Date(latest.timestamp)).getTime() < (new Date()).getTime() - 94548123 * 7) {
      return '';
    }

    if (checkChange && latest.pointChange == 0) {
      return '';
    }
    return <tr key={company.ticker}><td><a href={'/company/' + company.ticker} title={company.companyName} target="_blank">{company.ticker}</a></td>
      {latest && <>
        <td>{latest.latestPrice}</td>
        <td style={{ minWidth: '45px' }}>{latest.pointChange} {latest.pointChange > 0 ? '↑' : '↓'}</td>
      </>}
      {data.keyFinancial && <>
        <td contentEditable className={getClassHigherBetter(eps, 15, 20, 30, 45, 0)}>{eps.toFixed(2)}</td>
        <td contentEditable className={getClassLowerBetter(pe, 10, 15, 20, 25)}>{pe}</td>
        <td contentEditable className={getClassHigherBetter(bvps, 150, 200, 250, 300, 100)}>{bvps}</td>
        <td contentEditable>{fair_value || 0}</td>
        <td contentEditable className={getClassLowerBetter(parseInt(data.summary.listedShares), 500000, 1000000, 5000000, 5000000)}>{millify(data.summary.listedShares)}</td>
        <td contentEditable className={getClassHigherBetter((change / price).toFixed(2), -0.60, -0.45, -0.30, -0.15, -0.80)}>{(change / price).toFixed(2)}</td>
      </>}
    </tr>;
  }

  return '';
}
