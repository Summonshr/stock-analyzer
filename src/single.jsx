import React from 'react'
import img from './logo.png';

export default function () {
    return <div className="single">
        <table class="background" style={{ backgroundImage: img }}>
            <thead>
                <tr>
                    <th>Company</th>
                    <th>NICA (NIC Asia Bank)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Price</td>
                    <td>Rs. 800</td>
                </tr>
                <tr>
                    <td>Earning per Share</td>
                    <td>Rs. 35.02</td>
                </tr>
                <tr>
                    <td>Price/Earning Ratio</td>
                    <td>8.52</td>
                </tr>
                <tr>
                    <td>Book Value per Share</td>
                    <td>Rs. 200</td>
                </tr>
                <tr>
                    <td>Fair Price</td>
                    <td>Rs. 452</td>
                </tr>
                <tr>
                    <td>Total Listed Shares</td>
                    <td>8 Million</td>
                </tr>
            </tbody>
        </table>
    </div>
}