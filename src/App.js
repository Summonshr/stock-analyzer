import './App.css';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { map, uniq } from 'lodash';
import millify from 'millify';
import { toJpeg } from 'dom-to-image';

function Grahams({ bvps, eps }) {
  return bvps && eps && bvps > 0 && eps > 0 ? (Math.sqrt(22.5 * bvps * eps)).toFixed(2) : ''
}

function getClassLowerBetter(v, p1, p2, p3, p4) {
  if (v <= 0) {
    return ''
  }
  if (v < p1) {
    return 'bg-green'
  }
  if (v < p2) {
    return 'bg-green-light'
  }
  if (v < p3) {
    return 'bg-green-lighter'
  }
  if (v < p4) {
    return 'bg-green-lightest'
  }
}

function getClassHigherBetter(v, p1, p2, p3, p4) {
  if (v > p4) {
    return 'bg-green'
  }
  if (v > p3) {
    return 'bg-green-light'
  }
  if (v > p2) {
    return 'bg-green-lighter'
  }
  if (v > p1) {
    return 'bg-green-lightest'
  }
  return ''
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

  let className = []

  if (latest.latestPrice) {
    if (data && data.keyFinancial && data.keyFinancial.open && Grahams(data.keyFinancial) > data.keyFinancial.open) {
      className.push('bg-green')
    }
  }

  if (['KMFL', 'HAMRO', 'NCDB', 'SHBL', 'LFC'].includes(company.ticker)) {
    return ''
  }

  if (data && data.keyFinancial && data.keyFinancial.data && data.keyFinancial.data[0]) {
    let { eps, bvps } = data.keyFinancial.data[0]
    let fair_value = Grahams(data.keyFinancial.data[0])
    let pe = eps ? (latest.latestPrice / eps).toFixed(2) : 0
    let price = latest.latestPrice
    let change = (fair_value - price).toFixed()

    return <tr key={company.ticker}><td><a href={"https://sharesansar.com/company/" + company.ticker} target="_blank">{company.ticker}</a></td><td className="hide-small">{company.companyName}</td>
      {latest && <>
        <td>{latest.latestPrice}</td>
        <td style={{minWidth: '40px'}}>{latest.pointChange} {latest.pointChange > 0 ? '↑' : '↓'}</td>
      </>}
      {data.keyFinancial && <>
        <td className={getClassHigherBetter(eps, 15, 20, 30, 45)}>{eps.toFixed(2)}</td>
        <td className={getClassLowerBetter(pe, 10, 15, 20, 25)}>{pe}</td>
        <td className={getClassHigherBetter(bvps, 150, 200, 250, 300)}>{bvps}</td>
        <td>{fair_value}</td>
        <td>{millify(data.summary.listedShares)}</td>
        <td className={getClassHigherBetter((change / price).toFixed(2), -0.60, -0.45, -0.30, -0.15)}>{(change / price).toFixed(2)}</td>
      </>}
    </tr>
  }

  return ''


}

window.onkeydown = function (e) {
  if (e.keyCode === 82 && e.ctrlKey && e.shiftKey) {
    e.preventDefault()
    localStorage.clear();
    window.location.reload()
  }
}

function capture(name) {
  var node = document.getElementById('table-node');

  toJpeg(node)
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = name + '.png';
      link.href = dataUrl;
      link.click();
    });
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

  let groups = uniq(map(companies, 'sector')).filter(e=>!['Mutual Fund','Trading','Organized Fund', 'Others', 'Telecom'].includes(e))

  companies = companies.filter(company => (group === '' || company.sector === group) && company.companyName.indexOf('Promoter') === -1 && (search === '' || company.companyName.toLowerCase().indexOf(search.toLowerCase()) > -1 || search.toLowerCase().indexOf(company.ticker.toLowerCase()) > -1))
  // .slice(0,1)
  return (
    <div className="App">
      <input value={search} placeholder="Search ..." onChange={event => setSearch(event.target.value)} />
      <select value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="">All</option>
        {groups.map(group => <option key={group} value={group}>{group}</option>)}
      </select>
      <button onClick={()=>capture(search||group||'Capture')} className="full-button">Capture</button>
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
          {
            companies.map(company => <Company key={company.ticker} company={company} />)
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
