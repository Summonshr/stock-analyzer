import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { map, sortBy, uniq } from 'lodash';
import millify from 'millify';
import Company from './Company';
import Quote from './quotes';
import './App.css'

let password = ''

export default function() {

  password = password || prompt('password');

  if (password !== 'sumanji') {
    return <div>Unauthorized</div>;
  }

  let [companies, setCompanies] = useState([]);
  let [group, setGroup] = useState('Commercial Banks');
  let [search, setSearch] = useState('');
  let [minimumEPS, setMinimumEPS] = useState(0);
  let [maximumPE, setMaximumPE] = useState(0);
  let [minimumBVPS, setMinimumBVPS] = useState(0);
  let [maximumTotalShares, setMaximumTotalShares] = useState(150000000);
  let [checkChange, setCheckChange] = useState(true)


  useEffect(() => {
    Axios.get('https://bizmandu.com/__stock/tickers/all').then(response => {

      let companies = response.data.message;

      companies = companies.map(company => {
        return company;
      });

      setCompanies(companies);

    });
  }, []);

  let groups = uniq(map(companies, 'sector')).filter(e => !['Mutual Fund', 'Trading', 'Organized Fund', 'Others', 'Telecom'].includes(e));

  companies = companies.filter(company => (group === '' || company.sector === group) && company.companyName.indexOf('Promoter') === -1 && (search === '' || company.companyName.toLowerCase().indexOf(search.toLowerCase()) > -1 || search.toLowerCase().split('|').includes(company.ticker.toLowerCase())));
  // .slice(0,1)

  companies = companies.filter(company=>!['KMFL', 'HAMRO', 'NCDB', 'SHBL', 'LFC'].includes(company.ticker))


  companies = sortBy(companies, 'ticker')
  return (
    <div className="App">
      <div>
      <input value={search} type="text" className="search" placeholder="Search ..." onChange={event => setSearch(event.target.value)} />
      <select value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="">All</option>
        {groups.map(group => <option key={group} value={group}>{group}</option>)}
      </select>
      <button onClick={() => capture(search || group || 'Capture')} className="full-button">Capture</button>
      <input type="range" value={minimumEPS} onChange={event => setMinimumEPS(event.target.value)} />{minimumEPS} EPS
      <input type="range" value={maximumPE} onChange={event => setMaximumPE(event.target.value)} />{maximumPE} PE
      <input type="range" value={minimumBVPS} step="10" min="50" max="350" onChange={event => setMinimumBVPS(event.target.value)} />{minimumBVPS} BVPS
      <input type="range" value={maximumTotalShares} min="0" step="500000" max="150000000" onChange={event => setMaximumTotalShares(event.target.value)} />{millify(maximumTotalShares)} Total Shares
      <input type="checkbox"  checked={checkChange} onChange={()=>setCheckChange(!checkChange)} /> Exclude 0 change
      </div>
      <div className="list-table">
      <table id="capture">
        <thead>
          <tr>
          <th colSpan="9" className="table-heading">Nepse Table</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Symbol</td>
            <td>Price</td>
            <td>Diff</td>
            <td>EPS</td>
            <td>PE</td>
            <td>BVPS</td>
            <td>Fair Price</td>
            <td>Total Shares</td>
            <td>Deviation</td>
          </tr>
          {companies.map(company => <Company checkChange={checkChange} maxTS={maximumTotalShares == '150000000' ? '100000000000000' : maximumTotalShares} minBVPS={minimumBVPS} maxPe={maximumPE} minEps={minimumEPS} key={company.ticker} company={company} />).filter(Boolean)}
        </tbody>
      </table>
      <p className="quote"><Quote/></p> 
      </div>
       </div>
  );
}
