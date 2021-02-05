import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { map, uniq } from 'lodash';
import millify from 'millify';
import Company from './Company';

export function capture(name) {
  var node = document.getElementById('table-node');

  toJpeg(node)
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = prompt('Name please');
      link.href = dataUrl;
      link.click();
    });
}

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
  return (
    <div className="App">
      <input value={search} type="text" className="search" placeholder="Search ..." onChange={event => setSearch(event.target.value)} />
      <select value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="">All</option>
        {groups.map(group => <option key={group} value={group}>{group}</option>)}
      </select>
      <button onClick={() => capture(search || group || 'Capture')} className="full-button">Capture</button>
      <input type="range" value={minimumEPS} onChange={event => setMinimumEPS(event.target.value)} />{minimumEPS} EPS
      <input type="range" value={maximumPE} onChange={event => setMaximumPE(event.target.value)} />{maximumPE} PE
      <input type="range" value={minimumBVPS} min="50" max="350" onChange={event => setMinimumBVPS(event.target.value)} />{minimumBVPS} BVPS
      <input type="range" value={maximumTotalShares} min="0" step="500000" max="150000000" onChange={event => setMaximumTotalShares(event.target.value)} />{millify(maximumTotalShares)} Total Shares
      <table id="table-node">
        <tbody>
          <tr>
            <td>Symbol</td>
            <td className="hide-small">Name</td>
            <td>Price</td>
            <td>Diff</td>
            <td>EPS</td>
            <td>PE</td>
            <td>BVPS</td>
            <td>Fair Price</td>
            <td>Total Shares</td>
            <td>Deviation</td>
          </tr>
          {companies.map(company => <Company maxTS={maximumTotalShares == '150000000' ? '100000000000000' : maximumTotalShares} minBVPS={minimumBVPS} maxPe={maximumPE} minEps={minimumEPS} key={company.ticker} company={company} />).filter(Boolean)}
        </tbody>
      </table>
    </div>
  );
}
