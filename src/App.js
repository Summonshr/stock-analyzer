import './App.css';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { map, uniq } from 'lodash';

function Grahams({ bvps, epsDiluted }) {

  return bvps && epsDiluted && bvps > 0 && epsDiluted > 0 ? (Math.sqrt(22.5 * bvps * epsDiluted)).toFixed(2) : ''
}

function Company({ company }) {
  let [data, setData] = useState('')
  let [latest, setLatest] = useState('')
  useEffect(() => {
    if (localStorage.getItem('ticker-' + company.ticker)) {
      setData(JSON.parse(localStorage.getItem('ticker-' + company.ticker)))
    } else {
      Axios.get('https://bizmandu.com/__stock/tearsheet/summary/?tkr=' + company.ticker).then(response => {
        setData(response.data.message)
        localStorage.setItem('ticker-' + company.ticker, JSON.stringify(response.data.message))
      })

    }

    if (localStorage.getItem('ticker-latest-' + company.ticker)) {
      setLatest(JSON.parse(localStorage.getItem('ticker-latest-' + company.ticker)))
    } else {
      Axios.get('https://bizmandu.com/__stock/tearsheet/header/?tkr=' + company.ticker).then(response => {
        setLatest(response.data.message)
        localStorage.setItem('ticker-latest-' + company.ticker, JSON.stringify(response.data.message))
      })
    }
  }, [])

  return <tr className="" key={company.ticker}><td>{company.ticker}</td><td>{company.companyName}</td>
    {latest && <>
      <td>{latest.latestPrice}</td>
      <td>{latest.pointChange} {latest.pointChange > 0 ? '↑' : '↓'}</td>
    </>}
    {data.summary && data.summary && <>
      <td>{data.summary.epsDiluted && data.summary.epsDiluted.toFixed(2)}</td>
      <td>{data.summary.peDiluted && data.summary.peDiluted.toFixed(2)}</td>
      <td>{data.summary.bvps && data.summary.bvps.toFixed(2)}</td>
      <td>{Grahams(data.summary)}</td>
      <td>{latest.latestPrice ? (Grahams(data.summary) > data.summary.open ? 'Buy' : 'Sell') : ''}</td>
      <td>{data.summary && data.summary.beta}</td>
      <td>{(Grahams(data.summary) - data.summary.open).toFixed(2)}</td>
    </>}

  </tr>
}

function App() {

  let [companies, setCompanies] = useState([])
  let [group, setGroup] = useState('Commercial Banks')
  let [search, setSearch] = useState('')

  useEffect(() => {
    Axios.get('https://bizmandu.com/__stock/tickers/all').then(response => {

      let companies = response.data.message;

      companies = companies.map(company => {
        return company
      });

      setCompanies(companies);

    })
  }, [])

  let groups = uniq(map(companies, 'sector'))

  companies = companies.filter(company => (group == '' || company.sector == group) && company.companyName.indexOf('Promoter') === -1 && (search == '' || company.companyName.toLowerCase().indexOf(search.toLowerCase()) > -1 || company.ticker.toLowerCase().indexOf(search.toLowerCase()) > -1))


  return (
    <div className="App">
      <input value={search} onChange={event => setSearch(event.target.value)} />
      <select value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="">All</option>
        {groups.map(group => <option key={group} value={group}>{group}</option>)}
      </select>
      <table>
        <tbody>
          <tr>
            <td>Symbol</td>
            <td>Name</td>
            <td>Price</td>
            <td>Diff</td>
            <td>EPS</td>
            <td>PE</td>
            <td>BVPS</td>
            <td>Fair Price</td>
            <td>Signal</td>
            <td>Beta</td>
            <td>Fair Diff</td>
          </tr>
          {
            companies.map(company => <Company key={company.ticker} company={company} />)
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
