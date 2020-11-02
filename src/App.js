import './App.css';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { map, uniq } from 'lodash';

function Grahams({ bvps, eps }) {

  return bvps && eps && bvps > 0 && eps > 0 ? (Math.sqrt(22.5 * bvps * eps)).toFixed(2) : ''
}

function Company({ company }) {
  let [data, setData] = useState('')
  let [latest, setLatest] = useState('')
  useEffect(() => {
    if (localStorage.getItem('ticker-' + company.ticker)) {
      setData(JSON.parse(localStorage.getItem('ticker-' + company.ticker)))
    } else {
      Axios.get('https://bizmandu.com/__stock/tearsheet/keyFinancial/?tkr=' + company.ticker).then(response => {
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

  let className = []

  if (latest.latestPrice) {
    if (data && data.keyFinancial && data.keyFinancial.open && Grahams(data.keyFinancial) > data.keyFinancial.open) {
      className.push('bg-green')
    }
  }

  if (data && data.keyFinancial && data.keyFinancial.data && data.keyFinancial.data[0]) {
    let { eps, bvps } = data.keyFinancial.data[0]
    return <tr className={className.join(' ')} key={company.ticker}><td>{company.ticker}</td><td>{company.companyName}</td>
      {latest && <>
        <td>{latest.latestPrice}</td>
        <td>{latest.pointChange} {latest.pointChange > 0 ? '↑' : '↓'}</td>
      </>}
      {data.keyFinancial && <>
        <td>{eps.toFixed(2)}</td>
        <td>{eps ? (latest.latestPrice / eps).toFixed(2) : 0}</td>
        <td>{bvps.toFixed(2)}</td>
        <td>{Grahams(data.keyFinancial.data[0])}</td>
      </>}
    </tr>
  }

  return ''


}

window.onkeydown = function (e) {
  if (e.keyCode == 82 && e.ctrlKey && e.shiftKey) {
    e.preventDefault()
    localStorage.clear();
    window.location.reload()
  }
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
      <input value={search} placeholder="Search ..." onChange={event => setSearch(event.target.value)} />
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
