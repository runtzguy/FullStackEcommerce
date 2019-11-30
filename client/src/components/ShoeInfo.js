import React from 'react';
import '../App.css';
//CSS Style
import '../css/shoetile.css';
//Images URL context
var images = require.context('../css/shoe-tile-imgs', true);


function ShoeInfo(props){
    return (
        <div className="info-container">
            <img src={images(`./${props.imgURL}`)} alt=""/>
            <h2>{props.name} - ${props.price}</h2>
            <p>{props.descript}
            </p>
        </div>
    )
}

export default ShoeInfo;