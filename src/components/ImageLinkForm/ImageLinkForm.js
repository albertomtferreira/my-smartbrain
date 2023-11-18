import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange,onButtonSubmit})=> {
  return[
    <div>
      <p className="f3">
        {`It's Magic!`}
      </p>
      <div className="center">
        <div className="center form pa4 br3 shadow-5">
          <input className="f4 pa2 w-70 center" type="url" placeholder="https://website.com/image" pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)(.jpg|.png|.gif)" onChange={onInputChange}/>
          <button className="w-30 grow f4 link pv2 dib white bg-light-purple" onClick={onButtonSubmit}>Detect</button>
        </div>
      </div>
    </div>
  ]
}

export default ImageLinkForm;