import axios from 'axios'
import { find } from 'lodash'
import millify from 'millify'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import quotes from './quotes'

function getHuman(num) {
    if (num == 1) {
        return 'First'
    }

    if (num == 2) {
        return 'Second'
    }

    if (num == 3) {
        return 'Third'
    }

    if (num == 4) {
        return 'Fourth'
    }
}

export default function () {
    let { company } = useParams()
    let [header, setHeader] = useState(false)
    let [summary, setSummary] = useState(false)
    let [financial, setFinancial] = useState(false)
    let [announcement, setAnnouncement] = useState(false)
    let [dividend, setDividend] = useState(false)

    useEffect(() => {
        axios.get('https://bizmandu.com/__stock/tearsheet/header/?tkr=' + company).then(r => setHeader(r.data.message))
        axios.get('https://bizmandu.com/__stock/tearsheet/summary/?tkr=' + company).then(r => setSummary(r.data.message))
        axios.get('https://bizmandu.com/__stock/tearsheet/financial/keyStats/?tkr=' + company).then(r => setFinancial(r.data.message))
        axios.get('https://bizmandu.com/__stock/tearsheet/announcement/?tkr=' + company).then(r => setAnnouncement(r.data.message))
        axios.get('https://bizmandu.com/__stock/tearsheet/dividend/?tkr=' + company).then(r => setDividend(r.data.message))
    }, [])

    let keys = []

    keys.push({ key: 'Latest Trading Price', value: 'Rs. ' + header.latestPrice })


    if (!header || !summary || !financial || !announcement || !dividend) {
        return <div>Work on it</div>
    }

    let current = summary.keyFinancial.data[0]

    keys.push({ key: 'Earning per Share', value: 'Rs. ' + current.eps.toFixed(2) })

    keys.push({ key: 'Total Income', value: 'Rs. ' + millify(current.netIncome * 1000) })

    keys.push({ key: 'Book Value per Share', value: 'Rs. ' + current.bvps })

    keys.push({ key: '52 week high-low', value: [summary.summary.fiftyTwoWeekHigh.toFixed(0), summary.summary.fiftyTwoWeekLow.toFixed(0)].join(' - ') })

    keys.push({ key: 'Total Listed Shares', value: millify(summary.summary.listedShares || (summary.summary.mktCap / (header.latestPrice || 1))) })

    let ldiv = find(dividend.dividend, { year: "2019/20" })

    let div = ['No Dividend Announced'];

    if (ldiv.bonus && ldiv.cash) {
        div = ['Bonus: ', (ldiv.bonus * 100).toFixed(2), '%', ' / ', 'Cash: ', (ldiv.cash * 100).toFixed(2), '%']
    }
    keys.push({ key: 'Latest Dividend', value: div.join('') })

    console.log(financial)

    if (financial && financial.data && financial.data.length > 0 && financial.data[0].GrowthOverPriorPeriod) {
        let currentFinancial = financial.data[0]

        if (currentFinancial.GrowthOverPriorPeriod) {
            keys.push({ key: 'Company Growth', value: (currentFinancial.GrowthOverPriorPeriod * 100).toFixed(2) + "%" })
        }

        if (currentFinancial.NonPerformingLoanNplToTotalLoan) {
            keys.push({ key: 'Non Performing Loan %', value: (currentFinancial.NonPerformingLoanNplToTotalLoan * 100).toFixed(2) + "%" })
        }
    }



    return <div className="single-company" id="capture">
        <h2>{header.company} ({header.ticker})</h2>
        <p className="text-center" contentEditable>{getHuman(summary.keyFinancial.quarter)} Quarter</p>
        <table>
            <tbody>
                {keys.map(e => <tr key={e.key}><td>{e.key}</td><td>:</td><td contentEditable>{e.value}</td></tr>)}
            </tbody>
        </table>
        <p className="quote">{quotes()}</p>
    </div>
}