import React from 'react'
import capture from './capture'

export default function () {
    window.onkeydown = function (e) {
        if (e.code === 'KeyC' && e.ctrlKey) {
            capture()
        }
      }
      
    
    return <div className="note" id="capture">
        <h2 contentEditable>Simple Tips and Tricks</h2>
        <div className="divider"></div>
        <p contentEditable>
            A nice html language is Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima at corrupti ut consequuntur sed reprehenderit accusantium, soluta illum. Accusantium nam reiciendis sequi voluptatum eveniet optio, officia odit error reprehenderit architecto!
        </p>
    </div>
}