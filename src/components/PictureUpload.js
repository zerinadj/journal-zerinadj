import React, {Component} from 'react';

class PictureUpload extends Component {
    render() {
        return (<div className="picture-upload">
            <p> add an image: </p>
            <input type="file" onChange={this.uploadPhoto} />
            <p>
                <button>Finish</button>
            </p>
        </div>
        )
    }
}

export default PictureUpload;


